"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PROFILE } from "@/lib/profile";
import styles from "./Transmission.module.css";

/** Durée d'affichage du retour de copie. */
const COPY_FEEDBACK_MS = 2500;

type CopyState = "idle" | "copied" | "failed";

function ArrowGlyph() {
  return (
    <svg
      className={styles.glyph}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 1.25h7.25V8.5M10.75 1.25 1.25 10.75" />
    </svg>
  );
}

function DownloadGlyph() {
  return (
    <svg
      className={styles.glyph}
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

export function Transmission() {
  const { dict } = useLocale();
  const { transmission } = dict;
  const { channels } = transmission;

  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const t = window.setTimeout(() => setCopyState("idle"), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(t);
  }, [copyState]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    transmission.subject,
  )}`;

  const secondary = [
    {
      key: "github",
      href: PROFILE.github,
      external: true,
      ...channels.github,
    },
    {
      key: "linkedin",
      href: PROFILE.linkedin,
      external: true,
      ...channels.linkedin,
    },
    {
      key: "resume",
      href: PROFILE.resume,
      external: false,
      ...channels.resume,
    },
  ];

  return (
    <section
      id="transmission"
      className={styles.section}
      aria-labelledby="transmission-titre"
    >
      <div className={styles.shell}>
        <header>
          <p className={styles.ref}>
            <span>{transmission.ref}</span>
            <span className={styles.refRule} aria-hidden="true" />
          </p>
          <h2 id="transmission-titre" className={styles.title}>
            {transmission.title}
          </h2>
          <p className={styles.intro}>{transmission.intro}</p>
        </header>

        <div className={styles.layout}>
          <div className={`plate ${styles.primary}`}>
            <span
              className={`plate-fill ${styles.primaryFill}`}
              aria-hidden="true"
            />
            <p className={styles.primaryLabel}>
              <span className={styles.code} aria-hidden="true">
                CH-01
              </span>
              {transmission.primaryLabel}
            </p>
            <p className={styles.address}>{PROFILE.email}</p>

            <div className={styles.primaryActions}>
              <a className={`plate ${styles.write}`} href={mailto}>
                <span
                  className={`plate-fill ${styles.writeFill}`}
                  aria-hidden="true"
                />
                <span className={styles.label}>{transmission.write}</span>
                <ArrowGlyph />
              </a>
              <button
                type="button"
                className={`plate ${styles.copy}`}
                onClick={copyEmail}
              >
                <span
                  className={`plate-fill ${styles.copyFill}`}
                  aria-hidden="true"
                />
                <span className={styles.label}>{transmission.copy}</span>
              </button>
              <p className={styles.copyStatus} role="status">
                {copyState === "copied" && transmission.copied}
                {copyState === "failed" && transmission.copyFailed}
              </p>
            </div>
          </div>

          <ul className={styles.channels}>
            {secondary.map((channel, index) => (
              <li key={channel.key}>
                <a
                  className={`plate ${styles.channel}`}
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: true })}
                >
                  <span
                    className={`plate-fill ${styles.channelFill}`}
                    aria-hidden="true"
                  />
                  <span className={styles.code} aria-hidden="true">
                    CH-{String(index + 2).padStart(2, "0")}
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>
                      {channel.label}
                    </span>
                    <span className={styles.channelValue}>
                      {channel.value}
                    </span>
                  </span>
                  {channel.external ? (
                    <>
                      <span className="visually-hidden">
                        {transmission.newTab}
                      </span>
                      <ArrowGlyph />
                    </>
                  ) : (
                    <DownloadGlyph />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.end} aria-hidden="true">
          <span className={styles.endRule} />
          {transmission.end}
          <span className={styles.endRule} />
        </p>
      </div>
    </section>
  );
}
