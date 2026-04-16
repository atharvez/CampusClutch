'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Request } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'applications'>('incoming');
  const { user } = useAuth();

  const handleStatusUpdate = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await fetcher(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
    } catch (error) {
      alert('Error updating request: ' + (error as Error).message);
    }
  };

  const filteredRequests = requests.filter(req => {
    const isMyTeam = req.receiverTeam?.members?.some((m: any) => (m.user?._id || m.user) === user?._id);
    const isMyProject = req.receiverProject?.author?._id === user?._id || req.receiverProject?.author === user?._id;
    const isMeRecipient = req.recipientUser?._id === user?._id;

    if (activeTab === 'incoming') {
      // Incoming: join_request to my team/project OR invite that I received
      if (req.type === 'join_request') return isMyTeam || isMyProject;
      if (req.type === 'invite') return isMeRecipient;
      return false;
    } else {
      // Applications: items I SENT
      return (req.sender?._id || req.sender) === user?._id;
    }
  });

  useEffect(() => {
    const getRequests = async () => {
      try {
        const data = await fetcher<Request[]>('/requests');
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) getRequests();
  }, [user]);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <GlassNav />
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl w-64 h-[calc(100vh-120px)] sticky top-24 bg-surface-container-low/50 backdrop-blur-xl shadow-xl shadow-primary/5 font-manrope text-sm font-medium">
          <div className="px-4 py-4">
            <h3 className="text-on-surface font-bold text-lg">Dashboard</h3>
            <p className="text-on-surface-variant text-xs mt-1">Manage collaborations</p>
          </div>
          <nav className="flex flex-col gap-1">
            <a href="/explore" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1 transition-transform rounded-xl">
              <span className="material-symbols-outlined text-lg">explore</span> Explore
            </a>
            <a href="/community" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1 transition-transform rounded-xl">
               <span className="material-symbols-outlined text-lg">groups</span> Community
            </a>
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl transition-all">
              <span className="material-symbols-outlined text-lg">move_to_inbox</span> Inbox
            </a>
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1 transition-transform rounded-xl">
              <span className="material-symbols-outlined text-lg">person</span> Profile
            </a>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <section className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Inbox</h1>
            <p className="text-on-surface-variant mt-2 text-lg opacity-80">Track your invitations and squad applications.</p>
          </div>

          {/* Tabbed Navigation */}
          <div className="bg-surface-container-low p-1.5 rounded-2xl inline-flex gap-1 w-full md:w-auto border border-outline-variant/10">
            <button 
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'incoming' ? 'bg-white text-primary shadow-lg' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Incoming Requests
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'applications' ? 'bg-white text-primary shadow-lg' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Sent Items
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden border border-outline-variant/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Target Entity</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Type</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      [1, 2, 3].map((n) => (
                        <tr key={n} className="animate-pulse">
                          <td colSpan={4} className="px-8 py-8 h-20"></td>
                        </tr>
                      ))
                    ) : (
                      filteredRequests.map((req) => {
                        const targetName = req.receiverTeam?.name || req.receiverProject?.title || 'Personal Invite';
                        const targetColor = req.receiverProject ? 'bg-amber-500' : 'bg-primary';
                        
                        return (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={req._id} 
                            className="hover:bg-surface-bright transition-colors group"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${targetColor} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                                  {targetName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-on-surface tracking-tight">{targetName}</p>
                                  <p className="text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-widest">
                                    {activeTab === 'incoming' ? `From: ${req.sender.name}` : `Sent To: ${req.recipientUser?.name || 'Recruitment'}`}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-black opacity-40">
                                  {req.type === 'join_request' ? 'Join Request' : 'Invite'}
                               </p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                (req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              {req.status === 'pending' && activeTab === 'incoming' ? (
                                <div className="flex gap-2 justify-end">
                                  <button 
                                    onClick={() => handleStatusUpdate(req._id, 'accepted')}
                                    className="px-5 py-2.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
                                  >
                                    Accept
                                  </button>
                                   <button 
                                    onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                    className="px-5 py-2.5 bg-rose-500 text-white text-[10px] font-black rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-rose-500/20 uppercase tracking-widest"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
                                   Resolved
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {!loading && filteredRequests.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-20 text-3xl">inbox</span>
                </div>
                <p className="text-on-surface-variant font-bold text-lg opacity-60 tracking-tight">Your inbox is clear</p>
                <p className="text-xs text-on-surface-variant opacity-40 mt-1 uppercase tracking-widest">Check back later for squad activity</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
