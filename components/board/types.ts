export interface Task {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  task_order: number;
  project_id: string;
  created_by: string;
}

export interface Column {
  id: string;
  title: string;
  column_order: number;
  project_id: string;
}

export interface Project {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
}
