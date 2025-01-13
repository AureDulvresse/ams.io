import { Department } from "./department";

export interface Subject {
  id: number;
  code: string;
  name: string;
  description?: string;
  department_id: number;
  created_at: Date;
  updated_at: Date;
  department?: Department;
}
