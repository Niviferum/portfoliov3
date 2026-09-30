"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

/** Premier élément focusable du document (RGAA 12.7). */
export function SkipLink() {
  const { dict } = useLocale();

  return (
    <a className="skip-link" href="#contenu">
      {dict.shell.skipToContent}
    </a>
  );
}
