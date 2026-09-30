import type { OperationId } from "./operations";

/**
 * Modules installés, par catégorie.
 *
 * Aucun niveau de maîtrise : tout ce qui figure ici mérite d'être montré.
 * `ops` relie un module aux opérations où il a servi ; n'y inscrire que des
 * usages confirmés.
 */

export type StackCategoryId = "languages" | "frameworks" | "databases" | "devops";

export type StackModule = {
  name: string;
  ops?: readonly OperationId[];
};

export type StackCategory = {
  id: StackCategoryId;
  modules: readonly StackModule[];
};

/** Modules d'une opération, dans l'ordre des catégories. */
export function modulesOf(op: OperationId): StackModule[] {
  return STACK.flatMap((category) =>
    category.modules.filter((mod) => mod.ops?.includes(op)),
  );
}

export const STACK: readonly StackCategory[] = [
  {
    id: "languages",
    modules: [
      { name: "TypeScript", ops: ["op-01", "op-02"] },
      { name: "JavaScript", ops: ["op-01"] },
      { name: "Java", ops: ["op-02"] },
      { name: "Python" },
      { name: "PHP", ops: ["op-03"] },
    ],
  },
  {
    id: "frameworks",
    modules: [
      { name: "React", ops: ["op-01"] },
      { name: "Next.js", ops: ["op-01"] },
      { name: "Node.js", ops: ["op-01"] },
      { name: "Express" },
      { name: "NestJS", ops: ["op-01"] },
      { name: "Angular", ops: ["op-02"] },
      { name: "Spring Boot", ops: ["op-02"] },
      { name: "Vite" },
      { name: "Symfony" },
      { name: "Laravel" },
    ],
  },
  {
    id: "databases",
    modules: [
      { name: "PostgreSQL", ops: ["op-01", "op-02"] },
      { name: "MySQL", ops: ["op-03"] },
      { name: "OracleDB", ops: ["op-03"]  },
      { name: "MongoDB" },
    ],
  },
  {
    id: "devops",
    modules: [
      { name: "Docker", ops: ["op-02"] },
      { name: "Jenkins", ops: ["op-03"] },
      { name: "XLD", ops: ["op-03"] },
      { name: "XLR", ops: ["op-03"] },
    ],
  },
];
