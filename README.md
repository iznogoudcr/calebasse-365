# Calebasse 365

Un motif textile inédit imprimé chaque jour pendant 365 jours,
du 19 août 2026 au 18 août 2027.

Chaque motif est une tuile SVG `100 × 100` à raccord invisible : une surface,
pas une icône. La page les rassemble sur une étoffe d'un an qui se tisse en
public — une case par jour, le vide compris dans le dessin.

## Le dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | La plateforme entière. Un seul fichier, aucune dépendance, aucun script tiers. |
| `MOTIF-DU-JOUR.md` | Le protocole que suit l'agent quotidien. |
| `netlify.toml` | Publication statique à la racine, sans étape de build. |

Le registre des motifs vit dans `index.html`, entre les marqueurs
`/* === MOTIFS:START` et `/* === MOTIFS:END`. Il est **append-only** :
un motif imprimé n'est jamais retouché.

## Développement

```bash
python3 -m http.server 8742
```

Puis http://localhost:8742 — il n'y a rien à compiler.
