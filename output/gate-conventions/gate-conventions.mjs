#!/usr/bin/env node
// gate-conventions — TF-0109, sous-item 3.
//
// Gate de conventions « type danger » : au lieu d'auditer tout le stock d'un dépôt (c'est le
// travail de oracles/oracle-conventions.mjs, réservé à forge-organization), ce script juge
// UNIQUEMENT ce qui a bougé — les fichiers d'un commit staged ou d'une diff — comme danger.js
// juge une pull request au fil de ses fichiers changés, sans relire tout le dépôt à chaque
// passage. Portée volontairement incrémentale : bon marché en CI, en pre-commit, en revue.
//
// STATUT : PROPOSÉ. Ce fichier est un livrable de forge-organization, déposé dans son
// `output/` pour être copié — jamais poussé unilatéralement — dans un dépôt qui l'accepte.
// Voir INSTALLATION.md à côté de ce fichier : aucune installation automatique, aucun accès
// réseau, aucune dépendance à charger. Auto-suffisant : ce fichier ne fait AUCUN import
// relatif hors du cœur Node (fs/path/child_process) — il doit survivre à une copie isolée
// dans n'importe quel dépôt, y compris un dépôt qui n'a jamais entendu parler de
// forge-organization.
//
// Provenance des règles : portées depuis `oracles/oracle-conventions.mjs` de
// digit-ai-forge-organization (D-02/D-03/D-04/D-05/D-06/D-09/D-10), recopiées ici avec
// intention (D-12 : « inliner, jamais installer en douce ») plutôt qu'importées — ce fichier
// doit rester lisible et exécutable seul. Une correction de règle côté organization ne se
// répercute pas automatiquement ici : c'est le prix de l'autonomie de copie, documenté dans
// INSTALLATION.md.
//
// Modes d'invocation :
//   node gate-conventions.mjs --staged                 (défaut) fichiers indexés git (ACM)
//   node gate-conventions.mjs --diff <base-ref>         fichiers changés depuis <base-ref>
//   node gate-conventions.mjs --files <f1> <f2> ...     liste explicite (utilisé par les tests)
//   [--racine <dossier>]   racine du dépôt jugé, défaut = répertoire courant
//   [--registre <chemin>]  registre-types.json du dépôt jugé ; absent = D-04/D-06/D-03-émetteur
//                          dégradent en SKIP motivé plutôt que de planter (le dépôt cible n'a
//                          pas forcément adopté D-04)
//   [--json]               sortie JSON au lieu du rapport Markdown façon commentaire de PR
//
// Contrat : JSON {gate,racine,verdict,findings[],non_juge[]} · exit 0 PASS, 1 FAIL, 2 SKIP.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const json = args.includes('--json');
const iRacine = args.indexOf('--racine');
const RACINE = path.resolve(iRacine >= 0 ? args[iRacine + 1] : '.');
const iRegistre = args.indexOf('--registre');
const registrePath = iRegistre >= 0 ? path.resolve(args[iRegistre + 1]) : path.join(RACINE, 'registre-types.json');

const findings = [];
const ajoute = (sev, regle, msg, where) => findings.push({ sev, regle, msg, where });
const NON_JUGE = [];

function sortir(verdict, code) {
  const rapport = { gate: 'gate-conventions', racine: RACINE, verdict, findings, non_juge: NON_JUGE };
  if (json) {
    process.stdout.write(JSON.stringify(rapport, null, 2));
  } else {
    process.stdout.write(`### Gate conventions — ${verdict}\n\n`);
    if (!findings.length) {
      process.stdout.write('Aucun écart sur les fichiers jugés.\n');
    } else {
      for (const f of findings) {
        const icone = f.sev === 'bloquant' ? '❌' : f.sev === 'avertissement' ? '⚠️' : 'ℹ️';
        process.stdout.write(`- ${icone} **[${f.regle}]** \`${f.where}\` — ${f.msg}\n`);
      }
    }
    if (NON_JUGE.length) {
      process.stdout.write('\n<details><summary>Non jugé (dégradations et angles morts)</summary>\n\n');
      for (const n of NON_JUGE) process.stdout.write(`- ${n}\n`);
      process.stdout.write('\n</details>\n');
    }
    const b = findings.filter((f) => f.sev === 'bloquant').length;
    const a = findings.filter((f) => f.sev === 'avertissement').length;
    process.stdout.write(`\n${b} bloquant(s), ${a} avertissement(s).\n`);
  }
  process.exit(code);
}

// — Résolution du fichierset jugé —————————————————————————————————————————————
function fichiersDepuisGit(gitArgs) {
  const r = spawnSync('git', gitArgs, { cwd: RACINE, encoding: 'utf8' });
  if (r.status !== 0) return null;
  return r.stdout.split('\n').map((l) => l.trim()).filter(Boolean);
}

let cibles;
const iFiles = args.indexOf('--files');
const iDiff = args.indexOf('--diff');
if (iFiles >= 0) {
  cibles = args.slice(iFiles + 1).filter((a) => !a.startsWith('--'));
} else if (iDiff >= 0) {
  const base = args[iDiff + 1];
  cibles = fichiersDepuisGit(['diff', '--name-only', '--diff-filter=ACM', `${base}...HEAD`]);
  if (cibles === null) {
    ajoute('info', 'usage', `git diff impossible depuis « ${base} » — dépôt git absent ou réf inconnue`, RACINE);
    sortir('SKIP', 2);
  }
} else {
  cibles = fichiersDepuisGit(['diff', '--cached', '--name-only', '--diff-filter=ACM']);
  if (cibles === null) {
    ajoute('info', 'usage', 'pas un dépôt git (ou git absent du PATH) — utiliser --files pour juger une liste explicite', RACINE);
    sortir('SKIP', 2);
  }
}

// — Chargement du registre (optionnel) ————————————————————————————————————————
let registre = null;
if (fs.existsSync(registrePath)) {
  try {
    registre = JSON.parse(fs.readFileSync(registrePath, 'utf8'));
  } catch (e) {
    NON_JUGE.push(`registre « ${registrePath} » illisible (${e.message}) — D-04, D-06 et le volet émetteur de D-03 dégradent en non-jugé`);
  }
} else {
  NON_JUGE.push(`registre « ${registrePath} » absent — D-04, D-06 et le volet émetteur de D-03 dégradent en non-jugé (le dépôt jugé n'a peut-être pas adopté D-04)`);
}
const conv = (registre && registre.conventions) || {};
const PREFIXES_EMETTEUR = conv.prefixes_emetteur || [];
const SEUIL_Q3BIS = conv.seuil_q3bis || '99999999';
const TYPES_DOCTRINAUX = conv.types_doctrinaux || [];
const DIACRITIQUES = /[̀-ͯ]/g;
const pli = (s) => s.normalize('NFD').replace(DIACRITIQUES, '').toLowerCase();
const TYPES = new Map();
for (const t of (registre && registre.types) || []) {
  TYPES.set(pli(t.type), t.type);
  for (const a of t.alias || []) TYPES.set(pli(a), t.type);
}
const DOCTRINAUX = new Set(TYPES_DOCTRINAUX.map(pli));

// — D-05 — CLAUDE.md point d'entrée, vérifié à chaque passage (invariant du dépôt, pas du diff)
if (!fs.existsSync(path.join(RACINE, 'CLAUDE.md'))) {
  ajoute('bloquant', 'D-05', 'CLAUDE.md absent à la racine — point d\'entrée des instructions projet', '.');
}

// — Règles portées sur le fichierset jugé ————————————————————————————————————
const DATE_NUE = /(?:^|[^0-9])(20\d{6})(?![0-9])/;
const QUEUE_CONFORME = /^(\d{8})([a-z])(?: .*)?\.[A-Za-z0-9]+$/;
const QUEUE_SANS_INDICE = /^(\d{8})(?: .*)?\.[A-Za-z0-9]+$/;
// Mêmes dossiers ignorés que oracles/oracle-conventions.mjs : une fixture porte des
// violations volontaires, Old/ est une archive gelée, le reste est du tooling générique.
const IGNORE_SEGMENT = new Set(['.git', 'node_modules', '__pycache__', '.venv', 'Old', 'old', 'fixtures']);

for (const rel of cibles) {
  const relPosix = rel.replace(/\\/g, '/');
  if (relPosix.split('/').some((seg) => IGNORE_SEGMENT.has(seg))) continue;
  const abs = path.join(RACINE, rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue; // fichier supprimé par le commit jugé
  const nom = path.basename(rel);
  const dossier = path.dirname(rel).replace(/\\/g, '/');
  const racineDossier = dossier.split('/')[0];

  // D-09 / D-10 — livrables HTML d'output/, indépendant du nommage daté
  if (racineDossier === 'output' && /\.html?$/i.test(nom)) {
    const contenu = fs.readFileSync(abs, 'utf8');
    if (!/<html[^>]*\blang\s*=\s*["']fr["']/i.test(contenu)) {
      ajoute('bloquant', 'D-09', 'balise <html> sans lang="fr"', rel);
    }
    if (!/<meta[^>]*\bname\s*=\s*["']viewport["']/i.test(contenu)) {
      ajoute('bloquant', 'D-09', '<meta name="viewport"> absente', rel);
    }
    const nbH1 = (contenu.match(/<h1[\s>]/gi) || []).length;
    if (nbH1 !== 1) ajoute('bloquant', 'D-09', `${nbH1} <h1> trouvé(s), un seul est attendu`, rel);
    if (/syne/i.test(contenu)) ajoute('bloquant', 'D-09', 'police « Syne » référencée — interdite', rel);

    const sansCommentaires = contenu.replace(/<!--[\s\S]*?-->/g, '');
    const motif = /https?:\/\/|\/\/cdn\b|@import\s+url\(/i.exec(sansCommentaires);
    if (motif) ajoute('bloquant', 'D-10', `ressource externe détectée (« ${motif[0]} ») — livrable HTML autonome exigé`, rel);
  }

  // D-02 / D-03 / D-04 / D-06 — nommage daté
  if (!DATE_NUE.test(nom)) continue;
  const parts = nom.split(' - ');
  const queue = parts[parts.length - 1];

  if (parts.length < 3 || !(QUEUE_CONFORME.test(queue) || QUEUE_SANS_INDICE.test(queue))) {
    ajoute('bloquant', 'D-03', 'nom daté hors gabarit « <Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext> »', rel);
    continue;
  }
  const conforme = QUEUE_CONFORME.exec(queue);
  if (!conforme) {
    const date = QUEUE_SANS_INDICE.exec(queue)[1];
    ajoute('bloquant', 'D-02', `date « ${date} » sans indice alphabétique (« ${date}a » attendu)`, rel);
    continue;
  }
  const [, date, indice] = conforme;
  const projet = parts[0];
  const objet = parts.slice(1, -1).join(' - ');
  const type = objet.split(/\s+/)[0].replace(/[.,;:]$/, '');

  if (registre) {
    const estEmetteur = PREFIXES_EMETTEUR.some((p) => pli(projet) === pli(p));
    if (estEmetteur && date >= SEUIL_Q3BIS) {
      ajoute('bloquant', 'D-03', `préfixe émetteur « ${projet} » — depuis le ${SEUIL_Q3BIS}, le nom du PROJET prime (Q3-bis)`, rel);
    }
    if (!TYPES.has(pli(type))) {
      ajoute('bloquant', 'D-04', `type « ${type} » absent du registre`, rel);
    }
    if (racineDossier === 'output' && DOCTRINAUX.has(pli(type))) {
      ajoute('bloquant', 'D-06', `document doctrinal de type « ${type} » rangé dans output/`, rel);
    }
  }

  // D-02 — version antérieure du même livrable encore en place à côté (hors Old/)
  const dossierAbs = path.join(RACINE, dossier);
  if (fs.existsSync(dossierAbs)) {
    const cleObjet = pli(`${projet} - ${objet}`);
    for (const voisin of fs.readdirSync(dossierAbs)) {
      if (voisin === nom || !DATE_NUE.test(voisin)) continue;
      const vParts = voisin.split(' - ');
      const vQueue = vParts[vParts.length - 1];
      const vConforme = QUEUE_CONFORME.exec(vQueue);
      if (!vConforme || vParts.length < 3) continue;
      const vObjet = vParts.slice(1, -1).join(' - ');
      if (pli(`${vParts[0]} - ${vObjet}`) !== cleObjet) continue;
      const [, vDate, vIndice] = vConforme;
      if (`${vDate}${vIndice}` < `${date}${indice}`) {
        ajoute('bloquant', 'D-02', `version antérieure « ${voisin} » encore en place à côté de « ${nom} » — à déplacer dans Old/`, path.posix.join(dossier, voisin));
      }
    }
  }
}

const bloquants = findings.filter((f) => f.sev === 'bloquant').length;
sortir(bloquants ? 'FAIL' : 'PASS', bloquants ? 1 : 0);
