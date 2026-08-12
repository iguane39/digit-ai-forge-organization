# Composant — gate de conventions (`gate-conventions.mjs`)

**TF-0109, sous-item 3.** Un gate « type danger » (dans l'esprit de
[danger.js](https://github.com/danger/danger-js)) : au lieu d'auditer tout le stock d'un
dépôt à chaque passage — c'est le travail de `oracles/oracle-conventions.mjs`, réservé à
forge-organization elle-même —, ce script ne juge que ce qui **bouge** : les fichiers d'un
commit staged, d'une diff contre une branche de base, ou une liste explicite. Bon marché en
pre-commit ou en CI, comme une pull request jugée fichier par fichier plutôt que dépôt entier.

## Ce qu'il vérifie

Portées depuis les décisions D-01→D-12 de `forge-organization`, sur les seules décisions déjà
**mécanisées** (les autres restent SANS_OBJET côté `oracle-conventions.mjs`, cf.
`decisions/D-01.md` etc.) :

| Règle | Contrôle | Portée |
|---|---|---|
| D-05 | `CLAUDE.md` présent à la racine du dépôt jugé | toujours, invariant du dépôt |
| D-02 | indice alphabétique obligatoire ; version antérieure non archivée | fichiers datés touchés |
| D-03 | gabarit `<Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext>` ; préfixe émetteur après le seuil Q3-bis | fichiers datés touchés |
| D-04 | `<Type>` présent au registre fourni | fichiers datés touchés, **si `--registre` résout** |
| D-06 | document doctrinal absent d'`output/` | fichiers datés touchés, **si `--registre` résout** |
| D-09 | `lang="fr"`, `<meta viewport>`, un seul `<h1>`, police Syne interdite | `*.html` touchés sous `output/` |
| D-10 | aucune ressource externe (`http(s)://`, `//cdn`, `@import url(`) | `*.html` touchés sous `output/` |

Sans `--registre` résolu (fichier absent ou illisible), D-04/D-06 et le volet « préfixe
émetteur » de D-03 dégradent en **non-jugé documenté** — le gate ne plante pas et ne prétend
pas juger ce qu'il ne peut pas juger. Un dépôt qui n'a jamais adopté `registre-types.json`
obtient quand même le reste des règles.

## Ce qu'il NE vérifie PAS (hors périmètre assumé)

D-01, D-07, D-08, D-11, D-12 : non mécanisables (cf. `oracles/oracle-conventions.mjs`,
tableau `SANS_OBJET`). Ce gate ne les réimplemente pas et ne prétend pas les couvrir. Le
socle HTML complet (contrastes WCAG réels, tokens `:root`) reste délégué à
`digit-ai-page-html` / `check_html.py` — dupliquer cette recette ici serait la divergence que
D-13 (« organization organise, le pilot pilote ») existe pour éviter.

## Invocation

```bash
node gate-conventions.mjs                          # défaut : fichiers indexés (git diff --cached)
node gate-conventions.mjs --diff main               # fichiers changés depuis la branche main
node gate-conventions.mjs --files a.md b.html       # liste explicite (tests, scripts)
node gate-conventions.mjs --racine <dossier>        # racine du dépôt jugé (défaut : cwd)
node gate-conventions.mjs --registre <chemin>       # registre-types.json du dépôt jugé
node gate-conventions.mjs --json                    # sortie JSON au lieu du rapport Markdown
```

Sortie par défaut : un rapport Markdown au format « commentaire de PR » (liste à puces,
icônes ❌/⚠️/ℹ️, section repliable pour les angles morts) — copiable tel quel dans une
description de pull request ou un log CI. Exit `0` PASS, `1` FAIL, `2` SKIP (rien à juger ou
contexte non résolu, jamais silencieux).

## Autonomie du fichier

Aucun import relatif : seulement `node:fs`, `node:path`, `node:child_process`. Ce fichier doit
survivre à une copie isolée dans n'importe quel dépôt. Les règles sont recopiées avec
intention depuis `oracles/oracle-conventions.mjs` (principe D-12 : « inliner, jamais installer
en douce ») — une correction de règle côté organization ne se répercute pas automatiquement
ici, voir `INSTALLATION.md` pour la procédure de resynchronisation manuelle.

## Preuve

```bash
node self-test.mjs
```

6 fixtures à double sens (une par règle mécanisée) + 2 contrôles de robustesse (dégradation
propre sans registre, SKIP propre hors dépôt git). Voir `INSTALLATION.md` pour le détail des
résultats de recette exécutés.
