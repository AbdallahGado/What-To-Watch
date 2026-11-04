import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import { Navbar } from '@/app/components/Navbar';
import { SwipeSessionClient } from './SwipeSessionClient';
import { getTrending } from '@/lib/tmdb';
import { getMediaTitle } from '@/lib/media';
import { ensureDbUser } from '@/lib/ensure-user';
import type { TMDBMediaType } from '@/lib/tmdb-types';
import Link from 'next/link';

export const metadata = {
  title: 'Squad Swipe',
  robots: { index: false, follow: false },
};

export default async function SwipePage({ params }: { params: { code: string } }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const code = params.code.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,8}$/.test(code)) notFound();

  await ensureDbUser(userId);

  const session = await db.watchSession.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      status: true,
      members: {
        select: {
          userId: true,
          user: { select: { name: true, imageUrl: true } },
        },
      },
    },
  });

  if (!session || session.status !== 'active') {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-3xl font-display">Session not found</h1>
            <p className="text-white/50 text-sm">
              That invite code is invalid or expired. Start a new squad session from your profile.
            </p>
            <Link
              href="/profile"
              className="inline-flex px-5 py-3 rounded-2xl bg-brand-500 text-sm font-semibold hover:bg-brand-400 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isMember = session.members.some((m) => m.userId === userId);
  if (!isMember) {
    await db.watchSessionMember.create({
      data: { sessionId: session.id, userId },
    });
  }

  const members = isMember
    ? session.members
    : (
        await db.watchSession.findUnique({
          where: { id: session.id },
          select: {
            members: {
              select: {
                userId: true,
                user: { select: { name: true, imageUrl: true } },
              },
            },
          },
        })
      )?.members ?? session.members;

  const trending = await getTrending();
  const initialMovies = trending
    .filter((item) => item.poster_path)
    .slice(0, 20)
    .map((item) => ({
      id: String(item.id),
      title: getMediaTitle(item),
      poster: item.poster_path,
      mediaType: (item.media_type === 'tv' ? 'tv' : 'movie') as TMDBMediaType,
    }));

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar />
      <SwipeSessionClient
        code={code}
        members={members}
        initialMovies={initialMovies}
      />
    </div>
  );
}
