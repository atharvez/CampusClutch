'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GlassNav from '@/components/GlassNav';
import { fetcher } from '@/utils/api';
import { Competition } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

function CreateTeamForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const compId = searchParams.get('compId');
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const getComps = async () => {
      try {
        const data = await fetcher<Competition[]>('/competitions');
        const officialOnes = data.filter(c => c.isOfficial);
        setCompetitions(officialOnes);
        
        if (compId) {
          const found = officialOnes.find(c => c._id === compId);
          if (found) {
            setSelectedComp(found);
            setTeamSize(found.teamSize);
          }
        } else if (officialOnes.length > 0) {
          setSelectedComp(officialOnes[0]);
          setTeamSize(officialOnes[0].teamSize);
        }
      } catch (err) {
        console.error('Error fetching comps:', err);
      }
    };
    getComps();
  }, [compId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp) return setError('Please select a contest');
    
    setLoading(true);
    setError('');
    
    try {
      const team = await fetcher<any>('/teams', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          competitionId: selectedComp._id,
          maxMembers: teamSize,
        }),
      });
      router.push(`/teams/${team._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-primary/5 border border-outline-variant/10"
      >
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-4">Build Your Squad</h1>
          <p className="text-on-surface-variant max-w-md mx-auto">Launch a team for an official contest and start recruiting the best talent across campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span> {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Contest Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Target Contest</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10">verified</span>
                <select 
                  value={selectedComp?._id || ''}
                  onChange={(e) => {
                    const found = competitions.find(c => c._id === e.target.value);
                    if (found) {
                        setSelectedComp(found);
                        setTeamSize(found.teamSize);
                    }
                  }}
                  className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-5 text-on-surface font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                  disabled={!!compId}
                >
                  {competitions.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
                {!compId && (
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                )}
              </div>
            </div>

            {/* Team Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Team Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dream Team Alpha"
                className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 text-on-surface font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                required
              />
            </div>

            {/* Team Mission */}
            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Team Mission</label>
               <textarea 
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="What is your goal for this contest? What kind of vibe are you looking for?"
                 className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] resize-none"
                 required
               />
            </div>

            {/* Team Size - Adjustable as requested */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Team Size Limit</label>
                   <span className="text-primary font-black text-xl">{teamSize} Members</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container-low rounded-full appearance-none cursor-pointer accent-primary"
                />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-primary to-primary-container text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? 'Assembling Squad...' : 'Initialize Team'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function CreateTeamPage() {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <GlassNav />
      <main className="flex-grow pt-32 pb-20 flex justify-center items-center">
        <Suspense fallback={<div className="text-on-surface-variant opacity-50 font-bold">Loading form...</div>}>
          <CreateTeamForm />
        </Suspense>
      </main>
    </div>
  );
}
