# Forge Organization — Gabarit — A0 « Page HTML de restitution » — 20260809c

Gabarit de cadrage **A0** de la famille *page HTML de restitution* (fiches, dashboards,
cartographies, référentiels). Premier instancié du candidat `cadrage`, passé N1 le 08/08/2026.

**Historique des indices** (D-02) :
- `20260808a` — création : Partie 1 (socle A0-1 à A0-12) et Partie 2 (dashboard de tests).
  Archivée dans `Old/`.
- `20260809a` — **Partie 1 bis, lisibilité (A0-13 à A0-22)**, dérivée des dix défauts relevés
  par un lecteur humain sur un livrable réel le 09/08/2026. Aucun n'était détecté par les
  oracles en place : `check_html`, `render_page` et l'oracle de filtres étaient tous les trois
  au vert sur une page dont les textes étaient coupés, les scores sans barème, le sommaire
  muet et les chapitres de données sans mode d'emploi. Archivée dans `Old/`.
- `20260809b` — **A0-23 à A0-25**, issues d'une seconde lecture, cette fois par un lecteur
  naïf, sur le livrable *déjà corrigé* : verdict « oui, mais ». Les onze règles de la version
  précédente étaient toutes au vert. L'enseignement vaut d'être inscrit ici plutôt que dans un
  commit : **le premier tour d'exigences ne trouve que ce qu'il sait chercher.** Ce sont des
  lecteurs, pas des règles, qui trouvent les règles suivantes — et une famille de gabarits qui
  ne se rouvre pas après chaque lecture réelle se fige sur ses angles morts. Archivée dans `Old/`.
- `20260809c` — **réalignement sur le socle `digit-ai-page-html` 1.6.0**, dont ce gabarit avait
  dérivé en une journée. Trois écarts corrigés : A0-14 portait encore la doctrine « conteneur
  relatif, prose bornée en `ch` » que le socle a **retirée parce qu'elle produisait le défaut
  qu'elle prétendait éviter** ; A0-13 ignorait la seconde forme de L1 (ponctuation orpheline) ;
  la mesure de lecture **au rendu** et la gouttière d'étiquettes n'étaient nulle part. Ajout de
  **A0-26** (L12). Nommage repris selon Q3-bis — le nom du projet prime sur l'émetteur.

**La dérive elle-même est l'enseignement de cette version** : un référentiel d'exigences et
l'implémentation qui le contrôle vivent dans deux dépôts et se désynchronisent en quelques
heures. Un gabarit A0 déclare donc désormais **la version du socle sur laquelle il est aligné**
(ici `digit-ai-page-html` 1.6.0, lu sur cette machine le 09/08/2026) : sans ce point de
comparaison, la dérive ne se voit pas, elle se découvre.

**Ce que ce gabarit porte** : le **fond** — ce que la page doit contenir pour être utile.
**Ce qu'il ne porte pas** : la forme (charte, tokens, sémantique, print, rendu), déjà couverte
par `digit-ai-page-html` et contrôlée par `check_html.py` + `render_page.py` (V1–V7).

**Trois couches, trois propriétaires** — ne pas les confondre est ce qui rend le dispositif
utile : le **fond** (ce gabarit A0), la **forme** (charte et V1–V7), la **lisibilité**
(règles L1–L12 de `digit-ai-page-html/references/lisibilite.md`). Une page peut être exacte,
chartée, sans défaut visuel — et illisible.

La lisibilité se contrôle en **deux endroits, pas un** : `check_html.py --regles L` juge ce qui
se lit dans le code (présence, longueur, résolution d'ancre, seuil de lignes), `render_page.py`
juge ce qui ne se voit qu'une fois la page rendue (largeur réellement occupée, répartition
d'une grille). Un gabarit qui ne cite que le premier laisse passer les défauts de mesure —
c'est précisément ce qui est arrivé à la version `20260809b`. `scripts/self_test.py` prouve les
deux en rejouant les fixtures.

**Comment il s'utilise — production en deux temps** (décision B du 08/08/2026) :
1. Avant de rédiger, produire un **plan de contenu** : la liste des blocs, et pour chacun ce
   qu'il porte, construit *contre* ce gabarit.
2. Faire valider le plan. Un écart se corrige sur 15 lignes de plan, pas sur 400 de HTML.
3. Rédiger, puis contrôler par les oracles du registre.

**Grammaire** : patterns EARS transposés en français (étude P-10 du 08/08/2026).
`—` ubiquitaire · `Tant que` état · `Quand` événement · `Lorsque` option · `Si … alors`
comportement indésirable. Aucun terme de la liste noire E4, tout critère chiffré ou binaire.

---

## Partie 1 — Socle de la famille

Applicable à **toute** page de restitution, quel que soit son type.

| ID | Pattern | Exigence | Critère vérifiable | Source |
|---|---|---|---|---|
| **A0-1** | — | La page énonce la réponse à la question posée, et pas seulement les données qui y mènent. | Un bloc de tête porte une phrase affirmative répondant à l'objet de la page. Sa présence est binaire. | Interne — `digit-ai-fiches-html` : « argumentaire dirigeant », « encadré quotable » |
| **A0-2** | — | Chaque mesure affichée est accompagnée d'au moins un élément de contexte : cible, comparaison temporelle, ou référence. | Aucune valeur numérique mise en avant n'est isolée. Contrôle : toute stat de tête porte une seconde valeur (delta, cible ou période). | Few — *« data loses meaning in isolation ; provide historical comparisons or benchmarks »* |
| **A0-3** | — | Chaque chiffre est marqué comme fait constaté avec sa source, ou comme hypothèse avec son mode de validation. | Marquage explicite ; contrôlé par `oracle-claims` (montant sans source ni « à vérifier » = bloquant). | Interne — `redige-les-exigences` T4 · `quality-oracles` claims |
| **A0-4** | — | La vue principale tient dans un écran, sans défilement vertical, à 1280 px de large. | Hauteur du bloc principal ≤ hauteur de fenêtre au breakpoint 1280. Mesurable par `render_page.py`. | Few — *« a dashboard should not exceed the boundary of a single screen »* |
| **A0-5** | — | L'information la plus importante est distinguée visuellement des autres. | Au moins un niveau de hiérarchie explicite (taille, poids ou position) sépare le bloc principal du reste. | Few — *« make the most important data stand out from the rest »* |
| **A0-6** | — | Aucun élément décoratif ne porte de charge visuelle sans fonction informative. | Zéro élément graphique sans donnée associée. Recoupé par `oracle-slop` (S1, S2, S10). | Few — *« avoid unnecessary and distracting decoration »* |
| **A0-7** | — | La page affiche la date des données et leur périmètre. | Présence d'une mention datée et d'un périmètre nommé. Binaire. | Interne — convention de nommage D-02/D-03 ; principe de traçabilité |
| **A0-8** | `Tant que` | Tant qu'un filtre est actif, la page indique qu'elle affiche un sous-ensemble. | Indicateur visuel sur la colonne filtrée + compteur « N lignes sur M ». Contrôlé par G5. | WCAG 4.1.3 · règle G5 du composant filtres |
| **A0-9** | `Quand` | Quand le contenu affiché change sans rechargement, le changement est annoncé aux technologies d'assistance. | Région `aria-live="polite"` ou `role="status"` mise à jour. Contrôlé par `oracle-a11y`. | W3C ARIA22 · WCAG 4.1.3 Status Messages |
| **A0-10** | `Lorsque` | Lorsque la page vise aussi le PDF, toute information portée par un effet JS ou un survol possède un équivalent statique. | Aucune donnée présente uniquement dans un tooltip ou un panneau JS. | Interne — `digit-ai-page-html`, cibles Viewer / PDF (WeasyPrint n'exécute pas le JS) |
| **A0-11** | `Si … alors` | Si une donnée attendue est absente, alors la page l'affiche explicitement comme absente. | Aucun bloc vide sans libellé. Une absence est une information, pas un trou. | Few — pièges de contexte manquant ; interne — `non_juge` déclaré |
| **A0-12** | — | Tout tableau de données en périmètre porte ses filtres de colonne. | Périmètre et contrôle : G1–G6 de `oracle-filtres-tableau` (≥ 8 lignes et ≥ 1 colonne catégorielle). | Interne — composant filtres, 08/08/2026 |

---

## Partie 1 bis — Lisibilité (socle, obligatoire)

S'ajoute à la Partie 1 pour **toute** page de restitution. Chaque exigence a un contrôle
mécanique — dans `check_html.py --regles L` pour ce qui se lit dans le code, dans
`render_page.py` pour ce qui ne se mesure qu'au rendu — et une fixture rouge dans `fixtures/`
du skill : une règle sans fixture rouge n'est pas un contrôle, c'est une déclaration
d'intention. État du socle 1.6.0 au 09/08/2026 : **26 cas, 22 rouges**, dont quatre mesurés au
rendu, chacun exigeant l'ensemble exact des règles attendues — ni moins, le contrôle serait
aveugle, ni plus, il serait bruyant.

| ID | Pattern | Exigence | Critère vérifiable | Source |
|---|---|---|---|---|
| **A0-13** | `Si … alors` | Si un texte doit être raccourci, alors il s'arrête à une frontière grammaticale ; il n'est jamais amputé — et une phrase interrompue par un élément de bloc est rendue entière, pas rafistolée. | `L1(a)` — zéro `…` en fin de nœud de texte hors élément `data-ellipse-ok`. `L1(b)` — aucun nœud de texte ne commence par `. , ; : ! ?` quand l'élément qui le précède est **de niveau bloc** selon le CSS de la page. Le niveau 1 d'une strate porte une unité de sens complète, le niveau 2 le texte intégral. | Défaut 1 du 09/08/2026 : « Sur deux des… », coupé au niveau 1 **et** au niveau 2. `L1(b)` : un point orphelin en tête de ligne après un badge stylé en bloc — rien n'est tronqué, tout est là, mal assemblé, et aucun contrôle de troncature ne le voit |
| **A0-14** | — | La page occupe la largeur disponible, et le texte occupe la largeur que la page lui donne. **La mesure de lecture est portée par le conteneur, jamais par le paragraphe.** | Trois contrôles. `L2` **statique** : aucun `max-width` en pixels durs < 1 100 px sur `body`, `main`, `.wrap`, `.container`, `.page`. `L2` **au rendu** (bloquant) : tout bloc de texte de ≥ 120 caractères, hors tableau et hors navigation, occupe ≥ **0,85** de la largeur réellement disponible aux viewports ≥ 1 100 px — mesure exacte, `max-width` retiré le temps d'une mesure. `L2` **gouttière** (bloquant) : dans une grille à deux pistes dont la seconde porte ≥ 120 caractères et la première une étiquette de ≤ 60, la piste d'étiquettes ne dépasse pas **20 %**. | Défaut 2 : 1 080 px en dur, 44 % de surface perdue en 1 920. **Correction de doctrine du 09/08** : la formulation antérieure (« deux largeurs : conteneur relatif, prose bornée ~75 ch ») a produit le défaut qu'elle prétendait éviter — conteneur à 1 245 px, paragraphes à 606 px, une moitié droite vide, contrôle statique au vert. Seuil de gouttière à 20 % et non 25 % : le défaut constaté mesurait 22 %, et un seuil posé au-dessus du défaut qui l'a motivé ne prouve rien |
| **A0-15** | — | Tout score affiché renvoie à un barème publié dans la page. | `L3(a)` — élément de classe `sc`/`score`/`note`/`jauge` ou au texte `N/M` : `aria-describedby` résolvant vers un élément de 20 caractères au moins — le barème. Un `title` ne suffit pas : il ne survit pas au PDF, ne s'atteint pas au doigt, et n'a pas la place d'énoncer cinq crans. | Défaut 3 : « maturité 1/5 » sans dire ce que valent 1 à 5 |
| **A0-16** | — | Toute autre valeur mise en avant porte une légende non vide. | `L3(b)` — `kpi`/`badge`/`pastille`/`pv`/`stat` : `title`, `aria-label`, `aria-describedby` résolu ou légende visible de 12 caractères au moins. Une légende **vide** est un échec, pas un avertissement : elle annonce une explication et n'en donne aucune. | Défaut 3 |
| **A0-17** | `Tant que` | Tant qu'une liste de données dépasse 8 lignes, elle offre filtre, tri et recherche. | `L4` — cf. A0-12 et G1–G6. Exemption par `data-filterable="off"` **et** `data-filterable-reason`. | Défaut 5 · composant filtres |
| **A0-18** | `Quand` | Quand une recherche surligne une occurrence, le surlignage reste inline et ne détache aucune partie de mot. | `L5` — aucune règle visant un `<mark>` de la page, **par son élément ou par une classe qu'il porte**, ne déclare padding horizontal, margin, ou `display` autre qu'inline. | Défaut 6 : la règle `display:flex` du conteneur de recherche s'appliquait au `<mark>` qui partageait sa classe — « clics » rendu « clic » puis « s » à la ligne |
| **A0-19** | — | Chaque entrée de sommaire annonce ce que le chapitre apporte, et son ancre résout. | `L6` — ancre `#id` existante + élément `.toc-d` de 12 caractères au moins par entrée. | Défaut 7 : sommaire de titres nus |
| **A0-20** | — | Chaque chapitre ouvre par ce qu'il apprend au lecteur. | `L7` — toute section cible du sommaire porte un `.ch-apprend` (ou `.ch-st`) de 40 caractères au moins, avant toute donnée. | Défaut 10 : chapitres ouvrant sur un tableau de 200 lignes |
| **A0-21** | — | Tout lien interne nomme sa destination. | `L8` — `<a href="#…">` hors sommaire : libellé de 8 caractères au moins, ou `title`/`aria-label` de 12. Ancre vide interdite. | Défaut 9 : commandes sans cible annoncée, fil perdu |
| **A0-22** | `Lorsque` | Lorsqu'un chapitre porte une table de 8 lignes ou plus, il donne un exemple de lecture d'une ligne. | `L10` — élément `.exemple-lecture` de 30 caractères au moins dans la section. | Défaut 10 : « ni macro ni mode d'emploi » |
| **A0-23** | `Si … alors` | Si une valeur n'est pas renseignée, alors la page l'omet ou la déclare en français ; elle n'affiche jamais le littéral du langage. | `L11` — aucune occurrence de `null`, `None`, `undefined`, `NaN`, `nil`, `[object Object]`, `{{var}}`, `${expr}` dans un nœud de texte visible. Exemptions : `code`/`pre`/`kbd`/`samp`, `data-litteral-ok`. | Lecture naïve du 09/08 : « Motif : null » affiché 22 fois. Ce n'est pas un défaut de mise en forme, c'est une valeur qui a traversé le producteur sans être traitée |
| **A0-24** | — | Toute colonne portant une valeur calculée publie son calcul. | `L3(c)` — en-tête `Score`, `Note`, `Indice`, `Priorité`, `Pondération`, `Classement`, `Criticité`, `Sévérité` : `aria-describedby` vers un bloc qui donne formule, amplitude et seuil de décision. | Lecture naïve : « je dois vous croire sur parole pour la seule colonne qui classe vos actions » |
| **A0-25** | — | Aucune valeur écrite pour une machine n'est affichée nue. | `L3(d)` — empreinte hexadécimale, jeton kebab-case de trois segments ou plus : `title`/`aria-label` de 12 caractères, barème lié, ou définition en place. Échappatoire `data-opaque-ok`. | Lecture naïve : empreinte de grille et régimes d'automatisation (`ia-assistee-validation-humaine`) affichés sans un mot |
| **A0-26** | `Si … alors` | Si une énumération dépasse trois éléments `clé — valeur`, alors elle devient un tableau ou une liste, surmontés d'une ligne qui dit ce qu'il faut y voir. | `L12` — trois segments ou plus de forme `clé — valeur` séparés par des points-virgules dans un même nœud de texte. Le tableau seul ne suffit pas : sans sa ligne de lecture, on a déplacé le problème sans le résoudre. | Lecture naïve : six couples « rubrique — pages, étendue en mots » enchaînés en une phrase ; verdict du lecteur : « on ne sait ni à quoi ça correspond, ni ce qui est bien ou pas bien, ni pourquoi » |

**Dépliants — un cas où la règle a grandi.** `L9` couvre désormais quatre défauts et non plus
un seul : `<details>` au corps vide ; `<details>` cachant moins de **200 caractères** utiles
hors `data-repli-ok` (sous ce volume, replier fabrique un obstacle et le lecteur qui ouvre se
sent trompé) ; `<summary>` de moins de 3 caractères ; `<summary>` d'au plus trois mots pleins
dont aucun ne **désigne** (« Voir plus » échoue, « Afficher la dette » passe). Ce qui reste à
la revue : qu'un libellé qui désigne dise aussi un **usage** — le verbe du lecteur, pas la
table des matières de ce qu'il va trouver.

**Ce que la lisibilité ne mécanise PAS** — à traiter en **revue de lecture**, par un humain
ou l'orchestrateur du run, et à **consigner** défaut par défaut : clarté du propos,
pertinence du blocage principal retenu, justesse des chapeaux (un chapeau générique passe
le contrôle et rate la règle), qualité des exemples de lecture, fil narratif d'une lecture
linéaire, fidélité des libellés de lien, justesse du barème, langue du lecteur. Un run qui
déclare « lisibilité OK » sans énumérer ce qui a été relu n'a pas fait de revue.

---

## Partie 2 — Spécialisation « dashboard de résultats d'exécution de tests »

S'ajoute au socle. Cas de preuve du dispositif.

| ID | Pattern | Exigence | Critère vérifiable | Source |
|---|---|---|---|---|
| **D-1** | — | Le dashboard affiche le statut global du dernier run. | Un état unique et lisible en tête de page. | Allure — vue *Test statuses* |
| **D-2** | — | Le dashboard affiche le taux de réussite et sa tendance sur les runs précédents. | Une valeur en % **et** une série temporelle. Le taux seul ne satisfait pas A0-2. | Allure *Status dynamics* · métrique *pass rate* |
| **D-3** | — | Le dashboard affiche la comparaison au run précédent : tests passés à l'échec et inversement. | Deux compteurs distincts, nouveaux échecs et réparations. | Allure — vue *Status transitions* |
| **D-4** | — | Le dashboard affiche la durée totale du run et son évolution. | Durée + delta vs run précédent. Seuil d'alerte : **+20 % semaine sur semaine**. | Allure *Durations* / *Duration dynamics* · seuil : guides de reporting QA |
| **D-5** | — | Le dashboard affiche la répartition des tests par statut. | Compteurs passés / échoués / ignorés dont la somme est égale au total affiché. Vérifiable par re-somme (`oracle-calculs`). | Allure — vue *Test statuses* |
| **D-6** | — | Le dashboard identifie les tests instables séparément des tests en échec. | Liste distincte. Un test dont le statut change sans changement de code est instable, pas en échec. Seuils : **2 % par test**, **5 % global** traité comme bloquant. | Allure — *Stability distribution*, détection par historique · seuils : guides de reporting QA |
| **D-7** | — | Chaque test en échec donne accès à son détail : message d'erreur et trace. | Depuis la liste, un accès au détail existe pour 100 % des échecs. | Allure — *test steps, attachments* · BrowserStack — traçabilité des défaillances |
| **D-8** | — | Le dashboard identifie les suites les plus lentes. | Classement décroissant des N suites par durée. | Allure — *Durations* · BrowserStack — identification des composants |
| **D-9** | `Si … alors` | Si le run est vide ou interrompu, alors le dashboard l'affiche comme tel et n'affiche aucun taux calculé. | Zéro division par zéro, zéro « 0 % » trompeur, un libellé d'état explicite. | Interne — cas limite du protocole de tests, L99 du 08/08/2026 |
| **D-10** | `Si … alors` | Si le taux de réussite passe sous le seuil déclaré, alors le dashboard le signale visuellement. | Seuil déclaré dans la page. Référence usuelle : **< 85 % sur la branche principale**. Un seuil non déclaré est un défaut. | Seuils : guides de reporting QA — à calibrer sur ton contexte |
| **D-11** | `Lorsque` | Lorsque le dashboard couvre plusieurs environnements ou versions, il permet de restreindre l'affichage à l'un d'eux. | Filtre par environnement / build, conforme à A0-12 et G1–G6. | BrowserStack — filtrage contextuel |

---

## Partie 3 — Candidats non retenus (« à valider », non normatifs)

Métriques rencontrées dans les sources mais **écartées du gabarit** : elles relèvent d'un
dashboard **QA d'équipe au long cours**, pas d'une restitution de run. Les inscrire comme
obligatoires produirait des blocs vides à chaque génération.

- Couverture de code · MTTR · défauts échappés en production · cycle time
- Pyramide de tests · carte des écarts de couverture · taux de réouverture de tickets

Elles restent disponibles si tu confirmes que la famille vise aussi le pilotage QA continu.

---

## Ce que ce gabarit ne juge pas

- La **pertinence métier** des seuils : 85 %, 2 %, 5 % et +20 % viennent de guides de
  reporting QA, pas de ton contexte. Ce sont des points de départ à calibrer, et le gabarit
  exige seulement que le seuil **soit déclaré dans la page** — pas qu'il vaille telle valeur.
- La **qualité rédactionnelle** du contenu (relève d'`oracle-judge`, avis outillé).
- Tout ce qui touche à la **forme** — délégué à `check_html.py` et `render_page.py`.
- Tout ce qui, en lisibilité, suppose de **lire** — délégué à la revue de lecture, jamais
  maquillé en contrôle vert (cf. Partie 1 bis).
- **Sa propre fraîcheur** : ce gabarit ne sait pas que le socle a bougé. C'est un run qui le
  constate, et une version comme celle-ci qui le répare.

---

## Sources

**Externes**
- [Stephen Few — Common Pitfalls in Dashboard Design (Perceptual Edge)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf) *(PDF binaire non extractible ; principes obtenus par sources secondaires concordantes — [UXmatters](https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php), [Perceptual Edge — Formatting and Layout Matter](https://www.perceptualedge.com/articles/Whitepapers/Formatting_and_Layout_Matter.pdf))*
- [W3C WAI — ARIA22 : Using role=status to present status messages](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22) *(primaire, fetchée — critère WCAG 4.1.3)*
- [Allure Report — Reading Allure charts](https://allurereport.org/docs/v3/read-charts/) *(primaire, fetchée)*
- [BrowserStack — Software Testing Dashboard guide](https://www.browserstack.com/guide/software-testing-dashboard) *(primaire, fetchée)*
- [Testomat — Test automation reporting](https://testomat.io/blog/test-automation-reporting/) · [TestDino — Flaky tests](https://testdino.com/blog/flaky-tests) *(secondaires — origine des seuils chiffrés)*

**Terrain** (09/08/2026) — les dix défauts constatés par un lecteur humain sur
`Digit-AI - Audit - SEO auxportesdelabaie.fr - 20260808g.html`, source de la Partie 1 bis,
complétée le même jour par une lecture naïve du livrable corrigé (A0-23 à A0-26). Chaque
exigence est rattachée au défaut qui l'a payée.

**Internes** (test d'existence : lues sur cette machine le 09/08/2026)
- `digit-ai-page-html` — **SKILL.md 1.6.0**, cibles Viewer/PDF, checklist V1–V7,
  `references/lisibilite.md` (**L1–L12**), `scripts/check_html.py`, `scripts/render_page.py`
  (V1/V2/V4 + L2 mesuré au rendu), `scripts/self_test.py` (**26 cas, 22 rouges**)
- `digit-ai-fiches-html` — `references/contenu.md`, règles éditoriales
- `redige-les-exigences` — `references/formulation.md`, grammaire et statut épistémique
- `quality-oracles` — registre 2.9.1, oracles claims / calculs / a11y / slop
- Étude P-10 du 08/08/2026 — patterns EARS transposés

*Type de document « Gabarit » — inscrit au registre des types de cette forge
([`registre-types.json`](registre-types.json), décision D-04), avec « Décisions »,
« Conception » et « Étude ».*
