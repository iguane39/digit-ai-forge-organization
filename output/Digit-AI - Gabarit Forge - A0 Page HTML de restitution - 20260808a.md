# Digit-AI — Gabarit Forge — A0 « Page HTML de restitution » — 20260808a

Gabarit de cadrage **A0** de la famille *page HTML de restitution* (fiches, dashboards,
cartographies, référentiels). Premier instancié du candidat `cadrage`, passé N1 le 08/08/2026.

**Ce que ce gabarit porte** : le **fond** — ce que la page doit contenir pour être utile.
**Ce qu'il ne porte pas** : la forme (charte, tokens, sémantique, print, rendu), déjà couverte
par `digit-ai-page-html` et contrôlée par `check_html.py` + `render_page.py` (V1–V7).

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

---

## Sources

**Externes**
- [Stephen Few — Common Pitfalls in Dashboard Design (Perceptual Edge)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf) *(PDF binaire non extractible ; principes obtenus par sources secondaires concordantes — [UXmatters](https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php), [Perceptual Edge — Formatting and Layout Matter](https://www.perceptualedge.com/articles/Whitepapers/Formatting_and_Layout_Matter.pdf))*
- [W3C WAI — ARIA22 : Using role=status to present status messages](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22) *(primaire, fetchée — critère WCAG 4.1.3)*
- [Allure Report — Reading Allure charts](https://allurereport.org/docs/v3/read-charts/) *(primaire, fetchée)*
- [BrowserStack — Software Testing Dashboard guide](https://www.browserstack.com/guide/software-testing-dashboard) *(primaire, fetchée)*
- [Testomat — Test automation reporting](https://testomat.io/blog/test-automation-reporting/) · [TestDino — Flaky tests](https://testdino.com/blog/flaky-tests) *(secondaires — origine des seuils chiffrés)*

**Internes** (test d'existence : lues sur cette machine le 08/08/2026)
- `digit-ai-page-html` — SKILL.md, cibles Viewer/PDF, checklist V1–V7
- `digit-ai-fiches-html` — `references/contenu.md`, règles éditoriales
- `redige-les-exigences` — `references/formulation.md`, grammaire et statut épistémique
- `quality-oracles` — registre 2.9.1, oracles claims / calculs / a11y / slop
- Étude P-10 du 08/08/2026 — patterns EARS transposés

*Type de document « Gabarit » — à ajouter au registre des types (décision D-04), avec
« Conception » et « Étude » signalés le même jour.*
