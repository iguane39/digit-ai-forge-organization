#!/usr/bin/env node
// self-test — prouve que gate-conventions.mjs peut échouer, et pour la bonne raison.
// TF-0109 sous-item 3 : le gate est un composant PROPOSÉ, livré avec sa propre preuve —
// une règle sans fixture rouge n'est pas un contrôle, c'est une déclaration d'intention.
//
// Usage : node self-test.mjs   ·   exit 0 si tout tient, 1 sinon.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const GATE = path.join(ICI, 'gate-conventions.mjs');
const FIX = path.join(ICI, 'fixtures');
const REGISTRE = path.join(FIX, 'registre-minimal.json');

// [racine-fixture, fichiers --files, code attendu, règles bloquantes attendues (ensemble exact)]
const CAS = [
  ['verte', ['Forge Fixture - Note Cas conforme - 20260809a.md', 'output/Forge Fixture - Page-Temoin Cas conforme - 20260809a.html'], { code: 0, bloquants: [] }],
  ['rouge-d02', ['Forge Fixture - Note Deux versions - 20260809a.md'], { code: 1, bloquants: ['D-02'] }],
  ['rouge-d03', ['PV-Phase0-P3-20260809.md'], { code: 1, bloquants: ['D-03'] }],
  ['rouge-d05', ['Forge Fixture - Note Cas neutre - 20260809a.md'], { code: 1, bloquants: ['D-05'] }],
  ['rouge-d09', ['output/page-non-datee.html'], { code: 1, bloquants: ['D-09'] }],
  ['rouge-d10', ['output/page-non-datee.html'], { code: 1, bloquants: ['D-10'] }],
];

let echecs = 0;
for (const [nom, fichiers, attendu] of CAS) {
  const racine = path.join(FIX, nom);
  const r = spawnSync(process.execPath, [GATE, '--racine', racine, '--registre', REGISTRE, '--files', ...fichiers, '--json'], { encoding: 'utf8' });
  const ecarts = [];

  if (r.status !== attendu.code) ecarts.push(`code de sortie ${r.status}, attendu ${attendu.code} (stderr: ${r.stderr || '—'})`);

  let rapport = null;
  try {
    rapport = JSON.parse(r.stdout);
  } catch {
    ecarts.push(`sortie JSON illisible : ${r.stdout.slice(0, 300)}`);
  }

  if (rapport) {
    const obtenus = [...new Set(rapport.findings.filter((f) => f.sev === 'bloquant').map((f) => f.regle))].sort();
    const veut = [...attendu.bloquants].sort();
    if (obtenus.join(',') !== veut.join(',')) {
      ecarts.push(`règles bloquantes [${obtenus.join(', ') || '—'}], attendu [${veut.join(', ') || '—'}]`);
    }
  }

  if (ecarts.length) {
    echecs += 1;
    process.stdout.write(`  ECHEC  ${nom}\n${ecarts.map((e) => `         ${e}`).join('\n')}\n`);
  } else {
    process.stdout.write(`  ok     ${nom}\n`);
  }
}

// --- Preuve du mode dégradé (registre absent) : ne doit ni planter ni faire remonter D-04/D-06,
// mais rester capable de juger D-05/D-02/D-03-gabarit.
{
  const racine = path.join(FIX, 'rouge-d05');
  const r = spawnSync(process.execPath, [GATE, '--racine', racine, '--files', 'Forge Fixture - Note Cas neutre - 20260809a.md', '--json'], { encoding: 'utf8' });
  let rapport = null;
  try { rapport = JSON.parse(r.stdout); } catch { /* voir ecarts ci-dessous */ }
  const ecarts = [];
  if (!rapport) ecarts.push('sortie JSON illisible en mode sans registre');
  else {
    if (!rapport.non_juge.some((n) => /registre/.test(n))) ecarts.push('non_juge[] ne signale pas l\'absence de registre');
    const regles = new Set(rapport.findings.map((f) => f.regle));
    if (regles.has('D-04') || regles.has('D-06')) ecarts.push('D-04/D-06 jugées malgré un registre absent — devraient dégrader en non-jugé');
  }
  if (ecarts.length) {
    echecs += 1;
    process.stdout.write(`  ECHEC  mode-sans-registre\n${ecarts.map((e) => `         ${e}`).join('\n')}\n`);
  } else {
    process.stdout.write('  ok     mode-sans-registre (dégrade proprement, ne plante pas)\n');
  }
}

// --- Preuve SKIP propre hors dépôt git, sans --files ni --diff. Un dossier sous fixtures/
// hérite du dépôt git de forge-organization lui-même (git remonte les parents) : il faut un
// répertoire réellement hors de tout dépôt, créé dans le dossier temporaire de l'OS.
{
  const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-conventions-selftest-'));
  try {
    const r = spawnSync(process.execPath, [GATE, '--racine', racine, '--json'], { encoding: 'utf8' });
    if (r.status !== 2) {
      echecs += 1;
      process.stdout.write(`  ECHEC  skip-hors-git : code ${r.status}, attendu 2 (stdout: ${r.stdout.slice(0, 200)})\n`);
    } else {
      process.stdout.write('  ok     skip-hors-git (défaut --staged hors dépôt git → SKIP motivé, pas un crash)\n');
    }
  } finally {
    fs.rmSync(racine, { recursive: true, force: true });
  }
}

process.stdout.write(`\n${CAS.length - Math.min(echecs, CAS.length)}/${CAS.length} fixtures de règles + 2 contrôles de robustesse.\n`);
process.exit(echecs ? 1 : 0);
