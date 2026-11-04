# digit-ai-forge-organization

Chantier de doctrine transverse de l'écosystème forge Digit-AI : conventions observées,
décisions D-01→D-12 et D-15 (D-13/D-14 encore au format narratif seul, MADR à venir),
études normatives. **Organization organise, pilot pilote** — elle propose, le pilot décide
et encode.

## Utilisation

Cette forge ne se lance pas seule : la Factory la mobilise quand votre demande en a besoin.
Ouvrez une session Claude Code dans le dossier de votre projet et collez cette phrase, la même
pour tous les cas d'usage :

```
Utilise https://github.com/iguane39/digit-ai-factory pour ce projet
```

La Factory installe ce qui manque, cette forge comprise, puis vous demande ce que vous voulez
obtenir. Détail : [README de la Factory](https://github.com/iguane39/digit-ai-factory#utiliser-la-factory--une-seule-phrase).

## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-13) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.6.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Doctrine des conventions** | disposer de conventions arbitrées pour tous les projets | `conversationnel — documents comme points d'accroche (proposés au pilot, qui encode dans REGLES-PROJET.md)` | prouvé (experimental) |
| **Composant filtres-tableau** | réutiliser un composant de filtres de tableau vérifié | `node output\02-composants\composant-filtres-tableau\oracle-filtres-tableau.mjs` | prouvé (experimental) |
| **Parité oracle filtres-tableau** | savoir si la copie livrée avec le composant a divergé de la copie installée dans `quality-oracles` (TF-1336) | `node output\02-composants\composant-filtres-tableau\oracle-parite-filtres-tableau.mjs` | prouvé (experimental) |
| **Études normatives** | ancrer les pratiques sur les normes du métier | `conversationnel` | déclaré (experimental) |
| **Gate de conventions packagé** | vérifier les conventions en pre-commit/CI sans dépendre de la forge | `node output\02-composants\gate-conventions\gate-conventions.mjs [--staged]` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-factory/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-factory/blob/main/catalogues/CATALOGUES.md).
