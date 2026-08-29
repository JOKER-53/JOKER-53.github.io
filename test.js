const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
dom.window.AOS = { init: () => {} };
dom.window.Swiper = class { constructor() {} };
const script = fs.readFileSync('script.js', 'utf8');
try {
  dom.window.eval(script);
  console.log("Success");
} catch (e) {
  console.log("Error stack:", e.stack);
}
