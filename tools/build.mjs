// Builds the site's HTML pages from one shared layout. No dependencies:
//   node tools/build.mjs
// Each file in src/pages/ starts with a comment like
//   <!-- title: About Us | description: Our history, mission and values -->
// and its body is placed into src/layout.html. Output goes to the repository root,
// which GitHub Pages publishes as-is.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const layout = readFileSync(join(root, 'src/layout.html'), 'utf8');

const NAV = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['academics.html', 'Academics'],
    ['campuses.html', 'Campuses'],
    ['admission.html', 'Admissions'],
    ['student-life.html', 'Student Life'],
    ['contact.html', 'Contact'],
];

const nav = (current) =>
    NAV.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('\n                ');

// Shortcodes used in src/pages:
//   {{icon:name}}        an icon from assets/icons.svg
//   {{wave}} / {{wave:cream}}  two layered, slowly moving waves at the bottom of a hero
const sprite = readFileSync(join(root, 'assets/icons.svg'), 'utf8');
const icon = (name) => {
    if (!sprite.includes(`id="${name}"`)) throw new Error(`Icon "${name}" is not in assets/icons.svg`);
    return `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
};
// One wave period is 1440 wide and the path holds two, so sliding by half loops seamlessly.
const WAVE = 'M0 40 C 360 0 1080 80 1440 40 C 1800 0 2520 80 2880 40 V80 H0 Z';
const wave = (tone) =>
    `<svg class="wave wave--back${tone ? ` wave--${tone}` : ''}" viewBox="0 0 2880 80" preserveAspectRatio="none" aria-hidden="true"><path d="${WAVE}"/></svg>\n` +
    `<svg class="wave${tone ? ` wave--${tone}` : ''}" viewBox="0 0 2880 80" preserveAspectRatio="none" aria-hidden="true"><path d="${WAVE}"/></svg>`;
const expand = (html) =>
    html.replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name)).replace(/\{\{wave(?::([a-z]+))?\}\}/g, (_, tone) => wave(tone));

let count = 0;
for (const file of readdirSync(join(root, 'src/pages')).filter((f) => f.endsWith('.html'))) {
    const source = readFileSync(join(root, 'src/pages', file), 'utf8');
    const meta = source.match(/^<!--\s*title:\s*(.*?)\s*\|\s*description:\s*(.*?)\s*-->/);
    if (!meta) throw new Error(`${file}: first line must be <!-- title: ... | description: ... -->`);
    const [, title, description] = meta;
    const body = expand(source.slice(meta[0].length).trim());
    const html = expand(layout)
        .replaceAll('{{title}}', file === 'index.html' ? title : `${title} | Golden Child Complex School`)
        .replaceAll('{{description}}', description)
        .replaceAll('{{page}}', file.replace('.html', ''))
        .replaceAll('{{nav}}', nav(file))
        .replace('{{body}}', body);
    writeFileSync(join(root, file), html);
    count++;
}
console.log(`Built ${count} pages.`);
