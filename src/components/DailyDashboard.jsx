import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Shield, Check, X, Lock, Unlock, Edit3, Calendar, Filter, Info, RotateCcw } from 'lucide-react';

export const DailyDashboard = ({ selectedClass, setSelectedClass, selectedDate, setSelectedDate }) => {
  const { getDailyMatrix, periods, subjects, unlockAndEditPeriod } = useAttendance();
  const { currentUser, isAdmin } = useAuth();

  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [editMarks, setEditMarks] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const matrixData = getDailyMatrix(selectedClass, selectedDate);

  const handleOpenEditModal = (periodId) => {
    if (!isAdmin) return;
    const initialMap = {};
    matrixData.rows.forEach(row => {
      const rec = row.periodStatusMap[periodId];
      initialMap[row.student.id] = rec ? rec.status : 'present';
    });
    setEditMarks(initialMap);
    setEditingPeriodId(periodId);
  };

  const handleSaveAdminOverride = async () => {
    if (!editingPeriodId || !isAdmin) return;
    setSavingEdit(true);
    try {
      // Find subject for this period and class
      const subject = subjects.find(s => s.class_section === selectedClass) || subjects[0];
      await unlockAndEditPeriod({
        subjectId: subject.id,
        periodId: editingPeriodId,
        date: selectedDate,
        updatedMarks: editMarks,
        adminId: currentUser?.id || 'admin-001'
      });
      setEditingPeriodId(null);
    } catch (err) {
      console.error('Failed to save override:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Controls Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Daily Attendance & Bunk Matrix</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time cross-period attendance verification to catch partial-day bunks
          </p>
        </div>

        {/* Filter Controls */}
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
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Flagged Summary Alert Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Enrolled</div>
            <div className="text-2xl font-black text-slate-900">{matrixData.totalStudents}</div>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-600 font-bold text-xs">
            {selectedClass}
          </div>
        </div>

        {/* BUNK FLAGGED CARD */}
        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
          matrixData.flaggedCount > 0
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
              <span>Flagged Bunks Today</span>
            </div>
            <div className="text-2xl font-black text-amber-900 mt-0.5">
              {matrixData.flaggedCount} Students
            </div>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-200 text-amber-900 border border-amber-300">
            {matrixData.flaggedCount > 0 ? 'Action Required' : 'Clean Record'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Periods Conducted</div>
            <div className="text-2xl font-black text-slate-900">{matrixData.activePeriods.length} / {periods.length}</div>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl font-bold text-xs">
            Active
          </div>
        </div>

      </div>

      {/* Main Grid Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Period-by-Period Attendance Grid ({selectedClass})
          </span>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Present</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-bunk-absentRed"></span>
              <span>Absent</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Flagged Bunk Row</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="py-3 px-4 w-48">Student Info</th>
                {periods.map(p => {
                  const isActive = matrixData.activePeriods.some(ap => ap.id === p.id);
                  return (
                    <th key={p.id} className="py-3 px-3 text-center">
                      <div>{p.label.split(' ')[0]} {p.label.split(' ')[1]}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {p.start_time.slice(0, 5)} - {p.end_time.slice(0, 5)}
                      </div>
                      {isActive && isAdmin && (
                        <button
                          onClick={() => handleOpenEditModal(p.id)}
                          className="mt-1 inline-flex items-center space-x-0.5 text-[10px] text-brand-600 hover:underline font-bold"
                          title="Admin Unlock & Edit Period"
                        >
                          <Edit3 className="w-3 h-3 mr-0.5" />
                          <span>Edit</span>
                        </button>
                      )}
                    </th>
                  );
                })}
                <th className="py-3 px-4 text-center">Summary & Bunk Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {matrixData.rows.map(row => {
                const { student, periodStatusMap, presentCount, absentCount, isFlagged } = row;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isFlagged
                        ? 'bg-amber-100/80 hover:bg-amber-200/60 border-l-4 border-amber-500' // Distinct Bunk Row Highlight
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Student Info Cell */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{student.roll_number}</div>
                    </td>

                    {/* Period Status Cells */}
                    {periods.map(p => {
                      const rec = periodStatusMap[p.id];

                      if (!rec) {
                        return (
                          <td key={p.id} className="py-3.5 px-3 text-center">
                            <span className="inline-block w-6 h-6 rounded-md bg-slate-100 text-slate-400 font-bold text-xs leading-6">
                              -
                            </span>
                          </td>
                        );
                      }

                      const isAbsent = rec.status === 'absent';
                      const isEdited = rec.is_edited;

                      return (
                        <td key={p.id} className="py-3.5 px-3 text-center relative group">
                          <div className="inline-flex items-center justify-center">
                            {isAbsent ? (
                              <span className="w-7 h-7 rounded-lg bg-bunk-absentRed text-white font-black text-xs flex items-center justify-center shadow-xs">
                                A
                              </span>
                            ) : (
                              <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                P
                              </span>
                            )}
                          </div>

                          {/* Audit Indicator Badge */}
                          {isEdited && (
                            <span
                              className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"
                              title={`Admin Override: originally ${rec.original_status}`}
                            ></span>
                          )}
                        </td>
                      );
                    })}

                    {/* Summary & Bunk Status Cell */}
                    <td className="py-3.5 px-4 text-center">
                      {isFlagged ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-200 text-amber-900 font-extrabold text-xs border border-amber-400 shadow-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                          <span>PARTIAL BUNK ({presentCount}P / {absentCount}A)</span>
                        </span>
                      ) : absentCount === 0 && presentCount > 0 ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                          Full Present ({presentCount})
                        </span>
                      ) : presentCount === 0 && absentCount > 0 ? (
                        <span className="inline-flex items-center space-x-1 text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                          Full Absent ({absentCount})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No Records</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Unlock & Edit Modal */}
      {editingPeriodId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Admin Attendance Override ({selectedClass})
                </h3>
              </div>
              <button
                onClick={() => setEditingPeriodId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 text-amber-900 p-3 rounded-xl text-xs font-medium border border-amber-200 flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Postgres Audit Trigger Active: All modifications will be logged with your Admin ID, timestamp, and original status.
              </span>
            </div>

            {/* List of students for editing */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 custom-scrollbar pr-1">
              {matrixData.rows.map(({ student }) => {
                const currentStatus = editMarks[student.id] || 'present';

                return (
                  <div key={student.id} className="py-2 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.roll_number}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditMarks(prev => ({ ...prev, [student.id]: 'present' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMarks(prev => ({ ...prev, [student.id]: 'absent' }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'absent'
                            ? 'bg-bunk-absentRed text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingPeriodId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdminOverride}
                disabled={savingEdit}
                className="px-5 py-2 text-xs font-extrabold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md"
              >
                {savingEdit ? 'Saving Audit Record...' : 'Save Admin Override'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
