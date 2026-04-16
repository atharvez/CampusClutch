'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlassNav from '@/components/GlassNav';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/explore');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center font-manrope">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body text-on-surface">
      <GlassNav />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl" />
        
        <div className="max-w-4xl w-full text-center space-y-10">
          <div className="space-y-4">
            <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] rounded-full inline-block mb-4 shadow-sm ring-1 ring-primary/5">
              Academy Collaboration Protocol
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight font-headline text-on-surface leading-[1.05]">
              Form your <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">Dream Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto opacity-80 leading-relaxed">
              Find partners, join hackathons, and build projects within your college community.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="/projects/create" 
              className="w-full md:w-auto px-12 py-5 bg-primary text-white font-extrabold rounded-2xl shadow-[0_20px_40px_-10px_rgba(53,37,205,0.3)] hover:brightness-110 active:scale-95 transition-all text-sm tracking-widest uppercase"
            >
              Start Building
            </a>
            <a 
              href="/login" 
              className="w-full md:w-auto px-12 py-5 bg-surface-container-high text-on-surface font-extrabold rounded-2xl hover:bg-surface-container-highest active:scale-95 transition-all text-sm tracking-widest uppercase"
            >
              Sign In
            </a>
          </div>

          {/* Stats Pattern */}
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-center">
                <p className="text-3xl font-extrabold">2k+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Students</p>
             </div>
             <div className="text-center">
                <p className="text-3xl font-extrabold">150+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Teams</p>
             </div>
             <div className="text-center">
                <p className="text-3xl font-extrabold">40+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Hackathons</p>
             </div>
             <div className="text-center">
                <p className="text-3xl font-extrabold">85%</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Collab rate</p>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center opacity-30">
          <p className="text-xs font-bold uppercase tracking-widest">CampusTeam &copy; 2024</p>
      </footer>
    </div>
  );
}
