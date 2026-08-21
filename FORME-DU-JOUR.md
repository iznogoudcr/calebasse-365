# Calebasse 365 — protocole de la forme quotidienne

Tâche récurrente, distincte du motif du jour : **ajouter une forme géométrique
par jour à la réserve « Le fonds »**. Contrairement aux motifs, cette réserve
n'a pas de date de fin fixée — elle grandit tant qu'elle est alimentée.

## Repères

| | |
|---|---|
| Source | `index.html` — même fichier unique que les motifs |
| Contrôle | `node verify.mjs` — à passer avant tout commit |
| Registre | bloc délimité par `/* === FORMES:START` et `/* === FORMES:END` |
| Lancement | jour 1 = 21 août 2026, 58 formes publiées d'un coup ce jour-là |
| Mise en ligne | commit sur `main` → déploiement Netlify automatique |

## Procédure

1. **Lire le registre** dans `index.html` et relever le `day` de la dernière
   entrée du tableau `FORMES`.
2. **Composer une forme** — une seule par exécution, sauf rattrapage explicite.
   Chacune est un dessin distinct, jamais une variante d'une forme déjà publiée.
3. **Insérer** la nouvelle entrée juste avant `/* === FORMES:END`, avec une
   virgule après l'entrée précédente. Le registre est **append-only** : ne
   jamais modifier, réordonner ni supprimer une entrée déjà publiée.
4. **Vérifier** : `node verify.mjs` doit sortir sans erreur, puis charger la
   page pour confirmer que la carte s'affiche correctement dans « Le fonds »
   et que le compteur de pièces est à jour.
5. **Commiter et pousser** sur `main` : `Forme NNN — Nom de la forme`.

## Contraintes de dessin

- **Format** : `viewBox="0 0 100 100"`, toute la géométrie entre 0 et 100.
- **Pleine et fermée, sans exception.** Une forme est un ou plusieurs `<path>`
  refermés (`Z`), remplis par la couleur choisie par la personne qui copie.
  Jamais de `stroke`, jamais de fragment de tracé ouvert : le rendu ne propose
  plus de bascule contour/plein, donc un tracé mal fermé s'affiche cassé.
- **Une vraie forme, pas un logo.** Chaque pièce doit être reconnaissable et
  réutilisable telle quelle — flèche, bulle, écusson, engrenage, ruban,
  polygone, étoile... Pas de forme décorative sans usage identifiable.
- **Champs** : `day`, `name`, `family`, `inner`. Pas de `note`, pas de `mode` :
  la réserve n'a ni légende longue ni bascule de rendu.
- **Écriture** : SVG littéral en commandes absolues, figé une fois publié.
  Un polygone/étoile/anneau se calcule (trigonométrie, `evenodd` pour les
  trous), on ne le tape pas approximativement à la main.
- **Nommage** : toujours descriptif et en français (« Losange », « Bulle
  ronde »...). Jamais de nom emprunté à une tradition culturelle précise —
  ça, c'est réservé aux motifs, avec leurs propres règles de sourçage.

## Symboles Adinkra

Le second tableau, `ADINKRA`, n'est pas append-only : c'est un jeu fixe de
onze symboles reconstruits géométriquement, avec leur glose. On peut
retoucher un tracé existant pour l'améliorer (plus précis, plus fidèle), mais
on n'en ajoute pas au rythme quotidien et on ne change ni son nom ni sa glose
sans raison sourcée.

## Ce à quoi tu ne touches pas

L'identité visuelle est fixée : palette, polices, mise en page, sélecteur de
couleur. Ta seule écriture régulière dans `index.html` est l'ajout d'une
entrée à `FORMES`.
