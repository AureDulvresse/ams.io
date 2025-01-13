export interface AcademicYear {
  id: number;
  year: string; // ex: "2023-2024"
  start_date: DateTime;
  end_date: DateTime;
  is_current: Boolean;
  created_at: DateTime;
  updated_at: DateTime;
  semesters: Semester[];
  fees: TuitionFeeStructure[];
  enrollments: Enrollment[];
}

export interface Semester {
  id: Int;
  academic_year_id: Int;
  name: String;
  start_date: DateTime;
  end_date: DateTime;
  is_current: Boolean;
  created_at: DateTime;
  updated_at: DateTime;
  academicYear: AcademicYear;
  grades: Grade[];
  Course: Course[];
}
