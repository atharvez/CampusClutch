'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GlassNav from '@/components/GlassNav';
import SkillChip from '@/components/SkillChip';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { User, Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitingProjectId, setInvitingProjectId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('Hey! We are looking for someone with your skills to join our project.');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const getData = async () => {
      try {
        const [profileData, projectData] = await Promise.all([
          fetcher<User>(`/users/${id}`),
          currentUser ? fetcher<Project[]>(`/projects?author=${currentUser._id}`) : Promise.resolve([])
        ]);
        setProfile(profileData);
        setMyProjects(projectData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getData();
  }, [id, currentUser]);

  const handleSendInvite = async () => {
    if (!invitingProjectId) return alert('Please select a project');
    setIsSendingInvite(true);
    try {
      await fetcher('/requests', {
        method: 'POST',
        body: JSON.stringify({
          receiverProject: invitingProjectId,
          recipientUser: id,
          type: 'invite',
          message: inviteMessage
        })
      });
      setInviteStatus('success');
      setTimeout(() => setShowInviteModal(false), 2000);
    } catch (error: any) {
      alert(error.message);
      setInviteStatus('error');
    } finally {
      setIsSendingInvite(false);
    }
  };

  if (loading || !profile) return <div className="min-h-screen bg-surface flex items-center justify-center font-manrope">Loading profile...</div>;

  const isMe = currentUser?._id === profile._id;

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <GlassNav />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Profile Column */}
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
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
                    {profile.name}
                  </h1>
                  {!isMe && currentUser && (
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all w-fit mx-auto md:mx-0"
                    >
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Invite to Squad
                    </button>
                  )}
                </div>
                <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl opacity-80">
                  {profile.bio || "Student collaborator focused on making an impact."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <a href={profile.githubLink || '#'} target="_blank" className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant font-bold text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">terminal</span>
                    GitHub
                  </a>
                  <a href={profile.portfolioLink || '#'} target="_blank" className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant font-bold text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">language</span>
                    Portfolio
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
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
                <div className="col-span-full py-10 text-center text-on-surface-variant italic opacity-60">This user hasn't listed skills yet.</div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar / Info Column */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="sticky top-24 bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl shadow-primary/5 text-center flex flex-col gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2">Academic Profile</p>
              <p className="text-xl font-extrabold text-on-surface">{profile.branch}</p>
              <p className="text-sm font-semibold text-on-surface-variant opacity-70">Year {profile.year}</p>
            </div>

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
        </aside>
      </main>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black text-on-surface tracking-tight mb-2">Scout Talent</h2>
                <p className="text-on-surface-variant font-medium opacity-60 italic">Invite {profile.name} to join your mission.</p>
              </div>

              {inviteStatus === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h3 className="text-xl font-bold">Invitation Sent!</h3>
                  <p className="text-sm opacity-60">We've notified them about your interest.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">Choose Project</label>
                    <div className="relative">
                      <select 
                        value={invitingProjectId}
                        onChange={(e) => setInvitingProjectId(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                      >
                        <option value="">Select a project...</option>
                        {myProjects.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">expand_more</span>
                    </div>
                    {myProjects.length === 0 && (
                      <p className="mt-2 text-[10px] text-amber-600 font-bold uppercase">You don't have any projects to invite them to.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">Message</label>
                    <textarea 
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-semibold text-on-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none h-32 resize-none"
                      placeholder="Why should they join you?"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      disabled={isSendingInvite || myProjects.length === 0}
                      onClick={handleSendInvite}
                      className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-xs tracking-widest uppercase disabled:opacity-50 disabled:grayscale"
                    >
                      {isSendingInvite ? 'Sending...' : 'Send Invitation'}
                    </button>
                    <button 
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 py-4 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-all text-xs tracking-widest uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
