# Digit-AI — Décisions Forge — Conventions d'organisation — 20260808c

**Phase 2 du chantier `forge-organization` — arbitrages.**
Décisions prises par Sébastien le 2026-08-08 sur les 7 divergences relevées en Phase 1
(voir `Digit-AI - Inventaire Forge - Conventions d'organisation - 20260808a.md`).
Statut du document : **partiel** — 3 questions de cadrage restent ouvertes (§ Ouvertes).

**Historique des indices** (D-02 : la date *et* l'indice sont vérifiés à chaque génération —
ce document ne s'en dispense pas) :
- `a` — arbitrages initiaux D-01 à D-07. Archivée dans `Old/`.
- `b` — Q1 tranchée le 2026-08-08 par D-08 à D-12, sur le cas concret du rapport d'audit
  client de `forge-seo`. Archivée dans `Old/`.
- `c` — ouverture du **registre des types** sous D-04 (types `Décisions`, `Conception`,
  `Étude`, `Gabarit` ajoutés le 2026-08-08 avec leur premier exemplaire).

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
Architecture · Maquette · Diagnostic · Audit.

### Registre des types — ajouts du 08/08/2026

| Type | Objet | Premier exemplaire |
|---|---|---|
| **Décisions** | Arbitrages tracés, une entrée par décision, conflits résiduels déclarés | `Digit-AI - Decisions Forge - Conventions d'organisation - 20260808c.md` |
| **Conception** | Options comparées et recommandation, **avant** toute construction | `Digit-AI - Conception Forge - Leviers de qualite generique - 20260808a.md` |
| **Étude** | Résolution sourcée d'une question ouverte du corpus, avec test d'existence | `Digit-AI - Etude Forge - Ingenierie des exigences P-10 - 20260808a.md` |
| **Gabarit** | Référentiel d'exigences A0 d'une famille de livrable | `Digit-AI - Gabarit Forge - A0 Page HTML de restitution - 20260808a.md` |

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

## D-08 — Q1 : les trois axes sont trois décisions distinctes, toutes trois « oui »

**Contexte** : Q1 posait un choix entre trois lectures des « fichiers HTML ». C'est un faux
choix — les trois sont nécessaires et indépendantes. Un fichier peut respecter la charte sans
être autonome, être autonome sans respecter la charte, et le choix du format est encore autre
chose.

**Décision** : les trois axes s'appliquent **cumulativement** à tout livrable HTML destiné à
sortir du projet. Ils sont tranchés séparément en D-09, D-10 et D-11.

**Origine** : chantier `forge-seo`, cas concret du rapport d'audit client — le premier livrable
HTML de la forge qui parte réellement chez un tiers.

## D-09 — Charte : socle `digit-ai-page-html` obligatoire

**Décision** : tout livrable HTML sortant applique le socle `digit-ai-page-html` — tokens
`:root`, Roboto titres / DM Sans corps, thème clair, aucun hex en dur hors `:root`, WCAG 2.2 AA,
`lang="fr"`, `<meta viewport>`, un `<h1>` unique, police Syne interdite.

**Conséquence** : la recette passe par `check_html.py` et `render_page.py`. Un livrable non
recetté n'est pas un livrable.

**Écart admis** : un livrable peut ajouter des tokens sémantiques absents du socle — le rapport
SEO ajoute `--danger` et une échelle de niveau de preuve. Déclarés dans `:root` comme les
autres. Le socle est un plancher, pas un plafond.

## D-10 — Autonomie : totale, zéro requête réseau

**Décision** : un livrable HTML sortant est **entièrement autonome**. Aucun CDN, aucune police
distante, aucune image externe, aucun appel réseau. CSS et JS inline, images en `data:` URI,
polices en repli système.

**Trois motifs, par ordre d'importance :**

1. **Confidentialité** — une requête sortante signale l'ouverture du document : quand, depuis
   quelle adresse, combien de fois. Un livrable est lu par des tiers dont nous n'avons pas à
   connaître les habitudes de lecture.
2. **Durabilité** — le destinataire rouvre le fichier dans deux ans. Un CDN disparu rend la
   page illisible, et personne ne saura pourquoi.
3. **Contexte de lecture** — pièce jointe ouverte hors ligne, derrière un proxy d'entreprise
   qui bloque les domaines inconnus.

**Vérification** : recherche de motif dans le fichier produit — aucune occurrence de `http://`,
`https://`, `//cdn`, `@import url(` hors attributs documentaires. Contrôle exécutable, pas
déclaratif.

## D-11 — Format : HTML pour le visuel sortant, Markdown pour la matière

**Décision** : le HTML est le format des livrables **visuels destinés à sortir du projet**. Le
Markdown reste celui de la matière première et des documents de travail.

**Ce n'est pas un remplacement** : la source reste versionnable, diffable, lisible en revue ; le
HTML en est une **projection**, régénérable, jamais éditée à la main. Éditer le HTML livré
serait créer une seconde vérité.

**Conséquence** : tout livrable HTML sortant est produit par un générateur, jamais saisi. Un
gabarit HTML qu'on remplit à la main est un anti-patron — il ne survit pas au deuxième usage et
diverge de sa source dès la première correction.

## D-12 — Composant partagé non installé : inliner, jamais installer en douce

**Décision** : un projet qui a besoin d'un composant du référentiel **avant son installation**
en inline une copie verbatim, avec provenance et date, et **n'installe rien** dans un skill
tiers sans accord explicite.

**Conséquence de convergence** : le jour où le composant est installé, le projet lit l'asset du
skill au lieu de sa copie, sans changer le livrable produit — le contrat de marquage est
identique. Le repli sur la copie reste en place pour une machine où le skill n'est pas déployé.

**Statut du cas ayant motivé la règle** : `composant-filtres-tableau` a été installé le
2026-08-08 dans `digit-ai-page-html` (référence + asset) et `quality-oracles` (oracle +
2 fixtures + entrée au registre, vues MD et JSON). Vérifié : fixture rouge FAIL, fixture verte
PASS, `self-test.mjs` compile l'oracle.


---

## Questions ouvertes — bloquent la Phase 3

| # | Question | Impact si non tranché |
|---|---|---|
| ~~Q1~~ | ~~« les fichiers HTML… » vise quoi ?~~ | **Tranchée** le 2026-08-08 — voir D-08 à D-12. Les trois lectures étaient cumulatives, pas alternatives |
| Q3 | La norme s'applique au **flux** (fichiers nouveaux) seulement, ou aussi au **stock** (renommer les 57 fichiers sans indice, les 4 dossiers d'archivage) ? | Destructif si mal tranché : le renommage rétroactif casse les liens existants |
| Q3-bis | Préfixe : projet ou émetteur ? (voir D-03) | Bloque l'écriture du vérificateur |
| Q4 | Conventions internes aux fichiers (structure type d'un README, en-tête de document, versioning des skills `v0.9.1` → `v1.0.0`) — invisibles à l'inventaire | Le référentiel restera limité à ce que les noms de fichiers révèlent |

**Q2 tranchée par les données** (socle commun + surcouche forge) : `oracles/`, `corpus/`,
`skills/` n'existent que dans les forges ; `input/`, `README.md`, `.gitignore` traversent
tout le corpus. Retenu sauf objection.
