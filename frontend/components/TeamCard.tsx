'use client';
import { useState } from 'react';
import Link from 'next/link';
import SkillChip from './SkillChip';
import { Competition, Team, Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/utils/api';

interface TeamCardProps {
  item: Competition | Team | Project;
  type: 'competition' | 'team' | 'project';
}

export default function TeamCard({ item, type }: TeamCardProps) {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Derived properties based on Type
  const isComp = type === 'competition';
  const isTeam = type === 'team';
  const isProj = type === 'project';

  const title = isComp ? (item as Competition).title : (isTeam ? (item as Team).name : (item as Project).title);
  const description = isComp ? (item as Competition).description : (isTeam ? (item as Team).description : (item as Project).description);
  const category = isComp ? (item as Competition).category : (isTeam ? (item as Team).competition?.category : (item as Project).category);
  const skills = isComp ? (item as Competition).requiredSkills : (isTeam ? (item as Team).competition?.requiredSkills : (item as Project).requiredSkills) || [];
  
  const members = isTeam ? (item as Team).members.map(m => m.user) : (isProj ? (item as Project).members : []);
  const targetId = isTeam ? (item as Team)._id : (isProj ? (item as Project)._id : null);

  // Determine if the current user owns this project (authors can't join their own project)
  const projectAuthorId = isProj ? ((item as Project).author?._id || (item as Project).author as unknown as string) : null;
  const isOwner = !!user && !!projectAuthorId && (user._id === projectAuthorId);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to collaborate');
    setIsJoining(true);
    try {
      await fetcher('/requests', {
        method: 'POST',
        body: JSON.stringify({
          receiverTeam: isTeam ? targetId : undefined,
          receiverProject: isProj ? targetId : undefined,
          type: 'join_request',
          message: `I'm interested in joining your ${type}!`
        })
      });
      setHasRequested(true);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl shadow-primary/5 hover:translate-y-[-4px] transition-all flex flex-col group h-full border border-outline-variant/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          {category && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
              {category}
            </span>
          )}
          {isComp && (item as Competition).isOfficial && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Official
            </span>
          )}
          {isProj && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">school</span>
              Project
            </span>
          )}
        </div>
        
        {isComp && (
            <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                {new Date((item as Competition).deadline).toLocaleDateString()}
            </span>
        )}
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-on-surface mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-on-surface-variant text-sm line-clamp-2 mb-6 flex-1">
        {description}
      </p>

      <div className="space-y-4 pt-4 border-t border-surface-container-high">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, idx) => (
            <SkillChip key={idx} skill={skill} />
          ))}
          {skills.length > 3 && (
            <span className="text-[10px] font-bold text-on-surface-variant flex items-center h-full px-2">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {members.length > 0 ? members.slice(0, 3).map((m: any, n: number) => (
              <div key={n} className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-surface-container-highest overflow-hidden">
                <img 
                  alt={m?.name || 'Member'} 
                  src={m?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(m?.name || 'U')}&background=random`} 
                />
              </div>
            )) : (
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] opacity-40">person</span>
                </div>
            )}
          </div>
          
          {(isTeam || isProj) ? (
             <div className="flex gap-4 items-center">
                 <Link 
                    href={isTeam ? `/teams/${targetId}` : `/explore`} 
                    className="text-[10px] font-bold text-on-surface-variant underline uppercase tracking-widest"
                 >
                    Details
                 </Link>
                 {isOwner ? (
                   <span className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant">
                     Your Project
                   </span>
                 ) : (
                   <button 
                    onClick={handleJoin}
                    disabled={isJoining || hasRequested}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${hasRequested ? 'bg-emerald-100 text-emerald-700' : 'bg-primary text-white shadow-lg shadow-primary/20 active:scale-95'}`}
                   >
                     {isJoining ? '...' : (hasRequested ? 'Sent' : 'Join')}
                   </button>
                 )}
             </div>
          ) : (
             <Link 
              href={`/teams/create?compId=${item._id}`}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline underline-offset-4"
            >
              Build Team
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
