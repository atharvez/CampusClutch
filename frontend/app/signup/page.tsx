'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/utils/api';
import GlassNav from '@/components/GlassNav';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '1st Year',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetcher('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      login(data, data.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please bridge all requirements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      <GlassNav />
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-12">
        <div className="max-w-xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Community Entry</h1>
            <p className="text-on-surface-variant font-medium opacity-70">Initialize your academic collaboration profile.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 ring-1 ring-on-surface-variant/5">
            {/* Account Type Toggle */}
            <div className="mb-10 p-1.5 bg-surface-container-low rounded-2xl flex gap-1">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'student'})}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                Student Entry
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'host'})}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'host' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                Host / Admin
              </button>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-1">Legal Full Name</label>
                      <input 
                          name="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="Johnathan Doe"
                      />
                  </div>
                  
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-1">Institutional Email</label>
                      <input 
                          name="email"
                          type="email" 
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="name@college.edu"
                      />
                  </div>

                  <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-1">Department / Branch</label>
                      <input 
                          name="branch"
                          type="text" 
                          required
                          value={formData.branch}
                          onChange={handleChange}
                          className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="e.g. CS / AI"
                      />
                  </div>

                  <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-1">Academic Year</label>
                      <select 
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                      >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                      </select>
                  </div>

                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-1">Secure Passphrase</label>
                      <input 
                          name="password"
                          type="password" 
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="Minimum 8 characters"
                      />
                  </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white font-extrabold rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 text-xs tracking-widest uppercase mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Bridge Community'}
              </button>
            </form>

            <p className="text-center mt-12 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Already registered?{' '}
              <Link href="/login" className="text-primary hover:underline underline-offset-4">
                Access Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
