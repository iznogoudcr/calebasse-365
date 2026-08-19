#!/usr/bin/env node
/**
 * Contrôle du registre avant publication.
 *
 *   node verify.mjs
 *
 * Le rendu place la tuile et ses huit voisines dans le <pattern> : les débords
 * rognés d'un côté sont redessinés par la copie d'en face, donc le raccord
 * géométrique est acquis par construction. Ce script vérifie ce qui peut l'être
 * mécaniquement — structure, numérotation, unicité, tuile bien dans ses bornes.
 * La continuité du dessin, elle, se juge à l'œil sur l'étoffe du héros.
 */
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ---------- 1. extraction du registre ---------- */
const start = html.indexOf('/* === MOTIFS:START');
const end = html.indexOf('/* === MOTIFS:END');
if (start === -1 || end === -1 || end < start) {
  console.error('✗ marqueurs MOTIFS:START / MOTIFS:END introuvables ou inversés');
  process.exit(1);
}
const openBracket = html.indexOf('[', html.indexOf('var MOTIFS', start));
if (openBracket === -1 || openBracket > end) {
  console.error('✗ tableau MOTIFS introuvable entre les marqueurs');
  process.exit(1);
}
const literal = html.slice(openBracket, end).trimEnd().replace(/,\s*$/, '') + ']';

let MOTIFS;
try {
  MOTIFS = new Function(`"use strict"; return (${literal});`)();
} catch (e) {
  console.error("✗ le tableau MOTIFS ne s'évalue pas — virgule ou apostrophe non échappée ?");
  console.error('  ' + e.message);
  process.exit(1);
}
if (!Array.isArray(MOTIFS) || MOTIFS.length === 0) {
  console.error('✗ MOTIFS est vide');
  process.exit(1);
}

/* ---------- 2. schéma et numérotation ---------- */
const FIELDS = ['day', 'name', 'family', 'note', 'mode', 'weight', 'inner'];
MOTIFS.forEach((m, i) => {
  const tag = `motif #${i + 1} (day ${m && m.day})`;
  if (!m || typeof m !== 'object') return fail(`${tag} : ce n'est pas un objet`);
  for (const f of FIELDS) if (m[f] === undefined) fail(`${tag} : champ « ${f} » manquant`);
  if (m.mode !== 'stroke' && m.mode !== 'fill') fail(`${tag} : mode « ${m.mode} » — attendu 'stroke' ou 'fill'`);
  if (m.cap !== undefined && !['butt', 'square', 'round'].includes(m.cap)) fail(`${tag} : cap « ${m.cap} » invalide`);
  if (typeof m.weight !== 'number' || m.weight <= 0) fail(`${tag} : weight doit être un nombre positif`);
  if (typeof m.note === 'string' && m.note.trim().length < 40) warn(`${tag} : note très courte`);
  if (typeof m.name === 'string' && !m.name.trim()) fail(`${tag} : nom vide`);
  if (m.day !== i + 1) fail(`${tag} : numérotation discontinue — attendu day ${i + 1}`);
});
if (MOTIFS.length > 365) fail(`la série compte ${MOTIFS.length} motifs — le maximum est 365`);

const names = new Map();
const inners = new Map();
for (const m of MOTIFS) {
  const nk = String(m.name || '').toLowerCase().trim();
  if (names.has(nk)) fail(`nom « ${m.name} » déjà utilisé au jour ${names.get(nk)}`);
  names.set(nk, m.day);
  const ik = String(m.inner || '').replace(/\s+/g, '');
  if (inners.has(ik)) fail(`jour ${m.day} : tracé identique au jour ${inners.get(ik)}`);
  inners.set(ik, m.day);
}

/* deux jours de suite dans la même famille : la série s'aplatit */
for (let i = 1; i < MOTIFS.length; i++) {
  if (MOTIFS[i].family && MOTIFS[i].family === MOTIFS[i - 1].family) {
    warn(`jour ${MOTIFS[i].day} : même famille « ${MOTIFS[i].family} » que la veille`);
  }
}

/* ---------- 3. coordonnées d'un tracé absolu ---------- */
function pointsOfPath(d) {
  const pts = [];
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
  let i = 0, cmd = null, cur = null, startPt = null;
  const num = () => parseFloat(tokens[i++]);
  const push = (p) => { pts.push(p); cur = p; };

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    if (!cmd) break;
    const C = cmd.toUpperCase();
    if (cmd !== C && C !== 'Z') return { relative: true, pts };
    switch (C) {
      case 'M': { const p = [num(), num()]; push(p); startPt = p; cmd = 'L'; break; }
      case 'L': push([num(), num()]); break;
      case 'H': push([num(), cur ? cur[1] : 0]); break;
      case 'V': push([cur ? cur[0] : 0, num()]); break;
      case 'C': { push([num(), num()]); push([num(), num()]); push([num(), num()]); break; }
      case 'S': case 'Q': { push([num(), num()]); push([num(), num()]); break; }
      case 'T': push([num(), num()]); break;
      case 'A': { num(); num(); num(); num(); num(); push([num(), num()]); break; }
      case 'Z': if (startPt) cur = startPt; break;
      default: return { unknown: C, pts };
    }
  }
  return { pts };
}

const attr = (tagText, name) => {
  const m = tagText.match(new RegExp(`\\b${name}="([^"]+)"`));
  return m ? Number(m[1]) : 0;
};

function geometryOf(inner) {
  const out = { pts: [], relative: false, unknown: null };
  for (const mm of inner.matchAll(/\bd="([^"]+)"/g)) {
    const r = pointsOfPath(mm[1]);
    if (r.relative) out.relative = true;
    if (r.unknown) out.unknown = r.unknown;
    out.pts.push(...r.pts);
  }
  for (const mm of inner.matchAll(/<circle\b[^>]*>/g)) {
    const cx = attr(mm[0], 'cx'), cy = attr(mm[0], 'cy'), r = attr(mm[0], 'r');
    out.pts.push([cx - r, cy], [cx + r, cy], [cx, cy - r], [cx, cy + r]);
  }
  for (const mm of inner.matchAll(/<rect\b[^>]*>/g)) {
    const x = attr(mm[0], 'x'), y = attr(mm[0], 'y'), w = attr(mm[0], 'width'), h = attr(mm[0], 'height');
    out.pts.push([x, y], [x + w, y + h]);
  }
  return out;
}

/* ---------- 4. géométrie de chaque tuile ---------- */
const EPS = 1e-6;
for (const m of MOTIFS) {
  const tag = `jour ${String(m.day).padStart(3, '0')} « ${m.name} »`;
  const inner = String(m.inner || '');

  const opens = (inner.match(/</g) || []).length;
  const closes = (inner.match(/\/>|<\//g) || []).length;
  if (opens !== closes) fail(`${tag} : balises SVG déséquilibrées (${opens} ouvertes, ${closes} fermées)`);
  if (/\btransform="/.test(inner)) warn(`${tag} : transform dans inner — vérifier que la tuile reste dans ses bornes`);

  const { pts, relative, unknown } = geometryOf(inner);
  if (relative) { warn(`${tag} : commandes de chemin relatives — bornes non vérifiables`); continue; }
  if (unknown) { warn(`${tag} : commande « ${unknown} » non gérée — bornes non vérifiables`); continue; }
  if (pts.length === 0) { fail(`${tag} : aucune géométrie exploitable`); continue; }

  const out = pts.find(([x, y]) => x < -EPS || x > 100 + EPS || y < -EPS || y > 100 + EPS);
  if (out) fail(`${tag} : point (${out[0]}, ${out[1]}) hors de la tuile 0–100`);
}

/* ---------- 5. verdict ---------- */
const n = MOTIFS.length;
for (const w of warnings) console.warn('⚠ ' + w);
if (errors.length) {
  for (const e of errors) console.error('✗ ' + e);
  console.error(`\n${errors.length} erreur(s) — ne pas publier.`);
  process.exit(1);
}
console.log(`✓ registre valide — ${n} motif${n > 1 ? 's' : ''} sur 365${warnings.length ? `, ${warnings.length} avertissement(s)` : ''}.`);
console.log("  Reste à juger à l'œil : la continuité du dessin sur l'étoffe en haut de page.");
