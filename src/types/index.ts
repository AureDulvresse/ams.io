export interface User {
  id: number; // Assure-toi que cela correspond au type de ta base de données
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role?: Role;
  related_id: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  courses?: Course[];
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  credits: number;
  department: Department;
  department_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface LevelStudy {
  id: number;
  designation: string;
  description?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Contract {
  id: number;
  libelle: string;
  description?: string;
  duration?: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  dob: Date | string; // Format YYYY-MM-DD
  pob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  picture?: string;
  levelStudy_id: number;
  levelStudy?: LevelStudy;
  created_at: Date | string;
  updated_at: Date | string;
  tutor: StudentTutor;
  parent?: StudentTutor;
  paymentMode: number;
}

export interface StudentTutor {
  name: string;
  phone: string;
  email: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  dob: string; // Format YYYY-MM-DD
  pob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  department_id: number; // Référence au département
  daily_salary: number; // Salaire journalier
  hire_date: Date | string;
  picture?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: Date | string;
  duration?: number;
  location: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Grade {
  id: number;
  student_id: number;
  student?: Student;
  course_id: number;
  course?: Course;
  grade: number;
  observation?: string;
  semester: string;
  academic_year: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  date: Date | string;
  repeat?: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ChatMessage {
  id: number;
  sender: string;
  receiver: number;
  message: string;
  timestamp: string;
  isMine: boolean;
  file?: string | null; // Ajout de la propriété 'file'
}
