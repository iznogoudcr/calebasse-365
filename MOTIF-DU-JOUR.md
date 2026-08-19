# Calebasse 365 — protocole du motif quotidien

Tâche récurrente : **imprimer un motif par jour, du 19 août 2026 au 18 août 2027.**

## Où

| | |
|---|---|
| Source | `calebasse/index.html` (fichier unique, autonome) |
| Artifact | https://claude.ai/code/artifact/05df6cef-3986-4c45-b1f2-6af1b2cead1d |
| Registre | bloc délimité par `/* === MOTIFS:START` et `/* === MOTIFS:END` |
| Jour 1 | 19 août 2026 |

## Procédure (une exécution = un jour)

1. **Lire** `calebasse/index.html` et repérer le dernier objet du tableau `MOTIFS`.
   Le numéro du jour à produire = `dernier.day + 1`.
   Vérifier la date : jour N ↔ 19 août 2026 + (N−1) jours. Si le motif du jour existe
   déjà, **ne rien faire** et s'arrêter — jamais deux entrées pour la même journée.
2. **Composer** le motif (voir contraintes ci-dessous).
3. **Insérer** la nouvelle entrée juste avant la ligne `/* === MOTIFS:END`,
   en ajoutant une virgule après l'entrée précédente. Ne jamais modifier
   ni régénérer une entrée déjà publiée : le registre est append-only.
4. **Vérifier** le rendu (serveur local + capture) : la tuile doit se raccorder
   sans couture visible dans la bande répétée.
5. **Republier** l'artifact avec le paramètre `url` ci-dessus pour conserver
   la même adresse, et le label `calebasse-365-jour-NNN`.

## Contraintes de dessin

- **Format** : tuile `viewBox="0 0 100 100"`, raccord invisible sur les quatre bords.
  Tout élément qui coupe un bord doit être répété à l'identique sur le bord opposé
  (un tracé qui touche `x=0` à la hauteur `y` doit toucher `x=100` à la même hauteur).
- **Nature** : une surface, pas une icône. Le motif doit tenir en fond de plan,
  en textile, en décor animé.
- **Écriture** : SVG littéral dans le champ `inner`, figé une fois publié.
  Pas de fonction génératrice — un motif imprimé ne bouge plus.
- **Champs** : `day`, `name`, `family`, `note`, `mode` (`'stroke'` ou `'fill'`),
  `weight`, `inner`.
- **Variété** : ne pas répéter la famille de la veille. Familles ouvertes —
  Registres, Trames, Tissages, Damiers, Vagues, Écailles, Treillis, Semis,
  Chevrons, Spirales, Cercles, Grains.
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

## Arrêt

Au jour 365 (18 août 2027), publier le dernier motif puis supprimer la tâche
planifiée. Passé cette date, ne rien ajouter.
