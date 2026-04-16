'use client';

interface SkillChipProps {
  skill: string;
  color?: 'primary' | 'secondary' | 'outline';
}

export default function SkillChip({ skill, color = 'secondary' }: SkillChipProps) {
  const colorClasses = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed',
    outline: 'border border-dashed border-outline-variant text-on-surface-variant'
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all hover:brightness-95 flex items-center gap-2 ${colorClasses[color]}`}>
      {skill}
    </span>
  );
}
