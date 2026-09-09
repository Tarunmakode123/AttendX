import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { PatternInsights } from './PatternInsights';
import { TrendingUp, AlertTriangle, ChevronRight, User, Calendar, Award, Clock, Filter } from 'lucide-react';

export const WeeklyTrendView = ({ selectedClass, setSelectedClass }) => {
  const { getBunkLeaderboard } = useAttendance();
  const { currentUser, isAdmin } = useAuth();
  const [timeframeDays, setTimeframeDays] = useState(30);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('');

  const effectiveFacultyScope = isAdmin ? (selectedFacultyFilter || null) : (currentUser?.id || null);
  const leaderboard = getBunkLeaderboard(selectedClass, timeframeDays, effectiveFacultyScope);

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <span>Weekly & Monthly Bunk Intelligence Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-500">
            Students ranked primarily by partial-day bunk occurrences in the selected timeframe
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-amber-700 mb-0.5 flex items-center space-x-1">
                <Filter className="w-3 h-3 text-amber-600 inline" />
                <span>HOD Faculty Filter</span>
              </label>
              <select
                value={selectedFacultyFilter}
                onChange={(e) => setSelectedFacultyFilter(e.target.value)}
                className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-amber-950 focus:outline-none"
              >
                <option value="">All CSE Faculty (Dept-Wide)</option>
                {DEMO_USERS.filter(u => u.role === 'faculty').map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="CSE-A">CSE-A</option>
              <option value="CSE-B">CSE-B</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Timeframe</label>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {[
                { label: '7 Days', value: 7 },
                { label: '30 Days', value: 30 },
                { label: 'All Time', value: 365 },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setTimeframeDays(t.value)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    timeframeDays === t.value
                      ? 'bg-white text-brand-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span>Ranked Bunk List ({leaderboard.length} Students)</span>
          <span>Sorted by Partial Bunks → Total Absences</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No student attendance history recorded for {selectedClass}.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-3 text-center">Partial-Day Bunk Cases</th>
                  <th className="py-3 px-3 text-center">Total Absent Lectures</th>
                  <th className="py-3 px-3 text-center">Attendance %</th>
                  <th className="py-3 px-3 text-center">Most Skipped Period</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {leaderboard.map((item, rankIdx) => {
                  const { student, partialBunkCount, totalAbsentLectures, attendancePct, mostCommonPeriod } = item;
                  const isHighRisk = partialBunkCount >= 3;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`cursor-pointer transition-all ${
                        isHighRisk
                          ? 'bg-amber-50/70 hover:bg-amber-100/60 border-l-4 border-amber-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-black">
                        <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-xs ${
                          rankIdx === 0
                            ? 'bg-amber-200 text-amber-900 border border-amber-400 font-extrabold'
                            : rankIdx === 1
                            ? 'bg-slate-200 text-slate-800 font-bold'
                            : rankIdx === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{rankIdx + 1}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5">
                          <span>{student.name}</span>
                          {isHighRisk && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-200 text-amber-950 border border-amber-300">
                              Suspected Bunker
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Roll: {student.roll_number} {student.enrollment_number && `(${student.enrollment_number})`}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl font-black text-xs ${
                          partialBunkCount > 0 ? 'bg-amber-200 text-amber-950 border border-amber-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <AlertTriangle className={`w-3.5 h-3.5 ${partialBunkCount > 0 ? 'text-amber-700' : 'text-slate-400'}`} />
                          <span>{partialBunkCount} Bunks</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {totalAbsentLectures} Absences
                      </td>

                      <td className="py-3 px-3 text-center font-black">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[11px] ${
                          attendancePct >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : attendancePct >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attendancePct}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-semibold text-slate-600">
                        {mostCommonPeriod}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center text-xs font-bold text-brand-600 hover:underline">
                          <span>Pattern Insights</span>
                          <ChevronRight className="w-4 h-4 ml-0.5 text-brand-500" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pattern Insights Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedStudent.name}
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  Roll: {selectedStudent.roll_number} • Section {selectedStudent.class_section}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <PatternInsights studentId={selectedStudent.id} scopedFacultyId={effectiveFacultyScope} />

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                Close Insights
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
