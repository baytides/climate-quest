import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const files = {
  questions: path.join(ROOT, 'src/content/questions.json'),
  events: path.join(ROOT, 'src/content/events.json'),
  summaries: path.join(ROOT, 'src/content/summaries.json'),
  locations: path.join(ROOT, 'src/data/locations.ts'),
};

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const errors = [];
const warn = [];

const questions = load(files.questions);
const events = load(files.events);
const summaries = load(files.summaries);
const locationsText = fs.readFileSync(files.locations, 'utf8');
const locationsStart = locationsText.indexOf('export const locations');
const questionsStart = locationsText.indexOf('export const questions');
const locationsBlock = locationsStart >= 0 && questionsStart > locationsStart
  ? locationsText.slice(locationsStart, questionsStart)
  : locationsText;
const locationIds = new Set([...locationsBlock.matchAll(/id: '([^']+)'/g)].map((m) => m[1]));

const ids = new Set();
const addId = (id, kind) => {
  if (ids.has(id)) errors.push(`Duplicate id: ${id} (${kind})`);
  ids.add(id);
};

const perLocation = new Map();
const ensureAgg = (locationId) => {
  if (!perLocation.has(locationId)) {
    perLocation.set(locationId, { ngss: new Set(), epc: new Set(), questions: 0, questionsWithEpc: 0 });
  }
  return perLocation.get(locationId);
};

for (const q of questions) {
  if (!q.id || !q.locationId) errors.push('Question missing id or locationId');
  addId(q.id, 'question');
  if (!locationIds.has(q.locationId)) errors.push(`Question ${q.id} has unknown locationId ${q.locationId}`);
  if (!Array.isArray(q.answers) || q.answers.length !== 4) errors.push(`Question ${q.id} must have 4 answers`);
  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) errors.push(`Question ${q.id} has invalid correctIndex`);
  const agg = ensureAgg(q.locationId);
  agg.questions += 1;
  if (q.tags?.ngss?.length) q.tags.ngss.forEach((t) => agg.ngss.add(t));
  if (q.tags?.epc?.length) {
    agg.questionsWithEpc += 1;
    q.tags.epc.forEach((t) => agg.epc.add(t));
  } else {
    warn.push(`Question ${q.id} missing epc tags`);
  }
}

for (const e of events) {
  if (!e.id || !e.locationId) errors.push('Event missing id or locationId');
  addId(e.id, 'event');
  if (!Array.isArray(e.choices) || e.choices.length < 2) errors.push(`Event ${e.id} must have at least 2 choices`);
  if (!locationIds.has(e.locationId)) errors.push(`Event ${e.id} has unknown locationId ${e.locationId}`);
  const agg = ensureAgg(e.locationId);
  for (const choice of e.choices || []) {
    if (choice.tags?.ngss?.length) choice.tags.ngss.forEach((t) => agg.ngss.add(t));
    if (choice.tags?.epc?.length) choice.tags.epc.forEach((t) => agg.epc.add(t));
  }
  for (const qid of e.followUpQuestionIds || []) {
    if (!questions.find((q) => q.id === qid)) errors.push(`Event ${e.id} references unknown question ${qid}`);
  }
}

for (const s of summaries) {
  if (!s.locationId) errors.push('Summary missing locationId');
  if (!locationIds.has(s.locationId)) errors.push(`Summary for unknown locationId ${s.locationId}`);
  const agg = ensureAgg(s.locationId);
  if (s.tags?.ngss?.length) s.tags.ngss.forEach((t) => agg.ngss.add(t));
  if (s.tags?.epc?.length) s.tags.epc.forEach((t) => agg.epc.add(t));
}

for (const [locationId, agg] of perLocation.entries()) {
  if (agg.ngss.size === 0) errors.push(`Location ${locationId} missing NGSS tags across content`);
  if (agg.epc.size === 0) errors.push(`Location ${locationId} missing EP&C tags across content`);
  if (agg.questions > 0) {
    const required = Math.ceil(agg.questions / 3);
    if (agg.questionsWithEpc < required) {
      warn.push(`Location ${locationId} has ${agg.questionsWithEpc}/${agg.questions} questions with EP&C tags`);
    }
  }
}

if (errors.length) {
  console.error('Content validation failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

if (warn.length) {
  console.warn('Content validation warnings:');
  for (const w of warn) console.warn(`- ${w}`);
}

console.log('Content validation passed.');
