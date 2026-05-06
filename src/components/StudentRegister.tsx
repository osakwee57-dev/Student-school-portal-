import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { User, Calendar, MapPin, Phone, Home, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATES_OF_NIGERIA = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    surname: '', firstname: '', othername: '',
    dob: '', state: '', gender: '',
    phone1: '', phone2: '', phone3: '',
    address: '', adminCode: '', password: '',
    studentClass: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if the Admin Code (Institution) actually exists
      const { data: adminCheck, error: adminError } = await supabase
        .from('admins')
        .select('admin_code')
        .eq('admin_code', formData.adminCode)
        .maybeSingle();

      if (adminError || !adminCheck) {
        alert("Invalid Admin Code! Please check with your school.");
        setLoading(false);
        return;
      }

      // 2. Insert Student
      const { error } = await supabase.from('students').insert([{
        surname: formData.surname,
        firstname: formData.firstname,
        other_names: formData.othername,
        dob: formData.dob,
        state_of_origin: formData.state,
        gender: formData.gender,
        guardian_phone: `${formData.phone1}, ${formData.phone2}, ${formData.phone3}`,
        home_address: formData.address,
        admin_code: formData.adminCode,
        password: formData.password, // This now maps correctly to the DB column
        student_class: formData.studentClass
      }]);

      if (error) {
        console.error(error);
        alert("Registration failed: " + error.message);
      } else {
        alert("Registration Successful! You can now login.");
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
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
          <button onClick={() => navigate('/login')} className="text-slate-500 hover:text-slate-800 transition-colors">Portal Login</button>
          <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Support</a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Sidebar: Context/Info */}
          <div className="w-full md:w-1/3 bg-slate-900 p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold leading-tight mb-4 text-white">Join your academic community.</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Access your grades, schedules, and communication tools. Please ensure your Admin Code is correct to link your profile to your institution.
              </p>
            </div>
            <div className="space-y-4 mt-8 md:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                <span className="text-xs text-slate-300">Verified Institution Sync</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                <span className="text-xs text-slate-300">Secure End-to-End Encryption</span>
              </div>
            </div>
          </div>

          {/* Right Side: The Form */}
          <div className="flex-1 p-8 md:p-10">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Student Registration</h1>
                <p className="text-sm text-slate-500">Please enter your details exactly as they appear on your ID.</p>
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold hidden sm:block">Step 01 / 01</div>
            </header>

            <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <label className="form-label">Surname</label>
                <input 
                  required
                  className="form-input"
                  placeholder="e.g. Adebayo" 
                  onChange={e => setFormData({...formData, surname: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">First Name</label>
                <input 
                  required
                  className="form-input"
                  placeholder="e.g. Chinelo" 
                  onChange={e => setFormData({...formData, firstname: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Other Names</label>
                <input 
                  className="form-input"
                  placeholder="Optional" 
                  onChange={e => setFormData({...formData, othername: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Date of Birth</label>
                <input 
                  required
                  type="date" 
                  className="form-input"
                  onChange={e => setFormData({...formData, dob: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">State of Origin</label>
                <select 
                  required
                  className="form-input"
                  onChange={e => setFormData({...formData, state: e.target.value})}
                >
                  <option value="">Select State</option>
                  {STATES_OF_NIGERIA.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="form-label">Gender</label>
                <div className="flex gap-4 h-[42px] items-center">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="radio" name="gender" value="Male" required className="accent-indigo-600" onChange={e => setFormData({...formData, gender: e.target.value})}/> Male
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="radio" name="gender" value="Female" required className="accent-indigo-600" onChange={e => setFormData({...formData, gender: e.target.value})}/> Female
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="form-label">Admin Code</label>
                <input 
                  required
                  maxLength={6}
                  className="form-input font-mono tracking-widest uppercase"
                  placeholder="XXXXXX" 
                  onChange={e => setFormData({...formData, adminCode: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Current Class</label>
                <select 
                  required
                  className="form-input"
                  onChange={e => setFormData({...formData, studentClass: e.target.value})}
                >
                  <option value="">-- Select Class --</option>
                  <option value="Jss1">Jss1</option>
                  <option value="Jss2">Jss2</option>
                  <option value="Jss3">Jss3</option>
                  <option value="Sss1">Sss1</option>
                  <option value="Sss2">Sss2</option>
                  <option value="Sss3">Sss3</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="form-label">Primary Guardian Phone</label>
                <input 
                  required
                  className="form-input"
                  placeholder="+234 ..." 
                  onChange={e => setFormData({...formData, phone1: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Second Guardian Phone (Optional)</label>
                <input 
                  className="form-input"
                  placeholder="+234 ..." 
                  onChange={e => setFormData({...formData, phone2: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Third Guardian Phone (Optional)</label>
                <input 
                  className="form-input"
                  placeholder="+234 ..." 
                  onChange={e => setFormData({...formData, phone3: e.target.value})} 
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="form-label">Home Address</label>
                <input 
                  required
                  className="form-input"
                  placeholder="Enter your full residential address" 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="sm:col-span-2 space-y-1 mt-2">
                <label className="form-label">Create Password</label>
                <input 
                  required
                  type="password" 
                  className="form-input"
                  placeholder="••••••••" 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>

              <div className="sm:col-span-2 mt-4 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors"
                >
                  Already have an account? Log in
                </button>
                <button 
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <footer className="h-12 px-8 flex items-center justify-between bg-white border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest invisible sm:visible">
        <span>Powered by Supabase Cloud Engine</span>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Enrollment</span>
        </div>
      </footer>
    </div>
  );
};

export default StudentRegister;
