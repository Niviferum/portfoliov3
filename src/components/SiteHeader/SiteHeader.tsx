"use client";

import { LocaleToggle } from "@/components/LocaleToggle/LocaleToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const { dict } = useLocale();
  const { shell } = dict;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.org}>{shell.orgName}</span>
        <span className={styles.tagline}>{shell.orgTagline}</span>
      </div>

      <div className={styles.aside}>
        <span className={styles.ref} aria-hidden="true">
          {shell.dossierRef}
        </span>
        <LocaleToggle />
      </div>
    </header>
  );
}
