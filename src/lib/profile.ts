/**
 * Données de contact et ressources externes.
 *
 * À COMPLÉTER par Adrien avant toute mise en ligne :
 * - `email` est un placeholder, il ne pointe sur aucune boîte réelle ;
 * - `resume` attend le fichier `public/cv/adrien-derrey-cv.pdf` (absent du
 *   dépôt tant qu'il n'a pas été fourni).
 */

export const PROFILE = {
  name: "Adrien Derrey",
  /** Domaine de production — sert aux URL canoniques et aux aperçus Open Graph. */
  siteUrl: "https://adrien-derrey.ovh",
  /** TODO(adrien) : remplacer par l'adresse réelle. */
  email: "derrey.adrien@gmail.com",
  github: "https://github.com/Niviferum",
  /** TODO(adrien) : URL exacte du profil. */
  linkedin: "https://www.linkedin.com/in/adrien-derrey-2918922a5",
  /** TODO(adrien) : déposer le PDF à ce chemin dans `public/`. */
  resume: "/cv/adrien-derrey-cv.pdf",
} as const;
