#!/usr/bin/env node
// oracle-conventions — Phase 3 du chantier forge-organization.
//
// Vérifie mécaniquement, sur le stock d'un dépôt, les décisions mécanisables :
//   D-02  date ET indice alphabétique obligatoires ; une version antérieure vit dans Old/
//   D-03  <Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext>, le projet en tête (Q3-bis)
//   D-04  le <Type> appartient au registre (registre-types.json)
//   D-05  CLAUDE.md est le point d'entrée — présent à la racine d'un dépôt (.git détecté)
//   D-06  la doctrine vit à la racine, output/ ne porte que ce qui sort
//   D-09  socle HTML minimal des livrables d'output/ : lang="fr", <meta viewport>, un seul
//         <h1>, police Syne interdite (le reste du socle — contrastes, tokens :root — reste
//         du ressort de digit-ai-page-html/check_html.py, non dupliqué ici)
//   D-10  autonomie réseau des livrables HTML d'output/ : aucune ressource externe
//         (http(s)://, //cdn, @import url()) — la décision elle-même qualifie ce contrôle
//         d'« exécutable, pas déclaratif »
//
// TF-0109 (12/08) : les 8 décisions qui n'avaient AUCUN oracle (D-01, D-05, D-07→D-12) sont
// désormais toutes traitées explicitement — soit mécanisées ci-dessus (D-05, D-09, D-10),
// soit déclarées SANS_OBJET avec leur raison dans sans_objet[] (D-01, D-07, D-08, D-11, D-12).
// Une décision absente des deux listes serait un oubli silencieux ; ce n'est plus permis.
//
// Ce que l'oracle NE juge pas dans son périmètre mécanisé est déclaré dans non_juge[] : il ne
// devine pas si un fichier non daté est un livrable ou un fichier de travail — cela suppose
// de lire.
//
// Contrat : JSON {oracle,domaine,artefact,verdict,findings[],non_juge[],sans_objet[]} ·
// exit 0 PASS, 1 FAIL, 2 SKIP.
//
// Usage : node oracles/oracle-conventions.mjs <racine> [--json] [--registre <chemin>]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const DOM = 'Conventions d\'organisation (D-02 / D-03 / D-04 / D-05 / D-06 / D-09 / D-10)';

const NON_JUGE = [
  'les fichiers non datés — distinguer un livrable d\'un fichier de travail suppose de lire (D-02 ne s\'impose qu\'aux fichiers datés)',
  'le contenu de Old/ — archive gelée par D-02, jamais renommée',
  'le contenu des dossiers fixtures/ — ils portent des violations volontaires',
  'input/ : qu\'un entrant ait bien été fourni par l\'humain (D-06) ne se lit pas dans un nom',
  'le code, jamais daté (A6) — hors périmètre du nommage des livrables',
  'la pertinence du <Type> choisi : le registre dit qu\'il existe, pas qu\'il est le bon',
  'D-05, le complément référencé depuis CLAUDE.md : seule la présence du fichier est vérifiée, pas le contenu du renvoi',
  'D-09, le socle complet (contrastes WCAG, tokens :root, responsive) : délégué à digit-ai-page-html (check_html.py / render_page.py), non dupliqué ici',
];

// TF-0109 — les 8 décisions qui n'avaient aucun oracle avant ce jour. Celles qui ne sont pas
// mécanisables par balayage de fichiers sont déclarées ici, avec leur raison : un « oubli »
// silencieux n'est plus permis, une impossibilité documentée si.
const SANS_OBJET = [
  { regle: 'D-01', raison: 'output/ réservé aux livrables vs dist/ = artefact de build : distinguer les deux suppose de lire le CONTENU du dossier, pas son chemin — non mécanisable depuis un balayage de noms.' },
  { regle: 'D-07', raison: 'artefacts de traçabilité (ledger.jsonl, sidecars, versions-livrees.json, registre-dette.json) déclarés « patron optionnel » : la décision consacre une liberté, pas une obligation — rien n\'est défini à faire échouer.' },
  { regle: 'D-08', raison: 'décision de cadrage (Q1 : les trois axes HTML sont cumulatifs, pas alternatifs) : elle organise D-09/D-10/D-11, elle n\'introduit aucune règle propre à vérifier.' },
  { regle: 'D-11', raison: 'HTML généré vs saisi à la main : le générateur d\'origine n\'est pas visible dans le fichier produit lui-même — non mécanisable sans métadonnée de provenance absente de la décision.' },
  { regle: 'D-12', raison: 'composant partagé non installé, inliné avec provenance : suppose de connaître le catalogue des composants partagés et leur statut d\'installation dans d\'AUTRES dépôts — hors du balayage d\'un seul dépôt.' },
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
    sans_objet: SANS_OBJET,
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
    process.stdout.write(`\nSANS_OBJET (${SANS_OBJET.length} décision(s) non mécanisable(s), déclarées plutôt qu'ignorées) :\n`);
    for (const s of SANS_OBJET) process.stdout.write(`  · [${s.regle}] ${s.raison}\n`);
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

const RACINE = path.resolve(racineArg);
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
})(RACINE, '');

// — D-05 — CLAUDE.md est le point d'entrée ————————————————————————————————————
// Ne se juge qu'à la racine d'un DÉPÔT : appliqué à un sous-dossier arbitraire (une fixture,
// par exemple), la question n'a pas de sens — d'où l'absence de marqueur dans les fixtures qui
// ne testent pas D-05. Marqueur réel = `.git` (créé par git lui-même, jamais par un commit).
// Marqueur de simulation = `.depot-fixture`, réservé aux fixtures de cet oracle : git refuse
// structurellement de suivre tout chemin dont un segment s'appelle exactement `.git` (fichier
// ou dossier — protection anti-corruption native, constatée ici en committant une fixture qui
// tentait de le faire), donc une fixture ne peut pas committer de vrai `.git` pour se tester.
if (fs.existsSync(path.join(RACINE, '.git')) || fs.existsSync(path.join(RACINE, '.depot-fixture'))) {
  if (!fs.existsSync(path.join(RACINE, 'CLAUDE.md'))) {
    ajoute('bloquant', 'D-05',
      'CLAUDE.md absent à la racine du dépôt — il est le point d\'entrée des instructions projet (D-05) ; les compléments (ex. REGLES-PROJET.md) doivent y être référencés, pas orphelins',
      '.');
  }
}

// — D-09 / D-10 — livrables HTML d'output/ : socle minimal + autonomie réseau ————————
// Portée volontairement étroite : D-09 délègue le gros du socle (contrastes, tokens :root,
// responsive) à digit-ai-page-html/check_html.py — ici, seuls 4 marqueurs simples et non
// ambigus, bon marché à vérifier en même temps que D-10 sur le même balayage de fichier.
const HTML_OUTPUT = fichiers.filter((f) => f.dossier.split('/')[0] === 'output' && /\.html?$/i.test(f.nom));
for (const f of HTML_OUTPUT) {
  const abs = path.join(RACINE, f.rel);
  let contenu;
  try {
    contenu = fs.readFileSync(abs, 'utf8');
  } catch (e) {
    ajoute('info', 'D-09', `illisible : ${e.message}`, f.rel);
    continue;
  }

  // D-09 — marqueurs simples du socle
  if (!/<html[^>]*\blang\s*=\s*["']fr["']/i.test(contenu)) {
    ajoute('bloquant', 'D-09', 'balise <html> sans lang="fr" — socle digit-ai-page-html obligatoire pour tout livrable HTML sortant', f.rel);
  }
  if (!/<meta[^>]*\bname\s*=\s*["']viewport["']/i.test(contenu)) {
    ajoute('bloquant', 'D-09', '<meta name="viewport"> absente — socle digit-ai-page-html obligatoire', f.rel);
  }
  const nbH1 = (contenu.match(/<h1[\s>]/gi) || []).length;
  if (nbH1 !== 1) {
    ajoute('bloquant', 'D-09', `${nbH1} <h1> trouvé(s), un seul est attendu — socle digit-ai-page-html obligatoire`, f.rel);
  }
  if (/syne/i.test(contenu)) {
    ajoute('bloquant', 'D-09', 'police « Syne » référencée — explicitement interdite par D-09', f.rel);
  }

  // D-10 — autonomie réseau totale (hors attributs documentaires : commentaires HTML retirés
  // avant balayage). La décision elle-même qualifie ce contrôle d'« exécutable, pas déclaratif ».
  const sansCommentaires = contenu.replace(/<!--[\s\S]*?-->/g, '');
  const motif = /https?:\/\/|\/\/cdn\b|@import\s+url\(/i.exec(sansCommentaires);
  if (motif) {
    ajoute('bloquant', 'D-10', `ressource externe détectée (« ${motif[0]} ») — un livrable HTML sortant est entièrement autonome (D-10), zéro requête réseau`, f.rel);
  }
}

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
