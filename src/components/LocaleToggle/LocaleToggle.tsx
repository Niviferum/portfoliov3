"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import styles from "./LocaleToggle.module.css";

export function LocaleToggle() {
  const { dict, locale, toggleLocale } = useLocale();
  const { localeSwitch } = dict.shell;
  const otherLocale = locale === "fr" ? "en" : "fr";

  return (
    <button
      type="button"
      className={`plate ${styles.toggle}`}
      onClick={toggleLocale}
      // Le libellé visible n'est qu'un code de deux lettres : le nom complet
      // de la langue cible est restitué aux technologies d'assistance, dans
      // la langue courante du dossier.
      aria-label={`${localeSwitch.label} : ${localeSwitch.otherName}`}
    >
      <span className={styles.mark} aria-hidden="true">
        ⇄
      </span>
      <span lang={otherLocale}>{localeSwitch.toOther}</span>
    </button>
  );
}
