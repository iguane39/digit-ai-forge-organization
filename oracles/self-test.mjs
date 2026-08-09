#!/usr/bin/env node
// self-test — prouve qu'oracle-conventions.mjs peut échouer, et pour la bonne raison.
//
// Une règle sans fixture rouge n'est pas un contrôle, c'est une déclaration d'intention.
// Chaque fixture rouge exige l'ENSEMBLE EXACT des règles attendues : ni moins — le contrôle
// serait aveugle —, ni plus — il serait bruyant, et un jour on cesserait de le lire.
//
// Usage : node oracles/self-test.mjs   ·   exit 0 si tout tient, 1 sinon.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
];

let echecs = 0;
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
    if (!rapport.non_juge.length) ecarts.push('non_juge[] vide — un oracle qui ne déclare pas ses angles morts en cache');
  }

  if (ecarts.length) {
    echecs += 1;
    process.stdout.write(`  ECHEC  ${nom}\n${ecarts.map((e) => `         ${e}`).join('\n')}\n`);
  } else {
    process.stdout.write(`  ok     ${nom}\n`);
  }
}

process.stdout.write(`\n${CAS.length - echecs}/${CAS.length} fixtures conformes.\n`);
process.exit(echecs ? 1 : 0);
