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
- Corriger le nommage des informations pour les KPIs.
  - Important pour la compréhension du site.
- Afficher le nombre d'athlètes par JO dans le LineChart.
  - Important pour la compréhension du site.
- Gérer le loading et les erreurs en appelant le not found.
  - C'est un défaut majeur lors de la visite sur le site.
- Améliorer l'accessibilités.
  - Important pour les visiteurs malvoyants 
  - améliorer le contraste et ajouter des aria-label.
- Performances et fuites de mémoire.
  - Important pour les utilisateurs avec des appareils moins puissants.
- Corriger le typage `any` dans les composants.
  - Important pour la maintenabilité du code et éviter des bugs potentiels.
- Faire le refactoring des composants pour extraire la logique et le template.
  - Important pour la maintenabilité du code.

