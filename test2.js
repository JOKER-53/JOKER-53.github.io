const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously' });
dom.window.AOS = { init: () => {} };
dom.window.Swiper = class { constructor() {} };
const scriptLines = fs.readFileSync('script.js', 'utf8').split('\n');
for (let i = 0; i < scriptLines.length; i++) {
  try {
    dom.window.eval(scriptLines[i]);
  } catch (e) {
    if (e.message !== "Unexpected token 'catch'") {
       console.log("Error at line", i+1, scriptLines[i], e);
       break;
    }
  }
}
