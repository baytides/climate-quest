import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const files = {
  questions: path.join(ROOT, 'src/content/questions.json'),
  events: path.join(ROOT, 'src/content/events.json'),
  summaries: path.join(ROOT, 'src/content/summaries.json'),
};

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const errors = [];
const warn = [];

const questions = load(files.questions);
const events = load(files.events);
const summaries = load(files.summaries);

const ids = new Set();
const addId = (id, kind) => {
  if (ids.has(id)) errors.push(`Duplicate id: ${id} (${kind})`);
  ids.add(id);
};

for (const q of questions) {
  if (!q.id || !q.locationId) errors.push('Question missing id or locationId');
  addId(q.id, 'question');
  if (!Array.isArray(q.answers) || q.answers.length !== 4) errors.push(`Question ${q.id} must have 4 answers`);
  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) errors.push(`Question ${q.id} has invalid correctIndex`);
  if (!q.tags?.ngss?.length || !q.tags?.epc?.length) warn.push(`Question ${q.id} missing ngss/epc tags`);
}

for (const e of events) {
  if (!e.id || !e.locationId) errors.push('Event missing id or locationId');
  addId(e.id, 'event');
  if (!Array.isArray(e.choices) || e.choices.length < 2) errors.push(`Event ${e.id} must have at least 2 choices`);
}

for (const s of summaries) {
  if (!s.locationId) errors.push('Summary missing locationId');
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
