'use client';
import { useState, useEffect } from 'react';
import GlassNav from '@/components/GlassNav';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Request } from '@/types';

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'applications'>('incoming');
  const { user } = useAuth();

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
        
        {/* Sidebar Navigation - Design Matched */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 rounded-2xl w-64 h-[calc(100vh-120px)] sticky top-24 bg-surface-container-low/50 backdrop-blur-xl shadow-xl shadow-primary/5 font-manrope text-sm font-medium">
          <div className="px-4 py-4">
            <h3 className="text-on-surface font-bold text-lg">Menu</h3>
            <p className="text-on-surface-variant text-xs mt-1">Manage collaborations</p>
          </div>
          <nav className="flex flex-col gap-1">
            <a href="/explore" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1 transition-transform rounded-xl">
              <span className="material-symbols-outlined text-lg">explore</span> Home
            </a>
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl transition-all">
              <span className="material-symbols-outlined text-lg">groups</span> My Teams
            </a>
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1 transition-transform rounded-xl">
              <span className="material-symbols-outlined text-lg">person</span> Profile
            </a>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <section className="flex-1 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Requests Dashboard</h1>
              <p className="text-on-surface-variant mt-2 text-lg opacity-80">Manage your collaborations and pending applications.</p>
            </div>
          </div>

          {/* Tabbed Navigation */}
          <div className="bg-surface-container-low p-1.5 rounded-2xl inline-flex gap-1 w-full md:w-auto ring-1 ring-on-surface-variant/5">
            <button 
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'incoming' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Incoming Requests
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'applications' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              My Applications
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl shadow-primary/5 overflow-hidden ring-1 ring-on-surface-variant/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Team Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date Requested</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8 h-20"></td>
                      </tr>
                    ))
                  ) : (
                    requests.map((req) => (
                      <tr key={req._id} className="hover:bg-surface-bright transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                              {req.receiverTeam.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{req.receiverTeam.name}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold opacity-60">
                                {req.type === 'join_request' ? 'Join Request' : 'Invitation'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">
                          {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                            req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                            (req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              req.status === 'pending' ? 'bg-amber-500' : 
                              (req.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500')
                            }`}></span>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="px-6 py-2.5 bg-surface-container-high text-on-surface text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {!loading && requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-on-surface-variant font-medium opacity-60">
                        No requests found in this section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Card - Asymmetric Layout match */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-10 rounded-2xl text-white flex flex-col justify-between min-h-[240px] shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Collaboration Insights</h2>
                <p className="text-primary-container text-sm max-w-md opacity-90 leading-relaxed font-medium">
                  You've successfully matched with 4 teams this semester. Your collaboration rate is among the top 10% in the CS department.
                </p>
              </div>
              <div className="relative z-10 flex gap-4 items-center mt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((n) => (
                    <img key={n} alt="Member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/150?u=${n}`} />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-extrabold">+12</div>
                </div>
                <span className="text-xs font-bold text-on-primary-container opacity-80 tracking-wide uppercase">New potential matches</span>
              </div>
              {/* Decorative circle */}
              <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="bg-tertiary-fixed p-8 rounded-2xl flex flex-col justify-center items-center text-center shadow-xl shadow-primary/5">
              <span className="material-symbols-outlined text-5xl text-on-tertiary-fixed mb-4">auto_awesome</span>
              <h3 className="text-on-tertiary-fixed font-extrabold text-xl tracking-tight">Skill Suggestion</h3>
              <p className="text-on-tertiary-fixed-variant text-sm mt-2 opacity-80 font-medium">Try adding "System Design" to your profile to match with research projects.</p>
              <button className="mt-8 px-8 py-3 bg-white/30 hover:bg-white text-on-tertiary-fixed text-xs font-bold rounded-xl transition-all shadow-sm">Update Skills</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
