# Architecture du projet — Olympic Games (Angular)

## Vue d'ensemble

Le projet suit une **architecture en couches** organisée selon le pattern Angular **Core / Shared / Pages / Models**. 
Chaque répertoire correspond à une responsabilité précise, et les dépendances circulent toujours dans un seul sens : de la couche présentation vers la couche d'accès aux données, puis vers le domaine — jamais l'inverse.

| Couche | Répertoires | Rôle |
|---|---|---|
| Présentation | `pages/`, `shared/components/` | Affichage et interaction utilisateur |
| Données / Accès | `core/` | Service de données, appels API, transformation |
| Domaine | `models/` | Types et interfaces métier |

## Arborescence

```
src/
└── app/
    ├── core/
    │   ├── apis/
    │   │   └── olympic-api.api.ts
    │   ├── services/
    │   │   └── data.service.ts
    │   └── utils/
    │       └── olympic.utils.ts
    ├── models/
    │   ├── olympic/
    │   │   └── olympic.model.ts
    │   └── participation/
    │       └── participation.model.ts
    ├── pages/
    │   ├── home/
    │   │   ├── home.component.ts
    │   │   ├── home.component.html
    │   │   └── home.component.scss
    │   ├── country/
    │   │   ├── country.component.ts
    │   │   ├── country.component.html
    │   │   └── country.component.scss
    │   └── not-found/
    │       ├── not-found.component.ts
    │       ├── not-found.component.html
    │       └── not-found.component.scss
    ├── shared/
    │   ├── accessibility/
    │   │   └── accessibility-chart.interface.ts
    │   ├── components/
    │   │   ├── header/
    │   │   │   ├── header.component.ts
    │   │   │   ├── header.component.html
    │   │   │   └── header.component.scss
    │   │   ├── header-infos/
    │   │   │   ├── header-infos.component.ts
    │   │   │   ├── header-infos.component.html
    │   │   │   └── header-infos.component.scss
    │   │   ├── loader/
    │   │   │   ├── loader.component.ts
    │   │   │   ├── loader.component.html
    │   │   │   └── loader.component.scss
    │   │   ├── medals-chart/
    │   │   │   ├── medals-chart.component.ts
    │   │   │   ├── medals-chart.component.html
    │   │   │   └── medals-chart.component.scss
    │   │   └── country-chart/
    │   │       ├── country-chart.component.ts
    │   │       ├── country-chart.component.html
    │   │       └── country-chart.component.scss
    │   └── styles/
    │       ├── breakpoint.style.scss
    │       ├── colors.style.scss
    │       ├── colors-chart.style.ts
    │       └── grid.style.scss
    ├── app.component.ts
    ├── app.module.ts
    └── app-routing.module.ts
```

## Les composants et leurs rôles

### `pages/` — Composants de page (smart components)

Contient les **composants intelligents** (smart / container components), un sous-dossier par page routée de l'application :

- **`HomeComponent`** (route `''`) : page d'accueil, vue d'ensemble des données olympiques. Affiche le nombre de JO et de pays participants, ainsi qu'un graphique en camembert (`MedalsChartComponent`) du total de médailles par pays.
- **`CountryComponent`** (route `country/:id`) : page de détail d'un pays. Affiche le nombre de participations, de médailles et d'athlètes, ainsi qu'un graphique en ligne (`CountryChartComponent`) des médailles par édition des JO.
- **`NotFoundComponent`** (routes `not-found` et `**`) : page 404 affichée pour toute route inconnue.

Ces composants sont les seuls à orchestrer la logique de la page : ils injectent `DataService`, récupèrent les données (avec `takeUntilDestroyed` pour éviter les fuites de mémoire), les transforment via les fonctions pures de `core/utils/olympic.utils.ts`, puis délèguent l'affichage aux composants de `shared/components/` via leurs inputs.

### `shared/components/` — Composants réutilisables (dumb components)

Contient les **composants de présentation**, purement pilotés par leurs `input()` (signals). Ils n'injectent aucun service de données :

- **`HeaderComponent`** : en-tête de page, affiche le titre et une liste de KPIs via `HeaderInfosComponent`.
- **`HeaderInfosComponent`** : affiche un KPI (`label` + `count`), défini par le type `HeaderInfos`.
- **`MedalsChartComponent`** : graphique en camembert (Chart.js) du total de médailles par pays. Un clic sur une part navigue vers `country/:id` (seule exception à la règle : ce composant injecte le `Router` pour cette navigation).
- **`CountryChartComponent`** : graphique en ligne (Chart.js) du nombre de médailles par édition des JO pour un pays.

### `shared/accessibility/` — Contrats d'accessibilité

Regroupe les artefacts liés à l'**accessibilité** de la couche présentation. Le dossier est nommé par domaine (le *quoi*), le suffixe du fichier indique le rôle technique (le *comment*) :

- **`accessibility-chart.interface.ts`** : interface `AccessibilityChart`, contrat de comportement que doivent respecter les composants graphiques `<canvas>` (Chart.js) pour être accessibles : index actif (`activeIndex`), aria-label dynamique (`ariaLabel`), navigation clavier (`onKeydown`, `setActiveSlice`, `onClearActiveSlice`). Implémentée par `MedalsChartComponent` (et à terme `CountryChartComponent`).

Ce dossier n'est pas dans `models/` car ses interfaces dépendent d'Angular (`Signal`, `WritableSignal`) et décrivent un comportement d'UI, pas un type métier. Il pourra accueillir d'autres artefacts d'accessibilité (directives de focus, utilitaires aria, ...).

### `models/` — Domaine

Définit les **types métier** de l'application, sans aucune dépendance :

- **`olympic.model.ts`** : interface `Olympic` (id, pays, participations) et type `Olympics` (tableau d'`Olympic`).
- **`participation.model.ts`** : modèle représentant une participation à une édition des JO (année, ville, médailles, athlètes).

Ces modèles sont utilisés par toutes les couches pour typer les données de bout en bout.

## Le service Angular et son rôle

### `DataService` (`core/services/data.service.ts`)

`DataService` est la **façade** exposée au reste de l'application (`providedIn: 'root'`, singleton). C'est le **point d'entrée unique** des composants de page pour obtenir des données :

- `getOlympics(): Observable<Olympics>` : l'ensemble des données olympiques (page d'accueil).
- `getOlympic(countryId: number): Observable<Olympic | undefined>` : les données d'un pays (page de détail).

Il s'appuie sur deux collaborateurs de la couche `core/` :

- **`OlympicApi` (`core/apis/olympic-api.api.ts`)** : l'accès brut à la source de données via `HttpClient`. C'est le **seul fichier qui connaît l'URL** (`./assets/mock/olympic.json`) et le transport HTTP.
- **`olympic.utils.ts` (`core/utils/`)** : fonctions pures de transformation des données (`getTotalJOs`, `getCountries`, `sumOfAllMedalsYears`, `getTotalMedals`, `getTotalAthletes`, `getYears`, ...), utilisées par les pages pour préparer les données destinées aux graphiques et aux KPIs.

Ce découpage Composant → Service (façade) → API garantit qu'aucun composant ne dépend directement du transport HTTP ni de la source de données.

## Règles de dépendance

Ces règles font de la structure une véritable architecture en couches. Elles doivent être respectées dans le code :

1. **`pages/` ne parle qu'à `data.service.ts`.** Jamais d'injection directe de `olympic-api.api.ts` dans un composant.
2. **`shared/components/` ne dépend que de `models/`.** Aucun service de données injecté : les données arrivent par les inputs.
3. **`core/` ne dépend jamais de `pages/` ni de `shared/`.** Le flux de dépendances descend : présentation → données → domaine.
4. **`models/` ne dépend de rien.** Types purs, importables partout.

```
pages ──────────► core/services ──► core/apis
  │                     │
  ▼                     ▼
shared/components ──► models ◄──────┘
```

## Préparation à une future connexion back-end/API

Cette architecture est conçue pour brancher un vrai back-end sans refonte :

- **Un seul point de contact avec la source de données** : `OlympicApi` est la seule classe qui connaît l'URL et `HttpClient`. Aujourd'hui elle pointe vers le mock `./assets/mock/olympic.json` ; connecter une API REST revient à remplacer cette URL par celle du back-end (idéalement via les fichiers `environments/`), **sans toucher ni au `DataService` ni aux composants**.
- **Un contrat de données typé** : les modèles `Olympic` et `Participation` définissent le format attendu des réponses de l'API. Tant que le back-end respecte ce contrat, aucune autre couche n'est impactée ; sinon, seule la couche `core/apis/` devra adapter (mapper) les réponses.
- **Des extensions possibles sans casser la structure** :
  - une couche de **cache** (`core/caches/`) en proxy devant l'API, pour éviter de recharger les données à chaque navigation ;
  - des **intercepteurs** HTTP (authentification, gestion globale des erreurs) et des **guards** dans `core/` ;
  - des composants `loader/` et `error/` dans `shared/components/` pour matérialiser les états de chargement et d'erreur des appels réseau.

## Conventions

- **Dossiers et fichiers en kebab-case** (`medals-chart.component.ts`, `olympic-api.api.ts`) ; classes en PascalCase (`MedalsChartComponent`, `OlympicApi`).
- **Suffixes explicites** indiquant le rôle du fichier : `.component`, `.service`, `.api`, `.model`, `.utils`, `.interface`.
- **Composants standalone** : les pages et les composants partagés déclarent leurs imports directement dans le décorateur du composant ; le `NgModule` racine (`app.module.ts`) ne sert qu'au bootstrap et au routing.
- **Réactivité moderne** : `inject()` pour l'injection de dépendances, `input()` signals pour les entrées des composants, `takeUntilDestroyed` pour le nettoyage des abonnements RxJS.
