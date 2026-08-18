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
];

// TF-0109 — les 5 décisions non mécanisables doivent être déclarées SANS_OBJET avec leur
// raison sur CHAQUE run, jamais tues. Un compte qui bouge est un oubli en train de naître.
const REGLES_SANS_OBJET_ATTENDUES = ['D-01', 'D-07', 'D-08', 'D-11', 'D-12'];

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
    process.stdout.write(`  ECHEC  ${nom}\n${ecarts.map((e) => `         ${e}`).join('\n')}\n`);
  } else {
    process.stdout.write(`  ok     ${nom}\n`);
  }
}

// --- TF-0076 : fraîcheur du gabarit A0 — la version de socle DÉCLARÉE est comparée à
// la version INSTALLÉE. La dérive du 09/08 (4 itérations perdues) venait de l'absence de
// ce rapprochement : le gabarit déclarait un alignement que rien ne vérifiait.
{
  const racine = path.join(ICI, '..');
  const a0s = fs.readdirSync(racine).filter((f) => /Gabarit A0 .* - \d{8}[a-z]\.md$/.test(f)).sort();
  const skillInstalle = path.join(os.homedir(), '.claude', 'skills', 'digit-ai-page-html', 'SKILL.md');
  if (!a0s.length) {
    echecs += 1;
    process.stdout.write('  ECHEC  fraicheur-a0 : aucun gabarit A0 trouvé à la racine\n');
  } else if (!fs.existsSync(skillInstalle)) {
    process.stdout.write('  ok     fraicheur-a0 (socle non installé sur ce poste — non jugeable)\n');
  } else {
    const a0 = fs.readFileSync(path.join(racine, a0s[a0s.length - 1]), 'utf8');
    const declare = (a0.match(/digit-ai-page-html[`»\s]*\s*(\d+\.\d+\.\d+)/) || [])[1];
    const installe = (fs.readFileSync(skillInstalle, 'utf8').match(/version:\s*"?(\d+\.\d+\.\d+)"?/) || [])[1];
    if (!declare) {
      echecs += 1;
      process.stdout.write(`  ECHEC  fraicheur-a0 : ${a0s[a0s.length - 1]} ne déclare pas sa version de socle\n`);
    } else if (declare !== installe) {
      echecs += 1;
      process.stdout.write(`  ECHEC  fraicheur-a0 : gabarit aligné sur ${declare}, socle installé ${installe} — réaligner le gabarit (la dérive silencieuse a coûté 4 itérations le 09/08)\n`);
    } else {
      process.stdout.write(`  ok     fraicheur-a0 (déclaré ${declare} = installé ${installe})\n`);
    }
  }
}

process.stdout.write(`\n${CAS.length - echecs}/${CAS.length} fixtures conformes (+ contrôle fraîcheur A0).\n`);
process.exit(echecs ? 1 : 0);
