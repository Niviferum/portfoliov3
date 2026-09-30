"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { OPERATIONS, type OperationId } from "@/lib/operations";
import { STACK, type StackModule } from "@/lib/stack";
import styles from "./InstalledModules.module.css";

/** Numérotation sur deux chiffres, comme les références du dossier. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isDeployedIn(mod: StackModule, op: OperationId): boolean {
  return mod.ops?.includes(op) ?? false;
}

const TOTAL = STACK.reduce((sum, category) => sum + category.modules.length, 0);

export function InstalledModules() {
  const { dict } = useLocale();
  const { modules } = dict;
  const { filter } = modules;

  /** Opération sélectionnée ; `null` : aucun filtre, tout est allumé. */
  const [active, setActive] = useState<OperationId | null>(null);
  const activeOp = OPERATIONS.find((op) => op.id === active);

  const litCount = activeOp
    ? STACK.flatMap((category) => category.modules).filter((mod) =>
        isDeployedIn(mod, activeOp.id),
      ).length
    : TOTAL;

  const choices = [
    { id: null, code: null, label: filter.all },
    ...OPERATIONS.map((op) => ({ id: op.id, code: op.code, label: op.name })),
  ];

  return (
    <section
      id="modules"
      className={styles.section}
      aria-labelledby="modules-titre"
    >
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.ref}>
            <span>{modules.ref}</span>
            <span className={styles.refRule} aria-hidden="true" />
          </p>
          <h2 id="modules-titre" className={styles.title}>
            {modules.title}
          </h2>
          <p className={styles.intro}>{modules.intro}</p>

          <div
            className={styles.filter}
            role="group"
            aria-label={filter.label}
          >
            {choices.map((choice) => (
              <button
                key={choice.id ?? "all"}
                type="button"
                className={`plate ${styles.choice}`}
                aria-pressed={active === choice.id}
                onClick={() => setActive(choice.id)}
              >
                <span
                  className={`plate-fill ${styles.choiceFill}`}
                  aria-hidden="true"
                />
                {choice.code && (
                  <span className={styles.choiceCode}>{choice.code}</span>
                )}
                <span className={styles.choiceLabel}>{choice.label}</span>
              </button>
            ))}
          </div>

          {/* Annonce le résultat du filtre : l'estompage des autres modules
              n'est que visuel. */}
          <p className={styles.status} aria-live="polite">
            {activeOp && <span>{activeOp.name} — </span>}
            {pad(litCount)} {activeOp ? filter.statusOp : filter.statusAll}
          </p>
        </header>

        <div className={styles.grid}>
          {STACK.map((category, index) => {
            const headingId = `modules-${category.id}`;
            const total = category.modules.length;
            const lit = activeOp
              ? category.modules.filter((mod) => isDeployedIn(mod, activeOp.id))
                  .length
              : total;

            return (
              <section
                key={category.id}
                className={`plate ${styles.category}`}
                data-category={category.id}
                aria-labelledby={headingId}
              >
                <span
                  className={`plate-fill ${styles.fill}`}
                  aria-hidden="true"
                />

                <div className={styles.categoryHead}>
                  <span className={styles.index} aria-hidden="true">
                    MOD-{pad(index + 1)}
                  </span>
                  <h3 id={headingId} className={styles.categoryTitle}>
                    {modules.categories[category.id]}
                  </h3>
                  <span className={styles.count}>
                    {activeOp && `${pad(lit)} / `}
                    {pad(total)} {modules.countUnit}
                  </span>
                </div>

                <ul className={styles.list}>
                  {category.modules.map((mod) => (
                    <li
                      key={mod.name}
                      className={styles.module}
                      data-state={
                        activeOp
                          ? isDeployedIn(mod, activeOp.id)
                            ? "lit"
                            : "dim"
                          : undefined
                      }
                    >
                      {mod.name}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
