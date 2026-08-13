# Installation — gate de conventions (`gate-conventions.mjs`)

**Rien n'a été installé.** Ce composant est **PROPOSÉ**, comme tout le reste de
`forge-organization` produit vers un tiers (D-13 : « organization organise, le pilot pilote »).
Aucune écriture n'a eu lieu hors de ce dépôt — pas de commit, pas de PR, pas de fichier déposé
dans `digit-ai-forge-pilot` ni dans aucun autre dépôt du corpus. C'est le garde-fou du pilot :
« aucune écriture dans les dépôts frères hors mandat humain explicite ».

## Ce qu'un dépôt cible ferait (sur décision humaine, pas automatiquement)

| Fichier produit | Destination possible |
|---|---|
| `gate-conventions.mjs` | `scripts/gate-conventions.mjs` (ou `.github/gate-conventions.mjs`) du dépôt cible |
| `registre-types.json` | copie ou lien vers celui d'`organization`, **si** le dépôt adopte D-04 — sinon le gate dégrade proprement sans lui (voir `gate-conventions.md`) |

Aucune modification d'un skill tiers n'est nécessaire (contrairement à
`composant-filtres-tableau`) : ce composant est un script isolé, pas une extension d'un
skill existant.

## Intégration proposée (exemple, à valider par le dépôt cible)

**Pre-commit local** (juge le commit en train de se faire) :
```bash
node scripts/gate-conventions.mjs --registre registre-types.json || exit 1
```

**CI sur pull request** (juge tout ce qui diverge de la branche de base) :
```bash
node scripts/gate-conventions.mjs --diff origin/main --registre registre-types.json
```

Dans les deux cas, un exit `1` bloque ; un exit `2` (SKIP) signale un contexte non résolu —
à traiter comme un avertissement d'outillage, pas comme un vert déguisé.

## Resynchronisation avec `oracles/oracle-conventions.mjs`

Ce fichier est une **copie intentionnelle**, pas une dépendance vivante (D-12). Si
`oracle-conventions.mjs` évolue côté `forge-organization` (nouvelle règle mécanisée,
correction d'un motif), `gate-conventions.mjs` ne le sait pas automatiquement. Procédure de
resynchronisation, à la charge de qui maintient une copie déployée :
1. Comparer les deux fichiers (mêmes noms de règles D-xx, mêmes motifs de regex).
2. Reporter la correction dans la copie déployée.
3. Rejouer `self-test.mjs` du dépôt cible (à écrire par ce dépôt, sur le même principe de
   fixtures à double sens que celui-ci) avant de recommitter.

## Vérification après une éventuelle installation

```bash
node gate-conventions.mjs --racine fixtures/rouge-d09 --registre fixtures/registre-minimal.json --files "output/page-non-datee.html"   # attendu : FAIL, exit 1
node gate-conventions.mjs --racine fixtures/verte --registre fixtures/registre-minimal.json --files "Forge Fixture - Note Cas conforme - 20260809a.md" "output/Forge Fixture - Page-Temoin Cas conforme - 20260809a.html"   # attendu : PASS, exit 0
node self-test.mjs                                                    # rejoue les 6 fixtures + 2 contrôles de robustesse
```

## Résultats de recette (exécutés le 20260812)

| Cas | Verdict | Règle déclenchée |
|---|---|---|
| `verte` (câblage complet, CLAUDE.md + HTML conforme) | PASS | — |
| `rouge-d02` (version antérieure non archivée) | FAIL | D-02 |
| `rouge-d03` (nom hors gabarit) | FAIL | D-03 |
| `rouge-d05` (CLAUDE.md absent) | FAIL | D-05 |
| `rouge-d09` (marqueurs socle manquants + police interdite) | FAIL | D-09 |
| `rouge-d10` (ressource externe référencée) | FAIL | D-10 |
| Mode sans `--registre` résolu | dégrade proprement | D-04/D-06 non-jugées, reste jugé |
| Racine hors dépôt git, sans `--files`/`--diff` | SKIP (exit 2) | — |

`self-test.mjs` : 6/6 fixtures conformes + 2/2 contrôles de robustesse, exit 0. Rejoué contre
le staged réel de forge-organization (le commit TF-0109 lui-même) : `PASS`, 0 bloquant — le
gate ne se signale pas lui-même en écart, les dossiers `fixtures/` et `Old/` sont exclus du
balayage comme dans `oracle-conventions.mjs`.
