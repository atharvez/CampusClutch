'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import SkillChip from '@/components/SkillChip';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    githubLink: '',
    portfolioLink: '',
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetcher<User>('/users/profile');
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          skills: data.skills?.join(', ') || '',
          githubLink: data.githubLink || '',
          portfolioLink: data.portfolioLink || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) getProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const data = await fetcher<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ ...formData, skills: skillsArray }),
      });
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading || !profile) return <div className="min-h-screen bg-surface flex items-center justify-center font-manrope">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <GlassNav />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Profile Column (Asymmetric Layout like reference) */}
        <div className="flex-1 space-y-12">
          
          {/* Hero Header Section */}
          <section className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-xl shadow-primary/5 ring-1 ring-on-surface-variant/5">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
              <div className="relative">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-2xl rotate-3 transform transition-transform hover:rotate-0 ring-4 ring-white bg-surface-container-highest">
                  <img 
                    alt={profile.name} 
                    className="w-full h-full object-cover" 
                    src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=256&background=random`} 
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left pb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight mb-4">
                  {profile.name}
                </h1>
                <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl opacity-80">
                  {profile.bio || "Full-stack developer passionate about building college communities."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <a href={profile.githubLink || '#'} className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant font-bold text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">terminal</span>
                    GitHub
                  </a>
                  <a href={profile.portfolioLink || '#'} className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant font-bold text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">language</span>
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section (Bento Style) */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline text-on-surface px-2">Expertise & Craft</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col items-center justify-center gap-3 transition-all hover:translate-y-[-6px] hover:shadow-xl hover:shadow-primary/5">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">code</span>
                    </div>
                    <span className="font-bold text-on-surface text-sm uppercase tracking-wider">{skill}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-on-surface-variant italic opacity-60">No skills added yet.</div>
              )}
            </div>
          </section>

          {/* Edit Form Section */}
          {isEditing && (
            <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl shadow-primary/5 ring-1 ring-on-surface-variant/5">
              <h2 className="text-2xl font-bold font-headline text-on-surface mb-8">Refine your profile</h2>
              <form onSubmit={handleUpdate} className="space-y-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Professional Bio</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none h-32 resize-none"
                    placeholder="Describe your expertise and what you're looking to build..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Skills (comma separated)</label>
                  <input 
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="React, Next.js, UI Design, AWS..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">GitHub Profile</label>
                    <input 
                      type="text"
                      value={formData.githubLink}
                      onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Portfolio Website</label>
                    <input 
                      type="text"
                      value={formData.portfolioLink}
                      onChange={(e) => setFormData({...formData, portfolioLink: e.target.value})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98]">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        {/* Sidebar / Action Column */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="sticky top-24 bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl shadow-primary/5 text-center flex flex-col gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2">Academic Profile</p>
              <p className="text-xl font-extrabold text-on-surface">{profile.branch}</p>
              <p className="text-sm font-semibold text-on-surface-variant opacity-70">{profile.year}</p>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all w-full flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit Profile
              </button>
            )}

            <div className="pt-8 border-t border-surface-container-low flex justify-between px-2">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-on-surface">14</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-70">Teams</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-on-surface">32</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-70">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-on-surface">1.4k</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-70">Collabs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10 space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
              Skill Boosters
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">Based on your skills, you might be interested in the upcoming AWS GameDay competition.</p>
            <button className="text-xs font-bold text-primary hover:underline">Explore Competitions</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
