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

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('attendx_hardened_students_v3');
    return saved ? JSON.parse(saved) : generateSyntheticStudents();
  });

  // Lecture Sessions State (UNIQUE(date, class_section, period_id))
  const [lectureSessions, setLectureSessions] = useState(() => {
    const saved = localStorage.getItem('attendx_hardened_sessions_v3');
    if (saved) return JSON.parse(saved);
    const initialStudents = generateSyntheticStudents();
    const { sessions } = generateSyntheticAttendanceHistory(initialStudents);
    return sessions;
  });

  // Attendance Records State (references lecture_session_id)
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('attendx_hardened_records_v3');
    if (saved) return JSON.parse(saved);
    const initialStudents = generateSyntheticStudents();
    const { records } = generateSyntheticAttendanceHistory(initialStudents);
    return records;
  });

  useEffect(() => {
    localStorage.setItem('attendx_hardened_students_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendx_hardened_sessions_v3', JSON.stringify(lectureSessions));
  }, [lectureSessions]);

  useEffect(() => {
    localStorage.setItem('attendx_hardened_records_v3', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Find existing lecture session by (date, class_section, period_id)
  const getLectureSession = (dateStr, classSection, periodId) => {
    return lectureSessions.find(
      s => s.date === dateStr && s.class_section === classSection && s.period_id === periodId
    );
  };

  const isPeriodSubmitted = (subjectId, periodId, date, classSection) => {
    if (classSection) {
      return Boolean(getLectureSession(date, classSection, periodId));
    }
    return lectureSessions.some(s => s.period_id === periodId && s.date === date && s.subject_id === subjectId);
  };

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

  const getFacultyTodaySchedule = (facultyId, dateStr = new Date().toISOString().split('T')[0]) => {
    const dateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];

    const scheduledSlots = timetable.filter(tt => {
      if (tt.day_of_week !== dayName) return false;
      if (facultyId === 'admin-001') return true;
      return tt.faculty_id === facultyId;
    });

    return scheduledSlots.map(slot => {
      const periodObj = periods.find(p => p.id === slot.period_id);
      const subjectObj = subjects.find(s => s.id === slot.subject_id);
      const sectionStudents = students.filter(s => s.class_section === slot.class_section);

      const existingSession = getLectureSession(dateStr, slot.class_section, slot.period_id);

      return {
        slotId: slot.id,
        class_section: slot.class_section,
        subject: subjectObj,
        period: periodObj,
        date: dateStr,
        room_no: slot.room_no || 'Room 301',
        studentCount: sectionStudents.length,
        isSubmitted: Boolean(existingSession),
        session: existingSession
      };
    }).sort((a, b) => (a.period?.period_number || 0) - (b.period?.period_number || 0));
  };

  // Submit New Attendance Session (Enforces UNIQUE(date, class_section, period_id))
  const submitAttendance = async ({ classSection, subjectId, facultyId, periodId, date, markMap }) => {
    // 1. Check if session already exists for this DATE + CLASS_SECTION + PERIOD_ID
    const existingSession = getLectureSession(date, classSection, periodId);
    if (existingSession) {
      throw new Error(`Attendance for ${classSection} on ${date} (Period ${periodId}) has ALREADY been submitted! Duplicate submission blocked.`);
    }

    // 2. Validate faculty assignment / timetable slot
    const isAssigned = facultySubjects.some(
      fs => fs.faculty_id === facultyId && fs.subject_id === subjectId
    );
    if (!isAssigned && facultyId !== 'admin-001') {
      throw new Error('Faculty is not authorized to submit attendance for this subject (DB RLS Policy)');
    }

    // 3. Create Lecture Session Entity
    const sessionId = `sess-${classSection}-${periodId}-${date}`;
    const newSession = {
      id: sessionId,
      date,
      class_section: classSection,
      period_id: periodId,
      subject_id: subjectId,
      faculty_id: facultyId,
      created_at: new Date().toISOString()
    };

    // 4. Create Attendance Records for enrolled students
    const classStudents = students.filter(s => s.class_section === classSection);
    const newRecords = classStudents.map(student => ({
      id: `rec-${Date.now()}-${student.id}-${sessionId}`,
      lecture_session_id: sessionId,
      student_id: student.id,
      status: markMap[student.id] || 'present',
      is_locked: true,
      is_edited: false,
      created_at: new Date().toISOString()
    }));

    setLectureSessions(prev => [...prev, newSession]);
    setAttendanceRecords(prev => [...prev, ...newRecords]);

    return { success: true, count: newRecords.length };
  };

  // Admin Override with Audit Trail
  const unlockAndEditPeriod = async ({ subjectId, periodId, date, classSection, updatedMarks, adminId }) => {
    const session = getLectureSession(date, classSection, periodId);
    if (!session) {
      throw new Error('No lecture session found to edit.');
    }

    const nowIso = new Date().toISOString();

    const updatedRecords = attendanceRecords.map(r => {
      if (r.lecture_session_id === session.id) {
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

    setAttendanceRecords(updatedRecords);
    return { success: true };
  };

  // Compute Daily Attendance Matrix & Bunk Classification Rules
  const getDailyMatrix = (classSection, dateStr) => {
    const classStudents = students.filter(s => s.class_section === classSection);
    const expectedSlots = getExpectedPeriods(classSection, dateStr);

    // Get all completed sessions for this class and date
    const daySessions = lectureSessions.filter(
      s => s.date === dateStr && s.class_section === classSection
    );

    const activePeriodIds = daySessions.map(s => s.period_id);
    const activePeriods = periods
      .filter(p => activePeriodIds.includes(p.id))
      .sort((a, b) => a.period_number - b.period_number);

    let totalFullPresent = 0;
    let totalFullAbsent = 0;
    let totalPartialBunks = 0;
    let totalNotMarkedYet = 0;

    const rows = classStudents.map(student => {
      const periodStatusMap = {};
      let presentCount = 0;
      let absentCount = 0;
      let markedCount = 0;

      daySessions.forEach(session => {
        const rec = attendanceRecords.find(
          r => r.lecture_session_id === session.id && r.student_id === student.id
        );
        if (rec) {
          markedCount++;
          periodStatusMap[session.period_id] = {
            status: rec.status,
            is_edited: rec.is_edited,
            original_status: rec.original_status,
            edited_at: rec.edited_at
          };
          if (rec.status === 'present') presentCount++;
          if (rec.status === 'absent') absentCount++;
        }
      });

      let statusCategory = 'NOT_YET_MARKED';

      if (markedCount > 0) {
        if (presentCount > 0 && absentCount > 0) {
          statusCategory = 'PARTIAL_DAY_ABSENCE';
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
        totalMarked: markedCount,
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

  // Weekly Leaderboard Ranking
  const getBunkLeaderboard = (classSection, daysBack = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const classStudents = students.filter(
      s => !classSection || s.class_section === classSection
    );

    const relevantSessions = lectureSessions.filter(
      s => s.date >= cutoffStr && (!classSection || s.class_section === classSection)
    );

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

    // Group sessions by date per student
    const dayStudentMap = {};
    relevantSessions.forEach(session => {
      classStudents.forEach(st => {
        const key = `${st.id}_${session.date}`;
        if (!dayStudentMap[key]) {
          dayStudentMap[key] = { student_id: st.id, date: session.date, present: 0, absent: 0, total: 0 };
        }
        const rec = attendanceRecords.find(
          r => r.lecture_session_id === session.id && r.student_id === st.id
        );
        if (rec) {
          dayStudentMap[key].total++;
          if (rec.status === 'present') dayStudentMap[key].present++;
          if (rec.status === 'absent') {
            dayStudentMap[key].absent++;
            const stat = studentStats[st.id];
            if (stat) {
              stat.periodAbsenceMap[session.period_id] = (stat.periodAbsenceMap[session.period_id] || 0) + 1;
            }
          }
        }
      });
    });

    Object.values(dayStudentMap).forEach(item => {
      const stat = studentStats[item.student_id];
      if (stat) {
        stat.totalAbsentLectures += item.absent;
        stat.totalMarkedLectures += item.total;
        if (item.present > 0 && item.absent > 0) {
          stat.partialBunkCount++;
        }
      }
    });

    const leaderboard = Object.values(studentStats)
      .map(item => {
        const attendancePct = item.totalMarkedLectures > 0
          ? Math.round(((item.totalMarkedLectures - item.totalAbsentLectures) / item.totalMarkedLectures) * 100)
          : 100;

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
          return b.partialBunkCount - a.partialBunkCount;
        }
        return b.totalAbsentLectures - a.totalAbsentLectures;
      });

    return leaderboard;
  };

  const getStudentPatternInsights = (studentId) => {
    const studentRecords = attendanceRecords.filter(r => r.student_id === studentId);
    
    const dayGroups = {};
    studentRecords.forEach(r => {
      const session = lectureSessions.find(s => s.id === r.lecture_session_id);
      if (session) {
        if (!dayGroups[session.date]) dayGroups[session.date] = [];
        dayGroups[session.date].push({ rec: r, session });
      }
    });

    const periodAbsentCounts = {};
    const subjectAbsentCounts = {};
    let totalBunkDays = 0;
    let totalFullAbsentDays = 0;

    Object.entries(dayGroups).forEach(([date, items]) => {
      const hasPresent = items.some(i => i.rec.status === 'present');
      const hasAbsent = items.some(i => i.rec.status === 'absent');

      if (hasPresent && hasAbsent) {
        totalBunkDays++;
        items.forEach(i => {
          if (i.rec.status === 'absent') {
            periodAbsentCounts[i.session.period_id] = (periodAbsentCounts[i.session.period_id] || 0) + 1;
            subjectAbsentCounts[i.session.subject_id] = (subjectAbsentCounts[i.session.subject_id] || 0) + 1;
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
    const { sessions, records } = generateSyntheticAttendanceHistory(initStudents);
    setStudents(initStudents);
    setSubjects(SYNTHETIC_SUBJECTS);
    setFacultySubjects(SYNTHETIC_FACULTY_SUBJECTS);
    setTimetable(SYNTHETIC_TIMETABLE);
    setLectureSessions(sessions);
    setAttendanceRecords(records);
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
        lectureSessions,
        attendanceRecords,
        isPeriodSubmitted,
        getLectureSession,
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
