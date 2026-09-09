import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AlertCircle, TrendingDown, Clock, Lightbulb, BookOpen, AlertTriangle } from 'lucide-react';

export const PatternInsights = ({ studentId, scopedFacultyId = null }) => {
  const { getStudentPatternInsights } = useAttendance();

  const insights = getStudentPatternInsights(studentId, scopedFacultyId);

  if (!insights || (insights.totalBunkDays === 0 && insights.totalFullAbsentDays === 0)) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs font-medium">
        No recurring bunk patterns or absences detected for this student. Clean 100% attendance record across all periods!
      </div>
    );
  }

  return (
    <div className="bg-amber-50/80 border border-amber-300 p-4 rounded-2xl space-y-4 text-amber-950">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
            Automated Pattern Insights (Deterministic Rules)
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
          Rule Engine Output
        </span>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
          <div className="text-[10px] font-bold text-amber-800 uppercase">Partial Bunk Days</div>
          <div className="text-lg font-black text-amber-950 mt-0.5">{insights.totalBunkDays} Days</div>
        </div>
        <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Full-Day Absences</div>
          <div className="text-lg font-black text-slate-800 mt-0.5">{insights.totalFullAbsentDays} Days</div>
        </div>
      </div>

      {/* Primary Pattern Insights Box */}
      <div className="space-y-2 text-xs font-semibold">
        {insights.topSkippedPeriod && (
          <div className="flex items-start space-x-2 bg-white/90 p-3 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-slate-900">
                Period Pattern: Frequently skips {insights.topSkippedPeriod.period.label.split(' ')[0]} {insights.topSkippedPeriod.period.label.split(' ')[1]}
              </div>
              <div className="text-[11px] text-slate-600 font-normal">
                Student was absent in {insights.topSkippedPeriod.period.label} on {insights.topSkippedPeriod.absentOnBunkDays} of {insights.totalBunkDays} partial bunk days ({insights.topSkippedPeriod.percentage}% consistency).
              </div>
            </div>
          </div>
        )}

        {insights.topSkippedSubject && (
          <div className="flex items-start space-x-2 bg-white/90 p-3 rounded-xl border border-amber-200">
            <BookOpen className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-slate-900">
                Subject Pattern: Highest absence in {insights.topSkippedSubject.name}
              </div>
              <div className="text-[11px] text-slate-600 font-normal">
                Repeatedly skips lectures for subject code {insights.topSkippedSubject.code}.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Period-wise breakdown bars */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-bold text-amber-900 uppercase">Period Skip Distribution</div>
        {insights.periodBreakdown.map(({ period, absentOnBunkDays, percentage }) => (
          <div key={period.id} className="flex items-center text-[11px] justify-between">
            <span className="font-medium text-slate-700 w-36 truncate">{period.label.split(' ')[0]} {period.label.split(' ')[1]}</span>
            <div className="flex-1 mx-2 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-bunk-absentRed h-full rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="font-bold text-slate-900 w-16 text-right">
              {absentOnBunkDays} skips
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
