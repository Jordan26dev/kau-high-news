export type Role = "Administrator" | "Teacher" | "Writer" | "Editor" | "Guest";

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  status: "active" | "pending";
  requestedEditor?: boolean;
};
