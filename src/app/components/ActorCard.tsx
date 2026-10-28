'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { TMDBPerson } from '@/lib/tmdb-types';
import { getProfileUrl } from '@/lib/tmdb-images';

interface ActorCardProps {
  actor?: {
    id: string;
    name: string;
    image: string;
  };
  person?: TMDBPerson & { image?: string | null };
  onClick?: () => void;
}

const ActorCardComponent = ({ actor, person, onClick }: ActorCardProps) => {
  const name = actor?.name ?? person?.name ?? 'Unknown';
  const imageSrc = getProfileUrl(actor?.image ?? person?.image ?? person?.profile_path ?? null, 'w185');
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`flex flex-col items-center gap-4 group transition-transform duration-500 hover:-translate-y-2 ${isInteractive ? 'cursor-pointer' : ''}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`View profile for ${name}`}
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[2px] overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-brand-500/20 ring-1 ring-white/10 group-hover:ring-white/30">
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          aria-hidden="true"
        />
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-transparent relative z-10 bg-slate-900">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 96px, 112px"
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/40">
              <span className="text-xs font-semibold">No Image</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-sm md:text-base font-medium text-white/70 group-hover:text-white transition-colors duration-300 text-center tracking-wide line-clamp-2 px-2">
        {name}
      </span>
    </div>
  );
};

ActorCardComponent.displayName = 'ActorCard';

export const ActorCard = memo(ActorCardComponent, (prevProps, nextProps) => {
  return (
    (prevProps.actor?.id === nextProps.actor?.id || prevProps.person?.id === nextProps.person?.id) &&
    prevProps.onClick === nextProps.onClick
  );
});

