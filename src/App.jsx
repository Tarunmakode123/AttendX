import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { FacultySchedule } from './components/FacultySchedule';
import { ClassSelector } from './components/ClassSelector';
import { AttendanceMarker } from './components/AttendanceMarker';
import { DailyDashboard } from './components/DailyDashboard';
import { WeeklyTrendView } from './components/WeeklyTrendView';
import { TimetableManagement } from './components/TimetableManagement';
import { AdminRosterManagement } from './components/AdminRosterManagement';
import { isLiveSupabaseConfigured } from './lib/supabase';

const MainLayout = () => {
  const { currentUser, isAdmin } = useAuth();
  const { subjects, periods } = useAttendance();

  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'marker' | 'dashboard' | 'trends' | 'timetable' | 'roster'
  const [selectedClass, setSelectedClass] = useState('CSE-A');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-301');
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods[0]?.id || 'p1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSelectLectureFromSchedule = ({ classSection, subjectId, periodId, date }) => {
    setSelectedClass(classSection);
    if (subjectId) setSelectedSubjectId(subjectId);
    if (periodId) setSelectedPeriodId(periodId);
    if (date) setSelectedDate(date);
    setActiveTab('marker');
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {activeTab === 'schedule' && (
          <FacultySchedule onSelectLecture={handleSelectLectureFromSchedule} />
        )}

        {activeTab === 'marker' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <ClassSelector
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSubjectId={selectedSubjectId}
              setSelectedSubjectId={setSelectedSubjectId}
              selectedPeriodId={selectedPeriodId}
              setSelectedPeriodId={setSelectedPeriodId}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <AttendanceMarker
              selectedClass={selectedClass}
              selectedSubjectId={selectedSubjectId}
              selectedPeriodId={selectedPeriodId}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DailyDashboard
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {activeTab === 'trends' && (
          <WeeklyTrendView
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        )}

        {activeTab === 'timetable' && isAdmin && (
          <TimetableManagement />
        )}

        {activeTab === 'roster' && isAdmin && (
          <AdminRosterManagement />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-extrabold text-slate-700">AttendX Intelligence MVP</span> — B.Tech CSE (5th Semester) Synthetic Demo
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isLiveSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span>{isLiveSupabaseConfigured ? 'Live Supabase Connected' : 'Local Synthetic Engine Active'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <MainLayout />
      </AttendanceProvider>
    </AuthProvider>
  );
}
