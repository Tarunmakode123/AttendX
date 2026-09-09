import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AlertCircle, TrendingDown, Clock, Lightbulb } from 'lucide-react';

export const PatternInsights = ({ studentId }) => {
  const { getStudentPatternInsights } = useAttendance();

  const insights = getStudentPatternInsights(studentId);

  if (!insights || insights.totalBunkDays === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs font-medium">
        No recurring bunk patterns detected for this student. Clean attendance record across periods!
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3 text-amber-950">
      <div className="flex items-center space-x-2 border-b border-amber-200/60 pb-2">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
          Automated Pattern Insights (Stretch Feature)
        </h4>
      </div>

      {insights.topSkipped ? (
        <div className="text-xs font-semibold space-y-1">
          <p className="text-slate-800">
            ⚠️ Recurring Bunk Pattern Detected: Student was absent in{' '}
            <span className="font-extrabold text-red-600">{insights.topSkipped.period.label}</span> on{' '}
            <span className="font-extrabold text-amber-900">{insights.topSkipped.absentOnBunkDays}</span> of their{' '}
            <span className="font-extrabold text-amber-900">{insights.totalBunkDays}</span> flagged bunk days (
            {insights.topSkipped.percentage}% consistency).
          </p>
          <p className="text-slate-500 font-normal text-[11px]">
            This suggests targeted skipping of specific lectures rather than random day gaps.
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-700">
          Bunks are distributed across multiple periods with no single lecture dominating.
        </p>
      )}

      {/* Period-wise breakdown bar list */}
      <div className="space-y-1.5 pt-1">
        {insights.periodBreakdown.map(({ period, absentOnBunkDays, percentage }) => (
          <div key={period.id} className="flex items-center text-[11px] justify-between">
            <span className="font-medium text-slate-700 w-36 truncate">{period.label.split(' ')[0]} {period.label.split(' ')[1]}</span>
            <div className="flex-1 mx-2 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all"
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
