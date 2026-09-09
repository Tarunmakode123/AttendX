import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, BookOpen, Users, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const FacultySchedule = ({ onSelectLecture }) => {
  const { getFacultyTodaySchedule } = useAttendance();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySchedule = getFacultyTodaySchedule(currentUser?.id || 'fac-101', todayStr);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Schedule Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-brand-500" />
            <span>Today's Academic Schedule</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {currentUser?.name || 'Faculty'}'s Lectures
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {formattedDate} • {currentUser?.department || 'Computer Science & Engineering'}
          </p>
        </div>

        <div className="bg-brand-50 border border-brand-200 px-4 py-2 rounded-xl text-right">
          <div className="text-xs text-brand-700 font-medium">Scheduled Today</div>
          <div className="text-lg font-black text-brand-600">{todaySchedule.length} Lecture Sessions</div>
        </div>
      </div>

      {/* Scheduled Lecture Cards Grid */}
      {todaySchedule.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Lectures Scheduled Today</h3>
          <p className="text-xs text-slate-500">You have no teaching sessions assigned in the timetable for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Assigned Teaching Slots ({todaySchedule.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaySchedule.map((item) => {
              const { slotId, class_section, subject, period, date, studentCount, isSubmitted } = item;

              return (
                <div
                  key={slotId}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all flex flex-col justify-between ${
                    isSubmitted
                      ? 'border-slate-200 bg-slate-50/60'
                      : 'border-brand-200 hover:border-brand-400 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Time Slot & Period Badge */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-brand-500" />
                        <span>{period?.label || 'Period'}</span>
                      </span>

                      <span className="text-xs font-extrabold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-lg">
                        Section {class_section}
                      </span>
                    </div>

                    {/* Subject Details */}
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {subject?.name || 'Lecture'}
                      </h3>
                      <div className="text-xs font-mono font-semibold text-slate-500 mt-0.5 flex items-center space-x-3">
                        <span>Code: {subject?.code}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{studentCount} Enrolled Students</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Take Attendance Button */}
                  <div className="pt-2 border-t border-slate-100">
                    {isSubmitted ? (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                        <span className="flex items-center space-x-1 text-emerald-700 font-extrabold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Attendance Submitted & Locked</span>
                        </span>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectLecture({
                          classSection: class_section,
                          subjectId: subject?.id,
                          periodId: period?.id,
                          date
                        })}
                        className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all focus:ring-2 focus:ring-brand-400 focus:outline-none"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>[ TAKE ATTENDANCE ]</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
