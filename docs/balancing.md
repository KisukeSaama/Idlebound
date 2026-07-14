# Équilibrage Idlebound MVP Solo

## Principes

- Le joueur commence faible mais doit gagner ses premiers niveaux rapidement.
- Les zones alternent entre farming automatique et décision de tenter le boss.
- Les boss sont des murs de progression modérés, pas des blocages longs.
- Les essences donnent une progression permanente lente et cumulative.
- Les objets de boutique assurent une progression fiable ; les drops apportent des pics de puissance.

## Constantes Principales

Les valeurs centrales sont dans `shared/constants/balance.ts`.

- `BASE_PLAYER_STATS` : statistiques initiales.
- `LEVEL_UP_GAINS` : gain par niveau.
- `EXPERIENCE_BASE` et `EXPERIENCE_GROWTH` : courbe d'expérience.
- `DAMAGE_VARIANCE` : variation contrôlée des dégâts.
- `INVENTORY_LIMIT` : limite d'inventaire.
- `UPGRADE_COST_BASE`, `UPGRADE_COST_GROWTH`, `UPGRADE_MAX_LEVEL` : amélioration d'équipement.
- `OFFLINE_MAX_SECONDS` : plafond de progression hors ligne.

## Dégâts

La formule est centralisée dans `shared/game/formulas.ts`.

```text
dégâts = max(1, attaque - défense) avec une variation contrôlée
```

La variation est limitée par `DAMAGE_VARIANCE` afin de garder les résultats lisibles.

## Expérience

```text
xp requise = EXPERIENCE_BASE * EXPERIENCE_GROWTH^(niveau - 1)
```

Le passage de niveau restaure les points de vie et augmente les statistiques de base.

## Équipement

Chaque objet donne des bonus directs :

- attaque ;
- défense ;
- points de vie.

L'amélioration augmente progressivement la valeur d'un objet. Le coût augmente de façon exponentielle afin d'éviter qu'un seul objet bas niveau reste optimal trop longtemps.

## Essences

Les essences servent à acheter des bonus permanents :

- attaque ;
- défense ;
- points de vie ;
- gain d'expérience ;
- gain d'or ;
- taux de drop.

Les coûts augmentent par rang et chaque amélioration possède un rang maximum.

## Progression Hors Ligne

La progression hors ligne est une estimation :

1. Calcul du temps d'absence.
2. Application du plafond de 8 heures.
3. Évaluation de la zone sélectionnée.
4. Estimation du temps moyen de victoire.
5. Estimation du taux de réussite.
6. Attribution de récompenses moyennes.

Cette approche est suffisante pour le MVP Solo mais devra être revue si une économie persistante ou compétitive est ajoutée.
