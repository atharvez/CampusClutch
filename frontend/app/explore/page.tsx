'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import TeamCard from '@/components/TeamCard';
import PostCard from '@/components/PostCard';
import { fetcher } from '@/utils/api';
import { Competition, Team } from '@/types';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'competitions' | 'teams'>('competitions');
  const [filter, setFilter] = useState<'all' | 'official' | 'community'>('all');

  useEffect(() => {
    const getData = async () => {
      try {
        const [compData, teamData] = await Promise.all([
          fetcher<Competition[]>('/competitions'),
          fetcher<Team[]>('/teams'),
        ]);
        setCompetitions(compData);
        setTeams(teamData);
      } catch (error) {
        console.error('Error fetching discovery data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const filteredCompetitions = competitions.filter(comp => {
    if (filter === 'official') return comp.isOfficial;
    if (filter === 'community') return !comp.isOfficial;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface">
      <GlassNav />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation - Design Matched */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl w-64 h-[calc(100vh-120px)] sticky top-24 bg-surface-container-low/50 backdrop-blur-xl shadow-xl shadow-primary/5 font-manrope text-sm font-medium">
          <div className="px-4 py-4">
            <h3 className="text-on-surface font-bold text-lg leading-tight">Feed</h3>
            <p className="text-on-surface-variant text-xs mt-1 opacity-70">Sort & Discover</p>
          </div>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => { setActiveTab('competitions'); setFilter('all'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'competitions' && filter === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">public</span> Global Feed
            </button>
            <button 
              onClick={() => { setActiveTab('competitions'); setFilter('official'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'competitions' && filter === 'official' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">verified</span> Official Events
            </button>
            <button 
              onClick={() => { setActiveTab('competitions'); setFilter('community'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'competitions' && filter === 'community' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">forum</span> Reddit Feed
            </button>
            <div className="h-px bg-surface-container-high my-2 mx-4" />
            <button 
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'teams' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">groups</span> Joinable Teams
            </button>
          </nav>
          <div className="mt-auto p-2">
            <a 
              href="/teams/create" 
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white text-center rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all block text-xs tracking-wider uppercase"
            >
              Post a Project
            </a>
          </div>
        </aside>

        {/* Main Discovery Canvas */}
        <section className="flex-1 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-3">
                {activeTab === 'competitions' 
                  ? (filter === 'official' ? 'Official Channels' : (filter === 'community' ? 'Community Spirit' : 'Discovery Hub')) 
                  : 'Find Your Team'}
              </h1>
              <p className="text-on-surface-variant text-lg opacity-80 leading-relaxed">
                {activeTab === 'competitions' 
                  ? 'Connect with global opportunities and community-led initiatives.' 
                  : 'Collaborate with top students on exciting projects and competitions.'}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative group max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search by mission, skills or department..."
              className="w-full bg-white border-none rounded-2xl pl-12 pr-6 py-5 text-on-surface shadow-xl shadow-primary/5 ring-1 ring-on-surface-variant/5 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {/* Content Grid */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-surface-container-low rounded-2xl animate-pulse" />
              ))
            ) : (
              activeTab === 'competitions' ? (
                filteredCompetitions.map((comp) => (
                  <motion.div
                    key={comp._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {comp.isOfficial ? (
                      <TeamCard item={comp} type="competition" />
                    ) : (
                      <PostCard post={comp} />
                    )}
                  </motion.div>
                ))
              ) : (
                teams.map((team) => (
                  <motion.div
                    key={team._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamCard item={team} type="team" />
                  </motion.div>
                ))
              )
            )}
          </motion.div>
          
          {!loading && (activeTab === 'competitions' ? filteredCompetitions : teams).length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">inventory_2</span>
              </div>
              <p className="text-on-surface-variant font-bold text-xl opacity-80">This channel is quiet...</p>
              <p className="text-on-surface-variant text-sm mt-2 opacity-60">Be the first to spark a conversation here.</p>
              <a href="/teams/create" className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/20">
                 Start a Project
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
