export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  department_id: number;
  created_at: Date;
  updated_at: Date;
  department?: Department;
  prerequisites?: CoursePrerequisite[];
  requiredFor?: CoursePrerequisite[];
  teachers?: TeacherCourse[];
  classes?: Class[];
  materials?: CourseMaterial[];
  Subject?: Subject[];
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  description?: string;
  course_id: number;
  created_at: Date;
  updated_at: Date;
  courses?: Course;
}

export interface CoursePrerequisite {
  course_id: number;
  prerequisite_id: number;
  course?: Course;
  prerequisite?: Course;
}
