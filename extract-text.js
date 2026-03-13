const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/quinn/.claude/projects/C--projects-BlackSpace/3207a1c7-bfb7-4811-b279-38be7b315957/tool-results/mcp-pencil-batch_get-1773401729804.txt'));
const texts = [];
const seen = new Set();
function extract(obj) {
  if (obj === null || obj === undefined || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach(extract); return; }
  if (obj.type === 'text' && obj.content && obj.id && !seen.has(obj.id)) {
    seen.add(obj.id);
    texts.push({ id: obj.id, name: obj.name || '', content: obj.content });
  }
  Object.values(obj).forEach(v => extract(v));
}
extract(data);
texts.forEach(t => {
  const c = t.content.replace(/\n/g, '\\n').slice(0, 160);
  console.log(`${t.id.padEnd(22)}| ${(t.name || '').padEnd(26)}| ${c}`);
});
