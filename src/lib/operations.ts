/**
 * Registre des opérations au dossier.
 *
 * Source unique des identifiants, noms et liens : la section Opérations et
 * le sélecteur des modules installés s'appuient tous deux sur ce fichier.
 * La stack de chaque opération se déduit de `stack.ts`. Les textes traduits
 * (sous-titre, objectif, résultat) vivent dans les dictionnaires.
 */

/** `site` : le produit en ligne ; `code` : le dépôt source. */
export type OperationLink = { kind: "site" | "code"; href: string };

type OperationEntry = {
  id: string;
  code: string;
  name: string;
  link: OperationLink | null;
  /** Opération en cours : dépliée par défaut, marquée active. */
  active: boolean;
};

export const OPERATIONS = [
  {
    id: "op-01",
    code: "OP-01",
    name: "tgwor.com",
    link: { kind: "site", href: "https://tgwor.com" },
    active: false,
  },
  {
    id: "op-02",
    code: "OP-02",
    name: "miyoshiix.com",
    link: {
      kind: "code",
      href: "https://github.com/Niviferum/Miyoshiix-Portal",
    },
    active: false,
  },
  {
    id: "op-03",
    code: "OP-03",
    name: "Natixis",
    link: null,
    active: false,
  },
] as const satisfies readonly OperationEntry[];

export type Operation = (typeof OPERATIONS)[number];

export type OperationId = Operation["id"];
