import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Lock, Mail, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginScreen = () => {
  const { loginWithEmail, authError, isDemoModeEnabled, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await loginWithEmail(email, password || 'password123');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 text-white font-black text-3xl shadow-xl shadow-brand-500/30 mb-3">
            AX
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Attend<span className="text-brand-500">X</span> Sign In
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Period-wise attendance & automated bunk pattern detection tool for faculty & admins
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 space-y-5">
          {authError && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@college.edu"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to AttendX'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Persona Demo Switcher Card */}
          {isDemoModeEnabled && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                <span>Instant Demo Login Personas</span>
              </div>
              
              <div className="space-y-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => switchDemoUser(user.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all text-left group"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-brand-600">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email} • <span className="capitalize text-slate-700 font-semibold">{user.role}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-600 bg-brand-100 group-hover:bg-brand-500 group-hover:text-white px-2 py-1 rounded-lg transition-colors">
                      Enter
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500">
          Standalone MVP for college period attendance. Faculty accounts are managed by admin.
        </p>
      </div>
    </div>
  );
};
