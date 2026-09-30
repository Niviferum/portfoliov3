import {
  DEFAULT_LOCALE,
  isLocale,
  resolveLocale,
  type Locale,
} from "./dictionary";

/**
 * Petit magasin externe pour la langue active.
 *
 * `localStorage` et `navigator.language` ne sont lisibles que dans le
 * navigateur : les lire pendant le rendu ferait diverger l'hydratation du HTML
 * statique. Les exposer via `useSyncExternalStore` est la façon prévue par
 * React de brancher une source externe — le rendu serveur prend la langue par
 * défaut, le client bascule dès l'hydratation, sans effet ni rendu en cascade.
 */

const STORAGE_KEY = "nd.locale";

const listeners = new Set<() => void>();
let snapshot: Locale | null = null;

function detect(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Stockage indisponible (navigation privée, cookies bloqués) : on retombe
    // sur la détection navigateur, ce n'est pas une erreur bloquante.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const match = resolveLocale(tag);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Doit rendre une valeur stable tant que rien n'a changé. */
export function getSnapshot(): Locale {
  snapshot ??= detect();
  return snapshot;
}

/** Langue du HTML généré au build, et donc du premier rendu client. */
export function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function setLocale(next: Locale): void {
  if (snapshot === next) return;
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Choix non mémorisé : sans conséquence sur la session en cours.
  }
  listeners.forEach((listener) => listener());
}
