import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Search, CheckCircle, XCircle, Lock, Send, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';

export const AttendanceMarker = ({
  selectedClass,
  selectedSubjectId,
  selectedPeriodId,
  selectedDate
}) => {
  const {
    students,
    subjects,
    periods,
    timetable,
    facultySubjects,
    attendanceRecords,
    getLectureSession,
    submitAttendance
  } = useAttendance();
  const { currentUser, isAdmin, DEMO_USERS } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [markMap, setMarkMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const classStudents = students.filter(s => s.class_section === selectedClass);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentPeriod = periods.find(p => p.id === selectedPeriodId);

  // Check if session already exists for DATE + CLASS_SECTION + PERIOD_ID (Part 7 & 8)
  const existingSession = getLectureSession(selectedDate, selectedClass, selectedPeriodId);
  const isLocked = Boolean(existingSession);

  // Check timetable slot assignment
  const dateObj = new Date(selectedDate);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dateObj.getDay()];

  const matchingSlot = timetable.find(
    tt => tt.day_of_week === dayName &&
          tt.class_section === selectedClass &&
          tt.period_id === selectedPeriodId &&
          tt.subject_id === selectedSubjectId
  );

  const assignedFacultyObj = matchingSlot ? DEMO_USERS?.find(u => u.id === matchingSlot.faculty_id) : null;
  const isAssignedToCurrentFaculty = isAdmin || (matchingSlot ? matchingSlot.faculty_id === currentUser?.id : facultySubjects.some(fs => fs.faculty_id === currentUser?.id && fs.subject_id === selectedSubjectId));

  // Get session submitter name
  const submitterObj = existingSession ? DEMO_USERS?.find(u => u.id === existingSession.faculty_id) : null;
  const submitterName = submitterObj ? submitterObj.name : 'Faculty';

  // Get submitted records if session exists
  const existingRecs = existingSession
    ? attendanceRecords.filter(r => r.lecture_session_id === existingSession.id)
    : [];

  const existingPresentCount = existingRecs.filter(r => r.status === 'present').length;
  const existingAbsentCount = existingRecs.filter(r => r.status === 'absent').length;

  useEffect(() => {
    const initialMap = {};
    classStudents.forEach(st => {
      const match = existingRecs.find(r => r.student_id === st.id);
      initialMap[st.id] = match ? match.status : 'present';
    });

    setMarkMap(initialMap);
    setSubmittedSuccess(false);
    setErrorMessage(null);
  }, [selectedClass, selectedSubjectId, selectedPeriodId, selectedDate, attendanceRecords]);

  const toggleStatus = (studentId) => {
    if ((isLocked || !isAssignedToCurrentFaculty) && !isAdmin) return;
    setMarkMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'absent' ? 'present' : 'absent'
    }));
  };

  const markAllPresent = () => {
    if ((isLocked || !isAssignedToCurrentFaculty) && !isAdmin) return;
    const updated = {};
    classStudents.forEach(s => { updated[s.id] = 'present'; });
    setMarkMap(updated);
  };

  const invertAll = () => {
    if ((isLocked || !isAssignedToCurrentFaculty) && !isAdmin) return;
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = markMap[s.id] === 'absent' ? 'present' : 'absent';
    });
    setMarkMap(updated);
  };

  const presentCount = isLocked ? existingPresentCount : Object.values(markMap).filter(val => val === 'present').length;
  const absentCount = isLocked ? existingAbsentCount : Object.values(markMap).filter(val => val === 'absent').length;

  const filteredStudents = classStudents.filter(s =>
    s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.enrollment_number && s.enrollment_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedSubjectId) {
      setErrorMessage('Please select a valid subject.');
      return;
    }
    if (!isAssignedToCurrentFaculty) {
      setErrorMessage('You are not assigned to this lecture according to the timetable.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await submitAttendance({
        classSection: selectedClass,
        subjectId: selectedSubjectId,
        facultyId: currentUser?.id || 'fac-101',
        periodId: selectedPeriodId,
        date: selectedDate,
        markMap
      });
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Session Context Header Banner (Part 6) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[10px] font-black uppercase text-brand-600 tracking-wider">
              Lecture Session Context
            </div>
            <h3 className="text-base font-black text-slate-900">
              {currentSubject?.name || 'Subject'} ({currentSubject?.code})
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs">
              Section {selectedClass}
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
              {currentPeriod?.label}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-500 pt-1">
          <span>Date: <strong className="text-slate-800">{selectedDate}</strong></span>
          <span>Instructor: <strong className="text-slate-800">{currentUser?.name}</strong></span>
        </div>
      </div>

      {/* Cross-Faculty Timetable Assignment Restriction Warning */}
      {!isAssignedToCurrentFaculty && !isLocked && (
        <div className="bg-red-50 border border-red-300 p-5 rounded-2xl flex items-start space-x-3 text-red-950">
          <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm text-red-900">
              Timetable Assignment Block (DB RLS Enforced)
            </h4>
            <p className="text-xs text-red-800 mt-0.5">
              According to the college master timetable, this lecture is assigned to <strong>{assignedFacultyObj?.name || 'another faculty member'}</strong>. Dr. {currentUser?.name} is not authorized to submit attendance for this slot.
            </p>
          </div>
        </div>
      )}

      {/* Part 7 & 8: Duplicate Session Block Card if already submitted */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl space-y-3 text-amber-950">
          <div className="flex items-start space-x-3">
            <Lock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-amber-900">
                Attendance Already Submitted & Locked
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Attendance for <strong>{selectedClass}</strong> on <strong>{selectedDate}</strong> ({currentPeriod?.label}) has already been recorded by <strong>{submitterName}</strong>.
              </p>
            </div>
          </div>

          {/* Session Statistics Box */}
          <div className="grid grid-cols-3 gap-2 bg-white/90 p-3 rounded-xl border border-amber-200 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Enrolled</div>
              <div className="text-lg font-black text-slate-900">{classStudents.length}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Present</div>
              <div className="text-lg font-black text-emerald-900">{existingPresentCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-red-700 font-bold uppercase">Absent</div>
              <div className="text-lg font-black text-red-900">{existingAbsentCount}</div>
            </div>
          </div>

          {isAdmin && (
            <div className="text-center text-xs font-bold text-amber-800 bg-amber-200/80 p-2 rounded-xl">
              Admin Override Mode Available on Daily Matrix
            </div>
          )}
        </div>
      )}

      {/* Success Banner */}
      {submittedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center space-x-3 text-emerald-900">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-sm">Attendance Submitted & Locked!</div>
            <div className="text-xs text-emerald-700">
              Lecture session saved under UNIQUE(date, class_section, period_id) database constraint.
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center space-x-3 text-red-900">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Live Counter & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{presentCount} Present</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-red-50 text-red-800 border border-red-200 px-3.5 py-1.5 rounded-xl font-bold text-sm">
            <XCircle className="w-4 h-4 text-bunk-absentRed" />
            <span>{absentCount} Absent</span>
          </div>
        </div>

        {!isLocked && (
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllPresent}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={invertAll}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Invert Selection
            </button>
          </div>
        )}
      </div>

      {/* Search Filter Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student name or roll number..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium shadow-xs"
        />
      </div>

      {/* Student Roster List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Section Roster ({filteredStudents.length} Students)</span>
          <span>{isLocked ? 'View Only (Submitted)' : 'Tap row to toggle Absent / Present'}</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredStudents.map(student => {
            const isAbsent = markMap[student.id] === 'absent';

            return (
              <div
                key={student.id}
                onClick={() => toggleStatus(student.id)}
                className={`p-4 flex items-center justify-between ${
                  isLocked ? 'cursor-default' : 'cursor-pointer select-none'
                } transition-all ${
                  isAbsent
                    ? 'bg-red-50/80 border-l-4 border-bunk-absentRed'
                    : 'hover:bg-slate-50 border-l-4 border-emerald-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isAbsent ? 'bg-red-200 text-red-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {student.roll_number.slice(-3)}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {student.name}
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-500">
                      Roll: {student.roll_number} {student.enrollment_number && `• EN: ${student.enrollment_number}`}
                    </div>
                  </div>
                </div>

                <div>
                  {isAbsent ? (
                    <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-bunk-absentRed text-white font-black text-xs shadow-xs">
                      <XCircle className="w-4 h-4" />
                      <span>ABSENT</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>PRESENT</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isLocked && (
        <div className="pt-2 sticky bottom-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || filteredStudents.length === 0 || !isAssignedToCurrentFaculty}
            className={`w-full py-4 px-6 font-black text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all focus:ring-4 focus:outline-none ${
              !isAssignedToCurrentFaculty
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-brand-500/30 focus:ring-brand-300'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>
              {!isAssignedToCurrentFaculty
                ? 'Submission Blocked — Not Assigned in Timetable'
                : submitting
                ? 'Submitting Session...'
                : `Submit Attendance (${presentCount} Present / ${absentCount} Absent)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
