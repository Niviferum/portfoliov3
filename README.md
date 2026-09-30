# Portfolio — Adrien Derrey

## Démarrer

```bash
npm install
npm run dev        # serveur de développement
npm run build      # export statique dans out/ + génération de out/_headers
npm run preview    # sert out/ tel quel, pour vérifier le rendu de production
npm start          # idem sur $PORT (3000 par défaut) : commande de production
npm run lint
npm run typecheck
```

## Architecture

```
src/
  app/            layout (métadonnées, polices), page unique, icône
  components/     un dossier par bloc, TSX + module CSS à côté
  lib/i18n/       dictionnaires FR/EN, magasin de langue, contexte React
  lib/profile.ts  contacts et ressources externes
  lib/operations.ts  registre des opérations (codes, noms)
  lib/stack.ts    modules installés et renvois vers les opérations
  styles/         tokens.css (jetons de design), shapes.css (découpes)
scripts/          génération des en-têtes HTTP après build
```

### Export statique

`output: 'export'` (`next.config.ts`) : `next build` produit `out/`, servable
par n'importe quel serveur de fichiers. Trois conséquences structurantes :

- **Pas d'i18n Next.** Le routage i18n et les middlewares supposent un serveur.
  La langue est donc résolue côté client — `localStorage`, sinon
  `navigator.languages`, sinon le français. Le HTML généré est en français :
  c'est lui que voient les moteurs d'indexation et les aperçus de liens.
- **`<html lang>` est figé au build.** Il est réaffecté impérativement à chaque
  changement de langue (`LocaleProvider`).
- **`headers()` dans `next.config` n'a aucun effet.** Voir plus bas.

### Signature `shape()`

La règle de construction est dans [`src/styles/shapes.css`](./src/styles/shapes.css) :

1. la variante `polygon()` est écrite en base, elle est le repli universel ;
2. la variante `shape()` est ajoutée sous
   `@supports (clip-path: shape(from 0 0, line to 0 0))`, avec **la même
   séquence de commandes entre tous les états** — c'est la condition de
   l'interpolation ;
3. l'animation porte sur une variable typée par `@property` (`--cut`,
   `--seam`), jamais sur `clip-path` lui-même : la forme est recalculée à
   chaque image et les deux transitions ne se chevauchent pas.

Un liseré ne peut pas être dessiné par `border` ni `box-shadow: inset` sur une
plaque chanfreinée : `clip-path` les rogne justement sur les arêtes coupées. On
empile donc deux plaques, `.plate` pour la couleur du trait et `.plate-fill`
décalée d'1px pour le remplissage.

### Accessibilité

- L'écran d'accès est superposé au contenu, il n'en conditionne jamais le
  rendu : le document complet est déjà dans le DOM en dessous.
- Il est `aria-hidden` et hors de l'ordre de tabulation. Le bouton « Passer »
  porte `tabindex="-1"` : au clavier, n'importe quelle touche ferme la séquence.
- `prefers-reduced-motion: reduce` supprime la séquence, en CSS, donc avant même
  que JavaScript ne s'exécute.
- Éléments décoratifs (codes de référence, tampon, lignes de balayage) :
  `aria-hidden`.

### Déploiement (Railway)

Railway construit avec `npm run build` puis lance `npm start` : `serve` sert
`out/` sur le port donné par la variable `PORT`.

1. Service créé depuis le dépôt GitHub, variable `PORT=3000`.
2. *Settings > Networking > Custom Domain* : saisir le domaine, port cible
   `3000`, puis créer chez le registraire l'enregistrement DNS indiqué par
   Railway.
3. Reporter le domaine dans `PROFILE.siteUrl` (`src/lib/profile.ts`) : il sert
   aux URL canoniques et aux aperçus de liens.

### En-têtes HTTP

Sans serveur, les en-têtes relèvent de l'hébergeur.
[`scripts/build-headers.mjs`](./scripts/build-headers.mjs) écrit après chaque
build `out/_headers` (format Netlify / Cloudflare Pages) et `out/serve.json`,
lu par `serve` en production. Ce dernier porte une CSP unique qui réunit les
empreintes de toutes les pages.

Next émet deux scripts inline par page (la charge utile RSC) et aucun `nonce`
n'est possible sans serveur : le script calcule leur empreinte SHA-256 à chaque
build, ce qui permet une CSP **sans `script-src 'unsafe-inline'`**. Corollaire :
**l'hébergeur ne doit ni réécrire ni minifier le HTML servi**, sinon les
empreintes ne correspondent plus et la page est bloquée.

Pour un hébergeur qui ne lit pas `_headers`, transposer le contenu du fichier
généré. Sous nginx, les directives du bloc `/*` vont dans un `add_header` de
`server`, et chaque bloc de page dans un `location =` dédié, par exemple :

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
# ... reste du bloc /* de out/_headers

location = / {
  add_header Content-Security-Policy "<valeur du bloc / de out/_headers>" always;
}
```
