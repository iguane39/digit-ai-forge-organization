# Installation — composant filtres de tableau

**Rien n'a été installé.** Les artefacts sont ici, testés, prêts à copier. L'installation
touche deux skills en production (`digit-ai-page-html`, `quality-oracles`) et attend un
accord explicite.

## Destination des fichiers

| Fichier produit | Destination |
|---|---|
| `composant-filtres-tableau.md` | `digit-ai-page-html/references/composant-filtres-tableau.md` |
| `assets/table-filters.js` | `digit-ai-page-html/assets/table-filters.js` |
| `oracle-filtres-tableau.mjs` | `quality-oracles/scripts/oracle-filtres-tableau.mjs` |
| `fixtures/filtres-rouge.html` | `quality-oracles/fixtures/filtres-rouge.html` |
| `fixtures/filtres-verte.html` | `quality-oracles/fixtures/filtres-verte.html` |

Deux lignes sont aussi à ajouter dans `digit-ai-page-html/SKILL.md`, section « Composants » :
le composant devient **obligatoire** (les tableaux de données en périmètre), là où la
recherche dans le document est **optionnelle**. C'est la seule modification de texte du skill.

## Entrée à ajouter au registre — vue MD

```
| Filtres de colonne sur tableaux de données | `scripts/oracle-filtres-tableau.mjs <page.html>` — G1 marquage ou exemption motivée, G2 asset référencé, G3 initialisation, G4 id + thead, G5 compteur aria-live, G6 réaffichage à l'impression | cli | ✅ |
```

## Entrée à ajouter au registre — vue JSON

```json
{
  "domaine": "Filtres de colonne sur tableaux de données",
  "ext": [".html", ".htm"],
  "type": "cli",
  "cmd": ["node", "{skilldir}/scripts/oracle-filtres-tableau.mjs", "{file}"],
  "content_patterns": ["<table"],
  "checklist": "G1 tableau en périmètre (≥ 8 lignes et ≥ 1 colonne catégorielle) marqué data-filterable ou exempté avec motif · G2 asset table-filters.js référencé · G3 tableau initialisé · G4 id + thead porteur de th · G5 compteur data-tf-count-for avec aria-live · G6 règle @media print réaffichant tr[data-tf-hidden]",
  "statut": "ok",
  "non_juge": [
    "comportement d'exécution (panneaux, Tous/Aucun, recherche, combinaison ET) — exige un rendu navigateur",
    "pertinence métier des colonnes retenues comme catégorielles (heuristique de cardinalité)",
    "tableaux exemptés par data-filterable=\"off\""
  ]
}
```

`content_patterns` limite le déclenchement aux pages contenant un tableau : une page HTML sans
`<table>` n'est pas jugée, elle est ignorée par l'orchestrateur.

## Vérification après installation

```bash
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-rouge.html   # attendu : FAIL, exit 1
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-verte.html   # attendu : PASS, exit 0
node scripts/self-test.mjs                                            # rejoue registre + fixtures
```

## Résultats de recette (exécutés le 20260808)

| Cas | Verdict | Règle déclenchée |
|---|---|---|
| Fixture rouge (tableau en périmètre sans filtres) | FAIL | G1 |
| Fixture verte (câblage complet) | PASS | — |
| Mutant : exemption sans motif | FAIL | G1 |
| Mutant : asset retiré | FAIL | G2 |
| Mutant : initialisation retirée | FAIL | G3 |
| Mutant : `id` retiré | FAIL | G4 |
| Mutant : `aria-live` retiré du compteur | FAIL | G5 |
| Mutant : règle print retirée | FAIL | G6 |

Les six règles discriminent indépendamment. Un défaut a été trouvé par le test de mutation et
corrigé : un tableau exempté sans motif rendait `PASS` tout en portant un finding bloquant —
la branche « aucun tableau en périmètre » écrasait le verdict. Un bloquant prime désormais sur
toute autre considération.
