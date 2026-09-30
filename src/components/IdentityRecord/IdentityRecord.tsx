"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PROFILE } from "@/lib/profile";
import styles from "./IdentityRecord.module.css";

/** Glyphes SVG maison — aucun emoji, aucune dépendance d'icônes. */
function DownloadGlyph() {
  return (
    <svg
      className={styles.actionIcon}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 0.75v7M3 5l3 3 3-3M0.75 10.75h10.5" />
    </svg>
  );
}

function TransmitGlyph() {
  return (
    <svg
      className={styles.actionIcon}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0.75 2.25h10.5v7.5H0.75z" />
      <path d="M0.75 3 6 6.75 11.25 3" />
    </svg>
  );
}

export function IdentityRecord() {
  const { dict } = useLocale();
  const { identity } = dict;

  return (
    <section
      id="identite"
      className={styles.section}
      aria-labelledby="identite-titre"
    >
      <div className={styles.shell}>
        <div>
          <p className={styles.ref}>
            <span>{identity.ref}</span>
            <span className={styles.refRule} aria-hidden="true" />
          </p>

          {/* Unique `h1` du document : le nom du sujet du dossier. */}
          <h1 id="identite-titre" className={styles.name}>
            {identity.name}
          </h1>
          <p className={styles.role}>{identity.role}</p>
          <p className={styles.summary}>{identity.summary}</p>

          <div className={styles.actions}>
            <a
              className={`plate ${styles.action} ${styles.actionPrimary}`}
              href={PROFILE.resume}
              download
            >
              <span
                className={`plate-fill ${styles.actionFill}`}
                aria-hidden="true"
              />
              <DownloadGlyph />
              <span className={styles.actionLabel}>
                {identity.actions.resume}
              </span>
              <span className={styles.actionHint}>
                {identity.actions.resumeHint}
              </span>
            </a>

            <a
              className={`plate ${styles.action} ${styles.actionSecondary}`}
              href={`mailto:${PROFILE.email}`}
            >
              <span
                className={`plate-fill ${styles.actionFill}`}
                aria-hidden="true"
              />
              <TransmitGlyph />
              <span className={styles.actionLabel}>
                {identity.actions.contact}
              </span>
            </a>
          </div>
        </div>

        <div className={`plate ${styles.panel}`}>
          <span className={`plate-fill ${styles.fill}`} aria-hidden="true" />

          <p className={styles.panelHead} aria-hidden="true">
            <span>{dict.shell.dossierRef}</span>
            <span>ND / 01</span>
          </p>

          <dl className={styles.fields}>
            {identity.fields.map((field, index) => (
              <div key={field.label} className={styles.field}>
                <dt className={styles.fieldLabel}>{field.label}</dt>
                <dd className={styles.fieldValue}>
                  {index === 0 && (
                    <span className={styles.pulse} aria-hidden="true" />
                  )}
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <span className={styles.stamp} aria-hidden="true">
            {identity.stamp}
          </span>
        </div>
      </div>
    </section>
  );
}
