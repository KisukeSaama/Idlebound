# Idlebound

Idlebound est un idle game fantasy jouable dans un navigateur. Ce depot contient le MVP Solo : un aventurier unique progresse automatiquement contre des monstres, debloque des zones, obtient de l'equipement, depense des essences et conserve sa progression localement.

## Perimetre Du MVP Solo

Inclus :

- combat automatique solo ;
- personnage niveau 1 avec statistiques, experience et niveaux ;
- cinq zones avec monstres et boss ;
- deblocage de zones apres victoire contre un boss ;
- or, essences, drops simples et equipements ;
- boutique, inventaire, equipement et ameliorations ;
- sauvegarde locale automatique ;
- import/export JSON ;
- progression hors ligne estimee.

Exclu du MVP :

- authentification, comptes et base de donnees ;
- multijoueur, groupe, recrutement, classes, donjons de groupe ;
- gathering, craft avance, guilde, raids ;
- economie competitive ou serveur autoritaire complet.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- Vitest
- Zod

## Prerequis

- Node.js recent compatible avec Vite 8
- npm

## Installation

```bash
npm install
```

Aucune installation globale n'est requise.

## Variables D'environnement

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

Developpement complet :

```bash
npm run dev
```

Par defaut :

- client : `http://localhost:5173`
- serveur : `http://localhost:3001`

## Tests

```bash
npm test
```

Les tests couvrent les formules de combat, la puissance, l'experience, les recompenses, l'equipement, la boutique, la sauvegarde, la progression hors ligne et le deblocage d'une zone apres boss.

## Build Production

```bash
npm run build
```

Le build front est genere dans `dist/client`.

## Structure

```text
client/
  src/
    components/       composants UI generiques
    features/         ecrans fonctionnels du jeu
    store/            etat global, reducer et moteur de tick
server/
  src/
    index.ts          API Express
shared/
  constants/          constantes d'equilibrage
  data/               zones, ennemis, objets, essences
  game/               formules et services purs
  types/              types partages
docs/
  balancing.md        notes d'equilibrage du MVP
```

## API Express

Endpoints disponibles :

- `GET /api/health`
- `GET /api/game/config`
- `GET /api/zones`
- `GET /api/items`

Le combat est calcule cote client pour ce MVP Solo. Cette decision garde le projet simple tant qu'il n'y a ni multijoueur, ni comptes, ni economie competitive. Une future version avec serveur autoritaire devra deplacer les calculs critiques cote serveur.

## Sauvegarde

La sauvegarde principale utilise `localStorage` avec un schema versionne :

- version courante : `1`
- sauvegarde automatique toutes les 5 secondes ;
- sauvegarde au masquage ou a la fermeture de la page ;
- export JSON ;
- import JSON avec validation Zod ;
- sauvegarde de secours avant remplacement ;
- reinitialisation de partie.

Le contenu importe est parse comme JSON et valide comme donnees. Aucun contenu importe n'est execute.

## Progression Hors Ligne

Au retour du joueur, le client compare la date de derniere activite avec l'heure courante. Les gains sont estimes selon :

- la zone selectionnee ;
- les statistiques du joueur ;
- un temps moyen de victoire ;
- un taux de reussite estime ;
- une limite maximale de 8 heures.

La simulation ne rejoue pas chaque combat individuellement afin d'eviter les couts inutiles et les abus simples.

## Limites Connues

- Equilibrage initial volontairement simple.
- Sauvegarde locale modifiable par l'utilisateur.
- Pas d'anti-triche avance.
- Combat client non adapte a un futur mode competitif sans refonte serveur.
- Assets visuels temporaires en CSS, sans images protegees.

## Prochaines Etapes Possibles

- Ajuster l'equilibrage apres test utilisateur.
- Ajouter des animations plus riches.
- Ajouter une base de donnees et des comptes.
- Migrer les calculs critiques vers un serveur autoritaire.
- Ajouter plus de zones, objets et effets d'equipement.
