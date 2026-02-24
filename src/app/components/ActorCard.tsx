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
      className={`flex flex-col items-center gap-3 group transition-transform hover:-translate-y-1 ${isInteractive ? 'cursor-pointer' : ''}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`View profile for ${name}`}
    >
      <div className="relative w-24 h-24 rounded-full p-[2px] overflow-hidden transition-all duration-300 group-hover:scale-105">
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-brand-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" 
          aria-hidden="true"
        />
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-transparent relative z-10 bg-[#1e2128]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors text-center tracking-wide line-clamp-2 px-1">
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

