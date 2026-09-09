import React from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Shield, User, LogOut, CheckSquare, Grid, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab }) => {
  const { currentUser, isDemoModeEnabled, switchDemoUser, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      
      {/* Top Demo Data Indicator Banner */}
      <div className="bg-slate-900 text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-between">
        <div className="flex items-center space-x-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SYNTHETIC DEMO MODE ACTIVE — B.Tech CSE (5th Semester) Synthetic College Dataset</span>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('schedule')}>
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-500/20">
              AX
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Attend<span className="text-brand-500">X</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-100 text-brand-800 uppercase tracking-wider">
                Bunk Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isAdmin ? "Department Schedule" : "Today's Schedule"}</span>
            </button>

            <button
              onClick={() => setActiveTab('marker')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'marker'
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'timetable'
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Timetable</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{isAdmin ? "Department Matrix" : "My Bunk Analysis"}</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isAdmin ? "Dept Leaderboard" : "Leaderboard"}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('roster')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'roster'
                    ? 'bg-brand-50 text-brand-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Roster</span>
              </button>
            )}
          </nav>

          {/* User Profile & Persona Switcher */}
          <div className="flex items-center space-x-3">
            {isDemoModeEnabled && (
              <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 px-2">Demo Persona:</span>
                <select
                  value={currentUser?.id}
                  onChange={(e) => switchDemoUser(e.target.value)}
                  className="bg-white text-xs font-bold text-slate-900 px-2 py-1 rounded-md border border-slate-200 focus:outline-none"
                >
                  {DEMO_USERS.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 capitalize flex items-center justify-end space-x-1">
                    {isAdmin ? (
                      <span className="text-amber-600 font-bold flex items-center">
                        <Shield className="w-3 h-3 mr-0.5 text-amber-500 inline" /> Admin
                      </span>
                    ) : (
                      <span>{currentUser.faculty_id || 'Faculty'}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-100 py-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center text-[10px] font-bold py-1 px-2 rounded-lg ${
              activeTab === 'schedule' ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('marker')}
            className={`flex flex-col items-center text-[10px] font-bold py-1 px-2 rounded-lg ${
              activeTab === 'marker' ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
            }`}
          >
            <CheckSquare className="w-4 h-4 mb-0.5" />
            <span>Mark</span>
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex flex-col items-center text-[10px] font-bold py-1 px-2 rounded-lg ${
              activeTab === 'timetable' ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Timetable</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center text-[10px] font-bold py-1 px-2 rounded-lg ${
              activeTab === 'dashboard' ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4 mb-0.5" />
            <span>Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center text-[10px] font-bold py-1 px-2 rounded-lg ${
              activeTab === 'trends' ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" />
            <span>Leaderboard</span>
          </button>
        </div>

      </div>
    </header>
  );
};
