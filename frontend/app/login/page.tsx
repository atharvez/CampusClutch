'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/utils/api';
import GlassNav from '@/components/GlassNav';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data, data.token);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      <GlassNav />
      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Identity Verification</h1>
            <p className="text-on-surface-variant font-medium opacity-70">Securing your academic community.</p>
          </div>

          <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-2xl shadow-primary/5 ring-1 ring-on-surface-variant/5">
            {error && (
              <div className="mb-8 p-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">warning</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">College Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="name@college.edu"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">Access Token (Password)</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white font-extrabold rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 text-xs tracking-widest uppercase"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Authenticate'}
              </button>
            </form>

            <p className="text-center mt-10 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              New to CampusTeam?{' '}
              <Link href="/signup" className="text-primary hover:underline underline-offset-4">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
