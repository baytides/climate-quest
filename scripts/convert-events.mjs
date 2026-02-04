import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const src = path.join(ROOT, 'content-src/events.csv');
const out = path.join(ROOT, 'src/content/events.json');

const csv = fs.readFileSync(src, 'utf8').trim().split('\n');
const [headerLine, ...rows] = csv;
const headers = headerLine.split(',');

const splitPipe = (value) => value ? value.split('|').map((s) => s.trim()) : [];
const parseEffects = (value) => {
  const effects = { health: 0, supplies: 0, biodiversity: 0, time: 0 };
  if (!value) return effects;
  value.split(';').forEach((pair) => {
    const [key, raw] = pair.split(':');
    if (key && raw) effects[key.trim()] = Number(raw);
  });
  return effects;
};

const parseCsvLine = (line) =>
  line
    .match(/("[^"]*"|[^,]+)/g)
    .map((c) => c.replace(/^"|"$/g, ''));

const items = rows.filter(Boolean).map((line) => {
  const cells = parseCsvLine(line);
  const obj = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));

  const rawChoices = obj.choices
    ? obj.choices.split('||').map((c) => c.trim()).filter(Boolean)
    : [];

  const parsedChoices = rawChoices.map((chunk) => {
    const parts = chunk.split('|').map((c) => c.trim());
    const [id, label, outcome, effectsRaw, ngssRaw, epcRaw, ...topicParts] = parts;
    const topicRaw = topicParts.join('|');
    return {
      id,
      label,
      outcome,
      effects: parseEffects(effectsRaw),
      tags: {
        ngss: splitPipe(ngssRaw),
        epc: splitPipe(epcRaw),
        topic: splitPipe(topicRaw),
      },
    };
  });

  return {
    id: obj.id,
    locationId: obj.locationId,
    gradeBand: obj.gradeBand,
    type: obj.type,
    title: obj.title,
    prompt: obj.prompt,
    choices: parsedChoices,
    followUpQuestionIds: splitPipe(obj.followUpQuestionIds),
  };
});

fs.writeFileSync(out, JSON.stringify(items, null, 2) + '\n');
console.log(`Wrote ${items.length} events to ${out}`);
