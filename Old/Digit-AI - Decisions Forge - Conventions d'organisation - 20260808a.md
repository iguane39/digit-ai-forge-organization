# Digit-AI — Décisions Forge — Conventions d'organisation — 20260808a

**Phase 2 du chantier `forge-organization` — arbitrages.**
Décisions prises par Sébastien le 2026-08-08 sur les 7 divergences relevées en Phase 1
(voir `Digit-AI - Inventaire Forge - Conventions d'organisation - 20260808a.md`).
Statut du document : **partiel** — 3 questions de cadrage restent ouvertes (§ Ouvertes).

---

## D-01 — `output/` réservé aux livrables, pas aux artefacts de dev

**Décision** : `output/` contient les fichiers **en sortie** du projet. Il ne contient pas
les artefacts de développement (build, compilation, packaging).
**Conséquence** : `dist/` reste légitime pour un artefact de build — ce n'est pas un
synonyme d'`output/`, ce sont deux notions distinctes. `digit-ai-forge-design/dist` et
`HemTram3D/dist` **ne sont donc pas des non-conformités** à corriger, sous réserve que leur
contenu soit bien du build.
**À vérifier avant mise en œuvre** : le contenu réel de ces deux `dist/` (build ou livrable ?).

## D-02 — Indice alphabétique obligatoire + archivage sans effacement

**Décision** : l'indice `a/b/c…` est **obligatoire**, y compris pour le premier fichier du
jour (`20260808a`, jamais `20260808`). À chaque génération, la date **et** l'indice sont
vérifiés systématiquement.
**Décision liée** : les versions précédentes d'un livrable sont **déplacées dans `Old`**,
jamais supprimées. L'historique est conservé.
**Nom retenu** : `Old` (capitale initiale).
**Écart terrain** : 4 graphies coexistent — `Old` (2), `old` (1), `archives` (1),
`archive-v1` (1). Migration : renommer 4 dossiers.
**Reste à trancher** : `Old` à la racine du projet, ou dans chaque dossier concerné ?
Les deux existent (`OptimAssur/old` vs `EnlargeAIChat/input/Old`).

## D-03 — Préfixe = nom du projet

**Décision** : le nom de fichier est préfixé par le nom du projet.
**Gabarit** : `<Projet> - <Type> - <Sujet> - AAAAMMJJ<indice>.<ext>`
**Conflit non résolu** : la règle ne couvre pas les cas observés où le préfixe est
l'**émetteur** et non le projet — `Herodote/…/Digit-AI - Brief Analyse POC Mobi+ vs RFP -
20260527a.md`, `digit-ai-forge-conception/Digit-AI - CDC Forge - … - 20260804a.md`. Un
troisième cas utilise un préfixe fonctionnel avec underscore : `FRAG/output/RAG_Reponses -
20260414.html`.
**Hypothèse de travail à valider** : préfixe = `Digit-AI` pour les livrables destinés à
sortir du projet, nom du projet pour les fichiers de travail internes. **Bloque le
vérificateur** tant que non tranché.

## D-04 — Taxonomie des types : liste ouverte, registre tenu

**Décision** : la liste des `<Type>` reste ouverte, mais tout type nouveau est **ajouté au
référentiel** au lieu d'être improvisé.
**Base de départ** (19 types observés) : CDC · Prompt · Spec · Corpus · Runbook · PV ·
Cadrage · Brief · Note · Inventaire · Skill · Veille · Propale · Modèle · Guide ·
Architecture · Maquette · Diagnostic · Audit. Ajouté ce jour : **Décisions**.

## D-05 — `CLAUDE.md` point d'entrée, compléments admis

**Décision** : `CLAUDE.md` est le point d'entrée des instructions projet. D'autres fichiers
peuvent le compléter.
**Conséquence** : `digit-ai-forge-steering/REGLES-PROJET.md` reste valide comme complément,
à condition d'être **référencé depuis `CLAUDE.md`** — pas de fichier d'instructions
orphelin, qui deviendrait obsolète sans que personne ne le voie.

## D-06 — `input/` = ce que je fournis · `output/` = tout ce qui sort

**Décision** : `input/` contient les fichiers **fournis en entrée par l'utilisateur**.
`output/` contient **tous les fichiers en sortie** (sous réserve de D-01 : hors artefacts
de dev).
**Écart avec la reco de Phase 1** : la reco proposait `input/` = « entrants non produits par
le projet ». La décision est plus étroite et plus nette : c'est ce que **tu** fournis.
**Non tranché** : le sort de `docs/` (14 projets). Documentation produite sur le projet —
dossier distinct, ou sous-ensemble d'`output/` ?

## D-07 — Artefacts de traçabilité : patron optionnel

**Décision** : `ledger.jsonl`, sidecars `.oracles-historique.jsonl` / `.oracles-cache.json`,
`versions-livrees.json`, `registre-dette.json` sont documentés comme **patron optionnel**,
non comme obligation. Trop peu diffusés (1-2 occurrences chacun) pour être imposés.

---

## Questions ouvertes — bloquent la Phase 3

| # | Question | Impact si non tranché |
|---|---|---|
| Q1 | « les fichiers HTML… » vise quoi : la charte (skill `digit-ai-page-html`), l'autonomie du fichier (zéro CDN, tout inline), ou le choix du format HTML pour les livrables visuels ? | Bloquant : un des 3 axes de la demande initiale reste vide |
| Q3 | La norme s'applique au **flux** (fichiers nouveaux) seulement, ou aussi au **stock** (renommer les 57 fichiers sans indice, les 4 dossiers d'archivage) ? | Destructif si mal tranché : le renommage rétroactif casse les liens existants |
| Q3-bis | Préfixe : projet ou émetteur ? (voir D-03) | Bloque l'écriture du vérificateur |
| Q4 | Conventions internes aux fichiers (structure type d'un README, en-tête de document, versioning des skills `v0.9.1` → `v1.0.0`) — invisibles à l'inventaire | Le référentiel restera limité à ce que les noms de fichiers révèlent |

**Q2 tranchée par les données** (socle commun + surcouche forge) : `oracles/`, `corpus/`,
`skills/` n'existent que dans les forges ; `input/`, `README.md`, `.gitignore` traversent
tout le corpus. Retenu sauf objection.
