export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
}
