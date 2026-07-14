# Equilibrage Idlebound MVP Solo

## Principes

- Le joueur commence faible mais doit gagner ses premiers niveaux rapidement.
- Les zones alternent entre farming automatique et decision de tenter le boss.
- Les boss sont des murs de progression modérés, pas des blocages longs.
- Les essences donnent une progression permanente lente et cumulative.
- Les objets de boutique assurent une progression fiable ; les drops apportent des pics de puissance.

## Constantes Principales

Les valeurs centrales sont dans `shared/constants/balance.ts`.

- `BASE_PLAYER_STATS` : statistiques initiales.
- `LEVEL_UP_GAINS` : gain par niveau.
- `EXPERIENCE_BASE` et `EXPERIENCE_GROWTH` : courbe d'experience.
- `DAMAGE_VARIANCE` : variation controlee des degats.
- `INVENTORY_LIMIT` : limite d'inventaire.
- `UPGRADE_COST_BASE`, `UPGRADE_COST_GROWTH`, `UPGRADE_MAX_LEVEL` : amelioration d'equipement.
- `OFFLINE_MAX_SECONDS` : plafond de progression hors ligne.

## Degats

La formule est centralisee dans `shared/game/formulas.ts`.

```text
degats = max(1, attaque - defense) avec une variation controlee
```

La variation est limitee par `DAMAGE_VARIANCE` afin de garder les resultats lisibles.

## Experience

```text
xp requise = EXPERIENCE_BASE * EXPERIENCE_GROWTH^(niveau - 1)
```

Le passage de niveau restaure les points de vie et augmente les statistiques de base.

## Equipement

Chaque objet donne des bonus directs :

- attaque ;
- defense ;
- points de vie.

L'amelioration augmente progressivement la valeur d'un objet. Le cout augmente de facon exponentielle afin d'eviter qu'un seul objet bas niveau reste optimal trop longtemps.

## Essences

Les essences servent a acheter des bonus permanents :

- attaque ;
- defense ;
- points de vie ;
- gain d'experience ;
- gain d'or ;
- taux de drop.

Les couts augmentent par rang et chaque amelioration possede un rang maximum.

## Progression Hors Ligne

La progression hors ligne est une estimation :

1. Calcul du temps d'absence.
2. Application du plafond de 8 heures.
3. Evaluation de la zone selectionnee.
4. Estimation du temps moyen de victoire.
5. Estimation du taux de reussite.
6. Attribution de recompenses moyennes.

Cette approche est suffisante pour le MVP Solo mais devra etre revue si une economie persistante ou competitive est ajoutee.
