# digit-ai-forge-organization

Chantier de doctrine transverse de l'écosystème forge Digit-AI : conventions observées,
décisions D-01→D-12 et D-15 (D-13/D-14 encore au format narratif seul, MADR à venir),
études normatives. **Organization organise, pilot pilote** — elle propose, le pilot décide
et encode.

## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-13) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.6.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Doctrine des conventions** | disposer de conventions arbitrées pour tous les projets | `conversationnel — documents comme points d'accroche (proposés au pilot, qui encode dans REGLES-PROJET.md)` | prouvé (experimental) |
| **Composant filtres-tableau** | réutiliser un composant de filtres de tableau vérifié | `node output\02-composants\composant-filtres-tableau\oracle-filtres-tableau.mjs` | prouvé (experimental) |
| **Études normatives** | ancrer les pratiques sur les normes du métier | `conversationnel` | déclaré (experimental) |
| **Gate de conventions packagé** | vérifier les conventions en pre-commit/CI sans dépendre de la forge | `node output\02-composants\gate-conventions\gate-conventions.mjs [--staged]` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
