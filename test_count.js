const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('scratch_jogos.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;
const aTags = doc.querySelectorAll('a');
const hrefs = Array.from(aTags).map(a => a.href);
console.log(hrefs.slice(0, 30));
