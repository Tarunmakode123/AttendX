// ========================================================
// AttendX — Realistic Synthetic Dataset & Generator
// College: B.Tech CSE (5th Semester) — Sections CSE-A & CSE-B
// ========================================================

export const SYNTHETIC_PERIODS = [
  { id: 'p1', period_number: 1, label: 'Period 1 (09:00 - 09:50)', start_time: '09:00:00', end_time: '09:50:00' },
  { id: 'p2', period_number: 2, label: 'Period 2 (10:00 - 10:50)', start_time: '10:00:00', end_time: '10:50:00' },
  { id: 'p3', period_number: 3, label: 'Period 3 (11:00 - 11:50)', start_time: '11:00:00', end_time: '11:50:00' },
  { id: 'p4', period_number: 4, label: 'Period 4 (12:00 - 12:50)', start_time: '12:00:00', end_time: '12:50:00' },
  { id: 'p5', period_number: 5, label: 'Period 5 (01:45 - 02:35)', start_time: '13:45:00', end_time: '14:35:00' },
  { id: 'p6', period_number: 6, label: 'Period 6 (02:45 - 03:35)', start_time: '14:45:00', end_time: '15:35:00' },
  { id: 'p7', period_number: 7, label: 'Period 7 (03:45 - 04:35)', start_time: '15:45:00', end_time: '16:35:00' },
];

export const SYNTHETIC_SUBJECTS = [
  { id: 'sub-301', name: 'Artificial Intelligence', code: 'AI301', class_section: 'CSE-A', year: 3 },
  { id: 'sub-302', name: 'Database Management Systems', code: 'CS302', class_section: 'CSE-A', year: 3 },
  { id: 'sub-303', name: 'Operating Systems', code: 'CS303', class_section: 'CSE-A', year: 3 },
  { id: 'sub-304', name: 'Computer Networks', code: 'CS304', class_section: 'CSE-A', year: 3 },
  { id: 'sub-305', name: 'Software Engineering', code: 'CS305', class_section: 'CSE-A', year: 3 },
  { id: 'sub-306', name: 'Machine Learning', code: 'CS306', class_section: 'CSE-A', year: 3 },
  { id: 'sub-307', name: 'Compiler Design', code: 'CS307', class_section: 'CSE-A', year: 3 },
  
  // CSE-B Subjects
  { id: 'sub-401', name: 'Artificial Intelligence', code: 'AI301-B', class_section: 'CSE-B', year: 3 },
  { id: 'sub-402', name: 'Database Management Systems', code: 'CS302-B', class_section: 'CSE-B', year: 3 },
  { id: 'sub-403', name: 'Operating Systems', code: 'CS303-B', class_section: 'CSE-B', year: 3 },
  { id: 'sub-404', name: 'Computer Networks', code: 'CS304-B', class_section: 'CSE-B', year: 3 },
  { id: 'sub-405', name: 'Software Engineering', code: 'CS305-B', class_section: 'CSE-B', year: 3 },
];

export const SYNTHETIC_FACULTY_SUBJECTS = [
  { faculty_id: 'fac-101', subject_id: 'sub-301' }, // Dr. Amit Sharma -> AI
  { faculty_id: 'fac-101', subject_id: 'sub-305' }, // Dr. Amit Sharma -> SE
  { faculty_id: 'fac-101', subject_id: 'sub-401' },
  { faculty_id: 'fac-102', subject_id: 'sub-302' }, // Prof. Neha Verma -> DBMS
  { faculty_id: 'fac-102', subject_id: 'sub-402' },
  { faculty_id: 'fac-103', subject_id: 'sub-303' }, // Dr. Rahul Joshi -> OS
  { faculty_id: 'fac-103', subject_id: 'sub-307' }, // Dr. Rahul Joshi -> Compiler
  { faculty_id: 'fac-103', subject_id: 'sub-403' },
  { faculty_id: 'fac-104', subject_id: 'sub-304' }, // Prof. Priya Mehta -> CN
  { faculty_id: 'fac-104', subject_id: 'sub-404' },
  { faculty_id: 'fac-105', subject_id: 'sub-306' }, // Prof. Vikram Singh -> ML
  { faculty_id: 'fac-105', subject_id: 'sub-405' },
  { faculty_id: 'admin-001', subject_id: 'sub-301' },
  { faculty_id: 'admin-001', subject_id: 'sub-302' },
  { faculty_id: 'admin-001', subject_id: 'sub-303' },
  { faculty_id: 'admin-001', subject_id: 'sub-304' },
  { faculty_id: 'admin-001', subject_id: 'sub-305' },
  { faculty_id: 'admin-001', subject_id: 'sub-306' },
  { faculty_id: 'admin-001', subject_id: 'sub-307' },
];

// Timetable Schedule Mapping (Monday to Friday)
export const SYNTHETIC_TIMETABLE = [
  // Monday CSE-A
  { id: 'tt-m1', day_of_week: 'Monday', period_id: 'p1', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-m2', day_of_week: 'Monday', period_id: 'p2', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A' },
  { id: 'tt-m3', day_of_week: 'Monday', period_id: 'p3', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A' },
  { id: 'tt-m4', day_of_week: 'Monday', period_id: 'p4', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A' },
  { id: 'tt-m5', day_of_week: 'Monday', period_id: 'p5', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-m6', day_of_week: 'Monday', period_id: 'p6', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A' },
  { id: 'tt-m7', day_of_week: 'Monday', period_id: 'p7', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A' },

  // Tuesday CSE-A
  { id: 'tt-t1', day_of_week: 'Tuesday', period_id: 'p1', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A' },
  { id: 'tt-t2', day_of_week: 'Tuesday', period_id: 'p2', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-t3', day_of_week: 'Tuesday', period_id: 'p3', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A' },
  { id: 'tt-t4', day_of_week: 'Tuesday', period_id: 'p4', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A' },
  { id: 'tt-t5', day_of_week: 'Tuesday', period_id: 'p5', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A' },
  { id: 'tt-t6', day_of_week: 'Tuesday', period_id: 'p6', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-t7', day_of_week: 'Tuesday', period_id: 'p7', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A' },

  // Wednesday CSE-A
  { id: 'tt-w1', day_of_week: 'Wednesday', period_id: 'p1', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A' }, // Dr. Amit Sharma
  { id: 'tt-w2', day_of_week: 'Wednesday', period_id: 'p2', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A' }, // Prof. Neha Verma
  { id: 'tt-w3', day_of_week: 'Wednesday', period_id: 'p3', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A' }, // Dr. Rahul Joshi
  { id: 'tt-w4', day_of_week: 'Wednesday', period_id: 'p4', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A' }, // Prof. Priya Mehta
  { id: 'tt-w5', day_of_week: 'Wednesday', period_id: 'p5', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A' }, // Dr. Amit Sharma
  { id: 'tt-w6', day_of_week: 'Wednesday', period_id: 'p6', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A' }, // Prof. Vikram Singh
  { id: 'tt-w7', day_of_week: 'Wednesday', period_id: 'p7', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A' },

  // Thursday CSE-A
  { id: 'tt-th1', day_of_week: 'Thursday', period_id: 'p1', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A' },
  { id: 'tt-th2', day_of_week: 'Thursday', period_id: 'p2', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A' },
  { id: 'tt-th3', day_of_week: 'Thursday', period_id: 'p3', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-th4', day_of_week: 'Thursday', period_id: 'p4', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-th5', day_of_week: 'Thursday', period_id: 'p5', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A' },
  { id: 'tt-th6', day_of_week: 'Thursday', period_id: 'p6', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A' },

  // Friday CSE-A
  { id: 'tt-f1', day_of_week: 'Friday', period_id: 'p1', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A' },
  { id: 'tt-f2', day_of_week: 'Friday', period_id: 'p2', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A' },
  { id: 'tt-f3', day_of_week: 'Friday', period_id: 'p3', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A' },
  { id: 'tt-f4', day_of_week: 'Friday', period_id: 'p4', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A' },
  { id: 'tt-f5', day_of_week: 'Friday', period_id: 'p5', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A' },
  { id: 'tt-f6', day_of_week: 'Friday', period_id: 'p6', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A' },

  // CSE-B Schedule
  { id: 'tt-b1', day_of_week: 'Monday', period_id: 'p1', subject_id: 'sub-401', faculty_id: 'fac-101', class_section: 'CSE-B' },
  { id: 'tt-b2', day_of_week: 'Monday', period_id: 'p2', subject_id: 'sub-402', faculty_id: 'fac-102', class_section: 'CSE-B' },
  { id: 'tt-b3', day_of_week: 'Monday', period_id: 'p3', subject_id: 'sub-403', faculty_id: 'fac-103', class_section: 'CSE-B' },
  { id: 'tt-b4', day_of_week: 'Monday', period_id: 'p4', subject_id: 'sub-404', faculty_id: 'fac-104', class_section: 'CSE-B' },
  { id: 'tt-b5', day_of_week: 'Monday', period_id: 'p5', subject_id: 'sub-405', faculty_id: 'fac-105', class_section: 'CSE-B' },
  
  { id: 'tt-bw1', day_of_week: 'Wednesday', period_id: 'p1', subject_id: 'sub-401', faculty_id: 'fac-101', class_section: 'CSE-B' },
  { id: 'tt-bw2', day_of_week: 'Wednesday', period_id: 'p2', subject_id: 'sub-402', faculty_id: 'fac-102', class_section: 'CSE-B' },
  { id: 'tt-bw3', day_of_week: 'Wednesday', period_id: 'p3', subject_id: 'sub-403', faculty_id: 'fac-103', class_section: 'CSE-B' },
  { id: 'tt-bw4', day_of_week: 'Wednesday', period_id: 'p4', subject_id: 'sub-404', faculty_id: 'fac-104', class_section: 'CSE-B' },
];

// Generate 62 Realistic Indian Students per Section
const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Ananya', 'Devansh', 'Ishan', 'Kavya', 'Manish', 'Neha', 'Rohan', 'Siddharth',
  'Tanvi', 'Vikram', 'Yash', 'Zoya', 'Rahul', 'Aman', 'Ravi', 'Priya', 'Pooja', 'Akash',
  'Bhavna', 'Chirag', 'Divya', 'Esha', 'Gaurav', 'Harsh', 'Ishita', 'Jatin', 'Kirti', 'Lokesh',
  'Megha', 'Nikhil', 'Omkar', 'Pranav', 'Riya', 'Sachin', 'Trupti', 'Utkarsh', 'Varun', 'Yogesh',
  'Aniket', 'Deepak', 'Geeta', 'Himanshu', 'Kunal', 'Mohit', 'Naveen', 'Payal', 'Rajesh', 'Sanjana',
  'Shubham', 'Tarun', 'Vandana', 'Vishal', 'Abhishek', 'Bhawna', 'Dinesh', 'Karan', 'Monika', 'Preeti',
  'Rohit', 'Saurabh'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Gupta', 'Verma', 'Malhotra', 'Singh', 'Kumar', 'Joshi', 'Mehta', 'Rao',
  'Nair', 'Choudhury', 'Vardhan', 'Khan', 'Deshmukh', 'Saxena', 'Nambiar', 'Kapoor', 'Reddy', 'Agarwal',
  'Bhatia', 'Chawla', 'Dube', 'Garg', 'Hegde', 'Iyer', 'Jain', 'Kulkarni', 'Mishra', 'Pandey'
];

export const generateSyntheticStudents = () => {
  const students = [];

  // Section CSE-A (62 Students)
  for (let i = 1; i <= 62; i++) {
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const rollNum = `23CSE${String(i).padStart(3, '0')}`;

    students.push({
      id: `st-csea-${i}`,
      roll_number: rollNum,
      enrollment_number: `EN-2023-CSE-${String(i).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      class_section: 'CSE-A',
      year: 3
    });
  }

  // Section CSE-B (62 Students)
  for (let i = 1; i <= 62; i++) {
    const fn = FIRST_NAMES[(i + 5) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 2 + 1) % LAST_NAMES.length];
    const rollNum = `23CSE${String(100 + i).padStart(3, '0')}`;

    students.push({
      id: `st-cseb-${i}`,
      roll_number: rollNum,
      enrollment_number: `EN-2023-CSE-${String(100 + i).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      class_section: 'CSE-B',
      year: 3
    });
  }

  return students;
};

// Generate 3-4 Weeks of Realistic Deterministic Attendance Records
export const generateSyntheticAttendanceHistory = (students) => {
  const records = [];
  const today = new Date();
  
  // Define 6 Student Behavior Profiles for CSE-A
  // Rahul Sharma (st-csea-1): Category 4 — High-risk Partial Day Bunker (skips P3, P5)
  // Devansh Verma (st-csea-4): Category 4 — Partial Day Bunker (skips P1, P4)
  // Ishan Malhotra (st-csea-5): Category 5 — Recurring P3 DBMS Skipper
  // Ravi Singh (st-csea-17): Category 6 — Full Day Absentee (sick/absent whole day)
  // Aman Patel (st-csea-16): Category 2 — Occasional Absences
  // Regulars: Category 1 (90-100% Present)

  // Generate 20 teaching days back
  for (let d = 20; d >= 0; d--) {
    const dateObj = new Date(today);
    dateObj.setDate(dateObj.getDate() - d);

    // Skip weekends
    const dayOfWeekNum = dateObj.getDay();
    if (dayOfWeekNum === 0 || dayOfWeekNum === 6) continue;

    const dateStr = dateObj.toISOString().split('T')[0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dayOfWeekNum];

    // Scheduled periods for Monday to Friday CSE-A
    const scheduledSlots = SYNTHETIC_TIMETABLE.filter(
      tt => tt.day_of_week === dayName && tt.class_section === 'CSE-A'
    );

    if (scheduledSlots.length === 0) continue;

    // For today (d === 0), only mark P1, P2, P3 so P4-P7 remain NOT_YET_MARKED
    const slotsToMark = d === 0 ? scheduledSlots.slice(0, 3) : scheduledSlots;

    students.forEach((student) => {
      if (student.class_section !== 'CSE-A') return;

      const stIdNum = parseInt(student.id.replace('st-csea-', ''), 10);

      slotsToMark.forEach((slot) => {
        let status = 'present';

        // Category 4: Rahul Sharma (st-csea-1) — Partial Bunk Pattern (skips P3 & P5)
        if (stIdNum === 1) {
          if (slot.period_id === 'p3' || slot.period_id === 'p5') {
            status = (d % 2 === 0) ? 'absent' : 'present';
          }
        }
        // Category 4: Devansh Verma (st-csea-4) — Partial Bunk Pattern (skips P1 & P4)
        else if (stIdNum === 4) {
          if (slot.period_id === 'p1' || slot.period_id === 'p4') {
            status = (d % 3 !== 0) ? 'absent' : 'present';
          }
        }
        // Category 5: Ishan Malhotra (st-csea-5) — Recurring Period 3 Skipper
        else if (stIdNum === 5) {
          if (slot.period_id === 'p3') {
            status = 'absent';
          }
        }
        // Category 6: Ravi Singh (st-csea-17) — Full Day Absence on specific dates
        else if (stIdNum === 17) {
          if (d === 3 || d === 8 || d === 14) {
            status = 'absent'; // Full day absent on these dates!
          }
        }
        // Category 3: Frequent Absentees (st-csea-10, st-csea-20)
        else if (stIdNum === 10 || stIdNum === 20) {
          if ((stIdNum + d + parseInt(slot.period_id.replace('p', ''))) % 4 === 0) {
            status = 'absent';
          }
        }
        // Category 2: Occasional Absentees (st-csea-2, st-csea-8)
        else if (stIdNum === 2 || stIdNum === 8) {
          if ((d * 7 + parseInt(slot.period_id.replace('p', ''))) % 11 === 0) {
            status = 'absent';
          }
        }
        // Category 1: Regular Students (95%+ Present)
        else {
          if ((stIdNum * 13 + d * 5 + parseInt(slot.period_id.replace('p', ''))) % 37 === 0) {
            status = 'absent';
          }
        }

        records.push({
          id: `rec-syn-${student.id}-${slot.period_id}-${dateStr}`,
          student_id: student.id,
          subject_id: slot.subject_id,
          faculty_id: slot.faculty_id,
          period_id: slot.period_id,
          date: dateStr,
          status: status,
          is_locked: true,
          is_edited: false,
          created_at: new Date(dateObj.getTime() + 1000 * 60 * 60).toISOString()
        });
      });
    });
  }

  return records;
};
