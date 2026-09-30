import type { OperationId } from "@/lib/operations";
import type { StackCategoryId } from "@/lib/stack";

/**
 * Dictionnaires FR / EN.
 *
 * L'export statique interdit l'i18n de Next (routage serveur) : la langue est
 * résolue côté client. `fr` est la langue de rendu par défaut, donc celle du
 * HTML généré au build et celle vue par les moteurs d'indexation.
 */

export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Résout une valeur BCP 47 (`fr-FR`, `en-GB`...) vers une langue supportée. */
export function resolveLocale(tag: string | undefined): Locale | null {
  if (!tag) return null;
  const base = tag.toLowerCase().split("-")[0];
  return isLocale(base) ? base : null;
}

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  shell: {
    skipToContent: string;
    dossierRef: string;
    orgName: string;
    orgTagline: string;
    localeSwitch: {
      label: string;
      toOther: string;
      otherName: string;
    };
  };
  access: {
    region: string;
    boot: string[];
    dossier: string;
    subject: string;
    clearance: string;
    granted: string;
    skip: string;
  };
  identity: {
    sectionLabel: string;
    ref: string;
    name: string;
    role: string;
    fields: Array<{ label: string; value: string }>;
    summary: string;
    actions: {
      resume: string;
      resumeHint: string;
      contact: string;
    };
    stamp: string;
  };
  operations: {
    ref: string;
    title: string;
    intro: string;
    labels: {
      objective: string;
      role: string;
      result: string;
      stack: string;
    };
    activeBadge: string;
    /** Libellés des liens, selon leur nature (`OperationLink.kind`). */
    links: {
      site: string;
      code: string;
    };
    /** Suffixe restitué des liens qui ouvrent un nouvel onglet. */
    newTab: string;
    /** Champs absents : non affichés, jamais inventés. */
    items: Record<
      OperationId,
      {
        subtitle: string;
        mission: string;
        objective: string;
        role?: string;
        result?: string;
      }
    >;
  };
  transmission: {
    ref: string;
    title: string;
    intro: string;
    primaryLabel: string;
    write: string;
    /** Objet pré-rempli du message. */
    subject: string;
    copy: string;
    copied: string;
    copyFailed: string;
    channels: {
      github: { label: string; value: string };
      linkedin: { label: string; value: string };
      resume: { label: string; value: string };
    };
    newTab: string;
    end: string;
  };
  modules: {
    ref: string;
    title: string;
    intro: string;
    categories: Record<StackCategoryId, string>;
    /** Unité du compteur de modules par catégorie. */
    countUnit: string;
    filter: {
      /** Nom accessible du groupe de boutons. */
      label: string;
      all: string;
      /** Suffixe du compteur, sans filtre puis avec une opération choisie. */
      statusAll: string;
      statusOp: string;
    };
  };
};

const fr: Dictionary = {
  meta: {
    title: "Adrien Derrey — Développeur web full stack",
    description:
      "Dossier professionnel d'Adrien Derrey, développeur web full stack : TypeScript, React, Next.js, Node.js, NestJS, PostgreSQL. Disponible sur le Gard et Montpellier.",
  },
  shell: {
    skipToContent: "Aller au contenu principal",
    dossierRef: "Dossier #ND-0001",
    orgName: "Portfolio",
    orgTagline: "Division ingénierie logicielle",
    localeSwitch: {
      label: "Langue du dossier",
      toOther: "FR",
      otherName: "Français",
    },
  },
  access: {
    region: "Séquence d'ouverture du dossier",
    boot: [
      "Liaison établie",
      "Vérification des habilitations",
      "Descellement du dossier",
    ],
    dossier: "Dossier #ND-0001",
    subject: "Adrien Derrey",
    clearance: "Niveau d'accès 03",
    granted: "Accès autorisé",
    skip: "Passer",
  },
  identity: {
    sectionLabel: "Fiche d'identité",
    ref: "Fiche 01 — Identité",
    name: "Adrien Derrey",
    role: "Développeur web full stack",
    fields: [
      { label: "Statut", value: "Disponible pour affectation" },
      { label: "Zone d'affectation", value: "Gard / Montpellier" },
      { label: "Opérations au dossier", value: "03" },
    ],
    summary:
      "Je conçois et j'exploite des applications web de bout en bout : interface, API, base de données, mise en production.",
    actions: {
      resume: "Télécharger le CV",
      resumeHint: "PDF",
      contact: "Ouvrir une transmission",
    },
    stamp: "Classifié",
  },
  operations: {
    ref: "Fiche 02 — Opérations",
    title: "Opérations",
    intro:
      "Missions menées au dossier. Dépliez une fiche pour en consulter le détail.",
    labels: {
      objective: "Objectif",
      role: "Rôle",
      result: "Résultat",
      stack: "Stack",
    },
    activeBadge: "En cours",
    links: {
      site: "Visiter",
      code: "Voir le code sur GitHub",
    },
    newTab: "(nouvel onglet)",
    items: {
      "op-01": {
        subtitle: "Plateforme de réservation de jeu de rôle",
        mission: "Freelance",
        objective:
          "Conception et développement d'une plateforme de réservation de séances de jeu de rôle (React, Node.js, PostgreSQL via Supabase). Authentification client en OAuth 2.0 via Discord avec gestion des rôles (Client / Admin). Panel admin permettant l'envoi de propositions de paiement et le suivi en temps réel du statut des invitations et des paiements. Intégration Stripe pour les paiements, génération automatique d'une facture envoyée par mail. Création d'un espace client (Historique de paiements / Invitations) et pages vitrines (Univers / Prestations / Règles du jeu)",
        result: "En production",
      },
      "op-02": {
        subtitle: "Gestion multi-modules",
        mission: "Personnel",
        objective:
          "Conception et développement d'un portail privé qui regroupe des modules du quotidien derrière une connexion unique (Java 21, Spring Boot, Angular, PostgreSQL). Authentification OAuth 2.0 via Discord avec liste blanche et gestion des rôles (Utilisateur / Admin), session côté serveur en cookie HttpOnly. Portail fournisseur d'identité OpenID Connect (Spring Authorization Server, PKCE)\u00a0: chaque module est un site indépendant, sur son propre sous-domaine et son propre dépôt, qui s'y connecte en OIDC. Catalogue de modules déclaratif, validé au démarrage. Interface Angular rétro inspirée de Windows 95, conforme RGAA, avec thèmes clair et sombre. Tests unitaires, d'intégration et de bout en bout (JUnit 5, Testcontainers, Vitest), CI GitHub Actions et déploiement Docker sur Railway",
        result: 'En production',
      },
      "op-03": {
        subtitle: "Monitoring de stress tests",
        mission: "Stage — Groupe BPCE (2025 - 2026)",
        objective:
        "Refonte complète d'un outil de monitoring de stress tests, repris de zéro et restructuré en MVC (PHP Natif, sans framework). Bases de données OracleDB et MySQL. Mise en place d'une suite de tests unitaires (PHP Unit) et d'un suivi de la qualité du code (SonarQube). Déploiement d'une chaîne de CI/CD complète (Jenkins, XL Deploy, XL Release). Ajout de pages de visualisation de données pour fluidifier les astreintes de production. Méthode agile en scrumboard, suivie sous Jira et documentée sous Confluence",
        result: "Version utilisable prête et utilisée par les ingénieurs à la fin du stage. Mise en production et retours positifs.",
      },
    },
  },
  transmission: {
    ref: "Fiche 04 — Transmission",
    title: "Transmission",
    intro:
      "Une offre, une mission ou simplement un échange\u00a0: le canal est ouvert.",
    primaryLabel: "Canal prioritaire — E-mail",
    write: "Écrire un message",
    subject: "Contact depuis le portfolio",
    copy: "Copier l'adresse",
    copied: "Adresse copiée",
    copyFailed: "Copie impossible, sélectionnez l'adresse",
    channels: {
      github: { label: "GitHub", value: "Niviferum" },
      linkedin: { label: "LinkedIn", value: "Adrien Derrey" },
      resume: { label: "Curriculum vitae", value: "Télécharger le PDF" },
    },
    newTab: "(nouvel onglet)",
    end: "Fin du dossier #ND-0001",
  },
  modules: {
    ref: "Fiche 03 — Modules installés",
    title: "Modules installés",
    intro:
      "Langages, frameworks et outils en service. Sélectionnez une opération pour allumer les modules qu'elle a mobilisés.",
    categories: {
      languages: "Langages",
      frameworks: "Frameworks",
      databases: "Bases de données",
      devops: "DevOps",
    },
    countUnit: "modules",
    filter: {
      label: "Filtrer les modules par opération",
      all: "Tout",
      statusAll: "modules installés",
      statusOp: "modules mobilisés",
    },
  },
};

const en: Dictionary = {
  meta: {
    title: "Adrien Derrey — Full stack web developer",
    description:
      "Professional file of Adrien Derrey, full stack web developer: TypeScript, React, Next.js, Node.js, NestJS, PostgreSQL. Available around Gard and Montpellier, France.",
  },
  shell: {
    skipToContent: "Skip to main content",
    dossierRef: "File #ND-0001",
    orgName: "Portfolio",
    orgTagline: "Software engineering division",
    localeSwitch: {
      label: "File language",
      toOther: "EN",
      otherName: "English",
    },
  },
  access: {
    region: "File opening sequence",
    boot: ["Link established", "Verifying clearance", "Unsealing file"],
    dossier: "File #ND-0001",
    subject: "Adrien Derrey",
    clearance: "Clearance level 03",
    granted: "Access granted",
    skip: "Skip",
  },
  identity: {
    sectionLabel: "Identity record",
    ref: "Record 01 — Identity",
    name: "Adrien Derrey",
    role: "Full stack web developer",
    fields: [
      { label: "Status", value: "Available for assignment" },
      { label: "Deployment zone", value: "Gard / Montpellier, France" },
      { label: "Operations on file", value: "03" },
    ],
    summary:
      "I design and operate web applications end to end: interface, API, database, production.",
    actions: {
      resume: "Download resume",
      resumeHint: "PDF",
      contact: "Open a transmission",
    },
    stamp: "Classified",
  },
  operations: {
    ref: "Record 02 — Operations",
    title: "Operations",
    intro:
      "Missions on file. Expand a record to read the details.",
    labels: {
      objective: "Objective",
      role: "Role",
      result: "Outcome",
      stack: "Stack",
    },
    activeBadge: "Ongoing",
    links: {
      site: "Visit",
      code: "View the code on GitHub",
    },
    newTab: "(new tab)",
    items: {
      "op-01": {
        subtitle: "Roleplay Marketplace",
        mission: "Freelance",
        objective:
          "Design and development of a booking platform for tabletop role-playing sessions (React, Node.js, PostgreSQL via Supabase). Customer sign-in with OAuth 2.0 through Discord, with role management (Customer / Admin). Admin panel for sending payment requests and tracking the status of invitations and payments in real time. Stripe integration for payments, with an invoice generated automatically and sent by email. Customer area (Payment history / Invitations) and showcase pages (Universe / Services / Game rules)",
        result: "In production",
      },
      "op-02": {
        subtitle: "Multi Modules Management",
        mission: "Personal",
        objective:
          "Design and development of a private portal that gathers everyday modules behind a single sign-in (Java 21, Spring Boot, Angular, PostgreSQL). OAuth 2.0 sign-in through Discord with an allowlist and role management (User / Admin), server-side session in an HttpOnly cookie. The portal acts as an OpenID Connect identity provider (Spring Authorization Server, PKCE): each module is an independent site, on its own subdomain and in its own repository, that signs in through it with OIDC. Declarative module catalog, validated at startup. Retro Angular interface inspired by Windows 95, RGAA compliant, with light and dark themes. Unit, integration and end-to-end tests (JUnit 5, Testcontainers, Vitest), GitHub Actions CI and Docker deployment on Railway",
        result: "In production",
      },
      "op-03": {
        subtitle: "Stress Tests Monitoring",
        mission: "Internship — BPCE group (2025 - 2026)",
        objective:
          "Complete overhaul of a stress test monitoring tool, rebuilt from scratch with an MVC structure (native PHP, no framework). OracleDB and MySQL databases. Set up a unit test suite (PHPUnit) and code quality tracking (SonarQube). Deployed a complete CI/CD pipeline (Jenkins, XL Deploy, XL Release). Added data visualization pages to ease production on-call duty. Agile workflow on a scrum board, tracked in Jira and documented in Confluence",
        result:
          "Usable version ready and used by the engineers by the end of the internship. Deployed to production, with positive feedback.",
      },
    },
  },
  transmission: {
    ref: "Record 04 — Transmission",
    title: "Transmission",
    intro:
      "A job offer, a mission or just a conversation: the channel is open.",
    primaryLabel: "Priority channel — Email",
    write: "Write a message",
    subject: "Contact from your portfolio",
    copy: "Copy address",
    copied: "Address copied",
    copyFailed: "Copy failed, select the address",
    channels: {
      github: { label: "GitHub", value: "Niviferum" },
      linkedin: { label: "LinkedIn", value: "Adrien Derrey" },
      resume: { label: "Resume", value: "Download the PDF" },
    },
    newTab: "(new tab)",
    end: "End of file #ND-0001",
  },
  modules: {
    ref: "Record 03 — Installed modules",
    title: "Installed modules",
    intro:
      "Languages, frameworks and tools in service. Select an operation to light up the modules it relied on.",
    categories: {
      languages: "Languages",
      frameworks: "Frameworks",
      databases: "Databases",
      devops: "DevOps",
    },
    countUnit: "modules",
    filter: {
      label: "Filter modules by operation",
      all: "All",
      statusAll: "modules installed",
      statusOp: "modules deployed",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en };
