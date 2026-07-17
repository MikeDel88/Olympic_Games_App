# Observations

## Fichiers volumineux et/ou inutiles

- `teleSport.png` dans les assets, non utilisé et 171 ko de poids.
  - Supprimer le fichier si non utilisé.
- Les composants sont volumineux.
  - Créer des composants enfants pour extraire la logique et le template.

## Code dupliqué ou inutile

- Les composants country et home partagent la propriété `olympicUrl`.
  - Mettre cette constante dans un fichier de configuration ou un service pour éviter la duplication.
- Duplication de la propriété `titlePage` dans les composants `HomeComponent` et `CountryComponent`.
  - Mettre cette information dans un composant dédié "HeaderComponent".
- Le composant country injecte un `Router` qu'il n'utilise pas.
  - Supprimer l'injection du `Router` si elle n'est pas nécessaire.
- Le composant `NotFoundComponent` utilise un constructeur vide.
  - Supprimer le constructeur vide si aucune logique n'est nécessaire.
- Duplication de constante pour le chargement des médailles (`medals`) entre `HomeComponent` et `CountryComponent`.
  - Centraliser la logique dans une classe model.
- Duplication du code couleur `#0b868f`.
  - Prévoir un fichier de constantes pour les couleurs.
- Duplication de la requête pour charger les données des pays dans `HomeComponent` et `CountryComponent`.
  - Prévoir un service pour centraliser la logique de récupération des données.

## Analyse par rapport au cahier des charges

- Le composant `HeaderComponent` est manquant.
- Pas de gestion du responsive (aucune media query ou flexbox utilisé).
- Pas de gestion du chargement des données (aucun loader ou spinner).
- Pas de gestion des erreurs ou de l'absence de données (on n'utilise pas la route `not-found`).
- Aucune gestion d'id invalide, qui devrait afficher un message d'erreur et un bouton back.
- La route `/country/:id` est en réalité `/country/:countryName`.
- Les models `Participants` et `Olympic` ne sont pas créés.
- Aucun service `DataService` créé pour gérer les appels API.
- On n'a aucun `aria-label` défini pour les éléments interactifs (boutons, liens, etc.) pour l'accessibilité.
- Aucune description textuelle pour les graphiques.
- L'analyse `ng lint` révèle plusieurs types `any` :
  - `CountryComponent` : 10
  - `HomeComponent` : 8
- Le fichier `README.md` n'est pas documenté avec « installation / structure / décisions ».
- Le fichier `ARCHITECTURE.md` est manquant.
- Le nommage des informations pour les KPIs qui n'est pas toujours approprié (exemple : `number of entries` pour le nombre de participation qui pourrait reprendre `Number of JOs`).
- Le LineChart de CountryComponent n'affiche que les médailles et pas le nombre d'athlètes par JO.
- Le Pie Chart ne correspond pas visuellement à la maquette.

## Composant NotFoundComponent

- Créé mais non utilisé.
- Le `routerLink` est mal configuré, `""` au lieu de `"/"`.

## Composant HomeComponent

- Trop de logique dans le `ngOnInit`.
  - Extraire la logique.
- Le chargement des données ne passe pas par un service.
  - Charger les données depuis un service.
- Le loading et les erreurs (aucune donnée ou erreur de chargement) ne sont pas gérés.
  - Gérer le loading et les erreurs.
- Présence de `console.log`.
  - Supprimer les `console.log`.
- Problème sur le `titlePage` (manque `Public`) si l'on veut respecter la convention du projet.
- La propriété `error` n'est pas utilisée, ni pour rediriger vers la page not-found ni pour afficher un message d'erreur.
- Le graphique PieChart surcharge le `HomeComponent`.
  - Le mettre dans un composant dédié.

## Composant CountryComponent

- Trop de logique dans le `ngOnInit`.
  - Extraire la logique.
- Le chargement des données ne passe pas par un service.
  - Charger les données depuis un service.
- Le loading et les erreurs (aucune donnée ou erreur de chargement) ne sont pas gérés.
  - Gérer le loading et les erreurs.
- La propriété `error` n'est pas utilisée, ni pour rediriger vers la page not-found ni pour afficher un message d'erreur.
- Le graphique LineChart surcharge le `CountryComponent`.
  - Le mettre dans un composant dédié.

## Optimisation des performances

- Les données sont rechargées à chaque navigation.
  - Prévoir un système de mise en cache dans le localStorage.
- Le traitement des données peut être amélioré.
- L'appel réseau utilise l'Observer Pattern avec un `subscribe` mais il n'y a aucun `unsubscribe`, ce qui peut provoquer des fuites de mémoire.
  - Dans ce cas précis, on aurait dû utiliser `takeUntilDestroyed` dans le `pipe()` RxJS, qui permet de gérer automatiquement la destruction des observables.

## Accessibilité

- La classe `.center` dans le CSS n'a pas un bon contraste entre le background et le texte (ratio 4.35:1).
- Aucun `aria-label` sur les liens `<a>` et les graphiques `<canvas>`.
  - Utiliser des `aria-label` pour améliorer l'accessibilité.

## Priorisation des tâches

- Supprimer les consoles.log.
  - Important pour la sécurité car les données et les erreurs sont facilement accessibles.
- Afficher le nombre d'athlètes par JO dans le LineChart.
  - Important pour la compréhension du site.
- Gérer le loading et les erreurs en appelant le not found.
  - C'est un défaut majeur lors de la visite sur le site.
- Améliorer l'accessibilités.
  - Important pour les visiteurs malvoyants 
  - améliorer le contraste et ajouter des aria-label.
- Performances et fuites de mémoire.
  - Important pour les utilisateurs avec des appareils moins puissants.
- Mettre en place le responsive design.
  - Important pour les utilisateurs sur mobile.
- Corriger le typage `any` dans les composants.
  - Important pour la maintenabilité du code et éviter des bugs potentiels.
- Faire le refactoring des composants pour extraire la logique et le template.
  - Important pour la maintenabilité du code.

# Architecture du projet — Olympic (Angular 18)

## Vue d'ensemble

Le projet suit une **architecture en couches** (layered architecture) organisée selon le pattern Angular **Core / Shared / Feature**. Chaque répertoire correspond à une responsabilité précise, et les dépendances circulent toujours dans un seul sens : de la couche présentation vers la couche données, puis vers le domaine — jamais l'inverse.

| Couche | Répertoires | Rôle |
|---|---|---|
| Présentation | `pages/`, `shared/components/` | Affichage et interaction utilisateur |
| Données / Accès | `core/` | Services, appels API, cache |
| Domaine | `models/` | Types et interfaces métier |

## Arborescence

```
src/
└── app/
    ├── pages/
    │   ├── country/
    │   │   ├── country.component.ts
    │   │   ├── country.component.html
    │   │   └── country.component.scss
    │   ├── home/
    │   │   ├── home.component.ts
    │   │   ├── home.component.html
    │   │   └── home.component.scss
    │   └── not-found/
    │       ├── not-found.component.ts
    │       ├── not-found.component.html
    │       └── not-found.component.scss
    ├── core/
    │   ├── services/
    │   │   └── data.service.ts
    │   ├── apis/
    │   │   └── olympic-api.api.ts
    │   ├─── caches/
    │   │   └── proxy-data.cache.ts
    │   └── utils/
    │       └── olympic.utils.ts
    ├── shared/
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
    │   │   ├── error/
    │   │   │   ├── error.component.ts
    │   │   │   ├── error.component.html
    │   │   │   └── error.component.scss
    │   │   ├── country-chart/
    │   │   │   ├── country-chart.component.ts
    │   │   │   ├── country-chart.component.html
    │   │   │   └── country-chart.component.scss
    │   │   └── medals-chart/
    │   │       ├── medals-chart.component.ts
    │   │       ├── medals-chart.component.html
    │   │       └── medals-chart.component.scss
    │   └── styles/
    │       ├── colors.style.scss
    │       └── breakpoints.style.scss
    └── models/
        ├── participant.model.ts
        └── olympic.model.ts

```

## Description des répertoires

### `pages/` — Composants de page (features)

Contient les **composants intelligents** (smart / container components), un sous-dossier par page routée de l'application :

- **`country/`** : page de détail d'un pays (statistiques olympiques d'un pays donné).
- **`home/`** : page d'accueil, vue d'ensemble des données olympiques.
- **`not-found/`** : page 404 affichée pour toute route inconnue.

Ces composants sont les seuls à orchestrer la logique de la page : ils injectent `DataService`, récupèrent les données, gèrent les états de chargement et d'erreur, et délèguent l'affichage aux composants de `shared/components/` via leurs inputs.

### `core/` — Cœur applicatif (singletons)

Contient les services transverses instanciés une seule fois pour toute l'application (`providedIn: 'root'`). Ce répertoire implémente la couche d'accès aux données en trois niveaux :

- **`apis/olympic-api.api.ts`** : l'accès brut à la source de données (requêtes HTTP). C'est le seul fichier qui connaît les URLs et le format des réponses réseau.
- **`caches/proxy-data.cache.ts`** : un **Proxy** placé devant l'API. Il intercepte les demandes de données et sert les résultats déjà connus sans refaire d'appel réseau ; sinon il délègue à l'API et mémorise la réponse.
- **`services/data.service.ts`** : la **Façade** exposée au reste de l'application. C'est le point d'entrée unique des composants pour obtenir des données ; il s'appuie sur le proxy de cache et expose des données typées avec les modèles du domaine.

Ce trio API → Cache (Proxy) → Service (Façade/Repository) garantit qu'aucun composant ne dépend directement du transport HTTP ni de la stratégie de cache.

### `shared/` — Éléments réutilisables

Contient tout ce qui est **partagé et sans logique métier** :

- **`components/`** : composants de présentation (dumb components), purement pilotés par leurs `input()` / `output()`. Ils n'injectent aucun service :
  - `header/` : en-tête de l'application.
  - `loader/` : indicateur de chargement.
  - `error/` : affichage d'un message d'erreur.
  - `charts/pie-chart/` : graphique en camembert, alimenté uniquement par ses inputs.
- **`styles/`** : styles partagés, importables par tous les composants :
  - `colors.style.scss` : palette de couleurs (variables SCSS).
  - `breakpoints.style.scss` : points de rupture responsive et mixins associés.

#### Stratégie responsive

Le responsive (mobile / tablette / ordinateur) est géré en **mobile-first** dans le fichier `.scss` de chaque composant — il n'y a pas de fichier de style séparé par type d'écran. Les breakpoints sont définis une seule fois dans `breakpoints.style.scss` et consommés via des mixins :

```scss
// shared/styles/breakpoints.style.scss
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;

@mixin tablet {
  @media (min-width: $breakpoint-tablet) { @content; }
}

@mixin desktop {
  @media (min-width: $breakpoint-desktop) { @content; }
}
```

```scss
// Exemple d'utilisation dans un composant
@use 'shared/styles/breakpoints.style' as bp;

.dashboard {
  flex-direction: column;      // mobile : base

  @include bp.tablet {
    flex-direction: row;       // tablette et plus
  }
}
```

Cas particuliers :

- Si la **structure** d'une page change selon l'écran (composants différents affichés), utiliser `BreakpointObserver` de `@angular/cdk/layout` côté TypeScript plutôt que de masquer des blocs en CSS.
- Pour les composants réutilisables de `shared/components/` (ex. `pie-chart`), privilégier les **container queries** (`@container`) : le composant s'adapte à son conteneur et reste autonome.

### `models/` — Domaine

Définit les **types métier** de l'application, sans aucune dépendance :

- **`olympic.model.ts`** : modèle représentant les données olympiques d'un pays.
- **`participant.model.ts`** : modèle représentant une participation (édition, médailles, athlètes...).

Ces modèles sont utilisés par toutes les couches pour typer les données de bout en bout.

## Règles de dépendance

Ces règles font de la structure une véritable architecture en couches. Elles doivent être respectées dans le code :

1. **`pages/` ne parle qu'à `data.service.ts`.** Jamais d'injection directe de `olympic-api.api.ts` ni de `proxy-data.cache.ts` dans un composant.
2. **`shared/components/` ne dépend que de `models/`.** Aucun service injecté : les données arrivent par les inputs, les événements repartent par les outputs.
3. **`core/` ne dépend jamais de `pages/` ni de `shared/`.** Le flux de dépendances descend : présentation → données → domaine.
4. **`models/` ne dépend de rien.** Types purs, importables partout.

```
pages ──────────► core/services ──► core/caches ──► core/apis
  │                     │
  ▼                     ▼
shared/components ──► models ◄──────────────────────────┘
```

## Conventions

- **Dossiers et fichiers en kebab-case** (`pie-chart.component.ts`, `olympic-api.api.ts`) ; classes en PascalCase (`PieChartComponent`, `OlympicApiService`).
- **Suffixes explicites** indiquant le rôle du fichier : `.component`, `.service`, `.api`, `.cache`, `.model`, `.style`.
- **Composants standalone** (Angular 18) : pas de NgModule, imports déclarés directement dans le décorateur du composant.
- **Extension possible** : `shared/` pourra accueillir `pipes/` et `directives/` ; `core/` pourra accueillir `guards/` et `interceptors/` sans casser la structure.
