import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { PatternInsights } from './PatternInsights';
import { TrendingUp, AlertTriangle, ChevronRight, User, Calendar, Award, Filter } from 'lucide-react';

export const WeeklyTrendView = ({ selectedClass, setSelectedClass }) => {
  const { getBunkLeaderboard, attendanceRecords, periods } = useAttendance();
  const [timeframeDays, setTimeframeDays] = useState(30); // 7, 30, 90
  const [selectedStudent, setSelectedStudent] = useState(null);

  const leaderboard = getBunkLeaderboard(selectedClass, timeframeDays);

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <span>Bunk Leaderboard & Trend Analysis</span>
          </h2>
          <p className="text-xs text-slate-500">
            Students ranked by frequency of partial-day bunk flags in the selected date range
          </p>
        </div>

        {/* Timeframe & Class Filter */}
        <div className="flex items-center space-x-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="CS-A">CS-A</option>
              <option value="CS-B">CS-B</option>
              <option value="EC-A">EC-A</option>
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
          <span>Click Student to View Pattern Insights</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No student data found for {selectedClass}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaderboard.map(({ student, bunkCount }, rankIdx) => {
              const isHighRisk = bunkCount >= 3;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all ${
                    isHighRisk ? 'border-l-4 border-amber-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Rank & Student Details */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                      rankIdx === 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : rankIdx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : rankIdx === 2
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{rankIdx + 1}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <span>{student.name}</span>
                        {isHighRisk && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                            High Risk Bunker
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {student.roll_number} • Section {student.class_section}
                      </div>
                    </div>
                  </div>

                  {/* Bunk Count Bar & Drill-Down Indicator */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 flex items-center justify-end space-x-1">
                        <AlertTriangle className={`w-4 h-4 ${bunkCount > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                        <span>Flagged {bunkCount} time{bunkCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        in last {timeframeDays} days
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Drill-Down Pattern Insights Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
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

            {/* Render Pattern Insights */}
            <PatternInsights studentId={selectedStudent.id} />

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
