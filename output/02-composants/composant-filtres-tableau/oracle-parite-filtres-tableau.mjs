#!/usr/bin/env node
/**
 * oracle-parite-filtres-tableau.mjs — la copie de `oracle-filtres-tableau.mjs` livrée avec ce
 * composant est-elle identique à la copie installée dans quality-oracles ? (TF-1336, 26/09/2026)
 *
 * POURQUOI. `INSTALLATION.md` de ce composant désigne la copie D'ICI comme la source de vérité
 * de l'oracle et de sa checklist G1-G6 (section « Source de vérité depuis le 21/08 » : « la
 * checklist G1-G6 et l'oracle, eux, vivent ici » — à distinguer des assets JS/CSS, dont la copie
 * qui s'exécute est celle du skill `digit-ai-page-html`). La copie de `quality-oracles` est celle
 * qui s'exécute une fois installée chez un consommateur ; rien ne rapprochait mécaniquement les
 * deux avant ce contrôle. Constaté le 23/09/2026, vérifié le 26/09/2026 : la copie installée
 * (et la copie versionnée dans `digit-ai-forge-agents`, identiques entre elles) sont restées
 * figées au 09/08/2026 (131 lignes) tandis que la référence évoluait ici jusqu'au 13/09/2026
 * (209 lignes : durcissements RS-1 et RS-1 bis, TF-0837) — 78 lignes d'écart jamais propagées,
 * sans qu'aucun contrôle ne le voie.
 *
 * CE QUE CE CONTRÔLE NE TRANCHE PAS : quelle copie est correcte quand aucune source ne le dit.
 * Ici, une source le dit (`INSTALLATION.md`) — voir le rapport TF-1336 pour la citation complète
 * et pour la description des différences constatées. Si un jour les deux copies divergent à
 * nouveau SANS qu'une source ne désigne la référence, ce contrôle continue de détecter la
 * divergence ; il ne désigne jamais lui-même laquelle corriger — c'est un arbitrage humain.
 *
 * LA RÈGLE : lit les deux fichiers OCTET PAR OCTET, ici et maintenant — jamais une conclusion
 * mise en cache. Identiques → PASS. Différents → FAIL, écart résumé (nombre de lignes de chaque
 * côté, numéro de la première ligne qui diffère). Le dépôt tiers absent de ce poste (jamais
 * cloné) est NON JUGEABLE (INCONCLUSIF) — jamais un FAIL silencieux, jamais un PASS qui ne
 * prouve rien. Le dépôt présent mais le fichier manquant à l'emplacement attendu EST une
 * divergence réelle (FAIL) : la référence n'a pas été propagée, ou plus personne ne la lit.
 *
 * Contrat : {oracle,domaine,artefact,verdict,findings[],non_juge[]} — exit 0 PASS, 1 FAIL, 2 SKIP.
 * Usage : node oracle-parite-filtres-tableau.mjs [--reference <chemin>] [--autre <chemin>] [--json]
 *
 * Fixtures à double sens : fixtures/parite-verte/ (deux copies identiques, PASS) et
 * fixtures/parite-rouge/ (deux copies divergentes, FAIL) — rejouées par
 * self-test-parite-filtres-tableau.mjs, qui prouve aussi les deux branches non couvertes par un
 * fichier : dépôt tiers absent (INCONCLUSIF) et fichier explicitement demandé mais absent (FAIL).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));

/** Remonte depuis `depuis` jusqu'au premier `.git` rencontré — la racine du dépôt courant. */
function trouverRacineDepot(depuis) {
  let d = depuis;
  for (let i = 0; i < 20; i += 1) {
    if (existsSync(join(d, '.git'))) return d;
    const parent = dirname(d);
    if (parent === d) return null;
    d = parent;
  }
  return null;
}

const RACINE_DEPOT = trouverRacineDepot(ICI);
// Convention du pilot (CLAUDE.md racine) : FORGE_ROOT si posé, sinon le parent du dépôt courant.
const FORGE_ROOT = process.env.FORGE_ROOT || (RACINE_DEPOT ? dirname(RACINE_DEPOT) : null);

const REFERENCE_DEFAUT = join(ICI, 'oracle-filtres-tableau.mjs');
const DEPOT_AUTRE = 'digit-ai-forge-agents';
const CHEMIN_AUTRE_DANS_DEPOT = ['.claude', 'skills', 'quality-oracles', 'scripts', 'oracle-filtres-tableau.mjs'];
const AUTRE_DEFAUT = FORGE_ROOT ? join(FORGE_ROOT, DEPOT_AUTRE, ...CHEMIN_AUTRE_DANS_DEPOT) : null;

const args = process.argv.slice(2);
const json = args.includes('--json');
const valeurDe = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : undefined; };
const autreExplicite = valeurDe('--autre');
const reference = valeurDe('--reference') || REFERENCE_DEFAUT;
const autre = autreExplicite || AUTRE_DEFAUT;

const OUT = {
  oracle: 'parite-filtres-tableau',
  domaine: 'Parité de oracle-filtres-tableau.mjs entre ce composant (référence) et quality-oracles (copie installée)',
  artefact: null,
  verdict: 'INCONCLUSIF',
  findings: [],
  non_juge: [
    'laquelle des deux copies est correcte quand la divergence n\'est tranchée par AUCUNE source — ici, INSTALLATION.md tranche explicitement (« la checklist G1-G6 et l\'oracle, eux, vivent ici ») ; un arbitrage sans source de ce genre resterait humain, jamais déduit par ce contrôle',
    'le contenu FONCTIONNEL des deux copies au-delà du texte : deux fichiers strictement identiques mais logiquement faux resteraient PASS ici — la parité prouve une propagation, jamais une correction',
  ],
};
const ajoute = (regle, severite, message, ou) => OUT.findings.push({ regle, severite, message, ou });

function imprimer() {
  if (json) {
    process.stdout.write(JSON.stringify(OUT, null, 2));
    return;
  }
  const icone = { bloquant: '❌', avertissement: '⚠️ ', info: 'ℹ️ ' };
  process.stdout.write(`\n${OUT.domaine}\nArtefact : ${OUT.artefact}\n\n`);
  if (!OUT.findings.length) process.stdout.write('  aucun écart\n');
  for (const f of OUT.findings) process.stdout.write(`  ${icone[f.severite] || '  '} [${f.regle}] ${f.message}\n      ${f.ou}\n`);
  process.stdout.write(`\n${OUT.verdict}\n`);
}

function sortir(code) {
  imprimer();
  process.exit(code);
}

if (!existsSync(reference)) {
  OUT.artefact = reference;
  ajoute('—', 'bloquant', `copie de référence introuvable : ${reference}`, reference);
  sortir(2);
}

OUT.artefact = `${reference} ⇄ ${autre ?? '(indéterminé)'}`;

if (!autre) {
  OUT.non_juge.push('FORGE_ROOT indéterminé (ni variable d\'environnement, ni .git trouvé en remontant depuis ce fichier) : impossible de localiser la copie installée sans --autre explicite.');
  sortir(2);
}

// Le dépôt tiers lui-même absent de ce poste (jamais cloné) est un fait d'ENVIRONNEMENT, pas une
// divergence de contenu : non jugeable, jamais un FAIL qui laisserait croire à un vrai écart —
// jamais non plus un PASS qui ne prouve rien. Seulement quand --autre n'a pas été forcé à la
// main : un chemin explicite mais absent est, lui, une divergence réelle (branche suivante).
if (!autreExplicite && FORGE_ROOT && !existsSync(join(FORGE_ROOT, DEPOT_AUTRE))) {
  OUT.non_juge.push(`dépôt « ${DEPOT_AUTRE} » absent de ce poste (${join(FORGE_ROOT, DEPOT_AUTRE)}) : la comparaison suppose son clonage local — non jugeable ici, pas un FAIL.`);
  sortir(2);
}

if (!existsSync(autre)) {
  ajoute('PARITE', 'bloquant',
    `copie « autre » absente à l'emplacement attendu : ${autre} — soit elle a été retirée, soit elle n'a jamais reçu la propagation depuis la référence ; dans les deux cas la référence ne s'y trouve pas`,
    autre);
  OUT.verdict = 'FAIL';
  sortir(1);
}

const texteRef = readFileSync(reference, 'utf8');
const texteAutre = readFileSync(autre, 'utf8');

if (texteRef === texteAutre) {
  OUT.verdict = 'PASS';
  sortir(0);
}

const lignesRef = texteRef.split(/\r\n|\n/);
const lignesAutre = texteAutre.split(/\r\n|\n/);
let premier = 0;
while (premier < lignesRef.length && premier < lignesAutre.length && lignesRef[premier] === lignesAutre[premier]) premier += 1;
ajoute('PARITE', 'bloquant',
  `divergence de contenu : ${lignesRef.length} ligne(s) en référence, ${lignesAutre.length} en autre, premier écart à la ligne ${premier + 1} — la copie installée n'a pas reçu les évolutions de la référence (ou l'inverse : voir le rapport TF-1336 pour le sens constaté)`,
  `${resolve(reference)} ⇄ ${resolve(autre)}`);
OUT.verdict = 'FAIL';
sortir(1);
