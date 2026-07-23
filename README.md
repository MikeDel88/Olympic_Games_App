# Olympic Games Starter

Application Angular 18 affichant les statistiques olympiques : page d'accueil avec un camembert des médailles par pays, et page de détail par pays avec une courbe des médailles par édition des JO.

## Prérequis

- Node.js et npm (compatibles Angular 18, ex. Node ≥ 18.19).
- Angular CLI 18 (`@angular/cli`) est installé en devDependency : pas besoin d'installation globale pour utiliser les scripts `npm run`.

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm start
```

Lance `ng serve`. Naviguer vers `http://localhost:4200/`. L'application se recharge automatiquement à chaque modification des fichiers sources.

## Build

```bash
npm run build
```

Les artefacts de build sont générés dans `dist/olympic-games-starter`.

## Tests

```bash
npm test
```

Lance `ng test` (Karma/Jasmine).

## Lint

```bash
npm run lint
```

Lance ESLint (`angular-eslint`, configuration dans `eslint.config.js`).

## Structure du projet

- `core/` : accès aux données (`apis/`, `services/`, `utils/`) — logique métier et façade `DataService`.
- `models/` : types de domaine (`Olympic`, `Participation`).
- `pages/` : composants de route (`home`, `country`, `not-found`) — orchestrent la récupération des données.
- `shared/components/` : composants de présentation réutilisables (`header`, `header-infos`, `loader`, `medals-chart`, `country-chart`).
- `shared/accessibility/`, `shared/responsive/`, `shared/styles/` : contrats d'accessibilité, gestion du responsive (`BreakpointService`), styles partagés.

Pour le détail complet de l'arborescence et des règles de dépendance entre couches, voir [ARCHITECTURE.md](./ARCHITECTURE.md).

## Décisions techniques

- **Architecture en couches Core / Shared / Pages / Models**, avec un flux de dépendance à sens unique (pages → services → apis, jamais l'inverse) : facilite les tests et la maintenance, et prépare le branchement d'un vrai back-end sans toucher aux composants.
- **Façade `DataService`** devant `OlympicApi` : point d'entrée unique pour les données, qui isole les composants du transport HTTP.
- **Tri des pays par nombre de médailles dans `DataService` (US-01)** : l'US-01 du cahier des charges demande de "repérer les leaders" sur le graphique des totaux de médailles par pays. Pour répondre directement à ce besoin, `DataService.getOlympics()` trie les résultats via `sortByLeaders` (`core/utils/olympic.utils.ts`) — du pays ayant le plus de médailles au moins bien classé — avant de les exposer aux pages. Le tri est effectué dans la façade plutôt que dans `MedalsChartComponent` : le composant de présentation reçoit des données déjà ordonnées et n'a pas à connaître la règle de classement, ce qui garde le graphique simple et réutilisable.
- **Composants standalone + `inject()` + `input()` signals** : suit les pratiques Angular 18 recommandées, évite le `NgModule` de features.
- **Gestion explicite du loading/erreur** (`loader/`, messages d'erreur dans les pages) : le cahier des charges exigeait un retour utilisateur pendant le chargement et en cas de données absentes ou d'erreur réseau (un tableau vide affiche un message d'erreur sans redirection systématique vers `not-found`).
- **Accessibilité** : interface `AccessibilityChart` (aria-label dynamique, navigation clavier) implémentée par les composants graphiques, en réponse à l'absence initiale d'aria-label et de focus clavier.
- **Responsive mobile-first** via `BreakpointService` et des mixins SCSS, plutôt que des media queries dispersées, pour centraliser les points de rupture.
- **`@angular/cdk/layout` (`BreakpointObserver`) pour détecter le média courant** : `BreakpointService` (`shared/responsive/breakpoint.service.ts`) encapsule `BreakpointObserver.observe(...)` et l'expose comme un signal Angular (`isDesktop`, via `toSignal`). Plutôt que de réimplémenter une détection de media query en TypeScript (écoute de `window.matchMedia`/`resize`), le CDK fournit une API testée, réactive et alignée sur les breakpoints Material, avec une gestion propre de l'abonnement/désabonnement. Ce signal est consommé par `MedalsChartComponent` et `CountryChartComponent` pour ajuster dynamiquement l'`aspectRatio` des graphiques Chart.js (plus large en desktop, plus carré en mobile/tablette), un réglage que le CSS seul ne peut pas piloter puisque Chart.js dessine sur un `<canvas>`.
- **Typage strict** : suppression des `any` (modèles `Olympic`/`Participation`, DTOs de présentation colocalisés dans des sous-dossiers `interfaces/` pour les composants graphiques).
- **Fonctions utilitaires pures (`core/utils/olympic.utils.ts`) plutôt qu'une classe `OlympicUi`** : les transformations métier (totaux, tri, agrégations pour les graphiques) sont des fonctions pures sans état, appelées par `DataService` et par les pages. Une alternative aurait été de les encapsuler dans une classe dédiée (ex. `OlympicUi`) instanciée/castée à partir des données du `DataService`. Ce choix a été écarté pour l'instant : il ajouterait une couche de mapping/casting et un objet supplémentaire à maintenir, pour un gain limité au stade actuel du projet où des fonctions pures suffisent et restent simples à tester unitairement. Cette classe reste une évolution possible si la logique métier venait à se complexifier ou à porter un état.
- **Bar chart plutôt que pie chart pour le total de médailles par pays** (`MedalsChartComponent`) : avec le jeu de données actuel (5 pays), un camembert resterait lisible, mais un vrai jeu de données olympique compte beaucoup plus de pays participants. Passé un certain nombre de parts, un pie chart devient difficile à lire (segments trop fins, couleurs proches difficiles à distinguer), un problème amplifié sur mobile où l'espace disponible est réduit. Un bar chart horizontal reste lisible quel que soit le nombre de pays : chaque barre garde son label, la comparaison des longueurs est plus intuitive que celle des angles, et la liste peut défiler verticalement sans perdre en clarté. Ce choix anticipe donc la montée en charge du jeu de données réel plutôt que d'optimiser seulement pour les 5 pays du mock actuel.

---

*Généré initialement avec [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.*
