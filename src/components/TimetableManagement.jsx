import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, BookOpen, User, Building, Sparkles, Layers } from 'lucide-react';

export const TimetableManagement = () => {
  const { timetable, periods, subjects } = useAttendance();
  const { DEMO_USERS } = useAuth();
  const [activeSection, setActiveSection] = useState('CSE-A');
  const [mobileDay, setMobileDay] = useState('Wednesday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const sectionTimetable = timetable.filter(tt => tt.class_section === activeSection);

  // Helper to find faculty name
  const getFacultyName = (facId) => {
    const found = DEMO_USERS?.find(u => u.id === facId);
    return found ? found.name : 'Faculty';
  };

  return (
    <div className="space-y-6">
      
      {/* College & Department Academic Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-brand-500" />
              <span>Department of Computer Science & Engineering</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Official Master Timetable Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              B.Tech CSE — 5th Semester • Session 2026–2027 • Effective Date: 01 Aug 2026
            </p>
          </div>

          {/* Section Selector */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['CSE-A', 'CSE-B'].map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  activeSection === sec
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Section {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Building className="w-3.5 h-3.5 text-brand-500" />
            <span>Assigned Classroom: <strong className="text-slate-900">{activeSection === 'CSE-A' ? 'Room 301' : 'Room 304'}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>Teaching Slots: <strong className="text-slate-900">09:00 AM – 04:35 PM</strong></span>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: Full Real College Timetable Grid */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Weekly Schedule Grid — B.Tech CSE (5th Sem, {activeSection})
          </span>
          <span className="text-xs font-medium text-slate-500">
            Mon – Sat • Periods 1 – 7
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-extrabold text-slate-700">
                <th className="py-3 px-4 w-32 bg-slate-100">DAY / TIME</th>
                {periods.map(p => (
                  <th key={p.id} className="py-3 px-3 text-center border-l border-slate-200">
                    <div>P{p.period_number}</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                      {p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {days.map(day => (
                <tr key={day} className="hover:bg-slate-50/70">
                  {/* Day Row Header */}
                  <td className="py-4 px-4 font-black text-slate-900 bg-slate-50/70 border-r border-slate-200">
                    {day}
                  </td>

                  {/* Period Cells */}
                  {periods.map(p => {
                    const slot = sectionTimetable.find(
                      tt => tt.day_of_week === day && tt.period_id === p.id
                    );

                    if (!slot) {
                      return (
                        <td key={p.id} className="py-4 px-2 text-center text-slate-300 border-l border-slate-100">
                          <span className="text-slate-300 font-bold text-xs">-</span>
                        </td>
                      );
                    }

                    const sub = subjects.find(s => s.id === slot.subject_id);
                    const facName = getFacultyName(slot.faculty_id);
                    const isLab = sub?.is_lab;

                    return (
                      <td key={p.id} className="py-3 px-2 text-center border-l border-slate-100">
                        <div className={`p-2.5 rounded-xl border text-left space-y-1 transition-all ${
                          isLab
                            ? 'bg-purple-50 border-purple-200 hover:border-purple-400'
                            : 'bg-slate-50 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
                        }`}>
                          {/* Subject Name (Prominent) */}
                          <div className="font-extrabold text-slate-900 text-xs leading-snug">
                            {sub?.name || 'Subject'}
                          </div>

                          {/* Faculty Name (Underneath in small text) */}
                          <div className="text-[10px] font-medium text-slate-600 flex items-center space-x-1">
                            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{facName}</span>
                          </div>

                          {/* Code & Room Badge */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[9px] font-mono">
                            <span className="font-bold text-brand-700">{sub?.code}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              isLab ? 'bg-purple-200 text-purple-900' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {slot.room_no || 'Room 301'}
                            </span>
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

      {/* MOBILE RESPONSIVE VIEW (Part 15): Day Selector Dropdown & Vertical Cards */}
      <div className="block lg:hidden space-y-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Day:</label>
          <select
            value={mobileDay}
            onChange={(e) => setMobileDay(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none"
          >
            {days.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Vertical Period Cards for Selected Day */}
        <div className="space-y-3">
          {periods.map(p => {
            const slot = sectionTimetable.find(
              tt => tt.day_of_week === mobileDay && tt.period_id === p.id
            );

            if (!slot) return null;

            const sub = subjects.find(s => s.id === slot.subject_id);
            const facName = getFacultyName(slot.faculty_id);

            return (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    {p.label}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">{slot.room_no || 'Room 301'}</span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900">{sub?.name}</h4>
                  <p className="text-xs font-medium text-slate-500">Instructor: {facName}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
