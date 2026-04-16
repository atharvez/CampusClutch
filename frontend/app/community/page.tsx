'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import { fetcher } from '@/utils/api';
import { User } from '@/types';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search state
  const [skillFilter, setSkillFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = '/users?';
      if (searchQuery) url += `query=${searchQuery}&`;
      if (skillFilter) url += `skill=${skillFilter}&`;
      if (yearFilter) url += `year=${yearFilter}&`;
      
      const data = await fetcher<User[]>(url);
      // Filter by branch manually if backend doesn't support it yet
      const filtered = branchFilter 
        ? data.filter(u => u.branch.toLowerCase().includes(branchFilter.toLowerCase()))
        : data;
        
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching talent:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, skillFilter, yearFilter, branchFilter]);

  return (
    <div className="min-h-screen bg-surface">
      <GlassNav />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Hero Section */}
        <section className="bg-surface-container-low rounded-[2.5rem] p-10 md:p-16 border border-outline-variant/10 relative overflow-hidden ring-1 ring-primary/5">
           <div className="relative z-10 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-on-surface mb-6 leading-[1.1]">
                Campus <span className="text-primary italic">Community</span>
              </h1>
              <p className="text-lg text-on-surface-variant font-medium opacity-80 leading-relaxed">
                The ultimate database of campus expertise. Find collaborators, mentors, and friends based on their skills and shared missions.
              </p>
           </div>
           {/* Decorative background element */}
           <div className="absolute right-[-5%] top-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        </section>

        {/* Discovery Controls */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-4 rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant/5">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40">search</span>
            <input 
              type="text" 
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>
          <div className="md:col-span-3">
             <input 
              type="text" 
              placeholder="Skill (e.g. React)"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full bg-surface-container-low rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>
          <div className="md:col-span-2">
             <input 
              type="text" 
              placeholder="Branch"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-surface-container-low rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>
          <div className="md:col-span-2">
             <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-surface-container-low rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none font-bold text-on-surface-variant"
            >
              <option value="">Any Year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>
        </section>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             [1,2,3,4,5,6,7,8].map(n => (
               <div key={n} className="h-72 bg-surface-container-low rounded-3xl animate-pulse" />
             ))
          ) : users.map((u) => (
            <motion.div 
              key={u._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-outline-variant/10 p-6 shadow-xl shadow-primary/5 hover:translate-y-[-4px] transition-all flex flex-col items-center text-center group"
            >
               <div className="w-20 h-20 rounded-full border-4 border-surface-container-low overflow-hidden mb-4 group-hover:border-primary/20 transition-all">
                  <img 
                    src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                    alt={u.name}
                    className="w-full h-full object-cover"
                  />
               </div>
               <h3 className="text-lg font-black text-on-surface mb-1">{u.name}</h3>
               <p className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                  {u.branch} | Year {u.year}
               </p>
               
               <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                  {u.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-bold px-2 py-1 bg-surface-container-high rounded-lg text-on-surface-variant">
                      {skill}
                    </span>
                  ))}
                  {u.skills.length > 3 && (
                    <span className="text-[9px] font-bold px-1 py-1 opacity-40">+{u.skills.length - 3}</span>
                  )}
               </div>

               <a 
                href={`/profile/${u._id}`}
                className="mt-auto w-full py-3 bg-surface-container-low text-on-surface font-bold rounded-xl text-[10px] tracking-widest uppercase hover:bg-primary hover:text-white transition-all shadow-sm"
               >
                 View Profile
               </a>
            </motion.div>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center opacity-40">
             <span className="material-symbols-outlined text-6xl mb-4">person_off</span>
             <p className="text-xl font-bold">No talent found matching these criteria</p>
             <p className="text-sm">Try broadening your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
