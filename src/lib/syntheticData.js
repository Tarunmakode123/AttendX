// ========================================================
// AttendX — Realistic Synthetic Dataset & Timetable Generator
// College: B.Tech Computer Science & Engineering (5th Semester)
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
  { id: 'sub-301', name: 'Artificial Intelligence', code: 'AI301', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-302', name: 'Database Management Systems', code: 'CS302', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-303', name: 'Operating Systems', code: 'CS303', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-304', name: 'Computer Networks', code: 'CS304', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-305', name: 'Software Engineering', code: 'CS305', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-306', name: 'Machine Learning', code: 'CS306', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-307', name: 'Compiler Design', code: 'CS307', class_section: 'CSE-A', year: 3, is_lab: false },
  { id: 'sub-308', name: 'Database Lab', code: 'CS302-L', class_section: 'CSE-A', year: 3, is_lab: true },

  // CSE-B Subjects
  { id: 'sub-401', name: 'Artificial Intelligence', code: 'AI301-B', class_section: 'CSE-B', year: 3, is_lab: false },
  { id: 'sub-402', name: 'Database Management Systems', code: 'CS302-B', class_section: 'CSE-B', year: 3, is_lab: false },
  { id: 'sub-403', name: 'Operating Systems', code: 'CS303-B', class_section: 'CSE-B', year: 3, is_lab: false },
  { id: 'sub-404', name: 'Computer Networks', code: 'CS304-B', class_section: 'CSE-B', year: 3, is_lab: false },
  { id: 'sub-405', name: 'Software Engineering', code: 'CS305-B', class_section: 'CSE-B', year: 3, is_lab: false },
  { id: 'sub-408', name: 'AI Lab', code: 'AI301-L', class_section: 'CSE-B', year: 3, is_lab: true },
];

export const SYNTHETIC_FACULTY_SUBJECTS = [
  { faculty_id: 'fac-101', subject_id: 'sub-301' },
  { faculty_id: 'fac-101', subject_id: 'sub-305' },
  { faculty_id: 'fac-101', subject_id: 'sub-401' },
  { faculty_id: 'fac-102', subject_id: 'sub-302' },
  { faculty_id: 'fac-102', subject_id: 'sub-308' },
  { faculty_id: 'fac-102', subject_id: 'sub-402' },
  { faculty_id: 'fac-103', subject_id: 'sub-303' },
  { faculty_id: 'fac-103', subject_id: 'sub-307' },
  { faculty_id: 'fac-103', subject_id: 'sub-403' },
  { faculty_id: 'fac-104', subject_id: 'sub-304' },
  { faculty_id: 'fac-104', subject_id: 'sub-404' },
  { faculty_id: 'fac-105', subject_id: 'sub-306' },
  { faculty_id: 'fac-105', subject_id: 'sub-405' },
  { faculty_id: 'admin-001', subject_id: 'sub-301' },
  { faculty_id: 'admin-001', subject_id: 'sub-302' },
  { faculty_id: 'admin-001', subject_id: 'sub-303' },
  { faculty_id: 'admin-001', subject_id: 'sub-304' },
  { faculty_id: 'admin-001', subject_id: 'sub-305' },
  { faculty_id: 'admin-001', subject_id: 'sub-306' },
  { faculty_id: 'admin-001', subject_id: 'sub-307' },
  { faculty_id: 'admin-001', subject_id: 'sub-308' },
];

// Master Timetable Schedule for CSE-A & CSE-B (Real College Format)
export const SYNTHETIC_TIMETABLE = [
  // Monday CSE-A
  { id: 'tt-m1', day_of_week: 'Monday', period_id: 'p1', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m2', day_of_week: 'Monday', period_id: 'p2', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m3', day_of_week: 'Monday', period_id: 'p3', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m4', day_of_week: 'Monday', period_id: 'p4', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m5', day_of_week: 'Monday', period_id: 'p5', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m6', day_of_week: 'Monday', period_id: 'p6', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-m7', day_of_week: 'Monday', period_id: 'p7', subject_id: 'sub-308', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'LAB-2' },

  // Tuesday CSE-A
  { id: 'tt-t1', day_of_week: 'Tuesday', period_id: 'p1', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t2', day_of_week: 'Tuesday', period_id: 'p2', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t3', day_of_week: 'Tuesday', period_id: 'p3', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t4', day_of_week: 'Tuesday', period_id: 'p4', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t5', day_of_week: 'Tuesday', period_id: 'p5', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t6', day_of_week: 'Tuesday', period_id: 'p6', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-t7', day_of_week: 'Tuesday', period_id: 'p7', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },

  // Wednesday CSE-A
  { id: 'tt-w1', day_of_week: 'Wednesday', period_id: 'p1', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' }, // Dr. Amit Sharma
  { id: 'tt-w2', day_of_week: 'Wednesday', period_id: 'p2', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'Room 301' }, // Prof. Neha Verma
  { id: 'tt-w3', day_of_week: 'Wednesday', period_id: 'p3', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' }, // Dr. Rahul Joshi
  { id: 'tt-w4', day_of_week: 'Wednesday', period_id: 'p4', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A', room_no: 'Room 301' }, // Prof. Priya Mehta
  { id: 'tt-w5', day_of_week: 'Wednesday', period_id: 'p5', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' }, // Dr. Amit Sharma
  { id: 'tt-w6', day_of_week: 'Wednesday', period_id: 'p6', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A', room_no: 'Room 301' }, // Prof. Vikram Singh
  { id: 'tt-w7', day_of_week: 'Wednesday', period_id: 'p7', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },

  // Thursday CSE-A
  { id: 'tt-th1', day_of_week: 'Thursday', period_id: 'p1', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-th2', day_of_week: 'Thursday', period_id: 'p2', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-th3', day_of_week: 'Thursday', period_id: 'p3', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-th4', day_of_week: 'Thursday', period_id: 'p4', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-th5', day_of_week: 'Thursday', period_id: 'p5', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-th6', day_of_week: 'Thursday', period_id: 'p6', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A', room_no: 'Room 301' },

  // Friday CSE-A
  { id: 'tt-f1', day_of_week: 'Friday', period_id: 'p1', subject_id: 'sub-304', faculty_id: 'fac-104', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-f2', day_of_week: 'Friday', period_id: 'p2', subject_id: 'sub-306', faculty_id: 'fac-105', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-f3', day_of_week: 'Friday', period_id: 'p3', subject_id: 'sub-305', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-f4', day_of_week: 'Friday', period_id: 'p4', subject_id: 'sub-303', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-f5', day_of_week: 'Friday', period_id: 'p5', subject_id: 'sub-302', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-f6', day_of_week: 'Friday', period_id: 'p6', subject_id: 'sub-301', faculty_id: 'fac-101', class_section: 'CSE-A', room_no: 'Room 301' },

  // Saturday CSE-A
  { id: 'tt-s1', day_of_week: 'Saturday', period_id: 'p1', subject_id: 'sub-307', faculty_id: 'fac-103', class_section: 'CSE-A', room_no: 'Room 301' },
  { id: 'tt-s2', day_of_week: 'Saturday', period_id: 'p2', subject_id: 'sub-308', faculty_id: 'fac-102', class_section: 'CSE-A', room_no: 'LAB-2' },

  // CSE-B Timetable
  { id: 'tt-b1', day_of_week: 'Monday', period_id: 'p1', subject_id: 'sub-401', faculty_id: 'fac-101', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-b2', day_of_week: 'Monday', period_id: 'p2', subject_id: 'sub-402', faculty_id: 'fac-102', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-b3', day_of_week: 'Monday', period_id: 'p3', subject_id: 'sub-403', faculty_id: 'fac-103', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-b4', day_of_week: 'Monday', period_id: 'p4', subject_id: 'sub-404', faculty_id: 'fac-104', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-b5', day_of_week: 'Monday', period_id: 'p5', subject_id: 'sub-405', faculty_id: 'fac-105', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-b6', day_of_week: 'Monday', period_id: 'p6', subject_id: 'sub-408', faculty_id: 'fac-101', class_section: 'CSE-B', room_no: 'AI LAB' },
  
  { id: 'tt-bw1', day_of_week: 'Wednesday', period_id: 'p1', subject_id: 'sub-401', faculty_id: 'fac-101', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-bw2', day_of_week: 'Wednesday', period_id: 'p2', subject_id: 'sub-402', faculty_id: 'fac-102', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-bw3', day_of_week: 'Wednesday', period_id: 'p3', subject_id: 'sub-403', faculty_id: 'fac-103', class_section: 'CSE-B', room_no: 'Room 304' },
  { id: 'tt-bw4', day_of_week: 'Wednesday', period_id: 'p4', subject_id: 'sub-404', faculty_id: 'fac-104', class_section: 'CSE-B', room_no: 'Room 304' },
];

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
  'Nair', 'Choudhury', 'Vardhan', 'Khan', 'Deshmukh', 'Saxena', 'Nambiar', 'Kapoor', 'Reddy', 'Agarwal'
];

export const generateSyntheticStudents = () => {
  const students = [];

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

// Generate 4 Weeks of History with Lecture Sessions & Attendance Records
export const generateSyntheticAttendanceHistory = (students) => {
  const sessions = [];
  const records = [];
  const today = new Date();

  for (let d = 20; d >= 0; d--) {
    const dateObj = new Date(today);
    dateObj.setDate(dateObj.getDate() - d);

    const dayOfWeekNum = dateObj.getDay();
    if (dayOfWeekNum === 0 || dayOfWeekNum === 6) continue;

    const dateStr = dateObj.toISOString().split('T')[0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dayOfWeekNum];

    const scheduledSlots = SYNTHETIC_TIMETABLE.filter(
      tt => tt.day_of_week === dayName && tt.class_section === 'CSE-A'
    );

    if (scheduledSlots.length === 0) continue;

    const slotsToMark = d === 0 ? scheduledSlots.slice(0, 3) : scheduledSlots;

    slotsToMark.forEach((slot) => {
      // Create Lecture Session Entity with UNIQUE(date, class_section, period_id)
      const sessionId = `sess-${slot.class_section}-${slot.period_id}-${dateStr}`;

      const sessionObj = {
        id: sessionId,
        date: dateStr,
        class_section: slot.class_section,
        period_id: slot.period_id,
        subject_id: slot.subject_id,
        faculty_id: slot.faculty_id,
        created_at: new Date(dateObj.getTime() + 1000 * 60 * 30).toISOString()
      };

      sessions.push(sessionObj);

      students.forEach((student) => {
        if (student.class_section !== 'CSE-A') return;

        const stIdNum = parseInt(student.id.replace('st-csea-', ''), 10);
        let status = 'present';

        if (stIdNum === 1) { // Rahul Sharma (skips P3, P5)
          if (slot.period_id === 'p3' || slot.period_id === 'p5') {
            status = (d % 2 === 0) ? 'absent' : 'present';
          }
        } else if (stIdNum === 4) { // Devansh Verma (skips P1, P4)
          if (slot.period_id === 'p1' || slot.period_id === 'p4') {
            status = (d % 3 !== 0) ? 'absent' : 'present';
          }
        } else if (stIdNum === 5) { // Ishan Malhotra (skips P3 DBMS)
          if (slot.period_id === 'p3') status = 'absent';
        } else if (stIdNum === 17) { // Ravi Singh (Full Day Absence)
          if (d === 3 || d === 8 || d === 14) status = 'absent';
        } else if (stIdNum === 10 || stIdNum === 20) { // Frequent Absentees
          if ((stIdNum + d + parseInt(slot.period_id.replace('p', ''))) % 4 === 0) status = 'absent';
        } else if (stIdNum === 2 || stIdNum === 8) { // Occasional Absentees
          if ((d * 7 + parseInt(slot.period_id.replace('p', ''))) % 11 === 0) status = 'absent';
        } else { // Regular
          if ((stIdNum * 13 + d * 5 + parseInt(slot.period_id.replace('p', ''))) % 37 === 0) status = 'absent';
        }

        records.push({
          id: `rec-syn-${student.id}-${sessionId}`,
          lecture_session_id: sessionId,
          student_id: student.id,
          status: status,
          is_locked: true,
          is_edited: false,
          created_at: new Date(dateObj.getTime() + 1000 * 60 * 60).toISOString()
        });
      });
    });
  }

  return { sessions, records };
};
