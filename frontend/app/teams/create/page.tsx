'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlassNav from '@/components/GlassNav';
import { fetcher } from '@/utils/api';
import { Competition } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function CreateTeamPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedComp, setSelectedComp] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [skills, setSkills] = useState<string[]>(['React', 'Tailwind CSS', 'Figma']);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isHost = user?.role === 'host' || user?.role === 'admin';

  useEffect(() => {
    const getComps = async () => {
      try {
        const data = await fetcher<Competition[]>('/competitions');
        setCompetitions(data.filter(c => c.isOfficial));
        if (data.length > 0) setSelectedComp(data[0]._id);
      } catch (error) {
        console.error('Error fetching comps:', error);
      }
    };
    getComps();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If Host, they create a competition directly
      // If Student, they create a 'community project' (which is technically a competition in our model)
      const endpoint = isHost ? '/competitions' : '/competitions'; // Both go to competitions, backend handles isOfficial
      
      await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          title: name, // Using 'name' but backend expects 'title'
          description,
          category: isHost ? 'Competition' : 'Project',
          teamSize,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
          requiredSkills: skills,
        }),
      });
      router.push('/explore');
    } catch (error) {
      alert('Operation failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-body">
      <GlassNav />
      
      <main className="flex-grow pt-32 pb-12 px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">
              {isHost ? 'Launch Official Competition' : 'Spark a Community Project'}
            </h1>
            <p className="text-on-surface-variant text-lg opacity-80 leading-relaxed">
              {isHost 
                ? 'Institutional grade event management for your college ecosystem.' 
                : 'reddit-style open posting. Share your idea and find your squad.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 p-8 md:p-12 border border-outline-variant/10">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Competition/Post Title */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-on-surface tracking-tight" htmlFor="team-name">
                  {isHost ? 'Competition Title' : 'Project Subject'}
                </label>
                <input 
                  id="team-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isHost ? "e.g. AWS GameDay 2024" : "e.g. Building a Decentralized Marketplace"}
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold text-on-surface outline-none"
                />
              </div>

              {/* Required Skills Section */}
              <div className="space-y-4">
                <label className="block text-lg font-bold text-on-surface tracking-tight">Required Expertise</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Enter skill and press enter..."
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold text-on-surface outline-none mb-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-2 shadow-sm">
                        {skill} 
                        <span 
                          onClick={() => removeSkill(skill)}
                          className="material-symbols-outlined text-[16px] cursor-pointer opacity-60 hover:opacity-100"
                        >
                          close
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-lg font-bold text-on-surface tracking-tight" htmlFor="team-size">Target team size</label>
                  <span className="text-primary font-extrabold text-xl">{teamSize} Members</span>
                </div>
                <input 
                  id="team-size"
                  type="range"
                  min="2"
                  max="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container-low rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Project Description */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-on-surface tracking-tight" htmlFor="description">
                  {isHost ? 'Event Guidelines' : 'The Mission'}
                </label>
                <textarea 
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isHost 
                    ? "Detailed rules, timeline, and prize structure..." 
                    : "What are you building? Why should people join? Be bold."} 
                  className="w-full px-6 py-5 bg-surface-container-low border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium text-on-surface outline-none h-40 resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="w-full md:w-auto px-10 py-4 text-on-surface-variant font-bold hover:bg-surface-container-low rounded-2xl transition-all text-sm"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-14 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-extrabold rounded-2xl shadow-2xl shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all text-sm tracking-widest uppercase"
                >
                  {loading ? 'Initializing...' : (isHost ? 'Deploy Event' : 'Launch Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
