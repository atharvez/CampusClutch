'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import TeamCard from '@/components/TeamCard';
import { fetcher } from '@/utils/api';
import { Competition, Team, Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'projects'>('events');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const [compData, projectData] = await Promise.all([
          fetcher<Competition[]>('/competitions'),
          fetcher<Project[]>('/projects'),
        ]);
        // All competitions are now official via migration
        setCompetitions(compData.filter(c => c.isOfficial));
        setProjects(projectData);
      } catch (error) {
        console.error('Error fetching discovery data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const matchesSearch = (text: string) => text.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesSkills = (skills: string[]) => skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredCompetitions = competitions.filter(comp => {
    return !searchQuery || matchesSearch(comp.title) || matchesSearch(comp.description) || matchesSkills(comp.requiredSkills);
  });

  const filteredProjects = projects.filter(project => {
    return !searchQuery || matchesSearch(project.title) || matchesSearch(project.description) || matchesSkills(project.requiredSkills);
  });

  return (
    <div className="min-h-screen bg-surface">
      <GlassNav />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl w-64 h-[calc(100vh-120px)] sticky top-24 bg-surface-container-low/50 backdrop-blur-xl shadow-xl shadow-primary/5 font-manrope text-sm font-medium">
          <div className="px-4 py-4">
            <h3 className="text-on-surface font-bold text-lg leading-tight">Explore</h3>
            <p className="text-on-surface-variant text-xs mt-1 opacity-70">Curated Channels</p>
          </div>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'events' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">verified</span> Discover Events
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'}`}
            >
              <span className="material-symbols-outlined text-lg">handyman</span> Student Projects
            </button>
          </nav>
          
          <div className="mt-auto p-2">
            <a 
              href="/projects/create" 
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white text-center rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all block text-[10px] tracking-widest uppercase"
            >
              Start a Project
            </a>
            {user?.role === 'admin' && (
              <a 
                href="/events/create" 
                className="w-full py-3 mt-2 border border-primary/20 text-primary text-center rounded-xl font-bold hover:bg-primary/5 transition-all block text-[10px] tracking-widest uppercase"
              >
                Post Official Event
              </a>
            )}
          </div>
        </aside>

        {/* Main Discovery Canvas */}
        <section className="flex-1 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-3">
                {activeTab === 'events' ? 'Official Events' : 'Student Projects'}
              </h1>
              <p className="text-on-surface-variant text-lg opacity-80 leading-relaxed">
                {activeTab === 'events' 
                  ? 'High-stakes competitions and official hackathons curated by the academy.' 
                  : 'Independent student-led initiatives. Collab, build, and grow together.'}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative group max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'events' ? 'events' : 'projects'}...`}
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
              activeTab === 'events' ? (
                filteredCompetitions.map((comp) => (
                  <motion.div
                    key={comp._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamCard item={comp} type="competition" />
                  </motion.div>
                ))
              ) : (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamCard item={project} type="project" />
                  </motion.div>
                ))
              )
            )}
          </motion.div>
          
          {!loading && (activeTab === 'events' ? filteredCompetitions : filteredProjects).length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">inventory_2</span>
              </div>
              <p className="text-on-surface-variant font-bold text-xl opacity-80">This feed is quiet...</p>
              <p className="text-on-surface-variant text-sm mt-2 opacity-60">Be the first to spark a project here.</p>
              <a href="/projects/create" className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px]">
                 Start your Project
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
