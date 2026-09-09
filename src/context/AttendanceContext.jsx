import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import {
  SYNTHETIC_PERIODS,
  SYNTHETIC_SUBJECTS,
  SYNTHETIC_FACULTY_SUBJECTS,
  SYNTHETIC_TIMETABLE,
  generateSyntheticStudents,
  generateSyntheticAttendanceHistory
} from '../lib/syntheticData';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [periods] = useState(SYNTHETIC_PERIODS);
  const [subjects, setSubjects] = useState(SYNTHETIC_SUBJECTS);
  const [facultySubjects, setFacultySubjects] = useState(SYNTHETIC_FACULTY_SUBJECTS);
  const [timetable, setTimetable] = useState(SYNTHETIC_TIMETABLE);

  // Initialize 124 Synthetic Students (CSE-A & CSE-B)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('attendx_synthetic_students_v2');
    return saved ? JSON.parse(saved) : generateSyntheticStudents();
  });

  // Initialize 4-Week Deterministic Attendance History
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('attendx_synthetic_records_v2');
    if (saved) return JSON.parse(saved);
    const initialStudents = generateSyntheticStudents();
    return generateSyntheticAttendanceHistory(initialStudents);
  });

  // Persist local changes
  useEffect(() => {
    localStorage.setItem('attendx_synthetic_students_v2', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendx_synthetic_records_v2', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Helper: Get expected scheduled periods from timetable for a class & date
  const getExpectedPeriods = (classSection, dateStr) => {
    const dateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    const scheduled = timetable.filter(
      tt => tt.day_of_week === dayName && tt.class_section === classSection
    );

    return scheduled.map(slot => {
      const periodObj = periods.find(p => p.id === slot.period_id);
      const subjectObj = subjects.find(s => s.id === slot.subject_id);
      return {
        ...slot,
        period: periodObj,
        subject: subjectObj
      };
    }).sort((a, b) => (a.period?.period_number || 0) - (b.period?.period_number || 0));
  };

  // Helper: Get faculty schedule for today
  const getFacultyTodaySchedule = (facultyId, dateStr = new Date().toISOString().split('T')[0]) => {
    const dateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    const scheduledSlots = timetable.filter(tt => {
      if (tt.day_of_week !== dayName) return false;
      if (facultyId === 'admin-001') return true; // HOD sees all
      return tt.faculty_id === facultyId;
    });

    return scheduledSlots.map(slot => {
      const periodObj = periods.find(p => p.id === slot.period_id);
      const subjectObj = subjects.find(s => s.id === slot.subject_id);
      const sectionStudents = students.filter(s => s.class_section === slot.class_section);

      const isSubmitted = attendanceRecords.some(
        r => r.subject_id === slot.subject_id && r.period_id === slot.period_id && r.date === dateStr
      );

      return {
        slotId: slot.id,
        class_section: slot.class_section,
        subject: subjectObj,
        period: periodObj,
        date: dateStr,
        studentCount: sectionStudents.length,
        isSubmitted
      };
    }).sort((a, b) => (a.period?.period_number || 0) - (b.period?.period_number || 0));
  };

  const isPeriodSubmitted = (subjectId, periodId, date) => {
    return attendanceRecords.some(
      r => r.subject_id === subjectId && r.period_id === periodId && r.date === date
    );
  };

  const submitAttendance = async ({ classSection, subjectId, facultyId, periodId, date, markMap }) => {
    const isAssigned = facultySubjects.some(
      fs => fs.faculty_id === facultyId && fs.subject_id === subjectId
    );
    if (!isAssigned && facultyId !== 'admin-001') {
      throw new Error('Faculty is not assigned to teach this subject (DB RLS check)');
    }

    const classStudents = students.filter(s => s.class_section === classSection);
    const newRecords = classStudents.map(student => ({
      id: `rec-${Date.now()}-${student.id}-${periodId}`,
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

    const updated = attendanceRecords.filter(
      r => !(r.subject_id === subjectId && r.period_id === periodId && r.date === date)
    ).concat(newRecords);

    setAttendanceRecords(updated);
    return { success: true, count: newRecords.length };
  };

  const unlockAndEditPeriod = async ({ subjectId, periodId, date, updatedMarks, adminId }) => {
    const nowIso = new Date().toISOString();

    const updated = attendanceRecords.map(r => {
      if (r.subject_id === subjectId && r.period_id === periodId && r.date === date) {
        const newStatus = updatedMarks[r.student_id];
        if (newStatus && newStatus !== r.status) {
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

  // Compute Daily Attendance Matrix & Bunk Classification Rules
  const getDailyMatrix = (classSection, dateStr) => {
    const classStudents = students.filter(s => s.class_section === classSection);
    const expectedSlots = getExpectedPeriods(classSection, dateStr);
    const dateRecords = attendanceRecords.filter(r => r.date === dateStr);

    // Active periods that have attendance records marked
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

    let totalFullPresent = 0;
    let totalFullAbsent = 0;
    let totalPartialBunks = 0;
    let totalNotMarkedYet = 0;

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

      // Bunk Rules Evaluation:
      // Rule A: Full Day Present
      // Rule B: Full Day Absent -> FULL_DAY_ABSENCE (Not bunk!)
      // Rule C: At least 1 Present AND at least 1 Absent -> PARTIAL_DAY_ABSENCE ("Possible Bunk / Irregular Attendance")
      // Rule D: Not yet marked -> NOT_YET_MARKED
      let statusCategory = 'NOT_YET_MARKED';

      if (studentRecs.length > 0) {
        if (presentCount > 0 && absentCount > 0) {
          statusCategory = 'PARTIAL_DAY_ABSENCE'; // BUNK FLAGGED!
          totalPartialBunks++;
        } else if (absentCount > 0 && presentCount === 0) {
          statusCategory = 'FULL_DAY_ABSENCE';
          totalFullAbsent++;
        } else if (presentCount > 0 && absentCount === 0) {
          statusCategory = 'REGULAR';
          totalFullPresent++;
        }
      } else {
        totalNotMarkedYet++;
      }

      return {
        student,
        periodStatusMap,
        presentCount,
        absentCount,
        totalMarked: studentRecs.length,
        statusCategory,
        isFlagged: statusCategory === 'PARTIAL_DAY_ABSENCE'
      };
    });

    return {
      activePeriods,
      expectedSlots,
      rows,
      totalStudents: classStudents.length,
      flaggedCount: totalPartialBunks,
      totalFullPresent,
      totalFullAbsent,
      totalNotMarkedYet
    };
  };

  // Weekly/Monthly Leaderboard Ranking (Sorted by Partial Bunk Cases first)
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
          studentDayMap[key] = { student_id: r.student_id, date: r.date, present: 0, absent: 0, total: 0 };
        }
        if (r.status === 'present') studentDayMap[key].present++;
        if (r.status === 'absent') studentDayMap[key].absent++;
        studentDayMap[key].total++;
      }
    });

    const studentStats = {};

    classStudents.forEach(st => {
      studentStats[st.id] = {
        student: st,
        partialBunkCount: 0,
        totalAbsentLectures: 0,
        totalMarkedLectures: 0,
        periodAbsenceMap: {}
      };
    });

    Object.values(studentDayMap).forEach(item => {
      const stat = studentStats[item.student_id];
      if (stat) {
        stat.totalAbsentLectures += item.absent;
        stat.totalMarkedLectures += item.total;
        if (item.present > 0 && item.absent > 0) {
          stat.partialBunkCount++;
        }
      }
    });

    // Populate period absence map for most common period skip
    attendanceRecords.forEach(r => {
      if (r.date >= cutoffStr && r.status === 'absent') {
        const stat = studentStats[r.student_id];
        if (stat) {
          stat.periodAbsenceMap[r.period_id] = (stat.periodAbsenceMap[r.period_id] || 0) + 1;
        }
      }
    });

    const leaderboard = Object.values(studentStats)
      .map(item => {
        const attendancePct = item.totalMarkedLectures > 0
          ? Math.round(((item.totalMarkedLectures - item.totalAbsentLectures) / item.totalMarkedLectures) * 100)
          : 100;

        // Find most common absent period
        let topPeriodId = null;
        let maxSkips = 0;
        Object.entries(item.periodAbsenceMap).forEach(([pId, count]) => {
          if (count > maxSkips) {
            maxSkips = count;
            topPeriodId = pId;
          }
        });

        const topPeriodObj = periods.find(p => p.id === topPeriodId);

        return {
          student: item.student,
          partialBunkCount: item.partialBunkCount,
          totalAbsentLectures: item.totalAbsentLectures,
          attendancePct,
          mostCommonPeriod: topPeriodObj ? topPeriodObj.label.split(' ')[0] + ' ' + topPeriodObj.label.split(' ')[1] : 'N/A'
        };
      })
      .sort((a, b) => {
        if (b.partialBunkCount !== a.partialBunkCount) {
          return b.partialBunkCount - a.partialBunkCount; // Primary sort by partial bunk cases
        }
        return b.totalAbsentLectures - a.totalAbsentLectures; // Secondary sort by total absences
      });

    return leaderboard;
  };

  // Pattern Insights for a specific student
  const getStudentPatternInsights = (studentId) => {
    const studentRecs = attendanceRecords.filter(r => r.student_id === studentId);
    
    const dayGroups = {};
    studentRecs.forEach(r => {
      if (!dayGroups[r.date]) dayGroups[r.date] = [];
      dayGroups[r.date].push(r);
    });

    const periodAbsentCounts = {};
    const subjectAbsentCounts = {};
    let totalBunkDays = 0;
    let totalFullAbsentDays = 0;

    Object.entries(dayGroups).forEach(([date, recs]) => {
      const hasPresent = recs.some(r => r.status === 'present');
      const hasAbsent = recs.some(r => r.status === 'absent');

      if (hasPresent && hasAbsent) {
        totalBunkDays++;
        recs.forEach(r => {
          if (r.status === 'absent') {
            periodAbsentCounts[r.period_id] = (periodAbsentCounts[r.period_id] || 0) + 1;
            subjectAbsentCounts[r.subject_id] = (subjectAbsentCounts[r.subject_id] || 0) + 1;
          }
        });
      } else if (!hasPresent && hasAbsent) {
        totalFullAbsentDays++;
      }
    });

    const periodBreakdown = periods.map(p => ({
      period: p,
      absentOnBunkDays: periodAbsentCounts[p.id] || 0,
      percentage: totalBunkDays > 0 ? Math.round(((periodAbsentCounts[p.id] || 0) / totalBunkDays) * 100) : 0
    }));

    const topSkippedPeriod = [...periodBreakdown].sort((a, b) => b.absentOnBunkDays - a.absentOnBunkDays)[0];

    // Subject breakdown
    let topSkippedSubject = null;
    let maxSubSkips = 0;
    Object.entries(subjectAbsentCounts).forEach(([sId, count]) => {
      if (count > maxSubSkips) {
        maxSubSkips = count;
        topSkippedSubject = subjects.find(s => s.id === sId);
      }
    });

    return {
      totalBunkDays,
      totalFullAbsentDays,
      periodBreakdown,
      topSkippedPeriod: topSkippedPeriod && topSkippedPeriod.absentOnBunkDays > 0 ? topSkippedPeriod : null,
      topSkippedSubject
    };
  };

  const resetToSyntheticDefaults = () => {
    const initStudents = generateSyntheticStudents();
    const initRecs = generateSyntheticAttendanceHistory(initStudents);
    setStudents(initStudents);
    setSubjects(SYNTHETIC_SUBJECTS);
    setFacultySubjects(SYNTHETIC_FACULTY_SUBJECTS);
    setTimetable(SYNTHETIC_TIMETABLE);
    setAttendanceRecords(initRecs);
    localStorage.clear();
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        subjects,
        periods,
        facultySubjects,
        timetable,
        attendanceRecords,
        isPeriodSubmitted,
        submitAttendance,
        unlockAndEditPeriod,
        getDailyMatrix,
        getBunkLeaderboard,
        getStudentPatternInsights,
        getExpectedPeriods,
        getFacultyTodaySchedule,
        resetToSyntheticDefaults
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
