# Calebasse 365 — protocole du motif quotidien

Tâche récurrente : **imprimer un motif par jour, du 19 août 2026 au 18 août 2027.**

Une exécution = les motifs manquants jusqu'à aujourd'hui inclus. Le déploiement
est automatique : un commit poussé sur `main` met la plateforme en ligne.

## Repères

| | |
|---|---|
| Source | `index.html` — fichier unique, autonome, à la racine du dépôt |
| Contrôle | `node verify.mjs` — à passer avant tout commit |
| Registre | bloc délimité par `/* === MOTIFS:START` et `/* === MOTIFS:END` |
| Jour 1 | 19 août 2026 · Jour 365 : 18 août 2027 |
| Mise en ligne | commit sur `main` → déploiement Netlify automatique |

## Procédure

1. **Situer la date.** Relever la date du jour (`date -u +%F`) et calculer
   `jourAttendu = 1 + (aujourd'hui − 2026-08-19) en jours`.
   Si `jourAttendu > 365`, ne rien faire : la pièce est terminée.
2. **Lire le registre** dans `index.html` et relever le `day` du dernier objet
   du tableau `MOTIFS`.
   - Si `dernier.day >= jourAttendu` : le travail du jour est fait, s'arrêter
     sans rien modifier et sans commit.
   - Sinon, produire **tous** les motifs de `dernier.day + 1` à `jourAttendu`.
     Chacun est un dessin distinct, jamais une variante du précédent.
3. **Composer** chaque motif selon les contraintes ci-dessous.
4. **Insérer** les nouvelles entrées juste avant la ligne `/* === MOTIFS:END`,
   en ajoutant une virgule après l'entrée précédente. Le registre est
   **append-only** : ne jamais modifier, réordonner ni supprimer une entrée
   déjà publiée.
5. **Vérifier** avant de commiter, dans cet ordre :
   - `node verify.mjs` — structure du registre, numérotation, unicité du nom
     et du tracé, tuile dans ses bornes. **Sortie non nulle = ne pas commiter.**
   - `python3 -m http.server 8742` puis charger la page : aucune erreur console,
     le compteur affiche le bon nombre de motifs imprimés.
   - Regarder l'étoffe du héros et la bande qui la suit : le dessin doit se
     poursuivre d'une tuile à l'autre sans rupture. C'est le seul contrôle que
     la machine ne fait pas à ta place.
6. **Commiter et pousser** sur `main`, un commit par exécution :
   `Motif 007 — Nom du motif` (ou `Motifs 007-009 — rattrapage` si plusieurs).
   Le déploiement suit tout seul.

## Contraintes de dessin

- **Format** : tuile `viewBox="0 0 100 100"`. Toute la géométrie reste entre
  0 et 100 — rien ne dépasse.
- **Raccord** : le rendu dessine la tuile *et ses huit voisines* dans le
  `<pattern>`, donc les débords rognés d'un côté sont fournis par la copie
  d'en face — l'épaisseur des traits au raccord est correcte par construction.
  Il reste une seule règle de dessin, celle de la continuité : ce qui sort par
  un bord doit rentrer par le bord opposé **à la même coordonnée**. Un trait
  qui quitte la tuile en `(100, 40)` a besoin de son entrée en `(0, 40)`.
- **Terminaisons** : `cap:'butt'` par défaut. Deux extrémités qui se rejoignent
  au raccord ne se raccordent proprement que si elles sont colinéaires — faire
  traverser un zigzag au milieu d'une pente, jamais sur un sommet.
- **Nature** : une surface, pas une icône. Le motif doit tenir en fond de plan,
  en textile, en décor animé.
- **Écriture** : SVG littéral dans le champ `inner`, figé une fois publié.
  Pas de fonction génératrice — un motif imprimé ne bouge plus.
- **Champs** : `day`, `name`, `family`, `note`, `mode` (`'stroke'` ou `'fill'`),
  `weight`, `cap` (optionnel, `'butt'` par défaut), `inner`.
- **Variété** : ne pas reprendre la famille de la veille, ni un tracé déjà
  publié. Familles ouvertes — Registres, Trames, Tissages, Damiers, Vagues,
  Écailles, Treillis, Semis, Chevrons, Spirales, Cercles, Grains.
- **Note** : deux à quatre phrases. Ce qui est dessiné, d'où ça vient, ce que
  la répétition produit. Pas de remplissage lyrique.

## Lignée culturelle — règle stricte

Le vocabulaire puise dans les traditions graphiques ouest-africaines : registres
adinkra, trames bogolan, structures kente, scarifications, wax.

- Un motif **inventé** porte un nom descriptif en français. Il ne prend jamais
  un nom akan, bambara ou autre pour faire couleur locale.
- Un motif **traditionnel** garde son nom d'origine, avec sa source citée dans
  la note, et n'est publié que si le tracé est vérifiable. Dans le doute :
  inventer et nommer en français.
- Ne jamais attribuer un sens ou un proverbe à un motif inventé.

## Ce à quoi tu ne touches pas

L'identité visuelle est fixée : palette, polices, logotype, mise en page. Ta
seule écriture dans `index.html` est l'ajout d'une entrée au tableau `MOTIFS`.
Ne modifie ni le CSS, ni le balisage, ni les fichiers de `fonts/`. Si un motif
te semble mal rendu, c'est le motif qu'il faut corriger, pas la feuille de style.

## Fin de série

Au jour 365 (18 août 2027), pousser le dernier motif, puis signaler que la
routine peut être supprimée. Passé cette date, ne rien ajouter.
