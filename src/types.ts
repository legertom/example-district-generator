// Example District CSV file type definitions for educational data generation

export interface Student {
  student_id: string;
  student_number?: string;
  state_id?: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  grade: string;
  gender?: 'M' | 'F';
  dob?: string; // YYYY-MM-DD
  race?: string;
  hispanic_latino?: 'Y' | 'N';
  home_language?: string;
  ell_status?: 'Y' | 'N' | 'RFEP' | 'IFEP' | 'EL';
  frl_status?: 'Free' | 'Reduced' | 'Paid';
  iep_status?: 'Y' | 'N';
  student_email?: string;
  school_id: string;
  student_street?: string;
  student_city?: string;
  student_state?: string;
  student_zip?: string;
}

export interface Teacher {
  teacher_id: string;
  teacher_number?: string;
  state_teacher_id?: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  title?: string;
  teacher_email?: string;
  school_id: string;
  username?: string;
}

export interface School {
  school_id: string;
  school_number?: string;
  state_id?: string;
  low_grade?: string;
  high_grade?: string;
  school_name: string;
  school_address?: string;
  school_city?: string;
  school_state?: string;
  school_zip?: string;
  school_phone?: string;
  principal?: string;
  principal_email?: string;
}

export interface Section {
  section_id: string;
  course_name: string;
  course_number?: string;
  course_description?: string;
  period?: string;
  subject?: string;
  term_name?: string;
  term_start?: string; // YYYY-MM-DD
  term_end?: string; // YYYY-MM-DD
  school_id: string;
  teacher_id: string;
  teacher_2_id?: string;
  teacher_3_id?: string;
  grade?: string;
}

export interface Enrollment {
  section_id: string;
  student_id: string;
  school_id: string;
}

export interface Staff {
  staff_id: string;
  staff_email: string;
  last_name: string;
  first_name: string;
  department?: string;
  title?: string;
  school_id: string;
  username?: string;
  role?: string;
}

export interface GenerationConfig {
  numStudents: string | number;
  numTeachers: string | number;
  numSchools: string | number;
  numSections: string | number;
  numStaff: string | number;
  schoolDistrict: string;
  schoolYear: string;
}

export type CSVFileType = 'students' | 'teachers' | 'schools' | 'sections' | 'enrollments' | 'staff';

export const CSV_FILE_HEADERS: Record<CSVFileType, string[]> = {
  students: [
    'student_id', 'student_number', 'state_id', 'last_name', 'first_name', 'middle_name',
    'grade', 'gender', 'dob', 'race', 'hispanic_latino', 'home_language', 'ell_status',
    'frl_status', 'iep_status', 'student_email', 'school_id', 'student_street', 'student_city',
    'student_state', 'student_zip'
  ],
  teachers: [
    'teacher_id', 'teacher_number', 'state_teacher_id', 'last_name', 'first_name', 'middle_name',
    'title', 'teacher_email', 'school_id', 'username'
  ],
  schools: [
    'school_id', 'school_number', 'state_id', 'low_grade', 'high_grade', 'school_name',
    'school_address', 'school_city', 'school_state', 'school_zip', 'school_phone',
    'principal', 'principal_email'
  ],
  sections: [
    'section_id', 'course_name', 'course_number', 'course_description', 'period',
    'subject', 'term_name', 'term_start', 'term_end', 'school_id', 'teacher_id',
    'teacher_2_id', 'teacher_3_id', 'grade'
  ],
  enrollments: ['school_id', 'section_id', 'student_id'],
  staff: [
    'school_id', 'staff_id', 'staff_email', 'first_name', 'last_name',
    'department', 'title', 'username', 'role'
  ]
};

export const GRADE_LEVELS = [
  '1','2','3','4','5','6','7','8','9','10','11','12','13',
  'InfantToddler','Preschool','PreKindergarten','TransitionalKindergarten','Kindergarten','PostGraduate','Ungraded','Other'
];
export const SUBJECTS = ['Mathematics', 'English Language Arts', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education', 'World Languages', 'Health', 'Technology'];
export const STAFF_ROLES = ['Principal', 'Assistant Principal', 'Counselor', 'Librarian', 'Nurse', 'Secretary', 'Custodian', 'Teaching Assistant', 'Special Education Coordinator'];
export const RACES = ['A', 'B', 'I', 'M', 'P', 'W'];
export const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'French', 'Vietnamese', 'Arabic', 'Russian', 'Korean', 'Portuguese', 'Japanese'];
export const ELL_STATUSES = ['Y', 'N', 'RFEP', 'IFEP', 'EL'];
export const FRL_STATUSES = ['Free', 'Reduced', 'Paid'];
export const GENDERS = ['M', 'F', 'X'];
export const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
