// couverture des règles de lisibilité du gabarit A0 — jugement pur, sans accès disque (TF-2456).
//
// Le gabarit A0 reprend les règles de lisibilité du socle `digit-ai-page-html`
// (`references/lisibilite.md`). Sa fraîcheur de VERSION se lit au manifeste (fraicheur-a0.mjs) ;
// ce contrôle-ci juge ce que la version ne prouve pas : que la LISTE des règles L du gabarit est
// celle du socle. Le 12/11/2026, le socle allait jusqu'à L39 et le gabarit reprenait L1 à L37 :
// L38 et L39 manquaient, et rien ne le disait (la version, elle, était à jour).
//
// Ce que le gabarit déclare : une section « Couverture des règles de lisibilité du socle » dont
// chaque ligne de tableau commence par le numéro d'une règle (`L13`) et nomme, dans sa deuxième
// colonne, la ou les lignes `A0-n` qui la portent. Ce que le contrôle compare :
//   - toute règle du socle figure dans la table, et la table ne cite aucune règle absente du socle ;
//   - chaque règle nomme au moins une ligne `A0-n`, et chaque `A0-n` nommée existe dans le gabarit.
//
// Ce que ce contrôle ne juge pas : que la ligne A0 dise la même chose que la règle du socle. La
// présence d'une ligne n'est pas sa justesse ; la relecture ligne à ligne reste une lecture.

const TITRE_SECTION = /^##\s+Couverture des règles de lisibilité du socle/;

// Lignes hors blocs de code balisés : un titre ou une ligne de table cités dans un exemple ne comptent pas.
function lignesHorsCode(texte) {
  const sortie = [];
  let dansCode = false;
  for (const l of texte.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(l)) { dansCode = !dansCode; continue; }
    if (!dansCode) sortie.push(l);
  }
  return sortie;
}

// Règles du socle : les numéros portés par les titres `## L13 — …`, `### L18 bis — …`, `## L32 / L33 — …`.
// Un numéro absent (le socle n'a pas de L23) n'est pas inventé ; il est rendu dans `trous`.
export function reglesDuSocle(texteLisibilite) {
  const ids = new Set();
  for (const l of lignesHorsCode(texteLisibilite)) {
    const m = l.match(/^#{2,3}\s+L(\d+)(?:\s*\/\s*L(\d+))?(?=\s|$|\()/);
    if (m) { ids.add(Number(m[1])); if (m[2]) ids.add(Number(m[2])); }
  }
  const titre = texteLisibilite.match(/^#\s+Lisibilité\s+—\s+règles\s+L1\s+à\s+L(\d+)/m);
  const max = ids.size ? Math.max(...ids) : 0;
  const trous = [];
  for (let n = 1; n <= max; n += 1) if (!ids.has(n)) trous.push(n);
  return { ids: [...ids].sort((a, b) => a - b), annonceMax: titre ? Number(titre[1]) : null, max, trous };
}

// Lignes A0 définies : `| **A0-13** | …`.
export function lignesA0(texteA0) {
  const ids = new Set();
  for (const l of lignesHorsCode(texteA0)) {
    const m = l.match(/^\|\s*\*{0,2}(A0-\d+)\*{0,2}\s*\|/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

// Table de couverture du gabarit : { regle (nombre) → [A0-n…] }, ou null si la section manque.
export function couvertureDuGabarit(texteA0) {
  const lignes = lignesHorsCode(texteA0);
  const debut = lignes.findIndex((l) => TITRE_SECTION.test(l));
  if (debut < 0) return null;
  const table = new Map();
  for (let i = debut + 1; i < lignes.length; i += 1) {
    const l = lignes[i];
    if (/^##\s/.test(l) || /^---\s*$/.test(l)) break;
    const m = l.match(/^\|\s*\*{0,2}L(\d+)\*{0,2}\s*\|([^|]*)\|/);
    if (!m) continue;
    const n = Number(m[1]);
    const a0 = [...(m[2].match(/A0-\d+/g) || [])];
    table.set(n, [...(table.get(n) || []), ...a0]);
  }
  return table;
}

// → { verdict: 'ok' | 'echec' | 'non_jugeable', message, manquantes, en_trop, sans_ligne, a0_inconnues }
export function jugerCouvertureLisibilite(texteA0, texteLisibilite) {
  const vide = { manquantes: [], en_trop: [], sans_ligne: [], a0_inconnues: [] };
  if (!texteLisibilite) {
    return { verdict: 'non_jugeable', message: 'references/lisibilite.md du socle introuvable sur ce poste — non jugeable', ...vide };
  }
  const socle = reglesDuSocle(texteLisibilite);
  if (!socle.ids.length) {
    return { verdict: 'non_jugeable', message: 'aucune section « L<n> » lue dans lisibilite.md du socle — non jugeable', ...vide };
  }
  if (socle.annonceMax !== null && socle.annonceMax > socle.max) {
    return { verdict: 'non_jugeable', message: `le socle annonce L1 à L${socle.annonceMax} mais sa dernière section est L${socle.max} — non jugeable tant que le socle ne se contredit plus`, ...vide };
  }
  const table = couvertureDuGabarit(texteA0);
  if (!table) {
    return { verdict: 'echec', message: 'aucune section « Couverture des règles de lisibilité du socle » dans le gabarit', ...vide, manquantes: socle.ids };
  }
  const definies = lignesA0(texteA0);
  const manquantes = socle.ids.filter((n) => !table.has(n));
  // Un numéro sans section au socle mais DANS sa plage (L23, jugé par check_html.py sans être écrit
  // dans lisibilite.md) peut figurer à la table : le gabarit le porte, et le message le dit. Au-delà
  // de la dernière section, un numéro cité est de trop.
  const en_trop = [...table.keys()].filter((n) => !socle.ids.includes(n) && !socle.trous.includes(n)).sort((a, b) => a - b);
  const portees_sans_section = [...table.keys()].filter((n) => socle.trous.includes(n)).sort((a, b) => a - b);
  const sans_ligne = [...table.entries()].filter(([n, a0]) => socle.ids.includes(n) && !a0.length).map(([n]) => n).sort((a, b) => a - b);
  const a0_inconnues = [...new Set([...table.values()].flat().filter((id) => !definies.has(id)))];
  const nom = (n) => `L${n}`;
  const morceaux = [];
  if (manquantes.length) morceaux.push(`règles du socle absentes de la table : ${manquantes.map(nom).join(', ')}`);
  if (en_trop.length) morceaux.push(`règles citées que le socle n'a pas : ${en_trop.map(nom).join(', ')}`);
  if (sans_ligne.length) morceaux.push(`règles sans ligne A0 nommée : ${sans_ligne.map(nom).join(', ')}`);
  if (a0_inconnues.length) morceaux.push(`lignes A0 nommées mais non définies : ${a0_inconnues.join(', ')}`);
  const trous = socle.trous.length
    ? ` (numéros sans section dans lisibilite.md : ${socle.trous.map(nom).join(', ')}${portees_sans_section.length ? ` ; portés quand même par le gabarit : ${portees_sans_section.map(nom).join(', ')}` : ''})`
    : '';
  if (morceaux.length) {
    return { verdict: 'echec', message: `${morceaux.join(' ; ')} — socle L1 à L${socle.max}${trous}`, manquantes, en_trop, sans_ligne, a0_inconnues };
  }
  return { verdict: 'ok', message: `${socle.ids.length} règles du socle (L1 à L${socle.max})${trous} toutes nommées dans la table du gabarit, chacune avec une ligne A0 définie`, ...vide };
}
