'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/utils/api';
import GlassNav from '@/components/GlassNav';
import { motion } from 'framer-motion';

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [maxMembers, setMaxMembers] = useState(5);
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetcher('/projects', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          maxMembers,
          requiredSkills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        }),
      });
      router.push('/explore');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <GlassNav />
      
      <main className="pt-32 pb-12 px-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 ring-1 ring-on-surface-variant/5"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-on-surface tracking-tight mb-3">Launch a Project</h1>
            <p className="text-on-surface-variant max-w-md mx-auto">Start an independent initiative and find the perfect collaborators from across the campus.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3">
                <span className="material-symbols-outlined">error</span> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Project Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g., Campus Food Waste Tracking App"
                  required
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mission / Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[150px] resize-none"
                  placeholder="What are you building and why?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                >
                  <option>General</option>
                  <option>Software</option>
                  <option>Hardware</option>
                  <option>Social Impact</option>
                  <option>Research</option>
                  <option>Creative</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Max Collaborators</label>
                <input 
                  type="number" 
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  min="2"
                  max="50"
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Required Expertise (Comma separated)</label>
                <input 
                  type="text" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g., React, UI Design, Marketing"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-sm tracking-widest uppercase mt-4 disabled:opacity-50"
            >
              {loading ? 'Launching Pipeline...' : 'Broadcast Project'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
