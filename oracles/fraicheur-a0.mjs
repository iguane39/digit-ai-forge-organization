// fraîcheur du gabarit A0 — jugement pur, sans accès disque (TF-2396).
//
// Le gabarit A0 ne porte plus de numéro de socle écrit à la main : sa ligne « Socle aligné »
// désigne le manifeste `versions-livrees.json` de forge-agents, qui fait foi. Le numéro attendu
// est donc LU au manifeste à chaque run, et le contrôle ne rougit plus à chaque montée du socle
// (troisième récidive après TF-1336 et TF-1731 : l'alignement se refaisait à la main).
//
// Deux formes de déclaration sont admises, et seule la seconde peut encore rougir sur un numéro :
//   1) dérivée — la ligne cite `versions-livrees.json` et n'écrit aucun numéro : attendu = manifeste ;
//   2) littérale — la ligne écrit « digit-ai-page-html x.y.z » : ce numéro doit être celui du manifeste,
//      sinon ECHEC (une valeur écrite à la main et périmée reste attrapée).
//
// Ce que ce contrôle ne juge pas : que le CONTENU du gabarit (A0-13 à A0-29) couvre la surface du socle.
// Un numéro écrit à la main ne l'a jamais prouvé non plus (TF-1336).

// Ligne qui se désigne elle-même (cf. D-18) : seule une ligne débutant par « Socle aligné » (gras
// markdown optionnel) vaut déclaration ; une mention de version ailleurs n'est jamais lue.
export function ligneDeclaration(texteA0) {
  return texteA0.split(/\r?\n/).find((l) => /^\*{0,2}Socle aligné/.test(l.trim())) || null;
}

export function versionDuManifeste(manifeste, skill = 'digit-ai-page-html') {
  const v = manifeste?.skills?.[skill]?.version;
  return typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v) ? v : null;
}

// → { verdict: 'ok' | 'echec' | 'non_jugeable', message }
export function jugerFraicheurA0(texteA0, versionAttendue) {
  const ligne = ligneDeclaration(texteA0);
  if (!ligne) return { verdict: 'echec', message: 'aucune ligne « Socle aligné » déclarant sa version de socle' };
  if (!versionAttendue) return { verdict: 'non_jugeable', message: 'version du socle absente du manifeste versions-livrees.json — non jugeable' };
  const litterale = (ligne.match(/digit-ai-page-html[`»\s]*\s*(\d+\.\d+\.\d+)/) || [])[1];
  if (litterale) {
    return litterale === versionAttendue
      ? { verdict: 'ok', message: `déclaré ${litterale} = manifeste ${versionAttendue}` }
      : { verdict: 'echec', message: `gabarit aligné sur ${litterale}, manifeste ${versionAttendue} — retirer le numéro écrit à la main (la ligne désigne le manifeste) ou le réaligner` };
  }
  if (/versions-livrees\.json/.test(ligne)) {
    return { verdict: 'ok', message: `version dérivée du manifeste : ${versionAttendue}` };
  }
  return { verdict: 'echec', message: 'la ligne « Socle aligné » n\'écrit aucun numéro et ne désigne pas versions-livrees.json — déclaration vide' };
}
