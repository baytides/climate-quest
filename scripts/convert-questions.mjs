import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const src = path.join(ROOT, 'content-src/questions.csv');
const out = path.join(ROOT, 'src/content/questions.json');

const csv = fs.readFileSync(src, 'utf8').trim().split('\n');
const [headerLine, ...rows] = csv;
const headers = headerLine.split(',');

const splitPipe = (value) => value ? value.split('|').map((s) => s.trim()) : [];

const items = rows.filter(Boolean).map((line) => {
  const cells = line.match(/("[^"]*"|[^,]+)/g).map((c) => c.replace(/^"|"$/g, ''));
  const obj = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));

  return {
    id: obj.id,
    locationId: obj.locationId,
    gradeBand: obj.gradeBand,
    difficulty: obj.difficulty,
    question: obj.question,
    answers: splitPipe(obj.answers),
    correctIndex: Number(obj.correctIndex),
    explanation: obj.explanation,
    misconception: obj.misconception || undefined,
    tags: {
      ngss: splitPipe(obj.ngss),
      epc: splitPipe(obj.epc),
      topic: splitPipe(obj.topic),
    },
  };
});

fs.writeFileSync(out, JSON.stringify(items, null, 2) + '\n');
console.log(`Wrote ${items.length} questions to ${out}`);
