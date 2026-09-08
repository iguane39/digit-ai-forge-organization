# Installation — composant filtres de tableau

**Rien n'a été installé.** Les artefacts sont ici, testés, prêts à copier. L'installation
touche deux skills en production (`digit-ai-page-html`, `quality-oracles`) et attend un
accord explicite.

> **Source de vérité depuis le 21/08 (lot Client-B, TF-0429/0430/0431).** Le composant a évolué
> DANS le skill `digit-ai-page-html` (TF-0175 lignes de détail, RA-5 tri opt-in, puis
> `apresFiltrage`, état vide, côté d'ouverture) pendant que cette copie restait au 09/08 : les
> deux divergeaient de 460 lignes. La copie du skill est la source qui s'exécute ; `assets/`
> ici est **re-synchronisé depuis le skill** (js + css) et le restera à chaque évolution —
> la checklist G1-G6 et l'oracle, eux, vivent ici.

## Destination des fichiers

| Fichier produit | Destination |
|---|---|
| `composant-filtres-tableau.md` | `digit-ai-page-html/references/composant-filtres-tableau.md` |
| `assets/table-filters.js` | `digit-ai-page-html/assets/table-filters.js` |
| `oracle-filtres-tableau.mjs` | `quality-oracles/scripts/oracle-filtres-tableau.mjs` |
| `fixtures/filtres-rouge.html` | `quality-oracles/fixtures/filtres-rouge.html` |
| `fixtures/filtres-verte.html` | `quality-oracles/fixtures/filtres-verte.html` |
| `fixtures/filtres-rouge-cspexterne.html` + `fixtures/cspexterne/{rien.js,sans-print.css}` | `quality-oracles/fixtures/` (RS-1, TF-0837 : assets externes référencés mais sans init ni règle print) |
| `fixtures/filtres-verte-cspexterne.html` + `fixtures/cspexterne/{init.js,print.css}` | `quality-oracles/fixtures/` (RS-1, TF-0837 : init et règle print portées par un asset externe déclaré, sans duplication inline) |

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
  "checklist": "G1 tableau en périmètre (≥ 8 lignes et ≥ 1 colonne catégorielle) marqué data-filterable ou exempté avec motif · G2 asset table-filters.js référencé · G3 tableau initialisé (document ou asset externe déclaré, RS-1/TF-0837) · G4 id + thead porteur de th · G5 compteur data-tf-count-for avec aria-live · G6 règle @media print réaffichant tr[data-tf-hidden] (document ou asset externe déclaré, RS-1/TF-0837)",
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
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-rouge.html              # attendu : FAIL, exit 1
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-verte.html              # attendu : PASS, exit 0
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-rouge-cspexterne.html   # attendu : FAIL G3+G6, exit 1 (RS-1)
node scripts/oracle-filtres-tableau.mjs fixtures/filtres-verte-cspexterne.html   # attendu : PASS, exit 0 (RS-1)
node scripts/self-test.mjs                                                      # rejoue registre + fixtures
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

### Durcissement RS-1 (TF-0837, 08/09) — G3/G6 admettent l'asset externe déclaré

| Cas | Avant correctif | Après correctif |
|---|---|---|
| `filtres-verte-cspexterne.html` (init dans `cspexterne/init.js`, print dans `cspexterne/print.css`, rien d'inline) | **FAIL** G3+G6 (bug RS-1 reproduit) | PASS |
| `filtres-rouge-cspexterne.html` (assets référencés, lisibles, mais sans init ni règle print) | FAIL G3+G6 | FAIL G3+G6 (inchangé — la seule référence ne suffit jamais) |
| Fixtures historiques `filtres-rouge.html` / `filtres-verte.html` | FAIL G1 / PASS | FAIL G1 / PASS (non-régression) |

Défaut trouvé pendant le durcissement, corrigé avant clôture : le premier correctif
concaténait le contenu brut des assets externes au corpus jugé par G3/G6. L'en-tête de
commentaire de `assets/table-filters.js` porte la phrase « *la regle @media print du
livrable doit reafficher tr[data-tf-hidden]* » — un simple **commentaire de documentation**
— qui suffisait à satisfaire G6 par sa prose, sur **toute** page référençant la librairie,
y compris sans aucune règle print réelle. Corrigé en retirant les commentaires (`/* … */`,
`<!-- … -->`) du contenu externe avant jugement (`sansCommentaires()` dans
`oracle-filtres-tableau.mjs`). Preuve : `filtres-rouge-cspexterne.html` référence ce même
`table-filters.js` et échoue bien G6 après correction.
