import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { AlertTriangle, Shield, Check, X, Lock, Unlock, Edit3, Calendar, Info, FileSpreadsheet, CheckCircle2, UserX, Upload, Filter } from 'lucide-react';

export const DailyDashboard = ({ selectedClass, setSelectedClass, selectedDate, setSelectedDate }) => {
  const { getDailyMatrix, periods, subjects, unlockAndEditPeriod, importDailyMasterSheetCSV } = useAttendance();
  const { currentUser, isAdmin } = useAuth();

  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [editMarks, setEditMarks] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [showMasterModal, setShowMasterModal] = useState(false);
  const [masterFile, setMasterFile] = useState(null);
  const [importingMaster, setImportingMaster] = useState(false);
  const [masterMsg, setMasterMsg] = useState(null);

  // HOD Faculty Scope Filter
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('');

  const effectiveFacultyScope = isAdmin ? (selectedFacultyFilter || null) : (currentUser?.id || null);
  const matrixData = getDailyMatrix(selectedClass, selectedDate, effectiveFacultyScope);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMasterFile(file);
    setImportingMaster(true);
    try {
      const res = await importDailyMasterSheetCSV(file, selectedClass, selectedDate);
      setMasterMsg(`Successfully imported ${res.count} records for ${selectedDate}!`);
    } catch (err) {
      setMasterMsg('Error importing sheet: ' + err.message);
    } finally {
      setImportingMaster(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Controls Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Today's Attendance Intelligence & Bunk Analysis</span>
          </h2>
          <p className="text-xs text-slate-500">
            Rule-based cross-period analysis comparing expected vs marked sessions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMasterModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 shadow-2xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-500" />
            <span>Upload Daily Master Sheet</span>
          </button>

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

          <div className="flex items-center space-x-2">
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
      </div>

      {/* Today's Attendance Intelligence Summary Cards (Phase 11) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Enrolled</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{matrixData.totalStudents}</div>
          <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{selectedClass} Roster</div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Full-Day Present</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{matrixData.totalFullPresent}</div>
          <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">100% Attendance</div>
        </div>

        {/* BUNK FLAGGED CARD */}
        <div className={`p-4 rounded-2xl border shadow-sm ${
          matrixData.flaggedCount > 0
            ? 'bg-amber-100 border-amber-400 text-amber-950'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 inline" />
            <span>Partial Bunks</span>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">{matrixData.flaggedCount}</div>
          <div className="text-[10px] font-bold text-amber-900 mt-0.5">Possible Bunk / Irregular</div>
        </div>

        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1">
            <UserX className="w-3.5 h-3.5 text-slate-500" />
            <span>Full-Day Absent</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{matrixData.totalFullAbsent}</div>
          <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Sick / Whole Day Absence</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unconducted / Pending</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{matrixData.totalNotMarkedYet}</div>
          <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Not Marked Yet</div>
        </div>

      </div>

      {/* Main Grid Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Period-by-Period Matrix — Expected vs Marked ({selectedClass})
          </span>
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>P (Present)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-bunk-absentRed"></span>
              <span>A (Absent)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span>- (Not Marked)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Partial Bunk Row</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="py-3 px-4 w-52">Student Details</th>
                {periods.map(p => {
                  const isActive = matrixData.activePeriods.some(ap => ap.id === p.id);
                  return (
                    <th key={p.id} className="py-3 px-3 text-center">
                      <div>P{p.period_number}</div>
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
                <th className="py-3 px-4 text-center">Attendance Intelligence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {matrixData.rows.map(row => {
                const { student, periodStatusMap, presentCount, absentCount, statusCategory } = row;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      statusCategory === 'PARTIAL_DAY_ABSENCE'
                        ? 'bg-amber-100/80 hover:bg-amber-200/60 border-l-4 border-amber-500' // Bunk Highlight
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-xs">{student.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {student.roll_number} {student.enrollment_number && `(${student.enrollment_number})`}
                      </div>
                    </td>

                    {periods.map(p => {
                      const rec = periodStatusMap[p.id];

                      if (!rec) {
                        return (
                          <td key={p.id} className="py-3 px-3 text-center">
                            <span className="inline-block w-6 h-6 rounded-md bg-slate-100 text-slate-400 font-bold text-xs leading-6">
                              -
                            </span>
                          </td>
                        );
                      }

                      const isAbsent = rec.status === 'absent';
                      const isEdited = rec.is_edited;

                      return (
                        <td key={p.id} className="py-3 px-3 text-center relative">
                          <div className="inline-flex items-center justify-center">
                            {isAbsent ? (
                              <span className="w-6 h-6 rounded-md bg-bunk-absentRed text-white font-black text-xs flex items-center justify-center shadow-xs">
                                A
                              </span>
                            ) : (
                              <span className="w-6 h-6 rounded-md bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                P
                              </span>
                            )}
                          </div>

                          {isEdited && (
                            <span
                              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border border-white"
                              title={`Admin Override: originally ${rec.original_status}`}
                            ></span>
                          )}
                        </td>
                      );
                    })}

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {statusCategory === 'PARTIAL_DAY_ABSENCE' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 font-extrabold text-[11px] border border-amber-400 shadow-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                          <span>Possible Bunk / Irregular ({presentCount}P / {absentCount}A)</span>
                        </span>
                      ) : statusCategory === 'FULL_DAY_ABSENCE' ? (
                        <span className="inline-flex items-center space-x-1 text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                          Full-Day Absence ({absentCount} Sessions)
                        </span>
                      ) : statusCategory === 'REGULAR' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                          Regular ({presentCount} Sessions)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not Marked Yet</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Sheet Upload Modal */}
      {showMasterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-brand-500" />
                <span>Upload Daily Master Sheet</span>
              </h3>
              <button
                onClick={() => setShowMasterModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {masterMsg && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{masterMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Upload a daily attendance sheet with columns: <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">Roll Number, Name, P1, P2, P3, P4, P5</code> (values `P` or `A`).
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-6 text-center transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-brand-600 hover:underline">Choose CSV / Excel File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {masterFile && <p className="text-xs font-semibold text-slate-700 mt-2">{masterFile.name}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowMasterModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
