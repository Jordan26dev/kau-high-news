export type Role =
  | "Administrator"
  | "Advisor"
  | "Managing Editor"
  | "Teacher"
  | "Writer"
  | "Editor"
  | "Guest";

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  status: "active" | "pending";
  requestedEditor?: boolean;
};

export const newsroomRoles: Role[] = [
  "Administrator",
  "Advisor",
  "Managing Editor",
  "Teacher",
  "Writer",
  "Editor",
  "Guest",
];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && newsroomRoles.includes(value as Role);
}
