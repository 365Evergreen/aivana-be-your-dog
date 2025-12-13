const fs = require('fs');
const path = require('path');

function hexToRgb(hex){
  hex = hex.replace('#','');
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  return [r,g,b];
}

function srgbToLinear(c){
  c = c / 255;
  return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
}

function luminance([r,g,b]){
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hexA, hexB){
  const a = luminance(hexToRgb(hexA));
  const b = luminance(hexToRgb(hexB));
  const L1 = Math.max(a,b);
  const L2 = Math.min(a,b);
  return (L1 + 0.05) / (L2 + 0.05);
}

function parseVariables(css){
  const vars = {};
  const re = /--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g;
  let m;
  while((m = re.exec(css))){
    vars[m[1]] = m[2].toUpperCase();
  }
  return vars;
}

function fmt(n){
  return Math.round(n*100)/100;
}

const cssPath = path.join(__dirname, '..', 'src', 'assets', 'styles', 'global.css');
if(!fs.existsSync(cssPath)){
  console.error('global.css not found at', cssPath);
  process.exit(2);
}

const css = fs.readFileSync(cssPath, 'utf8');
const vars = parseVariables(css);

const checks = [
  {name:'Light: text on bg', fg: vars['fluent-text'], bg: vars['fluent-bg']},
  {name:'Light: muted on bg', fg: vars['fluent-muted'], bg: vars['fluent-bg']},
  {name:'Light: primary (link) on bg', fg: vars['fluent-link'] || vars['fluent-primary'], bg: vars['fluent-bg']},
  {name:'Light: surface text on surface', fg: vars['fluent-text'], bg: vars['fluent-surface']},
  {name:'Light: primary-button text (fg on primary)', fg: vars['fluent-primary-text'] || vars['fluent-bg'], bg: vars['fluent-primary']},

  {name:'Dark: text on bg', fg: vars['fluent-text'], bg: vars['fluent-bg']},
  {name:'Dark: muted on bg', fg: vars['fluent-muted'], bg: vars['fluent-bg']},
  {name:'Dark: primary (link) on bg', fg: vars['fluent-link'] || vars['fluent-primary'], bg: vars['fluent-bg']},
  {name:'Dark: surface text on surface', fg: vars['fluent-text'], bg: vars['fluent-surface']},
  {name:'Dark: primary-button text (fg on primary)', fg: vars['fluent-primary-text'] || vars['fluent-bg'], bg: vars['fluent-primary']},
];

console.log('Loaded variables:');
Object.keys(vars).sort().forEach(k => console.log('  --' + k + ':', vars[k]));
console.log('\nContrast checks (ratio, AA >=4.5, AA-large/UI >=3.0):\n');

checks.forEach(c => {
  if(!c.fg || !c.bg){
    console.log(c.name + ': missing variable(s)');
    return;
  }
  const ratio = contrastRatio(c.fg, c.bg);
  const a = ratio >= 4.5 ? 'PASS' : 'FAIL';
  const b = ratio >= 3.0 ? 'PASS' : 'FAIL';
  console.log(`${c.name}: ${c.fg} on ${c.bg} -> ${fmt(ratio)} (${a} AA, ${b} AA-large)`);
});

// Extra: list any remaining hex literals in the css that are not variables (potential misses)
const hexLiterals = Array.from(new Set((css.match(/#[0-9a-fA-F]{6}/g)||[])));
const varValues = new Set(Object.values(vars));
const literalsNotVars = hexLiterals.filter(h => !varValues.has(h.toUpperCase()));
if(literalsNotVars.length){
  console.log('\nFound literal hex colors in global.css not defined as variables:');
  literalsNotVars.forEach(h => console.log('  ', h));
} else {
  console.log('\nNo unmatched hex literals found in global.css.');
}

process.exit(0);
