"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { OPERATIONS, type OperationId } from "@/lib/operations";
import { modulesOf } from "@/lib/stack";
import styles from "./Operations.module.css";

function ExternalGlyph() {
  return (
    <svg
      className={styles.visitIcon}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 1h6v6M9 1 1 9" />
    </svg>
  );
}

/** Opérations dépliées au premier rendu : les opérations actives. */
const INITIALLY_OPEN: OperationId[] = OPERATIONS.filter((op) => op.active).map(
  (op) => op.id,
);

export function Operations() {
  const { dict } = useLocale();
  const { operations } = dict;
  const { labels } = operations;

  const [open, setOpen] = useState<OperationId[]>(INITIALLY_OPEN);

  const toggle = (id: OperationId) =>
    setOpen((current) =>
      current.includes(id)
        ? current.filter((other) => other !== id)
        : [...current, id],
    );

  return (
    <section
      id="operations"
      className={styles.section}
      aria-labelledby="operations-titre"
    >
      <div className={styles.shell}>
        <header>
          <p className={styles.ref}>
            <span>{operations.ref}</span>
            <span className={styles.refRule} aria-hidden="true" />
          </p>
          <h2 id="operations-titre" className={styles.title}>
            {operations.title}
          </h2>
          <p className={styles.intro}>{operations.intro}</p>
        </header>

        <ol className={styles.list}>
          {OPERATIONS.map((op) => {
            const item = operations.items[op.id];
            const isOpen = open.includes(op.id);
            const detailId = `${op.id}-detail`;
            const stack = modulesOf(op.id);

            return (
              <li key={op.id}>
                <article
                  id={op.id}
                  className={`plate ${styles.card}`}
                  data-open={isOpen}
                  aria-labelledby={`${op.id}-titre`}
                >
                  <span
                    className={`plate-fill ${styles.fill}`}
                    aria-hidden="true"
                  />

                  <h3 id={`${op.id}-titre`} className={styles.heading}>
                    <button
                      type="button"
                      className={styles.trigger}
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      onClick={() => toggle(op.id)}
                    >
                      <span className={styles.code}>{op.code}</span>
                      <span className={styles.name}>
                        {op.name}
                        <span className={styles.subtitle}>
                          <span className={styles.dash}>{" — "}</span>
                          {item.subtitle}
                        </span>
                      </span>
                      <span className={styles.meta}>
                        <span className={styles.mission}>{item.mission}</span>
                        {op.active && (
                          <span className={styles.badge}>
                            <span className={styles.pulse} aria-hidden="true" />
                            {operations.activeBadge}
                          </span>
                        )}
                      </span>
                      <span className={styles.toggle} aria-hidden="true" />
                    </button>
                  </h3>

                  {/* Replié, le détail reste dans le HTML (indexation) mais
                      sort de l'arbre d'accessibilité et de la tabulation. */}
                  <div id={detailId} className={styles.detail} inert={!isOpen}>
                    <div className={styles.detailInner}>
                      <div className={styles.body}>
                        <dl className={styles.fields}>
                          <div className={styles.field}>
                            <dt>{labels.objective}</dt>
                            <dd>{item.objective}</dd>
                          </div>
                          {item.role && (
                            <div className={styles.field}>
                              <dt>{labels.role}</dt>
                              <dd>{item.role}</dd>
                            </div>
                          )}
                          {item.result && (
                            <div className={styles.field}>
                              <dt>{labels.result}</dt>
                              <dd>{item.result}</dd>
                            </div>
                          )}
                          {stack.length > 0 && (
                            <div className={styles.field}>
                              <dt>{labels.stack}</dt>
                              <dd>
                                <ul className={styles.stack}>
                                  {stack.map((mod) => (
                                    <li key={mod.name} className={styles.chip}>
                                      {mod.name}
                                    </li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                          )}
                        </dl>

                        {op.link && (
                          <a
                            className={`plate ${styles.visit}`}
                            href={op.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span
                              className={`plate-fill ${styles.visitFill}`}
                              aria-hidden="true"
                            />
                            <span className={styles.visitLabel}>
                              {op.link.kind === "site"
                                ? `${operations.links.site} ${op.name}`
                                : operations.links.code}
                              <span className="visually-hidden">
                                {" "}
                                {operations.newTab}
                              </span>
                            </span>
                            <ExternalGlyph />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
