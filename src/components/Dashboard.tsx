import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Bell,
  Search,
  UserCircle,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  FileText,
  Info,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('notices');
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const name = localStorage.getItem('student_name');
    const code = localStorage.getItem('student_admin_code');
    const sid = localStorage.getItem('student_id');

    if (!sid) {
      navigate('/login');
    } else {
      setStudentName(name || 'Student');
      setAdminCode(code || 'N/A');
      setStudentId(sid || '');
      if (code) fetchNotices(code);
    }
  }, [navigate]);

  const fetchNotices = async (code: string) => {
    const { data } = await supabase
      .from('announcements')
      .select('message_text')
      .eq('admin_code', code)
      .order('created_at', { ascending: false });
    setNotices(data || []);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Notice Bar */}
      <div className="bg-slate-900 text-yellow-400 py-2 overflow-hidden whitespace-nowrap border-b border-white/5">
        <motion.div 
          animate={{ x: [1000, -2000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="inline-block px-4 font-mono text-xs font-bold uppercase tracking-widest"
        >
          {notices.length > 0 
            ? notices.map(n => n.message_text).join(" • ") 
            : "No new announcements from the management. Stay tuned for updates."}
        </motion.div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="font-bold tracking-tight text-xl text-slate-800 hidden sm:block">EduPortal</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Search size={14} className="text-slate-400" />
                <input 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-xs w-32 lg:w-48 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block pr-3 border-r border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{studentName}</p>
                  <p className="text-[9px] uppercase font-bold text-indigo-500 font-mono">{adminCode}</p>
                </div>
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </header>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && <ProfileView id={studentId} />}
              {activeSection === 'fees' && <FeesView studentId={studentId} />}
              {activeSection === 'results' && <ResultsView studentId={studentId} />}
              {activeSection === 'notices' && <NoticesView adminCode={adminCode} />}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
              />
              <motion.aside 
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-40 flex flex-col border-l border-slate-100"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 tracking-tight">Portal Menu</span>
                  <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  <MenuLink 
                    icon={<UserCircle size={20} />} 
                    label="Student Profile" 
                    active={activeSection === 'profile'} 
                    onClick={() => {setActiveSection('profile'); setMenuOpen(false);}} 
                  />
                  <MenuLink 
                    icon={<CreditCard size={20} />} 
                    label="Fees & Payment" 
                    active={activeSection === 'fees'} 
                    onClick={() => {setActiveSection('fees'); setMenuOpen(false);}} 
                  />
                  <MenuLink 
                    icon={<FileText size={20} />} 
                    label="Exam Results" 
                    active={activeSection === 'results'} 
                    onClick={() => {setActiveSection('results'); setMenuOpen(false);}} 
                  />
                  <MenuLink 
                    icon={<Bell size={20} />} 
                    label="Institutional Notices" 
                    active={activeSection === 'notices'} 
                    onClick={() => {setActiveSection('notices'); setMenuOpen(false);}} 
                  />
                </nav>

                <div className="p-6 border-t border-slate-100 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Info size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase">Contact your institution for password resets or identity verification issues.</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all font-bold text-sm"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MenuLink = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    {icon} <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, subtext }: { label: string, value: string, trend?: string, subtext?: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/20">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <div className="mt-3 flex items-baseline justify-between">
      <h4 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h4>
      {trend && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-tighter">{trend}</span>}
      {subtext && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtext}</span>}
    </div>
  </div>
);

const CourseRow = ({ title, code, instructor, progress }: { title: string, code: string, instructor: string, progress: number }) => (
  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-[10px] border border-slate-200">
        {code}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm leading-none">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{instructor}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="w-32 hidden lg:block">
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

// Section Views
const ProfileView = ({ id }: { id: string }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const { data } = await supabase.from('students').select('*').eq('id', id).single();
    setProfile(data);
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('students')
      .update({
        student_class: profile.student_class,
        dob: profile.dob,
        state_of_origin: profile.state_of_origin,
        guardian_phone: profile.guardian_phone,
        home_address: profile.home_address
      })
      .eq('id', id);

    if (!error) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile: " + error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing academic profile...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-6"
    >
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/20">
         <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <UserCircle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profile.firstname} {profile.surname}</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-mono">ID: {id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Legal Name</label>
                  <p className="font-bold text-slate-800 text-sm">{profile.surname}, {profile.firstname} {profile.other_names}</p>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter italic">Contact admin to change name</span>
               </div>
               
               <div className="space-y-1">
                  <label className="form-label">Academic Class</label>
                  <select 
                    value={profile.student_class} 
                    className="form-input"
                    onChange={(e) => setProfile({...profile, student_class: e.target.value})}
                  >
                    <option value="Jss1">Jss1</option>
                    <option value="Jss2">Jss2</option>
                    <option value="Jss3">Jss3</option>
                    <option value="Sss1">Sss1</option>
                    <option value="Sss2">Sss2</option>
                    <option value="Sss3">Sss3</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    value={profile.dob || ''} 
                    className="form-input"
                    onChange={(e) => setProfile({...profile, dob: e.target.value})} 
                  />
               </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="form-label">State of Origin</label>
                  <input 
                    type="text" 
                    value={profile.state_of_origin || ''} 
                    className="form-input"
                    onChange={(e) => setProfile({...profile, state_of_origin: e.target.value})} 
                  />
               </div>

               <div className="space-y-1">
                  <label className="form-label">Guardian Contacts</label>
                  <input 
                    type="text" 
                    value={profile.guardian_phone || ''} 
                    className="form-input"
                    placeholder="Separate numbers with commas"
                    onChange={(e) => setProfile({...profile, guardian_phone: e.target.value})} 
                  />
               </div>

               <div className="space-y-1">
                  <label className="form-label">Residential Address</label>
                  <textarea 
                    value={profile.home_address || ''} 
                    className="form-input h-20 resize-none"
                    placeholder="Enter full home address"
                    onChange={(e) => setProfile({...profile, home_address: e.target.value})} 
                  />
               </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleUpdate} 
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? "Syncing Changes..." : "Update Profile"}
            </button>
          </div>
      </div>
    </motion.div>
  );
};

const FeesView = ({ studentId }: { studentId: string }) => {
  const [view, setView] = useState<'fees' | 'receipts'>('fees');
  const [fees, setFees] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchFinanceData();
  }, [studentId]);

  const fetchFinanceData = async () => {
    setLoading(true);
    // Fetch Unpaid Fees
    const { data: fData } = await supabase
      .from('student_fees')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_paid', false);
    
    // Fetch All Receipts
    const { data: rData } = await supabase
      .from('student_receipts')
      .select('*')
      .eq('student_id', studentId);

    setFees(fData || []);
    setReceipts(rData || []);
    setLoading(false);
  };

  const generateReceiptPDF = (receipt: any, schoolName: string = "EduPortal") => {
    const doc = new jsPDF();
    let yPos = 20;

    // 1. Institution Name (Large Header)
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(schoolName.toUpperCase(), 105, yPos, { align: "center" });
    
    yPos += 15;

    // 2. Receipt Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.receipt_title || "Official Receipt", 105, yPos, { align: "center" });

    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos); // Horizontal line

    yPos += 15;

    // 3. Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DESCRIPTION", 25, yPos);
    doc.text("AMOUNT (N)", 150, yPos);
    
    yPos += 5;
    doc.line(20, yPos, 190, yPos); // Divider line
    yPos += 10;

    // 4. Details (Items and Amount)
    doc.setFont("helvetica", "normal");
    const itemsList = typeof receipt.items === 'string' ? JSON.parse(receipt.items) : (receipt.items || []);
    let total = 0;

    itemsList.forEach((item: any) => {
      doc.text(item.detail || "Detail", 25, yPos);
      const amt = parseFloat(item.amount || 0);
      doc.text(amt.toLocaleString(), 150, yPos);
      total += amt;
      yPos += 10;

      // Page overflow check
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    // 5. Total Section
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PAID:", 25, yPos);
    doc.text(`N${total.toLocaleString()}`, 150, yPos);

    // 6. Footer (Date and Signature)
    yPos += 30;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos);

    if (receipt.signature_data) {
      try {
        doc.addImage(receipt.signature_data, 'PNG', 140, yPos - 15, 40, 15);
        doc.text("___________________", 140, yPos);
        doc.text("Authorized Signature", 140, yPos + 5);
      } catch (e) {
        console.error("Signature image error:", e);
      }
    }

    // 7. Save the File
    doc.save(`${schoolName}_Receipt_${receipt.id.substring(0, 5)}.pdf`);
  };

  const totalBalance = fees.reduce((acc, fee) => {
    const feeTotal = (fee.items || []).reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0);
    return acc + feeTotal;
  }, 0);

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing financial records...</div>;

  if (selectedFee) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => setSelectedFee(null)} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">← Back to Portal</button>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono">Invoice #{selectedFee.id.slice(0, 8)}</span>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedFee.fee_name} Breakdown</h3>
          <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest font-bold">Issued on {new Date(selectedFee.created_at).toLocaleDateString()}</p>
          
          <div className="space-y-4">
            {(selectedFee.items || []).map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-600">{item.detail}</span>
                <span className="text-sm font-bold text-slate-900">₦{parseFloat(item.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <div className="text-right flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outstanding Balance</p>
              <p className="text-3xl font-bold text-indigo-600">₦{selectedFee.items.reduce((s: number, i: any) => s + parseFloat(i.amount), 0).toLocaleString()}</p>
            </div>
          </div>

          <button className="w-full mt-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            Process Payment Online
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-6"
    >
      {/* Toggle View */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setView('fees')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'fees' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Pending Fees
        </button>
        <button 
          onClick={() => setView('receipts')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'receipts' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Payment History
        </button>
      </div>

      {view === 'fees' ? (
        <>
          <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Aggregate Debt Balance</p>
              <h1 className="text-4xl font-bold mt-2">₦{totalBalance.toLocaleString()}</h1>
              <div className="mt-8 flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Requires Immediate Attention</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Pending Fee Requests</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fees.length} ITEMS FOUND</span>
            </div>
            
            {fees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-bold text-slate-400 flex flex-col gap-2">
                  <span className="text-3xl">🎉</span>
                  All accounts are currently balanced.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fees.map((fee) => (
                  <div 
                    key={fee.id} 
                    onClick={() => setSelectedFee(fee)}
                    className="group flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 hover:border-indigo-100 transition-all cursor-pointer rounded-2xl border border-transparent"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{fee.fee_name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">ISSUED {new Date(fee.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-900 pr-4 border-r border-slate-200">
                        ₦{(fee.items || []).reduce((s: number, i: any) => s + parseFloat(i.amount), 0).toLocaleString()}
                      </span>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 px-2">Official Receipts</h3>
          {receipts.length === 0 ? (
            <p className="text-center py-12 text-slate-400 text-sm">No payment history found.</p>
          ) : (
            receipts.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between hover:border-indigo-100 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{r.receipt_title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Confirmed on {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => generateReceiptPDF(r)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest border border-indigo-100/50"
                >
                  Download PDF
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

const ResultsView = ({ studentId }: { studentId: string }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchResults();
  }, [studentId]);

  const fetchResults = async () => {
    const { data } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    setResults(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing transcripts...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">Academic Transcripts</h2>
        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Released examination records</p>
      </div>
      <div className="divide-y divide-slate-50">
        {results.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-sm italic font-medium">No results have been uploaded yet.</p>
        ) : (
          results.map(res => (
            <div key={res.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-sm font-bold text-slate-700">{res.title}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Uploaded on {new Date(res.created_at).toLocaleDateString()}</p>
              </div>
              <a 
                href={res.file_url} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Download PDF
              </a>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const NoticesView = ({ adminCode }: { adminCode: string }) => {
  const [allNotices, setAllNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('admin_code', adminCode)
        .order('created_at', { ascending: false });
      setAllNotices(data || []);
      setLoading(false);
    };
    fetchAll();
  }, [adminCode]);

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving announcements...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Institutional Updates</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{allNotices.length} MESSAGES</span>
      </div>

      {allNotices.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium">No formal notices have been published for your institution yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allNotices.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-sky-50/50 p-6 rounded-r-3xl border-l-[6px] border-indigo-600 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-slate-800 text-sm leading-relaxed font-medium">{msg.message_text}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-indigo-100/30">
                <p className="text-[10px] uppercase font-bold text-indigo-500 font-mono tracking-widest">
                  Published • {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const InfoItem = ({ label, value, active }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-bold ${active ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</p>
  </div>
);

const FeeRow = ({ term, amount, status, date }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div>
      <p className="text-xs font-bold text-slate-800">{term}</p>
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">{date} • {status}</p>
    </div>
    <span className="text-sm font-bold text-slate-900">{amount}</span>
  </div>
);

const ResultRow = ({ course, grade, score }: any) => (
  <div className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
    <span className="text-sm font-bold text-slate-700">{course}</span>
    <div className="flex items-center gap-6">
      <span className="text-xs font-mono font-bold text-slate-400">{score}/100</span>
      <span className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-600">{grade}</span>
    </div>
  </div>
);

export default Dashboard;

