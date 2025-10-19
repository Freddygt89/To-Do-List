// types.ts
export type TaskStatus = "pending" | "inprogress" | "done";

export type Task = {
  id: string;
  title: string;
  category: string; // clave para icono: "home" | "work" | ...
  dateISO: string; // fecha en ISO
  time?: string | null; // "08:30" o null
  allDay?: boolean;
  status: TaskStatus;
  notes?: string;
};
