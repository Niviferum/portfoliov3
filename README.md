# Portfolio — Adrien Derrey

Dossier professionnel en page unique, dans l'esprit d'un dossier d'employé
classifié. Voir [`PORTFOLIO_BRIEF.md`](./PORTFOLIO_BRIEF.md) pour le concept,
la direction artistique et les garde-fous.

## Démarrer

```bash
npm install
npm run dev        # serveur de développement
npm run build      # export statique dans out/ + génération de out/_headers
npm run preview    # sert out/ tel quel, pour vérifier le rendu de production
npm run lint
npm run typecheck
```

## État d'avancement

| Section                   | État                                         |
| ------------------------- | -------------------------------------------- |
| 0. Écran d'accès          | fait                                          |
| 1. Fiche d'identité       | fait                                          |
| 2. Opérations             | fait (contenu à compléter)                    |
| 3. Modules installés      | fait                                          |
| 4. Transmission           | fait                                          |

### À compléter avant mise en ligne

Tout est regroupé dans [`src/lib/profile.ts`](./src/lib/profile.ts) :

- l'adresse e-mail (`contact@adrienderrey.fr` est un placeholder) ;
- l'URL exacte du profil LinkedIn ;
- le domaine de production, s'il diffère ;
- le CV : déposer le PDF en `public/cv/adrien-derrey-cv.pdf`. Tant qu'il est
  absent, le bouton « Télécharger le CV » pointe dans le vide.

Côté contenu, les fiches Opérations (`operations.items` dans
[`src/lib/i18n/dictionary.ts`](./src/lib/i18n/dictionary.ts)) n'affichent que
ce que le brief établit : `role` et `result` sont absents pour OP-02 et OP-03,
`role` pour OP-01. Un champ absent n'est pas affiché ; le renseigner suffit
à le faire apparaître, en FR et en EN.

Le nom d'en-tête « NIVIFERUM SYSTEMS » était marqué « à valider » dans le
brief ; il est en place, à confirmer ou remplacer dans les dictionnaires.

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
- Aucun emoji, nulle part — les pictogrammes sont des SVG écrits à la main.

### En-têtes HTTP

Sans serveur, les en-têtes relèvent de l'hébergeur.
[`scripts/build-headers.mjs`](./scripts/build-headers.mjs) écrit `out/_headers`
après chaque build, au format Netlify / Cloudflare Pages.

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
