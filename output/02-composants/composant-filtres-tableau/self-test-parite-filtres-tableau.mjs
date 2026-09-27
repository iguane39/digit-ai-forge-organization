#!/usr/bin/env node
// self-test-parite-filtres-tableau — prouve que oracle-parite-filtres-tableau.mjs peut échouer,
// et pour la bonne raison (TF-1336, 26/09/2026). Cinq cas, chacun une branche distincte du
// contrôle : deux fixtures à double sens (verte/rouge), deux branches d'environnement qui ne
// tiennent pas dans un fichier (dépôt tiers absent, chemin explicite absent), et depuis le 27/09
// deux copies au même contenu dont seules les fins de ligne diffèrent.
//
// Usage : node self-test-parite-filtres-tableau.mjs   ·   exit 0 si tout tient, 1 sinon.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const ORACLE = path.join(ICI, 'oracle-parite-filtres-tableau.mjs');
const FIX = path.join(ICI, 'fixtures');

const lancer = (args) => spawnSync(process.execPath, [ORACLE, ...args, '--json'], { encoding: 'utf8' });

let echecs = 0;
const cas = (nom, tenu) => {
  if (!tenu) echecs += 1;
  process.stdout.write(`  ${tenu ? 'ok    ' : 'ECHEC '} ${nom}\n`);
};

// 1) Fixture verte — deux copies identiques → PASS, exit 0, aucun finding.
{
  const r = lancer(['--reference', path.join(FIX, 'parite-verte', 'a.mjs'), '--autre', path.join(FIX, 'parite-verte', 'b.mjs')]);
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* dit par le contrôle ci-dessous */ }
  cas(`parite-verte (deux copies identiques → PASS, exit 0 — obtenu exit ${r.status}, verdict ${j?.verdict})`,
    r.status === 0 && j?.verdict === 'PASS' && (j?.findings || []).length === 0);
}

// 2) Fixture rouge — deux copies divergentes → FAIL, exit 1, un finding PARITE qui nomme la
// première ligne d'écart (ligne 1, puisque le tout premier commentaire diffère déjà).
{
  const r = lancer(['--reference', path.join(FIX, 'parite-rouge', 'a.mjs'), '--autre', path.join(FIX, 'parite-rouge', 'b.mjs')]);
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* dit par le contrôle ci-dessous */ }
  const finding = (j?.findings || [])[0];
  cas(`parite-rouge (deux copies divergentes → FAIL, exit 1, écart nommé — obtenu exit ${r.status}, verdict ${j?.verdict}, règle ${finding?.regle})`,
    r.status === 1 && j?.verdict === 'FAIL' && finding?.regle === 'PARITE' && finding?.severite === 'bloquant'
    && /premier écart à la ligne 1\b/.test(finding?.message || ''));
}

// 3) Dépôt tiers absent de ce poste (jamais cloné) — INCONCLUSIF, exit 2, jamais un FAIL qui
// laisserait croire à une vraie divergence, jamais un PASS qui ne prouve rien.
{
  const racineVide = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-organization-parite-'));
  try {
    const r = spawnSync(process.execPath, [ORACLE, '--reference', path.join(FIX, 'parite-verte', 'a.mjs'), '--json'],
      { encoding: 'utf8', env: { ...process.env, FORGE_ROOT: racineVide } });
    let j = null;
    try { j = JSON.parse(r.stdout); } catch { /* dit par le contrôle ci-dessous */ }
    cas(`depot-tiers-absent (FORGE_ROOT sans digit-ai-forge-agents → INCONCLUSIF, exit 2, zéro finding — obtenu exit ${r.status}, verdict ${j?.verdict})`,
      r.status === 2 && j?.verdict === 'INCONCLUSIF' && (j?.findings || []).length === 0);
  } finally {
    fs.rmSync(racineVide, { recursive: true, force: true });
  }
}

// 4) Chemin --autre explicite mais absent — FAIL, exit 1 : contrairement au cas 3, un chemin
// FORCÉ à la main qui n'existe pas est une divergence réelle (la référence n'y est pas), pas
// une question d'environnement.
{
  const r = lancer(['--reference', path.join(FIX, 'parite-verte', 'a.mjs'), '--autre', path.join(FIX, 'chemin-qui-nexiste-pas.mjs')]);
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* dit par le contrôle ci-dessous */ }
  cas(`autre-explicite-absent (chemin --autre forcé mais introuvable → FAIL, exit 1 — obtenu exit ${r.status}, verdict ${j?.verdict})`,
    r.status === 1 && j?.verdict === 'FAIL' && (j?.findings || []).some((f) => f.regle === 'PARITE'));
}

// 5) Même contenu, fins de ligne différentes — PASS, exit 0 (27/09/2026, reste de TF-1336). Les
// deux copies sont écrites à l'exécution dans un dossier jetable : une fixture en CRLF enregistrée
// au dépôt serait normalisée par git et ne prouverait plus rien. Sans la normalisation de
// l'oracle, ce cas rend FAIL, « 3 ligne(s) en référence, 3 en autre, premier écart à la ligne 4 »
// (mesuré le 27/09 sur la version précédente : les lignes sont égales, seuls les textes diffèrent).
{
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-organization-parite-eol-'));
  try {
    const contenu = "// copie de référence\nexport const x = 1;\n";
    fs.writeFileSync(path.join(dossier, 'lf.mjs'), contenu);
    fs.writeFileSync(path.join(dossier, 'crlf.mjs'), contenu.replace(/\n/g, '\r\n'));
    const r = lancer(['--reference', path.join(dossier, 'lf.mjs'), '--autre', path.join(dossier, 'crlf.mjs')]);
    let j = null;
    try { j = JSON.parse(r.stdout); } catch { /* dit par le contrôle ci-dessous */ }
    cas(`parite-fins-de-ligne (même contenu, LF d'un côté et CRLF de l'autre → PASS, exit 0 — obtenu exit ${r.status}, verdict ${j?.verdict})`,
      r.status === 0 && j?.verdict === 'PASS');
  } finally {
    fs.rmSync(dossier, { recursive: true, force: true });
  }
}

const TOTAL = 5;
process.stdout.write(`\n${TOTAL - echecs}/${TOTAL} cas conformes.\n`);
process.exit(echecs ? 1 : 0);
