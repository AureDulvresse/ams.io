import { Semester } from "./academic";
import { Subject } from "./subject";

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  subject_id: number;
  semester_id: number;
  created_at: Date;
  updated_at: Date;
  subject?: Subject;
  semester: Semester;
  prerequisites?: CoursePrerequisite[];
  requiredFor?: CoursePrerequisite[];
  teachers?: TeacherCourse[];
  classes?: Class[];
  materials?: CourseMaterial[];
}

export interface CoursePrerequisite {
  course_id: number;
  prerequisite_id: number;
  course?: Course;
  prerequisite?: Course;
}
