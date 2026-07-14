# Idlebound

Idlebound est un idle game fantasy jouable dans un navigateur. Ce dépôt contient le MVP Solo : un aventurier unique progresse automatiquement contre des monstres, débloque des zones, obtient de l'équipement, dépense des essences et conserve sa progression localement.

## Périmètre du MVP Solo

Inclus :

- combat automatique solo ;
- personnage niveau 1 avec statistiques, expérience et niveaux ;
- cinq zones avec monstres et boss ;
- déblocage de zones après victoire contre un boss ;
- or, essences, drops simples et équipements ;
- boutique, inventaire, équipement et améliorations ;
- sauvegarde locale automatique ;
- import/export JSON ;
- progression hors ligne estimée.

Exclu du MVP :

- authentification, comptes et base de données ;
- multijoueur, groupe, recrutement, classes, donjons de groupe ;
- gathering, craft avancé, guilde, raids ;
- économie compétitive ou serveur autoritaire complet.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- Vitest
- Zod

## Prérequis

- Node.js récent compatible avec Vite 8
- npm

## Installation

```bash
npm install
```

Aucune installation globale n'est requise.

## Variables d'environnement

Optionnelles :

```bash
PORT=3001
```

Le client Vite proxifie `/api` vers `http://localhost:3001`.

## Lancement

Front seul :

```bash
npm run dev:client
```

Back seul :

```bash
npm run dev:server
```

Développement complet :

```bash
npm run dev
```

Par défaut :

- client : `http://localhost:5173`
- serveur : `http://localhost:3001`

## Tests

```bash
npm test
```

Les tests couvrent les formules de combat, la puissance, l'expérience, les récompenses, l'équipement, la boutique, la sauvegarde, la progression hors ligne et le déblocage d'une zone après boss.

## Build Production

```bash
npm run build
```

Le build front est généré dans `dist/client`.

Build avec base GitHub Pages :

```bash
GITHUB_PAGES=true npm run build
```

Le workflow `.github/workflows/deploy-pages.yml` publie `dist/client` sur GitHub Pages après les tests. Une fois GitHub Pages activé en mode GitHub Actions dans les paramètres du dépôt, l'application sera accessible sur :

```text
https://kisukesaama.github.io/Idlebound/
```

## Structure

```text
client/
  src/
    components/       composants UI génériques
    features/         écrans fonctionnels du jeu
    store/            état global, reducer et moteur de tick
server/
  src/
    index.ts          API Express
shared/
  constants/          constantes d'équilibrage
  data/               zones, ennemis, objets, essences
  game/               formules et services purs
  types/              types partagés
docs/
  balancing.md        notes d'équilibrage du MVP
```

## API Express

Endpoints disponibles :

- `GET /api/health`
- `GET /api/game/config`
- `GET /api/zones`
- `GET /api/items`

Le combat est calculé côté client pour ce MVP Solo. Cette décision garde le projet simple tant qu'il n'y a ni multijoueur, ni comptes, ni économie compétitive. Une future version avec serveur autoritaire devra déplacer les calculs critiques côté serveur.

## Sauvegarde

La sauvegarde principale utilise `localStorage` avec un schéma versionné :

- version courante : `1`
- sauvegarde automatique toutes les 5 secondes ;
- sauvegarde au masquage ou à la fermeture de la page ;
- export JSON ;
- import JSON avec validation Zod ;
- sauvegarde de secours avant remplacement ;
- réinitialisation de partie.

Le contenu importé est parsé comme JSON et validé comme données. Aucun contenu importé n'est exécuté.

## Progression Hors Ligne

Au retour du joueur, le client compare la date de dernière activité avec l'heure courante. Les gains sont estimés selon :

- la zone sélectionnée ;
- les statistiques du joueur ;
- un temps moyen de victoire ;
- un taux de taux de réussite estimé ;
- une limite maximale de 8 heures.

La simulation ne rejoue pas chaque combat individuellement afin d'éviter les coûts inutiles et les abus simples.

## Limites Connues

- Équilibrage initial volontairement simple.
- Sauvegarde locale modifiable par l'utilisateur.
- Pas d'anti-triche avancé.
- Combat client non adapté à un futur mode compétitif sans refonte serveur.
- Assets visuels temporaires en CSS, sans images protégées.

## Prochaines Étapes Possibles

- Ajuster l'équilibrage après test utilisateur.
- Ajouter des animations plus riches.
- Ajouter une base de données et des comptes.
- Migrer les calculs critiques vers un serveur autoritaire.
- Ajouter plus de zones, objets et effets d'équipement.
