# Digit-AI — Conception Forge — Leviers de qualité générique — 20260808a

Conception des trois leviers **génériques** de qualité fond & forme, valables pour tout
livrable et non pour les deux exemples ayant servi à formuler le besoin.

Ce document ne construit rien : il pose les options et attend trois arbitrages.
État amont : `Digit-AI - Inventaire Forge - Conventions d'organisation - 20260808a.md`,
`Digit-AI - Decisions Forge - Conventions d'organisation - 20260808a.md`, et la Phase 0 de
reconnaissance de l'existant (quality-oracles v2.6.1, digit-ai-page-html v1.1.0).

---

## Constat qui recadre les trois leviers

La file des candidats de `digit-ai-forge-agents` porte 4 entrées écrites entre le 07/07 et le
24/07/2026. Sa note de clôture indique que trois d'entre elles instrumentent un candidat
déjà nommé : **« gabarits de cadrage A0 par famille de livrable »**.

| Entrée | Défaut consigné |
|---|---|
| `cadrage-reponse-ao` | Réponse bâtie hors cadre imposé — cadrage absent à l'entrée |
| `cadrage-acquisition` | Relecture sans référentiel de cadrage type |
| `cadrage-programme-formation` | Conception sans référentiel d'exigences figé en amont |

**Trois constats en découlent.**

1. Le besoin « charger la spécification avant de produire » est **identifié depuis le
   24/07/2026**. Il n'est pas à inventer, il est à instancier.
2. Le barème de déclenchement compte les occurrences **par domaine exact** (N0 → N1 à la 2ᵉ).
   Les trois entrées portent trois domaines différents partageant un préfixe et un défaut
   identique. Le compteur ne peut structurellement jamais atteindre 2 : **le candidat est
   gelé par construction**.
3. Aucune entrée n'a été écrite depuis le 24/07, alors que des chantiers ont eu lieu depuis
   (forge-design, forge-steering, forge-tests en août). La capture dépend du fait que le
   modèle y pense — elle n'est pas déterministe.

Le levier 1 n'est donc pas « construire une capture » mais « rendre déterministe et agrégeante
une capture qui existe ». Le levier 2 n'est pas « concevoir un mécanisme amont » mais
« instancier un candidat gelé ».

---

## Levier 1 — Capture déterministe des règles énoncées

**Ce qui existe** : `file-candidats.md` (réplique repo + `/areas/` côté claude.ai), le barème
N0/N1 de `quality-oracles` §4, et le scaffold `write-an-oracle`. La chaîne est complète.

**Ce qui manque** — deux défauts distincts :

- **D1.1 — déclenchement non garanti.** La règle §4 dit « produit dans le tour même une
  entrée ». C'est une consigne au modèle, donc probabiliste. Zéro écriture en 15 jours.
- **D1.2 — agrégation aveugle aux familles.** Le compteur exige l'identité stricte du
  domaine. Trois occurrences d'un même motif sous trois noms ne déclenchent rien.

**Conception proposée**

- **Sur D1.2** — ajouter au barème une règle de famille : *N occurrences partageant un
  préfixe de domaine (segment avant le premier tiret) OU un défaut de même classe comptent
  comme occurrences du même candidat*. Seuil identique (2). Effet immédiat : le candidat
  « gabarits de cadrage A0 » passe à N1 le jour où la règle entre en vigueur — il porte
  déjà 3 occurrences.
- **Sur D1.1** — un hook `Stop` (fin de tour) qui pose une question déterministe : une règle
  durable a-t-elle été énoncée, un contrôle manuel a-t-il porté sur un domaine hors registre ?
  Si oui, écriture dans la file avant clôture. Le hook ne juge pas : il force la question à
  être posée, ce qui est exactement ce qui manque aujourd'hui.

**Coût** : faible. Une règle de barème (texte) + un hook court. Aucun nouveau concept.

---

## Levier 2 — Chargement de la spécification en amont

C'est le seul levier qui produit « du premier coup ». Les oracles font converger en N passes ;
ils ne font pas réussir en une. **Trois conceptions possibles**, à arbitrer.

### Option A — Gabarit de cadrage A0 par famille de livrable

Un document d'exigences figé **par famille** (page HTML de restitution, deck commercial,
rapport d'audit, dashboard, note de cadrage…), chargé avant production. C'est le candidat
déjà nommé dans la file.

- **Pour** : lisible, versionnable, opposable ; le patron existe déjà à petite échelle dans
  `digit-ai-fiches-html` (règles éditoriales non négociables) ; alimente aussi les oracles aval.
- **Contre** : rien ne garantit qu'il soit **réellement lu** avant de produire. C'est
  précisément le mode d'échec du référentiel écrit qui ne change rien.
- **Couverture** : toute famille dotée d'un gabarit. Extensible.

### Option B — Injection automatique par hook

Un hook détecte qu'un livrable de type X va être produit et injecte sa spécification dans le
contexte.

- **Pour** : automatique, aucune discipline requise.
- **Contre** : **le type n'est connu qu'après avoir décidé du contenu.** Détecter « ceci va
  être un dashboard de tests » avant l'écriture est fragile ; détecter après l'écriture est
  trop tard pour le « premier coup ». C'est le levier 3 déguisé, pas un mécanisme amont.
- **Couverture** : illusoire tant que la détection précoce n'est pas fiable.

### Option C — Production en deux temps : plan de contenu, puis rédaction

Avant de produire un livrable substantiel, émettre un **plan de contenu** — la liste des
blocs et de ce que chacun porte — le confronter au gabarit A0 de sa famille, puis rédiger.

- **Pour** : garantit que la spécification est consultée, puisque le plan est produit *contre*
  elle ; le plan est vérifiable par oracle (présence des blocs obligatoires) ; un écart se
  corrige sur 15 lignes de plan, pas sur 400 lignes de HTML.
- **Contre** : un tour supplémentaire. Objection à relativiser — il remplace les 3 allers-retours
  actuels par 1 étape courte, ce qui est le gain recherché.
- **Couverture** : tout livrable substantiel, indépendamment de l'existence d'un skill dédié.

### Recommandation

**C armé par A.** Le gabarit A0 fournit la matière (le quoi), la production en deux temps
garantit qu'elle est consultée (le comment). B est écarté : sa détection précoce n'est pas
fiable, et ce qu'il apporte réellement relève du levier 3.

Quand un skill de production existe pour la famille, il porte le gabarit A0 — c'est le
véhicule naturel, déjà en place dans `digit-ai-fiches-html`.

---

## Levier 3 — Portée du contrôle : correction technique

**Le diagnostic initial était imprécis.** Élargir le matcher du hook PreToolUse existant à
`Write|Edit` ne fonctionnerait pas, et serait pire que l'absence de contrôle :

- En `PreToolUse`, le fichier **n'existe pas encore** (création) ou **contient l'ancienne
  version** (écrasement).
- `qo-gate.mjs` filtre par `fs.existsSync(f)` : une création serait silencieusement ignorée
  (`exit 0`), un écrasement ferait juger le **contenu précédent**.
- Résultat : une couverture apparente sans contrôle réel. Le pire des états.

**Le bon dispositif est un hook `PostToolUse` sur `Write|Edit`** : le fichier existe, son
contenu est celui qui vient d'être écrit. Il ne bloque pas l'écriture — elle est faite — mais
renvoie le verdict à Claude, ce qui déclenche la correction. C'est une boucle
générer → vérifier → corriger, exactement la boucle bornée à 3 itérations de `quality-oracles`.

**Calibrage — quatre options, non exclusives**

| # | Option | Effet | Coût quotidien |
|---|---|---|---|
| i | PostToolUse sur toute écriture | Couverture maximale | Élevé : chaque fichier intermédiaire est jugé |
| ii | Restreint aux extensions livrables (`.html`, `.md`, `.pptx`, `.xlsx`…) et hors dossiers techniques (`node_modules`, `.git`, `fixtures`, scratchpad) | Couvre ce qui compte | Modéré |
| iii | Mode signalement (jamais bloquant) pendant une période de calibrage, puis bloquant | Adoption progressive, pas de blocage subi sur des faux positifs | Faible |
| iv | Niveau d'exigence différencié : `--niveau note` sur écriture, `--niveau production` à la diffusion | Contrôle léger en cours de route, strict à la sortie | Faible |

**Recommandation : ii + iii + iv.** Le point iv n'invente rien — le mécanisme de niveaux
existe déjà (`quality-oracles` §6) et le cache par hash évite de rejuger un contenu inchangé.
Le hook de diffusion actuel reste en place, inchangé, en `production`.

---

## Ordre d'exécution recommandé

1. **Levier 1** (règle de famille + hook Stop) — débloque mécaniquement le candidat A0.
2. **Levier 2** (gabarit A0 d'une famille + production en deux temps) — sur une famille pilote.
3. **Levier 3** (hook PostToolUse calibré) — met les deux précédents sous contrôle exécuté.
4. **Preuve** : produire un dashboard de résultats de tests avec le dispositif complet, et
   mesurer le nombre d'allers-retours réellement nécessaires.

Le dashboard reste le cas de preuve, il n'est plus l'objet du travail.

---

## Décisions attendues

| # | Décision | Sans elle |
|---|---|---|
| **A** | Règle de famille dans le barème N0→N1 : préfixe de domaine, classe de défaut, ou les deux ? | Le candidat A0 reste gelé indéfiniment |
| **B** | Option retenue pour le levier 2 : C armé par A, ou autre ? Et **quelle famille pilote** ? | Rien à instancier |
| **C** | Hook PostToolUse : périmètre (ii), mode (iii) et niveaux (iv) — validés tels quels ? | Les règles produites ne se déclencheront jamais d'elles-mêmes |

La décision C modifie la configuration globale (`settings.json`) et change le comportement
quotidien à chaque écriture de fichier. Elle n'est pas prise.

---

*Type de document « Conception » — à ajouter au registre des types tenu par la décision D-04.*
