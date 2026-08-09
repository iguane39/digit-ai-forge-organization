#!/usr/bin/env node
// oracle-conventions — Phase 3 du chantier forge-organization.
//
// Vérifie mécaniquement, sur le stock d'un dépôt, les quatre décisions mécanisables :
//   D-02  date ET indice alphabétique obligatoires ; une version antérieure vit dans Old/
//   D-03  <Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext>, le projet en tête (Q3-bis)
//   D-04  le <Type> appartient au registre (registre-types.json)
//   D-06  la doctrine vit à la racine, output/ ne porte que ce qui sort
//
// Ce que l'oracle NE juge pas est déclaré dans non_juge[] : il ne devine pas si un fichier
// non daté est un livrable ou un fichier de travail — cela suppose de lire.
//
// Contrat : JSON {oracle,domaine,artefact,verdict,findings[],non_juge[]} · exit 0 PASS,
// 1 FAIL, 2 SKIP.
//
// Usage : node oracles/oracle-conventions.mjs <racine> [--json] [--registre <chemin>]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const DOM = 'Conventions d\'organisation (D-02 / D-03 / D-04 / D-06)';

const NON_JUGE = [
  'les fichiers non datés — distinguer un livrable d\'un fichier de travail suppose de lire (D-02 ne s\'impose qu\'aux fichiers datés)',
  'le contenu de Old/ — archive gelée par D-02, jamais renommée',
  'le contenu des dossiers fixtures/ — ils portent des violations volontaires',
  'input/ : qu\'un entrant ait bien été fourni par l\'humain (D-06) ne se lit pas dans un nom',
  'le code, jamais daté (A6) — hors périmètre du nommage des livrables',
  'la pertinence du <Type> choisi : le registre dit qu\'il existe, pas qu\'il est le bon',
];

const args = process.argv.slice(2);
const json = args.includes('--json');
const racineArg = args.find((a) => !a.startsWith('--'));
const iReg = args.indexOf('--registre');
const registrePath = iReg >= 0 ? args[iReg + 1] : path.join(ICI, '..', 'registre-types.json');

const findings = [];
const ajoute = (sev, regle, msg, where) => findings.push({ sev, regle, msg, where });

function sortir(verdict, code) {
  const rapport = {
    oracle: 'oracle-conventions',
    domaine: DOM,
    artefact: racineArg ? path.resolve(racineArg) : null,
    verdict,
    findings,
    non_juge: NON_JUGE,
  };
  if (json) {
    process.stdout.write(JSON.stringify(rapport, null, 2));
  } else {
    const icone = { bloquant: '❌', avertissement: '⚠️ ', info: 'ℹ️ ' };
    process.stdout.write(`\n${DOM}\nRacine : ${rapport.artefact}\n\n`);
    if (!findings.length) process.stdout.write('  aucun écart\n');
    for (const f of findings) {
      process.stdout.write(`  ${icone[f.sev] || '  '} [${f.regle}] ${f.msg}\n      ${f.where}\n`);
    }
    const b = findings.filter((f) => f.sev === 'bloquant').length;
    const a = findings.filter((f) => f.sev === 'avertissement').length;
    process.stdout.write(`\n${verdict} — ${b} bloquant(s), ${a} avertissement(s).\n`);
  }
  process.exit(code);
}

// — Chargement de la doctrine ————————————————————————————————————————————————
if (!racineArg || !fs.existsSync(racineArg)) {
  ajoute('info', 'usage', 'racine absente ou non fournie', String(racineArg));
  sortir('SKIP', 2);
}
let registre;
try {
  registre = JSON.parse(fs.readFileSync(registrePath, 'utf8'));
} catch (e) {
  ajoute('info', 'D-04', `registre des types illisible : ${e.message}`, registrePath);
  sortir('SKIP', 2);
}

const conv = registre.conventions || {};
const PREFIXES_EMETTEUR = conv.prefixes_emetteur || [];
const SEUIL_Q3BIS = conv.seuil_q3bis || '99999999';
const TYPES_DOCTRINAUX = conv.types_doctrinaux || [];

// Comparaison des types : insensible à la casse et aux accents, alias compris.
const DIACRITIQUES = /[\u0300-\u036f]/g;
const pli = (s) => s.normalize('NFD').replace(DIACRITIQUES, '').toLowerCase();
const TYPES = new Map();
for (const t of registre.types || []) {
  TYPES.set(pli(t.type), t.type);
  for (const a of t.alias || []) TYPES.set(pli(a), t.type);
}
const DOCTRINAUX = new Set(TYPES_DOCTRINAUX.map(pli));

// — Balayage ————————————————————————————————————————————————————————————————
const IGNORE_DIR = new Set(['.git', 'node_modules', '__pycache__', '.venv', 'Old', 'old', 'fixtures']);
const EST_SIDECAR = (n) => /\.oracles\.json$|\.oracles-cache\.json$|\.oracles-historique\.jsonl$/.test(n);

const fichiers = [];
(function balaye(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (IGNORE_DIR.has(e.name)) continue;
      balaye(path.join(dir, e.name), rel ? `${rel}/${e.name}` : e.name);
    } else if (e.isFile() && !EST_SIDECAR(e.name)) {
      fichiers.push({ nom: e.name, rel: rel ? `${rel}/${e.name}` : e.name, dossier: rel || '.' });
    }
  }
})(path.resolve(racineArg), '');

// Un fichier est « daté » dès qu'il porte une date AAAAMMJJ du siècle courant.
const DATE_NUE = /(?:^|[^0-9])(20\d{6})(?![0-9])/;
const QUEUE_CONFORME = /^(\d{8})([a-z])(?: .*)?\.[A-Za-z0-9]+$/;
const QUEUE_SANS_INDICE = /^(\d{8})(?: .*)?\.[A-Za-z0-9]+$/;

const versions = new Map(); // clé « dossier :: projet - objet » → [{nom, date, indice}]

for (const f of fichiers) {
  if (!DATE_NUE.test(f.nom)) continue;

  const parts = f.nom.split(' - ');
  const queue = parts[parts.length - 1];

  // D-03 — structure du nom
  if (parts.length < 3 || !(QUEUE_CONFORME.test(queue) || QUEUE_SANS_INDICE.test(queue))) {
    const pistes = [];
    if (/_/.test(f.nom)) pistes.push('underscore au lieu de «  -  »');
    if (!/ - /.test(f.nom)) pistes.push('séparateur «  -  » absent');
    if (parts.length === 2) pistes.push('segment <Projet> ou <Sujet> manquant');
    ajoute('bloquant', 'D-03',
      'nom daté hors gabarit « <Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext> »'
        + (pistes.length ? ` : ${pistes.join(' ; ')}` : ''),
      f.rel);
    continue;
  }

  // D-02 — indice obligatoire, y compris pour le premier fichier du jour
  const conforme = QUEUE_CONFORME.exec(queue);
  if (!conforme) {
    const date = QUEUE_SANS_INDICE.exec(queue)[1];
    ajoute('bloquant', 'D-02',
      `date « ${date} » sans indice alphabétique — l'indice est obligatoire dès le premier fichier du jour (« ${date}a »)`,
      f.rel);
    continue;
  }
  const [, date, indice] = conforme;

  const projet = parts[0];
  const objet = parts.slice(1, -1).join(' - ');
  const type = objet.split(/\s+/)[0].replace(/[.,;:]$/, '');

  // D-03 — Q3-bis : le nom du projet prime sur l'émetteur
  const estEmetteur = PREFIXES_EMETTEUR.some((p) => pli(projet) === pli(p));
  if (estEmetteur) {
    if (date >= SEUIL_Q3BIS) {
      ajoute('bloquant', 'D-03',
        `préfixe émetteur « ${projet} » en tête d'un livrable du ${date} — depuis le ${SEUIL_Q3BIS}, le nom du PROJET prime (Q3-bis)`,
        f.rel);
    } else {
      ajoute('avertissement', 'D-03',
        `préfixe émetteur « ${projet} » — héritage antérieur au ${SEUIL_Q3BIS} : conservé tel quel, les fichiers historiques ne sont pas renommés (Q3)`,
        f.rel);
    }
  }

  // D-04 — le type appartient au registre
  if (!TYPES.has(pli(type))) {
    ajoute('bloquant', 'D-04',
      `type « ${type} » absent du registre — l'ajouter à registre-types.json avec son objet et son premier exemplaire, ou corriger le nom`,
      f.rel);
  }

  // D-06 — la doctrine n'est pas une sortie
  const racineOutput = f.dossier.split('/')[0];
  if (racineOutput === 'output' && DOCTRINAUX.has(pli(type))) {
    ajoute('bloquant', 'D-06',
      `document doctrinal de type « ${type} » rangé dans output/ — la doctrine vit à la racine, avec le Old/ qui archive ses versions`,
      f.rel);
  }

  // D-02 — une seule version courante hors Old/
  const cle = `${f.dossier} :: ${pli(projet)} - ${pli(objet)}`;
  if (!versions.has(cle)) versions.set(cle, []);
  versions.get(cle).push({ rel: f.rel, date, indice });
}

for (const [cle, liste] of versions) {
  if (liste.length < 2) continue;
  const triees = [...liste].sort((a, b) => (a.date + a.indice).localeCompare(b.date + b.indice));
  const courante = triees[triees.length - 1];
  for (const v of triees.slice(0, -1)) {
    ajoute('bloquant', 'D-02',
      `version antérieure encore en place à côté de « ${path.basename(courante.rel)} » — une version remplacée migre dans Old/, elle n'est ni supprimée ni laissée sur place`,
      v.rel);
  }
  void cle;
}

const bloquants = findings.filter((f) => f.sev === 'bloquant').length;
if (!fichiers.length) {
  ajoute('info', 'usage', 'aucun fichier balayé', String(racineArg));
  sortir('SKIP', 2);
}
sortir(bloquants ? 'FAIL' : 'PASS', bloquants ? 1 : 0);
