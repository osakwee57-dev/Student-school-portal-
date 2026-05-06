import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Lock, User, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ surname: '', password: '', adminCode: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('surname', loginData.surname)
        .eq('password', loginData.password)
        .eq('admin_code', loginData.adminCode)
        .maybeSingle();

      if (data) {
        localStorage.setItem('student_id', data.id);
        localStorage.setItem('student_admin_code', data.admin_code);
        localStorage.setItem('student_name', `${data.firstname} ${data.surname}`);
        navigate("/student-dashboard");
      } else {
        alert("Login failed. Check your Surname, Password, and Admin Code.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs uppercase">EP</span>
          </div>
          <span className="font-bold tracking-tight text-xl text-slate-800">EduPortal</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => navigate('/register')} className="text-slate-500 hover:text-slate-800 transition-colors">Registration</button>
          <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Support</a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold">Portal Login</h2>
              <p className="mt-2 text-slate-400 text-sm">Welcome back. Enter your credentials to access your dashboard.</p>
            </div>
            {/* Decorative element */}
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="form-label">Student Surname</label>
                <input 
                  required
                  className="form-input"
                  placeholder="Enter your surname" 
                  onChange={e => setLoginData({...loginData, surname: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Password</label>
                <input 
                  required
                  type="password" 
                  className="form-input"
                  placeholder="••••••••" 
                  onChange={e => setLoginData({...loginData, password: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Institution Code</label>
                <input 
                  required
                  maxLength={6}
                  className="form-input font-mono tracking-widest"
                  placeholder="6-digit code" 
                  onChange={e => setLoginData({...loginData, adminCode: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Access Dashboard <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                New student? Create an account
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="h-12 px-8 flex items-center justify-center bg-white border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Secure Portal Access • Supabase Verified</span>
      </footer>
    </div>
  );
};

export default StudentLogin;
