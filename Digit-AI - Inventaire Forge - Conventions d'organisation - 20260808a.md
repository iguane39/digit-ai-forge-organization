# Digit-AI — Inventaire Forge — Conventions d'organisation — 20260808a

**Phase 1 du chantier `forge-organization` — inventaire factuel.**
Aucune règle n'est écrite ici : ce document ne consigne que ce qui est **observé** dans les
projets réels, avec preuves de chemin. Les arbitrages sont en Phase 2 (document séparé).

## Périmètre balayé

- **52 dossiers** dans `c:\dev` (balayage structurel complet des dossiers récurrents).
- **20 projets en balayage détaillé** (racine + arborescence) : 8 forges + 12 projets.
- Corpus GitHub : 6 forges vérifiées via `gh api` (trees récursifs).
- Plancher contractuel de 16 projets : **dépassé**.

**Écart au corpus annoncé** : la demande initiale mentionnait 6 forges. Il y en a **8** dans
`c:\dev` — `digit-ai-forge-seo` (actif, sans repo GitHub visible) et `nexistepas-forge`
(dossier **vide**, écarté de l'inventaire). `digit-ai-forge-organization` est la cible du
chantier, non une source.

---

## A. Nommage des fichiers livrables

**116 fichiers datés** relevés (profondeur 4, hors `.git` et `node_modules`).

| Convention | Énoncé observé | Applique | Absent / divergent | Exemples réels |
|---|---|---|---|---|
| A1 | Date inversée `AAAAMMJJ` en fin de nom | 116 / 116 fichiers datés | — | `Digit-AI - CDC Forge - Conception & PRD - 20260804a.md` · `Fit-Retail - RAO - TAO - Avec 2 plannings - 20260520b.xlsx` |
| A2 | Indice alphabétique `a/b/c` après la date | **59 / 116 (51 %)** | 57 sans indice | `… - 20260721d.md` · **divergent** : `Diagnostic Stratégique IA - 20260722.png`, `MSDriveOps - 20260330.zip` |
| A3 | Séparateur ` - ` (espace-tiret-espace) avant la date | **75 / 116 (65 %)** | 41 | `OptimAssur - Roadmap - 20260126.html` · **divergent** : `TEST_20260123.MD`, `PV-Phase0-P3-20260723.md` |
| A4 | Préfixe `Digit-AI - ` | **39 / 116 (34 %)** | 77 | `Digit-AI - Spec Forge - Noyau et contrat adaptateur - 20260802a.md` |
| A5 | Mention `Forge` en 2ᵉ position pour les documents de forge | 39 (tous les A4) | — | `Digit-AI - PV Forge - …` · `Digit-AI - Runbook Forge - …` |
| A6 | **Le code n'est jamais daté** | 20 / 20 projets détaillés | 0 contre-exemple | `bootstrap.mjs`, `generate_fiche.py`, `build_fiches.py`, `ledger.jsonl` |

**Gabarit complet reconstitué** (observé, non décrété) :
`Digit-AI - <Type> Forge - <Sujet> - AAAAMMJJ<indice>.<ext>`

**Taxonomie des `<Type>` relevée** (19 valeurs, liste ouverte) : CDC · Prompt · Spec · Corpus ·
Runbook · PV · Cadrage · Brief · Note · Inventaire · Skill · Veille · Propal / Propale ·
Modèle · Guide Admin · Architecture · Maquette · Diagnostic · Audit.

**Variantes divergentes recensées** :
- horodatage complet : `Beef Project - Saisie Fiches Produits - 20260721-073533.xlsx`
- underscore : `TEST_20260123.MD`
- tiret sans espaces : `PV-Phase0-P3-20260723.md`
- plage de dates : `RAG_Comparatif - 20260414_vs_20260423b.html`
- version sémantique intercalée : `Digit-AI - Skill Forge - forge-agents v0.9.1 - 20260721b.zip`
- doublon daté/non daté : `Beef Project - Saisie Fiches Produits.xlsx` coexiste avec sa version datée

---

## B. Arborescence — dossiers structurants

Comptage sur les **52 dossiers** de `c:\dev`.

| Convention | Dossier | Applique | Exemples réels |
|---|---|---|---|
| B1 | `input/` | **21 / 52** | `digit-ai-forge-steering/input`, `Herodote/input`, `Afficéo/input` |
| B2 | `output/` | **10 / 52** | `digit-ai-forge-agents/output`, `FRAG/output`, `PPTFormatter/output` |
| B3 | `input/` **et** `output/` ensemble | **7 / 52** | `digit-ai-forge-agents`, `AOFR`, `BeefProject`, `Herodote`, `Transcript`, `Fit-Retail Formatter`, `Digit-AI - SaaS Tests` |
| B4 | `dist/` **à la place de** `output/` | **2 / 52** | `digit-ai-forge-design/dist`, `HemTram3D/dist` |
| B5 | `docs/` | **14 / 52** | `RAG4AO/docs`, `digit-ai-forge-tests/docs`, `AOFR/docs` |
| B6 | `scripts/` | **8 / 52** | `digit-ai-forge-seo/scripts`, `PPTFormatter/scripts` |
| B7 | `oracles/` | **3 / 52** (forges seules) | `digit-ai-forge-steering/oracles`, `-design/oracles`, `-conception/oracles` |
| B8 | `skills/` | **4 / 52** | `digit-ai-forge-design/skills`, `-conception/skills`, `DashboardMail/skills` |
| B9 | `corpus/` | **2 / 52** (forges seules) | `digit-ai-forge-design/corpus`, `-conception/corpus` |
| B10 | `fixtures/` | **1 / 52** en racine | `digit-ai-forge-tests/fixtures` (+ récurrent dans `skills/*/fixtures`) |
| B11 | `.claude/skills/` (skills embarqués) | 1 / 52 | `digit-ai-forge-agents/.claude/skills/` (10 skills) |

**Constat majeur** : `input/` est **2 fois plus fréquent** qu'`output/`. Le couple annoncé
« les dossiers input/output » n'est appliqué conjointement que dans **7 projets sur 52**.

**Sous-structure interne des skills** (récurrente, 3 forges) : `references/` · `scripts/` ·
`fixtures/` · `assets/` — observée dans `forge-agents/.claude/skills/*`,
`forge-design/skills/*`, `forge-conception/skills/*`.

---

## C. Fichiers-pivots en racine

| Convention | Fichier | Applique | Note |
|---|---|---|---|
| C1 | `README.md` | **24 / 52** | Présent dans les 8 forges |
| C2 | `.gitignore` | **29 / 52** | Corrélé au fait d'être un repo git |
| C3 | `CLAUDE.md` | **13 / 52** | `digit-ai-forge-steering/CLAUDE.md`, `DPGFast/CLAUDE.md` |
| C4 | `TODO.md` | 2 / 52 | `digit-ai-forge-design/TODO.md`, `DPGFast/TODO.md` |
| C5 | `REGLES-PROJET.md` | **1 / 52** | `digit-ai-forge-steering` — fonction proche de C3, nom différent |
| C6 | `.env` + `.env.example` en paire | 5 / 52 | Divergence : `digit-ai-forge-tests/.env.exemple` (français) vs `.env.example` ailleurs |

**Cas particulier `digit-ai-forge-steering`** : 11 fichiers `.md` majuscules en racine
(`BOUCLE-AMELIORATION`, `CONTRAT-INTERFACE`, `ETAPE-MEP`, `HYPOTHESES`, `INVENTAIRE`,
`PROMPT-PRODUIT`, `REGLES-PROJET`, `RUN-PILOTE`). Convention de nommage `MAJUSCULES-TIRET`
pour les documents-pivots, unique à ce repo.

---

## D. Artefacts de traçabilité

| Convention | Artefact | Applique | Chemins réels |
|---|---|---|---|
| D1 | `ledger.jsonl` (journal append-only) | 2 | `digit-ai-forge-agents/ledger.jsonl`, `ASDMailManager2/forge/ledger.jsonl` |
| D2 | Sidecar `<fichier>.oracles-historique.jsonl` | 2 | `digit-ai-forge-agents/output/Digit-AI - PV Forge - … - 20260723a.md.oracles-historique.jsonl`, `ASDMailManager2/forge/RETOURS-FORGES.md.oracles-historique.jsonl` |
| D3 | Sidecar `<fichier>.oracles-cache.json` | 1 | `digit-ai-forge-steering/README.md.oracles-cache.json` |
| D4 | Registre de version `versions-livrees.json` | 1 | `digit-ai-forge-agents/versions-livrees.json` |
| D5 | Registre de dette `registre-dette.json` | 1 | `digit-ai-forge-tests/registre-dette.json` |

**Lecture** : famille cohérente (journal append-only + sidecars accolés au fichier source +
registres JSON racine), mais chaque membre n'existe qu'en **1 ou 2 exemplaires**. C'est un
patron émergent, pas encore une convention établie.

---

## E. Formats de livrables

| Format | Usage observé | Exemples |
|---|---|---|
| `.md` | Format dominant des livrables documentaires | 39 des 116 fichiers datés |
| `.html` | Livrables visuels autonomes (fiches, comparatifs, dossiers) | `FRAG/output/RAG_Comparatif - …html`, `Herodote/output/Matrice-Couverture-RFP-MobiPlus.html`, `digit-ai-forge-development/input/Digit-AI - Forge Development - … - 20260616d.html` |
| `.pptx` | Propales et supports | `Digit-AI - Propal ATB - Agents IA Run Support - 20260724a.pptx` |
| `.xlsx` | Données et matrices | `Fit-Retail - RAO - TAO - … - 20260520b.xlsx` |
| `.zip` / `.skill` | Skills packagés, versionnés + datés | `Digit-AI - Skill Forge - quality-oracles - 20260724a.zip`, `input/prompt-analyzer-l99.skill` |

---

## F. Fichiers HTML — inventaire non concluant

507 fichiers `.html` recensés, mais le volume est dominé par du bruit non pertinent :
rapports de couverture (`ASDMailManager/backend/htmlcov/*`, ~15 fichiers), prototypes
d'interface (`Afficéo/prototype/*`, 21 fichiers), sites web (`Digit-ai.fr/site`).

**Livrables HTML réels identifiés** (~25) : `FRAG/output/RAG_*.html`,
`Herodote/output/Matrice-Couverture-RFP-MobiPlus.html`,
`digit-ai-forge-development/input/…20260616d.html`, `AOFR/docs/architecture.html`,
`Digit-ai.fr/input/*.html`, `CRulers/CRulers_Schema.html`.

**Aucune convention n'est inscrite ici** : la demande initiale s'arrête sur « les fichiers
HTML... » (énumération tronquée), et trois lectures incompatibles restent ouvertes — charte
graphique, autonomie du fichier, ou convention de nommage. **→ Question de cadrage n° 1.**

---

## G. Candidates — non observées, à valider

Conventions **absentes du corpus** mais cohérentes avec le reste. Elles ne sont pas
normatives et ne doivent pas être traitées comme telles.

- `CHANGELOG.md` en racine (0 occurrence).
- Convention de nommage des branches git (non inventoriée).
- `LICENSE` (1 seule occurrence : `digit-ai-forge-development`).
- Fichier de manifeste projet unifié (chaque forge a le sien : `versions-livrees.json`,
  `registre-dette.json`, `.forge/`).

---

## H. Cas limites relevés

| Projet | Particularité | Enjeu |
|---|---|---|
| `digit-ai-forge-tests` | Package Python (`pyproject.toml`, `uv.lock`) ; `fixtures/` + `recette/` au lieu de `input/output` | Non-conformité **légitime** — cas de test de la procédure de dérogation |
| `digit-ai-forge-development` | Dossier auto-imbriqué `digit-ai-forge-development/digit-ai-forge-development/` ; 6 README traduits | Structure atypique, à ne pas normaliser à l'aveugle |
| `digit-ai-forge-design` | `dist/` au lieu d'`output/` | Divergence frontale sur le point B2/B4 |
| `nexistepas-forge` | Dossier vide | Écarté du corpus |
| `digit-ai-forge-seo` | Forge active sans repo GitHub | Absent du corpus annoncé |
