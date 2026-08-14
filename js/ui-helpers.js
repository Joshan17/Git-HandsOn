// Small shared helpers used by globe.js, search.js and profile-panel.js.
// Nothing here needs to change when a student adds their own data file.

// A handful of line icons (Feather-style, MIT-licensed shapes) inlined as
// SVG path data so the project has no icon-font/CDN dependency.
const ICON_PATHS = {
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.3c0-.9.3-1.5.7-1.9-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.2 0 4.5-2.7 5.5-5.4 5.8.4.4.8 1.1.8 2.2V21"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
};

function icon(name, className) {
  const path = ICON_PATHS[name] || '';
  return `<svg class="${className || 'icon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

// Every student gets a distinct, stable color derived from their id — no
// extra field to fill in, and it won't shift around when other students
// are added or removed.
const STUDENT_COLORS = [
  '#f0932b', // amber
  '#4fd1c5', // aqua
  '#f56565', // coral
  '#9f7aea', // violet
  '#63b3ed', // sky blue
  '#68d391', // mint
  '#ed64a6', // pink
  '#ecc94b', // gold
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function colorForStudent(id) {
  return STUDENT_COLORS[hashString(id) % STUDENT_COLORS.length];
}
