'use client';
import Link from 'next/link';
import SkillChip from './SkillChip';
import { Competition, Team } from '@/types';

interface TeamCardProps {
  item: Competition | Team;
  type: 'competition' | 'team';
}

export default function TeamCard({ item, type }: TeamCardProps) {
  const isCompetition = type === 'competition';
  const c = isCompetition ? (item as Competition) : (item as Team).competition;
  const t = !isCompetition ? (item as Team) : null;

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl shadow-primary/5 hover:translate-y-[-4px] transition-all flex flex-col group h-full border border-outline-variant/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
            {c.category}
          </span>
          {isCompetition && (item as Competition).isOfficial && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Official
            </span>
          )}
        </div>
        {isCompetition && (
          <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {new Date(c.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-on-surface mb-2 group-hover:text-primary transition-colors">
        {isCompetition ? c.title : (t?.name || c.title)}
      </h3>
      
      <p className="text-on-surface-variant text-sm line-clamp-2 mb-6 flex-1">
        {isCompetition ? c.description : t?.description}
      </p>

      <div className="space-y-4 pt-4 border-t border-surface-container-high">
        <div className="flex flex-wrap gap-2">
          {c.requiredSkills.slice(0, 3).map((skill, idx) => (
            <SkillChip key={idx} skill={skill} />
          ))}
          {c.requiredSkills.length > 3 && (
            <span className="text-[10px] font-bold text-on-surface-variant flex items-center h-full px-2">
              +{c.requiredSkills.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-surface-container-highest overflow-hidden">
                <img 
                  alt="Member" 
                  src={`https://i.pravatar.cc/150?u=${n + (isCompetition ? c._id : t?._id || '')}`} 
                />
              </div>
            ))}
          </div>
          <Link 
            href={isCompetition ? `/explore` : `/teams/${t?._id}`}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline underline-offset-4"
          >
            {isCompetition ? 'Join Team' : 'View Details'}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
