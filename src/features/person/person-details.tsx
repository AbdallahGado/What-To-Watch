import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import type { TMDBMedia, TMDBPersonDetails } from '@/lib/tmdb-types';
import { getMediaTitle } from '@/lib/media';
import { getProfileUrl } from '@/lib/tmdb-images';

interface PersonDetailsProps {
  data: TMDBPersonDetails;
}

export function PersonDetails({ data }: PersonDetailsProps) {
  const profileUrl = getProfileUrl(data.profile_path, 'w300');

  const credits = (data.combined_credits?.cast ?? []) as TMDBMedia[];

  return (
    <div className="min-h-screen bg-background text-white pb-16">
      <Navbar />
      <main className="pt-24 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-40 shrink-0">
            {profileUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl">
                <Image
                  src={profileUrl}
                  alt={data.name}
                  width={260}
                  height={390}
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-light">{data.name}</h1>
            <p className="text-xs text-white/50 uppercase tracking-[0.2em]">
              {data.known_for_department}
            </p>
            {data.biography && (
              <p className="text-sm text-white/70 whitespace-pre-line">
                {data.biography}
              </p>
            )}
          </div>
        </div>

        {credits.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-medium mb-3">Known for</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/70">
              {credits.slice(0, 8).map((credit) => (
                <div key={credit.id} className="space-y-1">
                  <p className="font-medium line-clamp-2">
                  {getMediaTitle(credit)}
                  </p>
                  {credit.character && (
                    <p className="text-white/50 line-clamp-1">
                      as {credit.character}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

