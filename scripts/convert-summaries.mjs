import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const src = path.join(ROOT, 'content-src/summaries.csv');
const out = path.join(ROOT, 'src/content/summaries.json');

const csv = fs.readFileSync(src, 'utf8').trim().split('\n');
const [headerLine, ...rows] = csv;
const headers = headerLine.split(',');

const splitPipe = (value) => value ? value.split('|').map((s) => s.trim()) : [];
const parseCsvLine = (line) =>
  line
    .match(/("[^"]*"|[^,]+)/g)
    .map((c) => c.replace(/^"|"$/g, ''));

const items = rows.filter(Boolean).map((line) => {
  const cells = parseCsvLine(line);
  const obj = Object.fromEntries(headers.map((h, i) => [h, cells[i]]));

  return {
    locationId: obj.locationId,
    title: obj.title,
    summary: obj.summary,
    keyTakeaway: obj.keyTakeaway,
    tags: {
      ngss: splitPipe(obj.ngss),
      epc: splitPipe(obj.epc),
      topic: splitPipe(obj.topic),
    },
  };
});

fs.writeFileSync(out, JSON.stringify(items, null, 2) + '\n');
console.log(`Wrote ${items.length} summaries to ${out}`);
