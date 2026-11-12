#!/usr/bin/env node
// self-test — prouve qu'oracle-conventions.mjs peut échouer, et pour la bonne raison.
//
// Une règle sans fixture rouge n'est pas un contrôle, c'est une déclaration d'intention.
// Chaque fixture rouge exige l'ENSEMBLE EXACT des règles attendues : ni moins — le contrôle
// serait aveugle —, ni plus — il serait bruyant, et un jour on cesserait de le lire.
//
// Usage : node oracles/self-test.mjs   ·   exit 0 si tout tient, 1 sinon.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jugerFraicheurA0, versionDuManifeste } from './fraicheur-a0.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const ORACLE = path.join(ICI, 'oracle-conventions.mjs');
const FIX = path.join(ICI, 'fixtures');

// fixture → { code attendu, règles bloquantes attendues (ensemble exact) }
const CAS = [
  ['verte', { code: 0, bloquants: [] }],
  ['rouge-d02-sans-indice', { code: 1, bloquants: ['D-02'] }],
  ['rouge-d02-version-non-archivee', { code: 1, bloquants: ['D-02'] }],
  ['rouge-d03-hors-gabarit', { code: 1, bloquants: ['D-03'] }],
  ['rouge-d03-prefixe-emetteur', { code: 1, bloquants: ['D-03'] }],
  ['rouge-d04-type-inconnu', { code: 1, bloquants: ['D-04'] }],
  ['rouge-d06-doctrine-en-sortie', { code: 1, bloquants: ['D-06'] }],
  // TF-0109 — les 3 des 8 décisions orphelines qui se sont révélées mécanisables.
  ['rouge-d05-claude-md-absent', { code: 1, bloquants: ['D-05'] }],
  ['rouge-d09-marqueurs-manquants', { code: 1, bloquants: ['D-09'] }],
  ['rouge-d10-reseau-externe', { code: 1, bloquants: ['D-10'] }],
  // TF-0377 / D-18 — deux sens, et le second n'est PAS bloquant : sans la vérification des
  // avertissements ajoutée plus bas, « rouge-d18-nom-muet » serait indistinguable de la
  // fixture verte, et le sens faible du contrôle pourrait disparaître sans que rien ne bouge.
  ['rouge-d18-version-divergente', { code: 1, bloquants: ['D-18'], avertissements: [] }],
  ['rouge-d18-nom-muet', { code: 0, bloquants: [], avertissements: ['D-18'] }],
  // TF-2427 — deux sens pour l'instruction des 13 types du produit marketing : les types admis
  // (Support en alias de Présentation ; Programme, Évaluation, Émargement, Questionnaire neufs)
  // passent, et un type propre à un produit (Animation, Pitch) reste refusé par le registre.
  ['verte-types-instruits', { code: 0, bloquants: [] }],
  ['rouge-d04-type-reste-au-produit', { code: 1, bloquants: ['D-04'] }],
];

// TF-0109 — les 5 décisions non mécanisables doivent être déclarées SANS_OBJET avec leur
// raison sur CHAQUE run, jamais tues. Un compte qui bouge est un oubli en train de naître.
const REGLES_SANS_OBJET_ATTENDUES = ['D-01', 'D-07', 'D-08', 'D-11', 'D-12'];

let echecs = 0;
let echecsCas = 0; // TF-1336 — décompte propre aux fixtures CAS, distinct de la fraîcheur A0
for (const [nom, attendu] of CAS) {
  const r = spawnSync(process.execPath, [ORACLE, path.join(FIX, nom), '--json'], { encoding: 'utf8' });
  const ecarts = [];

  if (r.status !== attendu.code) ecarts.push(`code de sortie ${r.status}, attendu ${attendu.code}`);

  let rapport = null;
  try {
    rapport = JSON.parse(r.stdout);
  } catch {
    ecarts.push('sortie JSON illisible');
  }

  if (rapport) {
    const obtenus = [...new Set(rapport.findings.filter((f) => f.sev === 'bloquant').map((f) => f.regle))].sort();
    const veut = [...attendu.bloquants].sort();
    if (obtenus.join(',') !== veut.join(',')) {
      ecarts.push(`règles bloquantes [${obtenus.join(', ') || '—'}], attendu [${veut.join(', ') || '—'}]`);
    }
    // Les avertissements ne sont vérifiés que là où la fixture en DÉCLARE l'attente : les
    // fixtures antérieures à D-18 ne s'en occupent pas, et les leur imposer ferait échouer
    // des cas justes. Là où l'attente est déclarée, l'ensemble est EXACT — ni moins, ni plus.
    if (attendu.avertissements) {
      const av = [...new Set(rapport.findings.filter((f) => f.sev === 'avertissement').map((f) => f.regle))].sort();
      const veutAv = [...attendu.avertissements].sort();
      if (av.join(',') !== veutAv.join(',')) {
        ecarts.push(`avertissements [${av.join(', ') || '—'}], attendu [${veutAv.join(', ') || '—'}]`);
      }
    }
    if (!rapport.non_juge.length) ecarts.push('non_juge[] vide — un oracle qui ne déclare pas ses angles morts en cache');

    const regles_sans_objet = (rapport.sans_objet || []).map((s) => s.regle).sort();
    if (regles_sans_objet.join(',') !== [...REGLES_SANS_OBJET_ATTENDUES].sort().join(',')) {
      ecarts.push(`sans_objet[] = [${regles_sans_objet.join(', ') || '—'}], attendu [${REGLES_SANS_OBJET_ATTENDUES.join(', ')}] — une décision sans oracle ne doit ni disparaître ni se dupliquer`);
    }
    if ((rapport.sans_objet || []).some((s) => !s.raison || !s.raison.trim())) {
      ecarts.push('sans_objet[] contient une entrée sans raison — un SANS_OBJET sans raison est un oubli déguisé');
    }
  }

  if (ecarts.length) {
    echecs += 1;
    echecsCas += 1;
    process.stdout.write(`  ECHEC  ${nom}\n${ecarts.map((e) => `         ${e}`).join('\n')}\n`);
  } else {
    process.stdout.write(`  ok     ${nom}\n`);
  }
}

// --- TF-0076 / TF-1336 : fraîcheur du gabarit A0 — la version de socle DÉCLARÉE est comparée à
// la version INSTALLÉE. La dérive du 09/08 (4 itérations perdues) venait de l'absence de ce
// rapprochement : le gabarit déclarait un alignement que rien ne vérifiait.
//
// TF-1336 (26/09) — DEUX défauts trouvés sur ce bloc lui-même, corrigés ici :
//   1) l'extraction lisait le PREMIER « digit-ai-page-html <version> » rencontré n'importe où
//      dans la prose — y compris dans un bullet d'historique purement narratif (« réalignement
//      sur le socle … 1.6.0 », vrai le jour où il a été écrit, faux comme déclaration vivante
//      une fois le socle reparti). Même prudence que D-18 d'oracle-conventions.mjs, dont la
//      première écriture a produit des faux positifs par proximité : la version comptée est
//      désormais celle d'une ligne qui SE DÉSIGNE elle-même (« Socle aligné » en tête de
//      document), jamais une mention trouvée par proximité dans un paragraphe narratif.
//   2) ce rouge de fraîcheur était compté dans le MÊME total que les 12 fixtures CAS
//      (« 11/12 fixtures conformes (+ contrôle fraîcheur A0) », constat du 23/09) — deux
//      verdicts mélangés en un seul chiffre. Il a désormais son verdict PROPRE, nommé, dans le
//      résumé final ; `echecsCas` (fixtures) et `echecFraicheur` (ci-dessous) ne se mélangent
//      plus — seul `echecs`, qui gouverne le code de sortie, agrège toujours les deux.
let echecFraicheur = false;
let messageFraicheur = '';
const casFraicheur = [];
{
  const racine = path.join(ICI, '..');
  const a0s = fs.readdirSync(racine).filter((f) => /Gabarit A0 .* - \d{8}[a-z]\.md$/.test(f)).sort();
  // TF-2396 — la version attendue n'est plus écrite dans le gabarit : elle est LUE au manifeste
  // versions-livrees.json de forge-agents (voir oracles/fraicheur-a0.mjs). Le manifeste se cherche
  // chez FORGE_ROOT, puis chez le parent du dépôt, puis chez le parent du dépôt principal quand ce
  // dépôt est un arbre de travail annexe (git worktree).
  const racinesPossibles = [];
  if (process.env.FORGE_ROOT) racinesPossibles.push(process.env.FORGE_ROOT);
  racinesPossibles.push(path.join(racine, '..'));
  const commun = spawnSync('git', ['-C', racine, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' });
  if (commun.status === 0 && commun.stdout.trim()) racinesPossibles.push(path.join(commun.stdout.trim(), '..', '..'));
  const cheminManifeste = racinesPossibles
    .map((r) => path.join(r, 'digit-ai-forge-agents', 'versions-livrees.json'))
    .find((c) => fs.existsSync(c));
  let versionManifeste = null;
  if (cheminManifeste) {
    try { versionManifeste = versionDuManifeste(JSON.parse(fs.readFileSync(cheminManifeste, 'utf8').replace(/^\uFEFF/, ''))); } catch { /* manifeste illisible : non jugeable, dit ci-dessous */ }
  }
  let verdict;
  if (!a0s.length) {
    verdict = { verdict: 'echec', message: 'aucun gabarit A0 trouvé à la racine' };
  } else if (!cheminManifeste) {
    verdict = { verdict: 'non_jugeable', message: 'manifeste versions-livrees.json de forge-agents introuvable sur ce poste — non jugeable' };
  } else {
    verdict = jugerFraicheurA0(fs.readFileSync(path.join(racine, a0s[a0s.length - 1]), 'utf8'), versionManifeste);
    if (verdict.verdict === 'echec') verdict.message = `${a0s[a0s.length - 1]} : ${verdict.message}`;
  }
  if (verdict.verdict === 'echec') {
    echecs += 1;
    echecFraicheur = true;
  }
  messageFraicheur = verdict.message;
  process.stdout.write(`  ${echecFraicheur ? 'ECHEC ' : 'ok    '} fraicheur-a0 : ${messageFraicheur}\n`);

  // TF-2396 — fixtures à double sens du contrôle lui-même, jouées sur des gabarits et des manifestes
  // posés ici : le sens vert (une montée du socle ne rougit pas une déclaration dérivée) et les sens
  // rouges (un numéro écrit à la main et périmé, une ligne absente, une ligne vide).
  const derive = '**Socle aligné** : `digit-ai-page-html`, version lue au manifeste `versions-livrees.json`.\n';
  const litteral = (v) => `**Socle aligné** : \`digit-ai-page-html\` ${v} — écrit à la main.\n`;
  const cas = (nom, texte, attendue, verdictVoulu) => {
    const v = jugerFraicheurA0(texte, attendue).verdict;
    casFraicheur.push([`${nom} (obtenu ${v}, attendu ${verdictVoulu})`, v === verdictVoulu]);
  };
  cas('fraicheur-verte-derivee (déclaration dérivée, manifeste 1.45.1)', derive, '1.45.1', 'ok');
  cas('fraicheur-verte-montee-du-socle (même gabarit, manifeste monté à 1.99.0 : ne rougit pas)', derive, '1.99.0', 'ok');
  cas('fraicheur-verte-litterale-a-jour (numéro écrit = manifeste)', litteral('1.45.1'), '1.45.1', 'ok');
  cas('fraicheur-rouge-litterale-perimee (numéro écrit 1.30.0, manifeste 1.45.1)', litteral('1.30.0'), '1.45.1', 'echec');
  cas('fraicheur-rouge-sans-ligne (aucune ligne « Socle aligné »)', '# Gabarit\n\nUne mention digit-ai-page-html 1.45.1 dans la prose ne vaut pas déclaration.\n', '1.45.1', 'echec');
  cas('fraicheur-rouge-ligne-vide (ni numéro, ni manifeste désigné)', '**Socle aligné** : le dernier.\n', '1.45.1', 'echec');
  cas('fraicheur-non-jugeable (manifeste sans version : jamais un vert muet)', derive, null, 'non_jugeable');
  const versions = [
    versionDuManifeste({ skills: { 'digit-ai-page-html': { version: '1.45.1' } } }) === '1.45.1',
    versionDuManifeste({ skills: { 'digit-ai-page-html': { version: null } } }) === null,
    versionDuManifeste({}) === null,
  ];
  casFraicheur.push([`manifeste-lecture (version lue, null et absence rendues null — ${versions.filter(Boolean).length}/3)`, versions.every(Boolean)]);
}
for (const [nom, tenu] of casFraicheur) {
  if (!tenu) echecs += 1;
  process.stdout.write(`  ${tenu ? 'ok    ' : 'ECHEC '} ${nom}\n`);
}
const fraicheurTenue = casFraicheur.filter(([, tenu]) => tenu).length;

// --- TF-1319 : la découverte des oracles LIT LE DISQUE, dans les deux sens. Le juge du pilot
// (méta-oracle d'enclenchement) confronte ce que cette forge DÉCOUVRE aux verdicts consignés au
// ledger d'un run. Une découverte qui raterait l'oracle livré avec son composant sous `output/` le
// rendrait invisible au juge ; une découverte qui prendrait une recette, une fixture ou un vieux
// gabarit sous `Old/` pour un oracle ferait accuser un run de n'avoir pas joué ce qui n'en est pas un.
const casDecouverte = [];
{
  const DECOUVRIR = path.join(ICI, 'decouvrir-oracles.mjs');
  const decouvre = (racine) => {
    const r = spawnSync(process.execPath, [DECOUVRIR, ...(racine ? ['--racine', racine] : [])], { encoding: 'utf8' });
    let j = null;
    try { j = JSON.parse(r.stdout); } catch { /* sortie illisible : les contrôles ci-dessous la disent */ }
    return { code: r.status, j };
  };
  const cas = (nom, tenu) => casDecouverte.push([nom, tenu]);
  const reel = decouvre(null);
  const cheminsReels = (reel.j?.oracles || []).map((o) => o.chemin);
  cas(`decouverte-reelle (${cheminsReels.length} oracles, contrat digit-ai/decouverte-oracles@1, composant sous output/ compris)`,
    reel.code === 0 && reel.j?.contrat === 'digit-ai/decouverte-oracles@1' && reel.j?.forge === 'digit-ai-forge-organization'
    && cheminsReels.includes('oracles/oracle-conventions.mjs')
    && cheminsReels.some((c) => /^output\/02-composants\/[^/]+\/oracle-filtres-tableau\.mjs$/.test(c))
    && cheminsReels.every((c) => fs.existsSync(path.join(ICI, '..', c))));
  const tmpDec = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-organization-decouverte-'));
  try {
    const poser = (rel) => {
      const p = path.join(tmpDec, rel);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, '// fixture de découverte\n');
    };
    ['oracles/oracle-alpha.mjs', 'output/02-composants/composant-x/oracle-beta.mjs'].forEach(poser);
    const leurres = ['oracles/oracle-alpha.test.mjs', 'oracles/self-test.mjs', 'oracles/fixtures/verte/oracle-faux.mjs',
      'Old/oracle-vieux.mjs', 'node_modules/paquet/oracle-dep.mjs', 'input/oracle-entrant.mjs'];
    leurres.forEach(poser);
    const v = decouvre(tmpDec);
    const noms = (v.j?.oracles || []).map((o) => o.nom).sort();
    cas(`decouverte-verte (un oracle posé est découvert, output/ compris — obtenu ${JSON.stringify(noms)})`,
      v.code === 0 && JSON.stringify(noms) === JSON.stringify(['oracle-alpha', 'oracle-beta']));
    cas(`decouverte-rouge (${leurres.length} leurres — recette, fixture, archive Old/, dépendance, entrant — JAMAIS pris pour des oracles)`,
      v.code === 0 && !(v.j?.oracles || []).some((o) => leurres.includes(o.chemin)));
    poser('oracles/oracle-gamma.mjs');
    const apres = decouvre(tmpDec);
    cas('decouverte-ajout (un oracle AJOUTÉ est vu au passage suivant, sans liste à tenir)',
      (apres.j?.oracles || []).some((o) => o.nom === 'oracle-gamma' && o.chemin === 'oracles/oracle-gamma.mjs'));
  } finally {
    fs.rmSync(tmpDec, { recursive: true, force: true });
  }
  const absente = decouvre(path.join(os.tmpdir(), 'forge-organization-racine-qui-n-existe-pas'));
  cas(`decouverte-racine-absente (rouge : exit 2 avec motif, jamais une liste vide muette — obtenu exit ${absente.code})`,
    absente.code === 2 && absente.j?.oracles?.length === 0 && /introuvable/.test(absente.j?.motif || ''));
}
for (const [nom, tenu] of casDecouverte) {
  if (!tenu) echecs += 1;
  process.stdout.write(`  ${tenu ? 'ok    ' : 'ECHEC '} ${nom}\n`);
}
const decouvertesTenues = casDecouverte.filter(([, tenu]) => tenu).length;

// TF-1336 — trois verdicts NOMMÉS et INDÉPENDANTS, jamais mélangés dans un seul chiffre : le
// compte de fixtures CAS ne bouge plus quand seule la fraîcheur A0 est rouge (le défaut exact
// du 23/09 : « 11/12 fixtures conformes (+ contrôle fraîcheur A0) », un rouge de fraîcheur lu
// comme une fixture ratée). Le code de sortie, lui, reste la somme des trois : un seul verdict
// rouge suffit à faire échouer tout le self-test.
process.stdout.write(`\n${CAS.length - echecsCas}/${CAS.length} fixtures conformes.\n`);
process.stdout.write(`fraîcheur A0 : ${echecFraicheur ? 'ECHEC' : 'ok'} (${messageFraicheur}).\n`);
process.stdout.write(`cas de fraîcheur A0 TF-2396 : ${fraicheurTenue}/${casFraicheur.length}.
`);
process.stdout.write(`découverte des oracles TF-1319 : ${decouvertesTenues}/${casDecouverte.length}.\n`);
process.exit(echecs ? 1 : 0);
