# Répertoire des articles de blog (Français)

**Note importante** : Ce répertoire n'est pas utilisé pour créer des articles de blog.

## Comment fonctionne le système de blog

- **Articles en anglais uniquement** : Tous les articles de blog sont créés dans `/public/en/blog/`
- **Page de liste française** : La page française (`/fr/blog.html`) affiche les titres et extraits en français depuis le fichier JSON, mais tous les liens pointent vers les versions anglaises
- **Pas besoin de créer des articles français** : Vous n'avez pas besoin de créer des versions françaises des articles de blog

## Pour ajouter un nouvel article de blog

Voir les instructions dans `/public/en/blog/README.md`

Les étapes sont :
1. Ajouter l'entrée dans `/public/data/blogs.json` (avec les titres et extraits en anglais ET français)
2. Créer le fichier HTML dans `/public/en/blog/`
3. C'est tout ! L'article apparaîtra automatiquement sur les deux pages de liste (anglaise et française)

## Pourquoi cette approche ?

- Simplifie la maintenance : un seul article à maintenir
- Les visiteurs français voient les titres et descriptions en français
- Tous les articles pointent vers la version anglaise complète
- Réduit la duplication de contenu
