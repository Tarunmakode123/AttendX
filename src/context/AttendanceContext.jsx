import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';

const AttendanceContext = createContext();

// Pre-defined Lecture Periods
export const DEFAULT_PERIODS = [
  { id: 'p1', period_number: 1, label: 'Period 1 (09:00 - 10:00)', start_time: '09:00', end_time: '10:00' },
  { id: 'p2', period_number: 2, label: 'Period 2 (10:00 - 11:00)', start_time: '10:00', end_time: '11:00' },
  { id: 'p3', period_number: 3, label: 'Period 3 (11:15 - 12:15)', start_time: '11:15', end_time: '12:15' },
  { id: 'p4', period_number: 4, label: 'Period 4 (01:15 - 02:15)', start_time: '13:15', end_time: '14:15' },
  { id: 'p5', period_number: 5, label: 'Period 5 (02:15 - 03:15)', start_time: '14:15', end_time: '15:15' },
];

// Pre-defined Subjects
export const DEFAULT_SUBJECTS = [
  { id: 'sub-101', name: 'Data Structures & Algorithms', code: 'CS301', class_section: 'CS-A', year: 3 },
  { id: 'sub-102', name: 'Web Technology', code: 'CS302', class_section: 'CS-A', year: 3 },
  { id: 'sub-103', name: 'Database Management Systems', code: 'CS303', class_section: 'CS-A', year: 3 },
  { id: 'sub-104', name: 'Operating Systems', code: 'CS304', class_section: 'CS-A', year: 3 },
  { id: 'sub-201', name: 'Computer Networks', code: 'CS305', class_section: 'CS-B', year: 3 },
  { id: 'sub-202', name: 'Software Engineering', code: 'CS306', class_section: 'CS-B', year: 3 },
];

// Faculty-Subject Mappings (DB Constraint Table Mock)
export const DEFAULT_FACULTY_SUBJECTS = [
  { faculty_id: 'fac-001', subject_id: 'sub-101' }, // Prof. Alan -> DSA
  { faculty_id: 'fac-001', subject_id: 'sub-103' }, // Prof. Alan -> DBMS
  { faculty_id: 'fac-002', subject_id: 'sub-102' }, // Prof. Priya -> Web Tech
  { faculty_id: 'fac-002', subject_id: 'sub-104' }, // Prof. Priya -> OS
  { faculty_id: 'admin-001', subject_id: 'sub-101' }, // Admin full
  { faculty_id: 'admin-001', subject_id: 'sub-102' },
  { faculty_id: 'admin-001', subject_id: 'sub-103' },
  { faculty_id: 'admin-001', subject_id: 'sub-104' },
  { faculty_id: 'admin-001', subject_id: 'sub-201' },
  { faculty_id: 'admin-001', subject_id: 'sub-202' },
];

// Sample Initial Students Roster (CS-A & CS-B)
export const INITIAL_STUDENTS = [
  { id: 'st-01', roll_number: '2024-CS-001', name: 'Aarav Sharma', class_section: 'CS-A', year: 3 },
  { id: 'st-02', roll_number: '2024-CS-002', name: 'Aditi Patel', class_section: 'CS-A', year: 3 },
  { id: 'st-03', roll_number: '2024-CS-003', name: 'Ananya Gupta', class_section: 'CS-A', year: 3 },
  { id: 'st-04', roll_number: '2024-CS-004', name: 'Devansh Verma', class_section: 'CS-A', year: 3 },
  { id: 'st-05', roll_number: '2024-CS-005', name: 'Ishan Malhotra', class_section: 'CS-A', year: 3 },
  { id: 'st-06', roll_number: '2024-CS-006', name: 'Kavya Singh', class_section: 'CS-A', year: 3 },
  { id: 'st-07', roll_number: '2024-CS-007', name: 'Manish Kumar', class_section: 'CS-A', year: 3 },
  { id: 'st-08', roll_number: '2024-CS-008', name: 'Neha Joshi', class_section: 'CS-A', year: 3 },
  { id: 'st-09', roll_number: '2024-CS-009', name: 'Rohan Mehta', class_section: 'CS-A', year: 3 },
  { id: 'st-10', roll_number: '2024-CS-010', name: 'Siddharth Rao', class_section: 'CS-A', year: 3 },
  { id: 'st-11', roll_number: '2024-CS-011', name: 'Tanvi Nair', class_section: 'CS-A', year: 3 },
  { id: 'st-12', roll_number: '2024-CS-012', name: 'Vikram Choudhury', class_section: 'CS-A', year: 3 },
  { id: 'st-21', roll_number: '2024-CS-101', name: 'Yash Vardhan', class_section: 'CS-B', year: 3 },
  { id: 'st-22', roll_number: '2024-CS-102', name: 'Zoya Khan', class_section: 'CS-B', year: 3 },
];

export const AttendanceProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('attendx_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [periods] = useState(DEFAULT_PERIODS);
  const [facultySubjects, setFacultySubjects] = useState(DEFAULT_FACULTY_SUBJECTS);

  // Helper date formatted YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Attendance Records State
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('attendx_records');
    if (saved) return JSON.parse(saved);

    // Default Seed Attendance showing realistic bunk patterns for demo testing
    return [
      // Period 1 Today CS-A (Prof. Alan - DSA)
      { id: 'rec-01', student_id: 'st-01', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-02', student_id: 'st-02', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-03', student_id: 'st-03', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-04', student_id: 'st-04', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'absent', is_locked: true }, // Devansh absent P1
      { id: 'rec-05', student_id: 'st-05', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true }, // Ishan present P1
      { id: 'rec-06', student_id: 'st-06', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-07', student_id: 'st-07', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'absent', is_locked: true }, // Manish absent P1
      { id: 'rec-08', student_id: 'st-08', subject_id: 'sub-101', faculty_id: 'fac-001', period_id: 'p1', date: todayStr, status: 'present', is_locked: true },

      // Period 2 Today CS-A (Prof. Priya - Web Tech)
      { id: 'rec-11', student_id: 'st-01', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-12', student_id: 'st-02', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-13', student_id: 'st-03', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-14', student_id: 'st-04', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true }, // Devansh present P2 -> Bunk Flag!
      { id: 'rec-15', student_id: 'st-05', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'absent', is_locked: true },  // Ishan absent P2 -> Bunk Flag!
      { id: 'rec-16', student_id: 'st-06', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-17', student_id: 'st-07', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'absent', is_locked: true },  // Manish absent P1 & P2 -> Full absent, NOT bunk
      { id: 'rec-18', student_id: 'st-08', subject_id: 'sub-102', faculty_id: 'fac-002', period_id: 'p2', date: todayStr, status: 'present', is_locked: true },

      // Period 3 Today CS-A (Prof. Alan - DBMS)
      { id: 'rec-21', student_id: 'st-01', subject_id: 'sub-103', faculty_id: 'fac-001', period_id: 'p3', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-24', student_id: 'st-04', subject_id: 'sub-103', faculty_id: 'fac-001', period_id: 'p3', date: todayStr, status: 'present', is_locked: true },
      { id: 'rec-25', student_id: 'st-05', subject_id: 'sub-103', faculty_id: 'fac-001', period_id: 'p3', date: todayStr, status: 'absent', is_locked: true },  // Ishan absent P3
      { id: 'rec-29', student_id: 'st-09', subject_id: 'sub-103', faculty_id: 'fac-001', period_id: 'p3', date: todayStr, status: 'present', is_locked: true },
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('attendx_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendx_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Check if a specific period/subject/date submission is locked
  const isPeriodSubmitted = (subjectId, periodId, date) => {
    return attendanceRecords.some(
      r => r.subject_id === subjectId && r.period_id === periodId && r.date === date
    );
  };

  // Submit New Attendance Batch
  const submitAttendance = async ({ classSection, subjectId, facultyId, periodId, date, markMap }) => {
    // Check faculty-subject authorization (DB logic check)
    const isAssigned = facultySubjects.some(
      fs => fs.faculty_id === facultyId && fs.subject_id === subjectId
    );
    if (!isAssigned && facultyId !== 'admin-001') {
      throw new Error('Faculty is not assigned to teach this subject (DB RLS check)');
    }

    const classStudents = students.filter(s => s.class_section === classSection);
    const newRecords = classStudents.map(student => ({
      id: 'rec-' + Date.now() + '-' + student.id,
      student_id: student.id,
      subject_id: subjectId,
      faculty_id: facultyId,
      period_id: periodId,
      date: date,
      status: markMap[student.id] || 'present',
      is_locked: true,
      is_edited: false,
      created_at: new Date().toISOString()
    }));

    // Filter out existing records for this combo to prevent duplicates
    const updated = attendanceRecords.filter(
      r => !(r.subject_id === subjectId && r.period_id === periodId && r.date === date)
    ).concat(newRecords);

    setAttendanceRecords(updated);
    return { success: true, count: newRecords.length };
  };

  // Admin Override: Unlock and Re-edit Period with Audit Trail
  const unlockAndEditPeriod = async ({ subjectId, periodId, date, updatedMarks, adminId }) => {
    const nowIso = new Date().toISOString();

    const updated = attendanceRecords.map(r => {
      if (r.subject_id === subjectId && r.period_id === periodId && r.date === date) {
        const newStatus = updatedMarks[r.student_id];
        if (newStatus && newStatus !== r.status) {
          // Trigger audit logging (imitates Postgres BEFORE UPDATE trigger)
          return {
            ...r,
            original_status: r.original_status || r.status,
            status: newStatus,
            is_edited: true,
            edited_by: adminId,
            edited_at: nowIso,
            is_locked: true
          };
        }
      }
      return r;
    });

    setAttendanceRecords(updated);
    return { success: true };
  };

  // Compute Daily Attendance Matrix & Bunk Flags
  const getDailyMatrix = (classSection, date) => {
    const classStudents = students.filter(s => s.class_section === classSection);
    const dateRecords = attendanceRecords.filter(r => r.date === date);

    // Active periods that have records on this date for this class
    const activePeriodIds = Array.from(
      new Set(
        dateRecords
          .filter(r => classStudents.some(s => s.id === r.student_id))
          .map(r => r.period_id)
      )
    );

    const activePeriods = periods
      .filter(p => activePeriodIds.includes(p.id))
      .sort((a, b) => a.period_number - b.period_number);

    const rows = classStudents.map(student => {
      const studentRecs = dateRecords.filter(r => r.student_id === student.id);
      
      const periodStatusMap = {};
      let presentCount = 0;
      let absentCount = 0;

      studentRecs.forEach(r => {
        periodStatusMap[r.period_id] = {
          status: r.status,
          is_edited: r.is_edited,
          original_status: r.original_status,
          edited_at: r.edited_at
        };
        if (r.status === 'present') presentCount++;
        if (r.status === 'absent') absentCount++;
      });

      // CORE BUNK DETECTION LOGIC:
      // Flagged if student has AT LEAST 1 Present AND AT LEAST 1 Absent on the same date!
      const isFlagged = presentCount > 0 && absentCount > 0;

      return {
        student,
        periodStatusMap,
        presentCount,
        absentCount,
        totalMarked: studentRecs.length,
        isFlagged
      };
    });

    return {
      activePeriods,
      rows,
      totalStudents: classStudents.length,
      flaggedCount: rows.filter(r => r.isFlagged).length
    };
  };

  // Weekly/Monthly Leaderboard Ranking
  const getBunkLeaderboard = (classSection, daysBack = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const classStudents = students.filter(
      s => !classSection || s.class_section === classSection
    );

    // Group records by student and date
    const studentDayMap = {};

    attendanceRecords.forEach(r => {
      if (r.date >= cutoffStr) {
        const key = `${r.student_id}_${r.date}`;
        if (!studentDayMap[key]) {
          studentDayMap[key] = { student_id: r.student_id, date: r.date, present: 0, absent: 0 };
        }
        if (r.status === 'present') studentDayMap[key].present++;
        if (r.status === 'absent') studentDayMap[key].absent++;
      }
    });

    // Count bunk instances per student
    const studentBunkCounts = {};
    Object.values(studentDayMap).forEach(item => {
      if (item.present > 0 && item.absent > 0) {
        studentBunkCounts[item.student_id] = (studentBunkCounts[item.student_id] || 0) + 1;
      }
    });

    const leaderboard = classStudents
      .map(st => ({
        student: st,
        bunkCount: studentBunkCounts[st.id] || 0
      }))
      .sort((a, b) => b.bunkCount - a.bunkCount);

    return leaderboard;
  };

  // Pattern Insights for a specific student (Stretch Goal)
  const getStudentPatternInsights = (studentId) => {
    const studentRecs = attendanceRecords.filter(r => r.student_id === studentId);
    
    // Group by date
    const dayGroups = {};
    studentRecs.forEach(r => {
      if (!dayGroups[r.date]) dayGroups[r.date] = [];
      dayGroups[r.date].push(r);
    });

    const periodAbsentCounts = {};
    let totalBunkDays = 0;

    Object.entries(dayGroups).forEach(([date, recs]) => {
      const hasPresent = recs.some(r => r.status === 'present');
      const hasAbsent = recs.some(r => r.status === 'absent');

      if (hasPresent && hasAbsent) {
        totalBunkDays++;
        recs.forEach(r => {
          if (r.status === 'absent') {
            periodAbsentCounts[r.period_id] = (periodAbsentCounts[r.period_id] || 0) + 1;
          }
        });
      }
    });

    const periodBreakdown = periods.map(p => ({
      period: p,
      absentOnBunkDays: periodAbsentCounts[p.id] || 0,
      percentage: totalBunkDays > 0 ? Math.round(((periodAbsentCounts[p.id] || 0) / totalBunkDays) * 100) : 0
    }));

    // Find worst period
    const topSkipped = [...periodBreakdown].sort((a, b) => b.absentOnBunkDays - a.absentOnBunkDays)[0];

    return {
      totalBunkDays,
      periodBreakdown,
      topSkipped: topSkipped && topSkipped.absentOnBunkDays > 0 ? topSkipped : null
    };
  };

  // CSV Bulk Import for Students Roster
  const importStudentsFromCSV = (fileOrContent, classSection) => {
    return new Promise((resolve, reject) => {
      Papa.parse(fileOrContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const newStudents = results.data.map((row, idx) => {
              const rollNumber = row['Roll Number'] || row['roll_number'] || row['Roll No'] || `ROLL-${Date.now()}-${idx}`;
              const name = row['Name'] || row['name'] || row['Student Name'] || `Student ${idx + 1}`;
              const section = row['Class'] || row['class_section'] || row['Section'] || classSection || 'CS-A';
              const year = parseInt(row['Year'] || row['year'] || '3', 10);

              return {
                id: 'st-csv-' + Date.now() + '-' + idx,
                roll_number: rollNumber,
                name: name,
                class_section: section,
                year: year
              };
            });

            // Merge with existing students, replacing duplicates by roll number
            setStudents(prev => {
              const filtered = prev.filter(s => !newStudents.some(ns => ns.roll_number === s.roll_number));
              return [...filtered, ...newStudents];
            });

            resolve({ count: newStudents.length, data: newStudents });
          } catch (err) {
            reject(err);
          }
        },
        error: (error) => reject(error)
      });
    });
  };

  const addSingleStudent = (studentData) => {
    const newSt = {
      id: 'st-' + Date.now(),
      ...studentData
    };
    setStudents(prev => [newSt, ...prev]);
    return newSt;
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        subjects,
        periods,
        facultySubjects,
        attendanceRecords,
        isPeriodSubmitted,
        submitAttendance,
        unlockAndEditPeriod,
        getDailyMatrix,
        getBunkLeaderboard,
        getStudentPatternInsights,
        importStudentsFromCSV,
        addSingleStudent
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
