'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import GlassNav from '@/components/GlassNav';
import SkillChip from '@/components/SkillChip';
import { fetcher } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Team, Message } from '@/types';
import io, { Socket } from 'socket.io-client';

export default function TeamDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getTeam = async () => {
      try {
        const data = await fetcher<Team>(`/teams/${id}`);
        setTeam(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };
    if (user) getTeam();
  }, [id, user]);

  useEffect(() => {
    if (user && team) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
      
      socketRef.current.emit('joinTeam', { teamId: id });

      socketRef.current.on('message', (message: any) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [id, user, team]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData = {
      teamId: id,
      senderId: user?._id,
      senderName: user?.name,
      content: newMessage,
      createdAt: new Date(),
    };

    socketRef.current.emit('chatMessage', messageData);
    setNewMessage('');
  };

  if (loading || !team) return <div className="min-h-screen bg-surface flex items-center justify-center font-manrope">Loading team details...</div>;

  const isLeader = user?._id === (typeof team.createdBy === 'string' ? team.createdBy : team.createdBy._id);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <GlassNav />
      
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Hero Section - Design Matched */}
        <header className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-8 lg:p-12 mb-10 text-white flex flex-col md:flex-row justify-between items-end gap-8 overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full mb-6 ring-1 ring-white/20">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{team.competition.category}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-tight">{team.name}</h1>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl font-medium">
              {team.description || "No description provided for this team project."}
            </p>
          </div>
          <div className="relative z-10 flex gap-3">
             {isLeader && (
               <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl active:scale-95 transition-all shadow-xl hover:shadow-2xl">
                 Manage Team
               </button>
             )}
             <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl active:scale-95 transition-all">
                Share Team
             </button>
          </div>
          {/* Decorative blur */}
          <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Required Skills Section */}
            <section className="bg-surface-container-low rounded-[2rem] p-10 shadow-xl shadow-primary/5 border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">psychology</span>
                </div>
                <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Required Expertise</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {team.competition.requiredSkills.map((skill, idx) => (
                  <SkillChip key={idx} skill={skill} color="secondary" />
                ))}
              </div>
            </section>

            {/* Chat Interface - Refined Design */}
            <section className="bg-surface-container-lowest rounded-[2rem] shadow-2xl shadow-primary/5 border border-outline-variant/10 flex flex-col min-h-[600px] overflow-hidden">
              <div className="px-10 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 className="font-extrabold text-lg text-on-surface tracking-tight">Team Collaboration</h3>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Live Channel</span>
              </div>
              
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-8 bg-surface-container-low/20">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <span className="material-symbols-outlined text-6xl mb-4">forum</span>
                    <p className="font-bold text-xl">Silent Waters</p>
                    <p className="text-sm mt-2">The conversation hasn't started yet.</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.senderId === user?._id ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-bold text-on-surface-variant opacity-70">{msg.senderName}</span>
                       <span className="text-[10px] opacity-40 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-6 py-3.5 rounded-3xl max-w-[85%] text-sm font-medium leading-relaxed ${
                      msg.senderId === user?._id 
                        ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
                        : 'bg-white text-on-surface rounded-tl-none border border-outline-variant/10 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-8 bg-surface-container-low/10 border-t border-surface-container-low flex gap-4">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Communicate with your team..."
                  className="flex-1 bg-white border-none rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm"
                />
                <button type="submit" className="w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center hover:brightness-110 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </form>
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Current Members Section */}
            <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-xl shadow-primary/5 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-extrabold text-on-surface inline-flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  Members
                </h2>
                <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                    {team.members.length}/{team.competition.teamSize} Slots
                </span>
              </div>
              <div className="space-y-4">
                {team.members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 transition-all hover:translate-x-1 border border-transparent hover:border-primary/10 hover:shadow-xl hover:shadow-primary/5">
                    <img className="w-12 h-12 rounded-full object-cover border-2 border-primary/5" src={member.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=random`} />
                    <div>
                      <p className="text-sm font-extrabold text-on-surface leading-tight">{member.user.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider opacity-60">
                         {member.role} | {member.user.branch}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Contextual Stats or Info */}
            <div className="bg-surface-container-low/50 p-8 rounded-[2rem] border border-outline-variant/20 italic text-sm text-on-surface-variant opacity-80 leading-relaxed font-medium">
                "We're looking for someone who's not just good at coding, but also loves the problem we're solving. Join us if you thrive in ambiguity!"
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
