"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import styles from "./AccessScreen.module.css";

/** Duree totale de la sequence : fin de l'ouverture du sas (1800 + 620 ms). */
const SEQUENCE_MS = 2620;
const LEAVE_MS = 240;

type Phase = "running" | "leaving" | "done";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AccessScreen() {
  const { dict } = useLocale();
  const [phase, setPhase] = useState<Phase>("running");

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    const finish = window.setTimeout(
      () => setPhase("done"),
      reducedMotion ? 0 : SEQUENCE_MS,
    );

    // La CSS masque deja le sas : on le retire du DOM au tour suivant.
    if (reducedMotion) {
      return () => window.clearTimeout(finish);
    }

    // Le sas est `aria-hidden` et hors tabulation : la sortie clavier passe
    // donc par un écouteur global, pas par le bouton.
    const skip = () => setPhase((p) => (p === "running" ? "leaving" : p));
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    events.forEach((type) =>
      window.addEventListener(type, skip, { passive: true }),
    );

    return () => {
      window.clearTimeout(finish);
      events.forEach((type) => window.removeEventListener(type, skip));
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("done"), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const { access } = dict;

  return (
    <div className={styles.overlay} data-state={phase} aria-hidden="true">
      <div className={`${styles.panel} ${styles.panelTop}`} />
      <div className={`${styles.panel} ${styles.panelBottom}`} />
      <span className={`${styles.corner} ${styles.cornerTopLeft}`} />
      <span className={`${styles.corner} ${styles.cornerTopRight}`} />
      <span className={`${styles.corner} ${styles.cornerBottomLeft}`} />
      <span className={`${styles.corner} ${styles.cornerBottomRight}`} />

      <div className={styles.console}>
        <p className={styles.dossier}>{access.dossier}</p>
        <p className={styles.subject}>{access.subject}</p>
        <p className={styles.clearance}>{access.clearance}</p>
        <div className={styles.progress}>
          <span className={styles.progressBar} />
        </div>
        <ul className={styles.boot}>
          {/* Les delais sont portes par la feuille de styles (`:nth-child`)
              et non par un attribut `style` : la CSP peut ainsi refuser
              `style-src 'unsafe-inline'`. */}
          {access.boot.map((line) => (
            <li key={line} className={styles.bootLine}>
              {line}
            </li>
          ))}
        </ul>
        <p className={styles.granted}>{access.granted}</p>
      </div>

      <button
        type="button"
        tabIndex={-1}
        className={styles.skip}
        onClick={() => setPhase("leaving")}
      >
        {access.skip}
      </button>
    </div>
  );
}
