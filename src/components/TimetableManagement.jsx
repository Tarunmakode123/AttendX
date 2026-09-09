import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Calendar, Clock, BookOpen, User, Shield } from 'lucide-react';

export const TimetableManagement = () => {
  const { timetable, periods, subjects } = useAttendance();
  const [activeSection, setActiveSection] = useState('CSE-A');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const sectionTimetable = timetable.filter(tt => tt.class_section === activeSection);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <span>Master Weekly Timetable Schedule</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official timetable mapping period slots to subjects, assigned faculty, and sections
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['CSE-A', 'CSE-B'].map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSection === sec
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Section {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span>Weekly Schedule Matrix — B.Tech CSE (5th Sem, {activeSection})</span>
          <span>Mon – Fri • Periods 1 – 7</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="py-3 px-4 w-32">Day</th>
                {periods.map(p => (
                  <th key={p.id} className="py-3 px-3 text-center">
                    <div>P{p.period_number}</div>
                    <div className="text-[10px] font-normal text-slate-500">
                      {p.start_time.slice(0, 5)} - {p.end_time.slice(0, 5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {days.map(day => (
                <tr key={day} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50/50">
                    {day}
                  </td>
                  {periods.map(p => {
                    const slot = sectionTimetable.find(
                      tt => tt.day_of_week === day && tt.period_id === p.id
                    );

                    if (!slot) {
                      return (
                        <td key={p.id} className="py-3 px-2 text-center text-slate-300">
                          -
                        </td>
                      );
                    }

                    const sub = subjects.find(s => s.id === slot.subject_id);

                    return (
                      <td key={p.id} className="py-3 px-2 text-center">
                        <div className="bg-slate-100/90 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 p-2 rounded-xl text-left space-y-0.5 transition-all">
                          <div className="font-extrabold text-slate-900 text-[11px] truncate">
                            {sub?.name || 'Subject'}
                          </div>
                          <div className="text-[10px] font-mono text-brand-700 font-semibold">
                            {sub?.code}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
