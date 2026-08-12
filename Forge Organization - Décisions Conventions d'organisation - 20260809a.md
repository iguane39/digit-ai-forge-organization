# Forge Organization — Décisions — Conventions d'organisation — 20260809a

**Phase 2 du chantier `forge-organization` — arbitrages.**
Décisions prises par Sébastien le 2026-08-08 sur les 7 divergences relevées en Phase 1
(voir `Digit-AI - Inventaire Forge - Conventions d'organisation - 20260808a.md`).
Statut du document : **partiel** — 1 question de cadrage reste ouverte (§ Ouvertes).

**TF-0109 (12/08)** : D-01 à D-12 sont désormais aussi au format [MADR](https://adr.github.io/madr/)
sous [`decisions/`](decisions/) — un fichier par décision, id stable, statut/contexte/
décision/conséquences, plus le statut d'encodage corpus (circuit D-13) et le verdict d'oracle
(mécanisée ou `SANS_OBJET` motivé). **Ce document reste la doctrine narrative de référence** —
les MADR n'en sont pas une réécriture, ils conservent le texte d'origine verbatim et
n'ajoutent que la structure et la traçabilité. Chaque section ci-dessous renvoie à son MADR.

**Historique des indices** (D-02 : la date *et* l'indice sont vérifiés à chaque génération —
ce document ne s'en dispense pas) :
- `20260808a` — arbitrages initiaux D-01 à D-07. Archivée dans `Old/`.
- `20260808b` — Q1 tranchée le 2026-08-08 par D-08 à D-12, sur le cas concret du rapport
  d'audit client de `forge-seo`. Archivée dans `Old/`.
- `20260808c` — ouverture du registre des types sous D-04. Archivée dans `Old/`.
- `20260809a` — Q-B tranchée (D-13), Q3-bis tranchée (D-03), Q3 tranchée sur sa partie
  destructive, D-04 délégué au fichier `registre-types.json`, renommage
  `forge-steering` → `forge-pilot` répercuté. **Premier exemplaire de cette forge nommé
  selon Q3-bis** : le nom du projet est en tête, plus l'émetteur.

---

## D-01 — `output/` réservé aux livrables, pas aux artefacts de dev

→ MADR : [`decisions/D-01.md`](decisions/D-01.md)

**Décision** : `output/` contient les fichiers **en sortie** du projet. Il ne contient pas
les artefacts de développement (build, compilation, packaging).
**Conséquence** : `dist/` reste légitime pour un artefact de build — ce n'est pas un
synonyme d'`output/`, ce sont deux notions distinctes. `digit-ai-forge-design/dist` et
`HemTram3D/dist` **ne sont donc pas des non-conformités** à corriger, sous réserve que leur
contenu soit bien du build.
**À vérifier avant mise en œuvre** : le contenu réel de ces deux `dist/` (build ou livrable ?).

## D-02 — Indice alphabétique obligatoire + archivage sans effacement

→ MADR : [`decisions/D-02.md`](decisions/D-02.md)

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

## D-03 — Préfixe = nom du projet (Q3-bis tranchée)

→ MADR : [`decisions/D-03.md`](decisions/D-03.md)

**Décision** : le nom de fichier est préfixé par le nom du projet.
**Gabarit** : `<Projet> - <Type> <Sujet> - AAAAMMJJ<indice>.<ext>`

**Q3-bis — tranchée le 2026-08-09 (décision humaine)** : le nom du **projet prime sur
l'émetteur**. « Aux Portes de la Baie - Audit SEO - … », plus jamais « Digit-AI - … » en
tête. Pour une forge, le projet est la forge elle-même : « Forge Organization - … »,
« Forge Pilot - … ». L'hypothèse de travail de la version précédente — préfixe `Digit-AI`
pour ce qui sort, nom du projet pour l'interne — est **abandonnée** : elle demandait au
producteur de deviner la destination du fichier au moment de le nommer.

**Portée** : les fichiers historiques ne sont **pas renommés** (cf. Q3, ci-dessous). La règle
vaut pour tout livrable produit à partir du 2026-08-09.

**Où se lit le `<Type>`** : premier mot du deuxième segment, séparateur `« - »`. La règle
tient sur la forme héritée (`Digit-AI - Inventaire Forge - …` → `Inventaire`) comme sur la
forme Q3-bis (`Forge Pilot - Schéma Écosystème - …` → `Schéma`). C'est ce qui permet à un
vérificateur de lire le type d'un nom sans connaître son époque.

**Encodage** : cette décision est encodée par le pilot à la règle 4 de son `REGLES-PROJET.md`
et contrôlée par son oracle de conformité projet (cf. D-13).

## D-04 — Taxonomie des types : liste ouverte, registre tenu dans un fichier

→ MADR : [`decisions/D-04.md`](decisions/D-04.md)

**Décision** : la liste des `<Type>` reste ouverte, mais tout type nouveau est **ajouté au
référentiel** au lieu d'être improvisé.

**Le référentiel est un fichier** : [`registre-types.json`](registre-types.json), source
unique. Il porte, pour chacun des **23 types admis**, son objet, ses graphies alternatives
observées et son premier exemplaire quand l'inventaire de Phase 1 l'a relevé. Le tableau qui
tenait lieu de registre dans les versions précédentes de ce document est supprimé : deux
copies d'une même liste divergent à la première correction.

**Ajouter un type** se fait dans `registre-types.json`, dans un commit qui le motive — pas
dans un nom de fichier.

## D-05 — `CLAUDE.md` point d'entrée, compléments admis

→ MADR : [`decisions/D-05.md`](decisions/D-05.md)

**Décision** : `CLAUDE.md` est le point d'entrée des instructions projet. D'autres fichiers
peuvent le compléter.
**Conséquence** : `digit-ai-forge-pilot/REGLES-PROJET.md` reste valide comme complément,
à condition d'être **référencé depuis `CLAUDE.md`** — pas de fichier d'instructions
orphelin, qui deviendrait obsolète sans que personne ne le voie.
**Application chez soi** (2026-08-09) : cette forge a désormais son `CLAUDE.md`, qui référence
le présent document, `registre-types.json` et le vérificateur. Elle ne violait plus la règle
qu'elle édicte que faute d'avoir été écrite.

## D-06 — `input/` = ce que je fournis · `output/` = tout ce qui sort

→ MADR : [`decisions/D-06.md`](decisions/D-06.md)

**Décision** : `input/` contient les fichiers **fournis en entrée par l'utilisateur**.
`output/` contient **tous les fichiers en sortie** (sous réserve de D-01 : hors artefacts
de dev).
**Écart avec la reco de Phase 1** : la reco proposait `input/` = « entrants non produits par
le projet ». La décision est plus étroite et plus nette : c'est ce que **tu** fournis.
**Non tranché** : le sort de `docs/` (14 projets). Documentation produite sur le projet —
dossier distinct, ou sous-ensemble d'`output/` ?

**Précision d'application, proposée le 2026-08-09 — la doctrine n'est pas une sortie.**
Un document **normatif** de la forge (ce document, un gabarit A0, `registre-types.json`)
n'est pas « en sortie » : il est la matière même du dépôt, il vit à sa racine, et ses
versions antérieures dans le `Old/` de cette racine. `output/` porte ce qui *sort* — études,
revues, composants livrés. Le référentiel A0 vivait dans `output/` jusqu'au 2026-08-09,
séparé du `Old/` qui archivait ses propres versions : la doctrine et son archive n'étaient
pas au même endroit. **Statut** : proposition d'organization, appliquée chez elle ; elle ne
devient règle du corpus que par décision humaine au pilot (D-13).

## D-07 — Artefacts de traçabilité : patron optionnel

→ MADR : [`decisions/D-07.md`](decisions/D-07.md)

**Décision** : `ledger.jsonl`, sidecars `.oracles-historique.jsonl` / `.oracles-cache.json`,
`versions-livrees.json`, `registre-dette.json` sont documentés comme **patron optionnel**,
non comme obligation. Trop peu diffusés (1-2 occurrences chacun) pour être imposés.

## D-08 — Q1 : les trois axes sont trois décisions distinctes, toutes trois « oui »

→ MADR : [`decisions/D-08.md`](decisions/D-08.md)

**Contexte** : Q1 posait un choix entre trois lectures des « fichiers HTML ». C'est un faux
choix — les trois sont nécessaires et indépendantes. Un fichier peut respecter la charte sans
être autonome, être autonome sans respecter la charte, et le choix du format est encore autre
chose.

**Décision** : les trois axes s'appliquent **cumulativement** à tout livrable HTML destiné à
sortir du projet. Ils sont tranchés séparément en D-09, D-10 et D-11.

**Origine** : chantier `forge-seo`, cas concret du rapport d'audit client — le premier livrable
HTML de la forge qui parte réellement chez un tiers.

## D-09 — Charte : socle `digit-ai-page-html` obligatoire

→ MADR : [`decisions/D-09.md`](decisions/D-09.md)

**Décision** : tout livrable HTML sortant applique le socle `digit-ai-page-html` — tokens
`:root`, Roboto titres / DM Sans corps, thème clair, aucun hex en dur hors `:root`, WCAG 2.2 AA,
`lang="fr"`, `<meta viewport>`, un `<h1>` unique, police Syne interdite.

**Conséquence** : la recette passe par `check_html.py` et `render_page.py`. Un livrable non
recetté n'est pas un livrable.

**Écart admis** : un livrable peut ajouter des tokens sémantiques absents du socle — le rapport
SEO ajoute `--danger` et une échelle de niveau de preuve. Déclarés dans `:root` comme les
autres. Le socle est un plancher, pas un plafond.

## D-10 — Autonomie : totale, zéro requête réseau

→ MADR : [`decisions/D-10.md`](decisions/D-10.md)

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

→ MADR : [`decisions/D-11.md`](decisions/D-11.md)

**Décision** : le HTML est le format des livrables **visuels destinés à sortir du projet**. Le
Markdown reste celui de la matière première et des documents de travail.

**Ce n'est pas un remplacement** : la source reste versionnable, diffable, lisible en revue ; le
HTML en est une **projection**, régénérable, jamais éditée à la main. Éditer le HTML livré
serait créer une seconde vérité.

**Conséquence** : tout livrable HTML sortant est produit par un générateur, jamais saisi. Un
gabarit HTML qu'on remplit à la main est un anti-patron — il ne survit pas au deuxième usage et
diverge de sa source dès la première correction.

## D-12 — Composant partagé non installé : inliner, jamais installer en douce

→ MADR : [`decisions/D-12.md`](decisions/D-12.md)

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

## D-13 — Q-B : organization organise, le pilot pilote

**Décision humaine du 2026-08-08.** Le recouvrement de gouvernance entre le `REGLES-PROJET.md`
du pilot et les décisions D-01→D-12 de cette forge est tranché : ce ne sont pas deux sources
concurrentes, ce sont **deux rôles**.

- **`forge-organization` est l'atelier amont.** Elle **inventorie** l'existant avec preuves de
  chemin, **propose** des conventions, et **outille** leur vérification. Elle ne décrète rien
  pour le corpus.
- **`digit-ai-forge-pilot` décide.** Il **encode** la convention adoptée dans son
  `REGLES-PROJET.md` et la **fait respecter** par son oracle de conformité projet.

**Circuit d'une convention** — et il n'a pas de raccourci :

1. organization observe, mesure, et écrit la proposition dans ce document (une décision `D-xx`,
   avec son écart terrain chiffré) ;
2. la proposition est remise au pilot ;
3. **décision humaine au pilot** — c'est la seule étape qui transforme une proposition en règle ;
4. le pilot encode la règle dans `REGLES-PROJET.md` et l'ajoute à son oracle de conformité.

**Conséquence directe** : une décision `D-xx` de ce document **n'est pas opposable au corpus**
tant que le pilot ne l'a pas encodée. Elle est opposable à cette forge, chez elle, tout de
suite — c'est le sens de « se conformer à sa propre doctrine ». Aucun passage automatique de
l'étape 2 à l'étape 4.

**Conséquence sur la Phase 3** : le vérificateur machine s'écrit **une fois, ici**, et le pilot
le branche s'il le veut. Deux vérificateurs concurrents seraient exactement la divergence que
ce chantier existe pour supprimer.

## D-14 — `forge-steering` s'appelle `forge-pilot`

**Renommage du 2026-08-09.** Le dépôt d'orchestration vit désormais en
`c:\dev\digit-ai-forge-pilot` ; une jonction depuis l'ancien nom `digit-ai-forge-steering`
maintient les chemins existants. Le nom porte le rôle tranché en D-13 : il pilote.

**Portée documentaire** : les documents produits à partir du 2026-08-09 écrivent `forge-pilot`.
Les documents antérieurs — dont l'inventaire de Phase 1, qui compte `digit-ai-forge-steering`
dans 52 dossiers — **ne sont pas réécrits** : ce sont des relevés datés, et corriger un relevé
après coup lui retire sa valeur de preuve.

---

## Questions ouvertes

| # | Question | État |
|---|---|---|
| ~~Q1~~ | ~~« les fichiers HTML… » vise quoi ?~~ | **Tranchée** le 2026-08-08 — voir D-08 à D-12. Les trois lectures étaient cumulatives, pas alternatives |
| ~~Q3~~ | ~~La norme s'applique au flux seulement, ou aussi au stock ?~~ | **Tranchée sur sa partie destructive** le 2026-08-09 : les fichiers historiques ne sont pas renommés (règle 4 du pilot). La norme s'applique au **flux**. Reste, sans urgence ni risque : harmoniser en `Old` les 4 graphies de dossier d'archivage |
| ~~Q3-bis~~ | ~~Préfixe : projet ou émetteur ?~~ | **Tranchée** le 2026-08-09 — le projet prime, voir D-03. Le vérificateur n'est plus bloqué |
| Q4 | Conventions internes aux fichiers (structure type d'un README, en-tête de document, versioning des skills `v0.9.1` → `v1.0.0`) — invisibles à l'inventaire | **Ouverte**. Le référentiel restera limité à ce que les noms de fichiers révèlent |

**Q2 tranchée par les données** (socle commun + surcouche forge) : `oracles/`, `corpus/`,
`skills/` n'existent que dans les forges ; `input/`, `README.md`, `.gitignore` traversent
tout le corpus. Retenu sauf objection.
