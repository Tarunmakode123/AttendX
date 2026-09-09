import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, Clock, Layers, Lock } from 'lucide-react';

export const ClassSelector = ({
  selectedClass,
  setSelectedClass,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedPeriodId,
  setSelectedPeriodId,
  selectedDate,
  setSelectedDate
}) => {
  const { subjects, periods, facultySubjects, isPeriodSubmitted } = useAttendance();
  const { currentUser, isAdmin } = useAuth();

  const availableSubjects = subjects.filter(sub => {
    if (sub.class_section !== selectedClass) return false;

    if (!isAdmin && currentUser?.id) {
      return facultySubjects.some(
        fs => fs.faculty_id === currentUser.id && fs.subject_id === sub.id
      );
    }
    return true;
  });

  const isLocked = selectedSubjectId && selectedPeriodId && isPeriodSubmitted(selectedSubjectId, selectedPeriodId, selectedDate);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Lecture Session Selector</span>
        </h3>
        
        {isLocked && (
          <span className="flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Period Submitted & Locked</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* 1. Class & Section */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Class & Section
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              const firstSub = subjects.find(s => s.class_section === e.target.value);
              if (firstSub) setSelectedSubjectId(firstSub.id);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="CSE-A">CSE-A (B.Tech CSE 5th Sem)</option>
            <option value="CSE-B">CSE-B (B.Tech CSE 5th Sem)</option>
          </select>
        </div>

        {/* 2. Subject */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-brand-500 inline" />
            <span>Subject</span>
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {availableSubjects.length === 0 ? (
              <option value="">No Assigned Subjects</option>
            ) : (
              availableSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))
            )}
          </select>
        </div>

        {/* 3. Period */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-brand-500 inline" />
            <span>Period</span>
          </label>
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {periods.map(p => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-brand-500 inline" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

      </div>
    </div>
  );
};
