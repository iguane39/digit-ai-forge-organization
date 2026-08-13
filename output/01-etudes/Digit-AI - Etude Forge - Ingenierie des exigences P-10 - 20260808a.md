# Digit-AI — Étude Forge — Ingénierie des exigences (P-10) — 20260808a

Résolution de l'entrée **`P-10` ingénierie des exigences**, laissée en statut `todo` dans
`digit-ai-forge-conception/corpus/registre-sources.md` au 04/08/2026 avec ce motif : *« Aucun
accès réseau n'a été engagé lors de la construction. […] les nommer de mémoire produirait une
source non résolue. »*

Conséquence opérationnelle qui y est assumée et que cette étude vise :
**« `oracle-exigences` E3/E6 restent lexicaux. `P-10` les rendrait sémantiques. »**

Méthode reprise du registre : une source n'est servie que si son **test d'existence a été
exécuté**. Pour une source web, le test est le fetch réussi de la source primaire.

---

## 1. Sources — et l'état réel de leur résolution

| Réf | Corps de doctrine | Test d'existence exécuté le 08/08/2026 | Statut proposé |
|---|---|---|---|
| S-1 | **EARS** — Easy Approach to Requirements Syntax (Mavin & Wilkinson, Rolls-Royce, RE'09) | **Source primaire fetchée** : `alistairmavin.com/ears/` — syntaxe des 5 patterns obtenue intégralement | **`ok`** |
| S-2 | **ISO/IEC/IEEE 29148:2018** — Systems and software engineering, Requirements engineering | **Primaire non accessible** : norme payante. Page officielle IEEE SA identifiée ; caractéristiques obtenues par sources secondaires concordantes | **à arbitrer** |
| S-3 | **INCOSE Guide to Writing Requirements v4** | **Primaire non accessible** : PDF officiel `incose.org` → HTTP 403. Contenu obtenu par source secondaire | **à arbitrer** |

**Point d'intégrité.** Seul S-1 satisfait strictement la règle du registre. Pour S-2 et S-3,
je peux nommer, citer et confronter — je n'ai pas lu les textes primaires. Ta méthode dit
« dans le doute : `todo` ». Les passer `ok` sur source secondaire est un arbitrage, pas une
constatation : il t'appartient. Ce document les utilise en le déclarant à chaque fois.

---

## 2. Ce que disent les trois corps de doctrine

### S-2 · ISO/IEC/IEEE 29148 — les caractéristiques

**Neuf caractéristiques d'une exigence individuelle** : *necessary, appropriate, unambiguous,
complete, singular, feasible, verifiable, correct, conforming*.

Deux méritent l'attention parce qu'elles n'ont pas d'équivalent chez toi :
- **appropriate** — le niveau d'abstraction est juste, sans contrainte inutile ni détail
  d'implémentation ;
- **conforming** — l'énoncé **suit un gabarit approuvé**. C'est la caractéristique qui rend
  possible tout contrôle structurel.

**Cinq caractéristiques d'un *ensemble* d'exigences**, distinctes des précédentes :
*complete, consistent, bounded, feasible, able to be validated*. La norme sépare
explicitement la qualité de l'exigence unitaire de celle du jeu.

### S-1 · EARS — la syntaxe (source primaire)

Cinq patterns, chacun avec son mot-clé. Forme générique :
`While <précondition>, when <déclencheur>, the <système> shall <réponse>`

| Pattern | Mot-clé | Forme |
|---|---|---|
| Ubiquitaire | — | `The <système> shall <réponse>` |
| Piloté par l'état | **While** | `While <précondition>, the <système> shall <réponse>` |
| Piloté par l'événement | **When** | `When <déclencheur>, the <système> shall <réponse>` |
| Fonction optionnelle | **Where** | `Where <fonction incluse>, the <système> shall <réponse>` |
| Comportement indésirable | **If / Then** | `If <déclencheur>, then the <système> shall <réponse>` |

Les patterns se combinent (*complex requirements*). EARS est né à Rolls-Royce et a été
présenté à RE'09 ; les études citées par ses auteurs rapportent une réduction des défauts
d'exigences et un gain de lisibilité.

### S-3 · INCOSE GtWR — les règles

42 règles en 14 catégories. Les pertinentes ici :

| Règle | Objet |
|---|---|
| **R7** | Termes vagues proscrits — *some, adequate, reasonable*, et *minimize / maximize / optimize* |
| **R18** | Une seule pensée par phrase (singularité) |
| **R24** | Pas de pronoms personnels ni indéfinis |
| **R26** | Pas d'absolus ni de superlatifs — *100 %*, *toujours* |
| **R34** | Cibles de performance spécifiques et mesurables |

Formule de synthèse retenue : une exigence doit pouvoir être construite et testée par
quelqu'un qui ne vous a jamais rencontré.

---

## 3. Confrontation avec `redige-les-exigences`

### 3.1 Ce qui est déjà aligné — sans le savoir

| Ta règle (`formulation.md`) | Correspondance |
|---|---|
| **E6** — un comportement observable, un seul ; marqueurs `;`, ` puis `, ` et/ou ` | 29148 *singular* · INCOSE **R18** |
| **E4** — liste noire d'adjectifs (optimal, robuste, intuitif, fluide…) | 29148 *unambiguous* · INCOSE **R7** |
| Critère **chiffré** (valeur **et** unité) ou **binaire** | 29148 *verifiable* · INCOSE **R34** |
| « Remplacer l'adjectif par ce qu'on mesurerait pour le contredire » | Reformulation exacte du critère de vérifiabilité |

**Rien à corriger sur ces quatre points.** Ta grammaire est conforme à l'état de l'art.

### 3.2 Ce qui est **plus strict** chez toi — à ne pas assouplir

- **La liste fermée de 31 prédicats binaires.** Aucun des trois corps de doctrine n'impose
  un lexique fermé. C'est précisément ce qui rend ton oracle exécutable là où les standards
  restent des recommandations. Ta remarque — « chaque ajout affaiblit la règle » — est juste.
- **Le statut épistémique du chiffre** (`fait constaté` + source / `hypothèse` + mode de
  validation). INCOSE R34 exige que la cible soit mesurable ; il n'exige pas de tracer d'où
  elle vient. Tu vas au-delà.

Une « mise aux standards » qui remplacerait ces deux règles par leur équivalent générique
serait une **régression**. À protéger explicitement.

### 3.3 Les cinq manques réels

| # | Manque | Ce qu'en disent les standards | Effet concret |
|---|---|---|---|
| **M1** | **Aucune syntaxe de condition.** Ta grammaire impose « sujet, verbe d'action, complément » — rien pour exprimer un état, un déclencheur, une option, un comportement indésirable. | 29148 *conforming* · EARS, les 5 patterns | **C'est le manque structurant.** Une exigence sur un cas limite — run de tests vide, filtre actif, export PDF — n'a aujourd'hui aucune forme pour être écrite. |
| **M2** | **Aucune caractéristique d'ensemble.** Tous tes contrôles (E3, E4, E6, T4) sont unitaires. | 29148 : *complete, consistent, bounded, feasible, able to be validated* | Rien ne détecte deux exigences contradictoires, ni un jeu qui déborde du périmètre, ni un périmètre non couvert. |
| **M3** | **Absolus et superlatifs non couverts.** Ta liste noire retient *exhaustif* et *complet*, mais pas *toujours*, *jamais*, *tous*, *100 %*. | INCOSE **R26** | « La liste est toujours à jour » passe tes contrôles et n'est pas vérifiable. |
| **M4** | **Pronoms non couverts.** | INCOSE **R24** | « Il est affiché après validation » passe E3 : le prédicat `est affiché` est présent, le sujet est indéterminé. |
| **M5** | **Rien n'impose le « solution-free ».** | 29148 *appropriate* | Une exigence peut prescrire l'implémentation. C'est exactement le défaut relevé dans les anti-patterns de `digit-ai-fiches-html` : « fiche architecture qui re-décrit les fonctionnalités ». |

---

## 4. Ce qui rend E3/E6 sémantiques — la réponse au manque déclaré

Le registre annonçait que P-10 rendrait E3/E6 sémantiques. Voici par quel mécanisme.

Aujourd'hui E3 demande : *« un prédicat de la liste fermée est-il présent ? »* — un test de
présence lexicale. Une exigence peut le satisfaire tout en étant informe.

EARS fournit une grammaire **structurelle détectable par script** : la présence d'un mot-clé
de condition en tête classe l'exigence dans un des cinq patterns, et le contrôle devient
*« cette exigence appartient-elle à un pattern connu, et ce pattern est-il complet ? »* —
c'est-à-dire un test de forme, pas de vocabulaire.

**Transposition française proposée** (le `shall` anglais n'a pas à être importé : 29148 exige
*conforming*, c'est-à-dire un gabarit approuvé, pas *ce* gabarit) :

| Pattern | Forme française | Reste applicable |
|---|---|---|
| Ubiquitaire | `<sujet> <prédicat> <complément>` | forme actuelle, inchangée |
| État | `Tant que <état>, <sujet> <prédicat> <complément>` | E4, E6, critère |
| Événement | `Quand <déclencheur>, <sujet> <prédicat> <complément>` | idem |
| Option | `Lorsque <fonction> est incluse, <sujet> <prédicat> <complément>` | idem |
| Indésirable | `Si <déclencheur>, alors <sujet> <prédicat> <complément>` | idem |

Trois contrôles nouveaux en découlent, tous exécutables :

- **E7 — pattern reconnu** : toute exigence commençant par `Tant que` / `Quand` / `Lorsque` /
  `Si` doit porter la partie principale complète après la virgule. Une condition orpheline est
  un échec.
- **E8 — absolus** (R26) et **pronoms** (R24) : extension de la liste noire E4.
- **E9 — ensemble** (29148) : sur le jeu complet — aucun couple d'exigences contradictoires
  sur le même sujet, et chaque élément du périmètre porte au moins une exigence. Le second
  volet existe déjà chez toi sous la forme d'un exemple de réécriture (« chaque élément de
  `surface[]` porte au moins une exigence ») — il n'est simplement pas outillé.

---

## 5. Conséquence directe pour la décision B

Le gabarit A0 de la famille « page HTML de restitution » doit être **rédigé en exigences**
conformes à cette grammaire, et non en prose. Deux bénéfices immédiats :

1. Les cinq patterns couvrent exactement les cas limites qui manquaient au dashboard :
   run vide → *indésirable* (`Si`) · filtre actif → *état* (`Tant que`) · export PDF →
   *option* (`Lorsque`) · fin de run → *événement* (`Quand`).
2. Les caractéristiques d'ensemble (M2) fournissent enfin le **critère de complétude** du
   gabarit — la question « quand la fiche d'exigences est-elle finie ? » restait sans réponse.

---

## 6. Entrées proposées pour `corpus/pratiques.csv`

Format à 7 colonnes du registre. **Non appliquées** — le registre prévoit un checkpoint
humain : « ce qui entre dans le corpus est un arbitrage, pas une collecte ».

```
P-10;ingenierie des exigences;EARS - Easy Approach to Requirements Syntax, 5 patterns avec mots-cles;Fournit la grammaire structurelle qui rend E3/E6 semantiques (controle de pattern, pas de lexique). Couvre etat, evenement, option, comportement indesirable;Mavin & Wilkinson, RE'09 - alistairmavin.com/ears;fetch reussi le 2026-08-08 : https://alistairmavin.com/ears/;ok
P-12;ingenierie des exigences;ISO/IEC/IEEE 29148:2018 - 9 caracteristiques unitaires et 5 caracteristiques d'ensemble;Apporte la distinction exigence unitaire / jeu d'exigences, absente de la grammaire actuelle (manque M2), et la notion de conformite a un gabarit;ISO/IEC/IEEE 29148:2018, page officielle IEEE SA;PRIMAIRE NON ACCESSIBLE le 2026-08-08 : norme payante - caracteristiques obtenues par sources secondaires concordantes;todo
P-13;ingenierie des exigences;INCOSE Guide to Writing Requirements v4 - 42 regles en 14 categories;Complete la liste noire E4 sur deux angles non couverts : absolus/superlatifs (R26) et pronoms indefinis (R24);INCOSE Requirements Working Group, GtWR v4;PRIMAIRE NON ACCESSIBLE le 2026-08-08 : PDF incose.org HTTP 403 - contenu obtenu par source secondaire;todo
```

---

## 7. Ce qu'il ne faut **pas** reprendre

- **Le `shall`.** Convention anglophone. 29148 exige un gabarit approuvé, pas celui-là. Ta
  forme « sujet + verbe au présent » est équivalente et plus lisible en français.
- **Les 42 règles INCOSE en bloc.** Une large part vise l'ingénierie système physique
  (unités, tolérances, interfaces matérielles). Cinq sont pertinentes ici, retenues au §2.
- **La chaîne complète besoin → exigence système → exigence logicielle** de 29148. Appareil
  lourd, calibré pour des systèmes critiques multi-équipes. Hors proportion.

---

*Type de document « Étude » — à ajouter au registre des types tenu par la décision D-04,
avec « Conception » signalé le même jour.*

## Sources

- [EARS — Alistair Mavin, guide officiel](https://alistairmavin.com/ears/) *(primaire, fetchée)*
- [EARS: The Easy Approach to Requirements Syntax — Mavin & Wilkinson (PDF)](https://ccy05327.github.io/SDD/08-PDF/Easy%20Approach%20to%20Requirements%20Syntax%20(EARS).pdf)
- [ISO/IEC/IEEE 29148-2018 — page officielle IEEE SA](https://standards.ieee.org/standard/29148-2018.html) *(payante, non lue)*
- [ISO 29148 Explained — Modern Requirements](https://www.modernrequirements.com/blogs/iso-29148-explained/) *(secondaire)*
- [INCOSE GtWR v4 — Summary Sheet officielle](https://www.incose.org/docs/default-source/working-groups/requirements-wg/guidetowritingrequirements/incose_rwg_gtwr_v4_summary_sheet.pdf) *(HTTP 403, non lue)*
- [INCOSE Requirements Quality: The 42 Rules — reqi.io](https://reqi.io/articles/incose-requirements-quality-42-rule-guide) *(secondaire)*
