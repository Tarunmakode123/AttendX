import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Search, CheckCircle, XCircle, Lock, Send, AlertCircle } from 'lucide-react';

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
    attendanceRecords,
    isPeriodSubmitted,
    submitAttendance
  } = useAttendance();
  const { currentUser, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [markMap, setMarkMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const classStudents = students.filter(s => s.class_section === selectedClass);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentPeriod = periods.find(p => p.id === selectedPeriodId);

  const isLocked = selectedSubjectId && selectedPeriodId && isPeriodSubmitted(selectedSubjectId, selectedPeriodId, selectedDate);

  useEffect(() => {
    const existingRecs = attendanceRecords.filter(
      r => r.subject_id === selectedSubjectId && r.period_id === selectedPeriodId && r.date === selectedDate
    );

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
    if (isLocked && !isAdmin) return;
    setMarkMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'absent' ? 'present' : 'absent'
    }));
  };

  const markAllPresent = () => {
    if (isLocked && !isAdmin) return;
    const updated = {};
    classStudents.forEach(s => { updated[s.id] = 'present'; });
    setMarkMap(updated);
  };

  const invertAll = () => {
    if (isLocked && !isAdmin) return;
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = markMap[s.id] === 'absent' ? 'present' : 'absent';
    });
    setMarkMap(updated);
  };

  const presentCount = Object.values(markMap).filter(val => val === 'present').length;
  const absentCount = Object.values(markMap).filter(val => val === 'absent').length;

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
      
      {/* Real-Time Counter & Action Bar */}
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

          <div className="hidden sm:block text-xs font-semibold text-slate-500">
            Enrolled: {classStudents.length} Students
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

      {isLocked && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between text-amber-900">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">Attendance Submitted & Locked</div>
              <div className="text-xs text-amber-800">
                Attendance for {currentSubject?.name} ({currentPeriod?.label}) on {selectedDate} is locked to prevent duplicate submissions.
              </div>
            </div>
          </div>
          {isAdmin && (
            <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-1 rounded-lg">
              Admin Edit Mode Active
            </span>
          )}
        </div>
      )}

      {submittedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center space-x-3 text-emerald-900">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-sm">Attendance Submitted Successfully!</div>
            <div className="text-xs text-emerald-700">
              Period attendance locked. Real-time bunk flags generated on Daily Analysis.
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

      {/* Search Filter Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student name or roll number (e.g. 23CSE001, Rahul Sharma)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium shadow-xs"
        />
      </div>

      {/* Student Roster List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Section Roster ({filteredStudents.length} Students)</span>
          <span>Tap row to toggle Absent / Present</span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No students found matching "{searchQuery}" in {selectedClass}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto custom-scrollbar">
            {filteredStudents.map(student => {
              const isAbsent = markMap[student.id] === 'absent';

              return (
                <div
                  key={student.id}
                  onClick={() => toggleStatus(student.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                    isAbsent
                      ? 'bg-red-50/80 hover:bg-red-100/80 border-l-4 border-bunk-absentRed'
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
        )}
      </div>

      {!isLocked && (
        <div className="pt-2 sticky bottom-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || filteredStudents.length === 0}
            className="w-full py-4 px-6 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-black text-base rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center space-x-2 transition-all focus:ring-4 focus:ring-brand-300 focus:outline-none disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            <span>
              {submitting
                ? 'Submitting...'
                : `Submit Attendance (${presentCount} Present / ${absentCount} Absent)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
