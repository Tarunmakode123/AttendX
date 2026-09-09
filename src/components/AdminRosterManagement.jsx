import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Upload, Plus, FileText, UserPlus, CheckCircle, AlertCircle, Users, BookOpen } from 'lucide-react';

export const AdminRosterManagement = () => {
  const { students, subjects, facultySubjects, importStudentsFromCSV, addSingleStudent } = useAttendance();

  const [activeSectionFilter, setActiveSectionFilter] = useState('CS-A');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvTextContent, setCsvTextContent] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Manual Add Form State
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('CS-A');
  const [newYear, setNewYear] = useState(3);
  const [addSuccess, setAddSuccess] = useState(false);

  const filteredStudents = students.filter(
    s => !activeSectionFilter || s.class_section === activeSectionFilter
  );

  const handleCsvFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
    setImporting(true);
    setImportResult(null);

    try {
      const res = await importStudentsFromCSV(file, activeSectionFilter);
      setImportResult({ success: true, count: res.count });
    } catch (err) {
      setImportResult({ success: false, message: err.message || 'Failed to parse CSV' });
    } finally {
      setImporting(false);
    }
  };

  const handleSampleCsvImport = async () => {
    setImporting(true);
    const sampleCsv = `Roll Number,Name,Class,Year
2024-CS-050,Arjun Kapoor,CS-A,3
2024-CS-051,Bhavna Reddy,CS-A,3
2024-CS-052,Chirag Deshmukh,CS-A,3
2024-CS-053,Divya Saxena,CS-A,3
2024-CS-054,Esha Nambiar,CS-A,3`;

    try {
      const res = await importStudentsFromCSV(sampleCsv, 'CS-A');
      setImportResult({ success: true, count: res.count });
    } catch (err) {
      setImportResult({ success: false, message: err.message });
    } finally {
      setImporting(false);
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newRoll || !newName) return;
    addSingleStudent({
      roll_number: newRoll,
      name: newName,
      class_section: newClass,
      year: parseInt(newYear, 10)
    });
    setNewRoll('');
    setNewName('');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & CSV Import Button */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-500" />
            <span>Roster & Data Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Bulk CSV import 50-100 students per section, manage roll numbers, and assign faculty subjects
          </p>
        </div>

        <button
          onClick={() => setShowCsvModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Bulk CSV Roster Import</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Manual Student Add Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <UserPlus className="w-4 h-4 text-brand-500" />
            <span>Single Student Entry</span>
          </h3>

          {addSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 font-semibold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Student added to roster successfully!</span>
            </div>
          )}

          <form onSubmit={handleManualAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={newRoll}
                onChange={(e) => setNewRoll(e.target.value)}
                placeholder="2024-CS-020"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Student Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class Section</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="CS-A">CS-A</option>
                  <option value="CS-B">CS-B</option>
                  <option value="EC-A">EC-A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Year</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student to Roster</span>
            </button>
          </form>
        </div>

        {/* Right Column: Enrolled Students List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enrolled Roster ({filteredStudents.length})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {['CS-A', 'CS-B', 'EC-A'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                    activeSectionFilter === sec
                      ? 'bg-brand-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500">
                  <th className="py-2 px-3">Roll Number</th>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Section</th>
                  <th className="py-2 px-3 text-right">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-xs font-bold text-slate-700">
                      {st.roll_number}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {st.name}
                    </td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {st.class_section}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-xs font-bold text-slate-500">
                      Yr {st.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-brand-500" />
                <span>Bulk CSV Roster Import</span>
              </h3>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {importResult?.success && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Successfully imported {importResult.count} students!</span>
              </div>
            )}

            {importResult?.success === false && (
              <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-200 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{importResult.message}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Upload a standard CSV file with headers: <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-mono">Roll Number, Name, Class, Year</code>
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-6 text-center transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-brand-600 hover:underline">Choose CSV File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>
                {csvFile && <p className="text-xs font-semibold text-slate-700 mt-2">{csvFile.name}</p>}
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Or test instantly:</span>
                <button
                  type="button"
                  onClick={handleSampleCsvImport}
                  disabled={importing}
                  className="mt-1 block mx-auto text-xs font-bold text-brand-600 hover:underline"
                >
                  {importing ? 'Importing...' : 'Load Sample 5-Student Batch'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
