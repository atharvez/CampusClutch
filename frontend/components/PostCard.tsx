'use client';
import { Competition } from '@/types';

interface PostCardProps {
  post: Competition;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant/10 hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col gap-4 group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-lg">person</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-extrabold text-on-surface">Community Post</p>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-60">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-surface-container-low rounded-full">
           <span className="material-symbols-outlined text-[14px] text-primary">arrow_upward</span>
           <span className="text-[10px] font-bold text-on-surface">{post.upvotes}</span>
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      
      <p className="text-sm text-on-surface-variant opacity-80 line-clamp-3 leading-relaxed">
        {post.description}
      </p>

      <div className="pt-4 border-t border-surface-container-low flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary">
         <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">forum</span>
            Discuss Project
         </span>
         <span className="flex items-center gap-1">
            Join Team
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
         </span>
      </div>
    </div>
  );
}
