import { faker } from '@faker-js/faker';
import type {
  Student,
  Teacher,
  School,
  Section,
  Enrollment,
  Staff,
  GenerationConfig
} from './types';
import {
  GRADE_LEVELS,
  SUBJECTS,
  STAFF_ROLES,
  RACES,
  LANGUAGES,
  ELL_STATUSES,
  FRL_STATUSES,
  GENDERS,
  US_STATES
} from './types';

export class DataGenerator {
  private config: GenerationConfig;

  private gradeToNumber(grade: string): number {
    switch (grade) {
  case 'InfantToddler': return 1; // infants/toddlers
  case 'Preschool': return 3;
  case 'PreKindergarten': return 4;
  case 'TransitionalKindergarten': return 5;
  case 'Kindergarten': return 5;
  case '1': return 6;
  case '2': return 7;
  case '3': return 8;
  case '4': return 9;
  case '5': return 10;
  case '6': return 11;
  case '7': return 12;
  case '8': return 13;
  case '9': return 14;
  case '10': return 15;
  case '11': return 16;
  case '12': return 17;
  case '13': return 18;
  case 'PostGraduate': return 19;
  case 'Ungraded': return 10;
  case 'Other': return 10;
  default: return 10; // fallback
    }
  }

  constructor(config: GenerationConfig) {
    this.config = config;
    faker.seed(42); // For consistent data generation
  }

  generateSchools(): School[] {
    const schools: School[] = [];
    
    for (let i = 0; i < Number(this.config.numSchools); i++) {
      const schoolId = faker.string.uuid();
      const schoolTypes = ['Elementary School', 'Middle School', 'High School', 'K-8 School'];
      const schoolType = faker.helpers.arrayElement(schoolTypes);
      const schoolName = `${faker.location.city()} ${schoolType}`;
      
      // Set grade ranges based on school type
      let lowGrade = 'Kindergarten';
      let highGrade = '5';
      
      if (schoolType === 'Middle School') {
        lowGrade = '6';
        highGrade = '8';
      } else if (schoolType === 'High School') {
        lowGrade = '9';
        highGrade = '12';
      } else if (schoolType === 'K-8 School') {
        lowGrade = 'Kindergarten';
        highGrade = '8';
      }
      
      const state = faker.helpers.arrayElement(US_STATES);
      const principalFirstName = faker.person.firstName();
      const principalLastName = faker.person.lastName();
      
      schools.push({
        school_id: schoolId,
        school_number: (i + 1).toString().padStart(3, '0'),
        state_id: faker.string.alphanumeric(8).toUpperCase(),
        low_grade: lowGrade,
        high_grade: highGrade,
        school_name: schoolName,
        school_address: faker.location.streetAddress(),
        school_city: faker.location.city(),
        school_state: state,
        school_zip: faker.location.zipCode(),
        school_phone: faker.phone.number(),
        principal: `${principalFirstName} ${principalLastName}`,
        principal_email: faker.internet.email({ firstName: principalFirstName, lastName: principalLastName })
      });
    }
    
    return schools;
  }

  generateTeachers(schools: School[]): Teacher[] {
    const teachers: Teacher[] = [];
    
    for (let i = 0; i < Number(this.config.numTeachers); i++) {
      const teacherId = faker.string.uuid();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const school = faker.helpers.arrayElement(schools);
      
      teachers.push({
        teacher_id: teacherId,
        teacher_number: (i + 1).toString().padStart(4, '0'),
        state_teacher_id: faker.string.alphanumeric(10).toUpperCase(),
        last_name: lastName,
        first_name: firstName,
        middle_name: faker.person.middleName(),
        title: faker.helpers.arrayElement(['Mr.', 'Ms.', 'Mrs.', 'Dr.']),
        teacher_email: faker.internet.email({ firstName, lastName }),
        school_id: school.school_id,
        username: faker.internet.username({ firstName, lastName })
      });
    }
    
    return teachers;
  }

  generateStudents(schools: School[]): Student[] {
    const students: Student[] = [];
    
    for (let i = 0; i < Number(this.config.numStudents); i++) {
      const studentId = faker.string.uuid();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const school = faker.helpers.arrayElement(schools);
      const grade = faker.helpers.arrayElement(GRADE_LEVELS);
      const gender = faker.helpers.arrayElement(GENDERS) as 'M' | 'F';
      const race = faker.helpers.arrayElement(RACES);
      const hispanicLatino = faker.helpers.arrayElement(['Y', 'N']) as 'Y' | 'N';
      const homeLanguage = faker.helpers.arrayElement(LANGUAGES);
      const ellStatus = faker.helpers.arrayElement(ELL_STATUSES) as 'Y' | 'N' | 'RFEP' | 'IFEP' | 'EL';
      const frlStatus = faker.helpers.arrayElement(FRL_STATUSES) as 'Free' | 'Reduced' | 'Paid';
      const iepStatus = faker.helpers.arrayElement(['Y', 'N']);
      const state = faker.helpers.arrayElement(US_STATES);
      
      // Generate age-appropriate birth date based on grade
      const gradeAge = this.gradeToNumber(grade);
      let birthYear = 2025 - gradeAge; // Current year minus expected age
      
      students.push({
        student_id: studentId,
        student_number: (i + 1).toString().padStart(6, '0'),
        state_id: faker.string.alphanumeric(12).toUpperCase(),
        last_name: lastName,
        first_name: firstName,
        middle_name: faker.person.middleName(),
        grade: grade,
        gender: gender,
        dob: faker.date.between({ 
          from: `${birthYear}-01-01`, 
          to: `${birthYear}-12-31` 
        }).toISOString().split('T')[0],
        race: race,
        hispanic_latino: hispanicLatino,
        home_language: homeLanguage,
        ell_status: ellStatus,
        frl_status: frlStatus,
        iep_status: iepStatus,
        student_email: faker.datatype.boolean(0.7) ? faker.internet.email({ firstName, lastName }) : '',
        school_id: school.school_id,
        student_street: faker.location.streetAddress(),
        student_city: faker.location.city(),
        student_state: state,
        student_zip: faker.location.zipCode()
      });
    }
    
    return students;
  }

  generateSections(schools: School[], teachers: Teacher[]): Section[] {
    const sections: Section[] = [];
    
    for (let i = 0; i < Number(this.config.numSections); i++) {
      const sectionId = faker.string.uuid();
      const subject = faker.helpers.arrayElement(SUBJECTS);
      const school = faker.helpers.arrayElement(schools);
      const schoolTeachers = teachers.filter(t => t.school_id === school.school_id);
      const teacher = faker.helpers.arrayElement(schoolTeachers.length > 0 ? schoolTeachers : teachers);
      const grade = faker.helpers.arrayElement(GRADE_LEVELS);
      const courseNumber = `${subject.substring(0, 3).toUpperCase()}${faker.number.int({ min: 100, max: 999 })}`;
      
      // Optionally add second and third teachers (lower probability)
      const teacher2 = faker.datatype.boolean(0.2) ? faker.helpers.arrayElement(schoolTeachers)?.teacher_id : undefined;
      const teacher3 = faker.datatype.boolean(0.1) ? faker.helpers.arrayElement(schoolTeachers)?.teacher_id : undefined;
      
      sections.push({
        section_id: sectionId,
        course_name: `${subject} - Grade ${grade}`,
        course_number: courseNumber,
        course_description: `${subject} curriculum for grade ${grade} students`,
        period: faker.number.int({ min: 1, max: 8 }).toString(),
        subject: subject,
        term_name: `${this.config.schoolYear} School Year`,
        term_start: `${this.config.schoolYear.split('-')[0]}-08-15`,
        term_end: `${this.config.schoolYear.split('-')[1]}-06-15`,
        school_id: school.school_id,
        teacher_id: teacher.teacher_id,
        teacher_2_id: teacher2,
        teacher_3_id: teacher3,
        grade: grade
      });
    }
    
    return sections;
  }

  generateEnrollments(sections: Section[], students: Student[]): Enrollment[] {
    const enrollments: Enrollment[] = [];
    
    // Enroll students in sections from their school with grade-appropriate matching
    sections.forEach(section => {
      const schoolStudents = students.filter(s => 
        s.school_id === section.school_id && 
        s.grade === section.grade
      );
      
      if (schoolStudents.length === 0) return;
      
      // Class size varies by grade and subject
      const gradeLevel = section.grade || 'Kindergarten';
      const gradeNumber = this.gradeToNumber(gradeLevel);
      const baseClassSize = gradeNumber <= 10 ? // Elementary ages (PreK through 5th grade)
        faker.number.int({ min: 18, max: 25 }) : // Elementary
        faker.number.int({ min: 20, max: 30 });  // Middle/High school
      
      const actualClassSize = Math.min(baseClassSize, schoolStudents.length);
      const enrolledStudents = faker.helpers.arrayElements(schoolStudents, actualClassSize);
      
      enrolledStudents.forEach(student => {
        enrollments.push({
          school_id: section.school_id,
          section_id: section.section_id,
          student_id: student.student_id
        });
      });
    });
    
    return enrollments;
  }

  generateStaff(schools: School[]): Staff[] {
    const staff: Staff[] = [];
    
    for (let i = 0; i < Number(this.config.numStaff); i++) {
      const staffId = faker.string.uuid();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const school = faker.helpers.arrayElement(schools);
      const role = faker.helpers.arrayElement(STAFF_ROLES);

      staff.push({
        school_id: school.school_id,
        staff_id: staffId,
        staff_email: faker.internet.email({ firstName, lastName }),
        first_name: firstName,
        last_name: lastName,
        department: faker.helpers.arrayElement(['District Office', 'Technology', 'Operations', 'Student Services', 'Counseling']),
        title: role,
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        role
      });
    }
    
    return staff;
  }

  generateAllData() {
    const schools = this.generateSchools();
    const teachers = this.generateTeachers(schools);
    const students = this.generateStudents(schools);
    const sections = this.generateSections(schools, teachers);
    const enrollments = this.generateEnrollments(sections, students);
    const staff = this.generateStaff(schools);

    return {
      schools,
      teachers,
      students,
      sections,
      enrollments,
      staff
    };
  }
}
