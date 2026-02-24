import { auth, currentUser } from '@/lib/auth'
import { clerkEnabled } from '@/lib/clerk-appearance'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { CinephileRadar } from '@/app/components/CinephileRadar'
import { Navbar } from '@/app/components/Navbar'
import { Star, Trophy, Clock, MessageSquare, Settings, ArrowRight, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPosterUrl } from '@/lib/tmdb-images'
import { SignOutButton } from '@/lib/auth-client'

export default async function ProfilePage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect(clerkEnabled ? '/sign-in' : '/')
  }

  const emailAddress = user.emailAddresses?.[0]?.emailAddress ?? 'dev@example.com'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

  const normalizedName = fullName || null
  const normalizedImageUrl = user.imageUrl || null

  // Use upsert to handle both first-time creation and subsequent visits.
  // This is more efficient and avoids manual sync checks for core profile fields.
  let dbUser = await db.user.upsert({
    where: { id: userId },
    update: {
      email: emailAddress,
      name: normalizedName,
      imageUrl: normalizedImageUrl,
    },
    create: {
      id: userId,
      email: emailAddress,
      name: normalizedName,
      imageUrl: normalizedImageUrl,
      dna: {
        create: {}
      }
    },
    include: { dna: true, watchlist: true, reviews: true, history: true }
  })

  const dnaData = dbUser.dna || {
    action: 0, comedy: 0, drama: 0, horror: 0, sciFi: 0, romance: 0, thriller: 0
  }

  const nextLevelXp = dbUser.level * 1000
  const xpProgress = nextLevelXp > 0 ? Math.min(100, Math.round((dbUser.xp / nextLevelXp) * 100)) : 0
  const xpRemaining = Math.max(0, nextLevelXp - dbUser.xp)

  const dnaLabelMap: Record<string, string> = {
    sciFi: 'Sci-Fi'
  }

  const dnaEntries = Object.entries(dnaData)
    .filter(([k]) => k !== 'id' && k !== 'userId' && k !== 'updatedAt')
    .map(([key, value]) => ({
      key,
      label: dnaLabelMap[key] ?? key,
      value: Number(value) || 0
    }))

  const topTaste = [...dnaEntries]
    .sort((a, b) => b.value - a.value)
    .filter((entry) => entry.value > 0)
    .slice(0, 2)

  const tasteSummary = topTaste.length > 0
    ? topTaste.map((entry) => entry.label.toUpperCase()).join(' + ')
    : 'NO DATA YET'

  const memberSince = dbUser.createdAt
    ? dbUser.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently joined'
  const lastSynced = dbUser.updatedAt
    ? dbUser.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Just now'

  const watchlistItems = [...dbUser.watchlist].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
  const recentWatchlist = watchlistItems.slice(0, 4)
  const watchlistDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const displayName = fullName || 'Film Fan'

  const stats = [
    { label: 'Level', value: dbUser.level, icon: Trophy, color: 'text-yellow-500', sub: 'Current rank' },
    { label: 'XP', value: `${dbUser.xp} / ${nextLevelXp}`, icon: Star, color: 'text-brand-400', sub: `${xpRemaining} to level ${dbUser.level + 1}`, progress: xpProgress },
    { label: 'Watchlist', value: dbUser.watchlist.length, icon: Clock, color: 'text-blue-400', sub: 'Saved to watchlist' },
    { label: 'Reviews', value: dbUser.reviews.length, icon: MessageSquare, color: 'text-rose-400', sub: 'Ratings shared' },
  ]

  const profileInitial = (user.firstName || user.lastName || 'U')[0].toUpperCase()

  return (
    <div className="relative min-h-screen bg-background text-white pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-10 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[28rem] -translate-x-1/2 rounded-full bg-white/5 blur-[140px]" />
      </div>
      <Navbar activeView="profile" />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32">
        {/* Profile Header */}
        <div className="relative mb-14 rounded-[32px] border border-white/5 bg-white/[0.03] p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" aria-hidden="true" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px] bg-gradient-to-tr from-brand-500 via-accent-500 to-brand-300 overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-background relative flex items-center justify-center text-white text-3xl font-bold ring-1 ring-white/10">
                    {user.imageUrl ? (
                        <Image 
                            src={user.imageUrl} 
                            alt={displayName} 
                            fill
                            sizes="160px"
                            className="object-cover"
                        />
                    ) : (
                        <span>{profileInitial}</span>
                    )}
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
                    <span>Profile</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>Member since {memberSince}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                      {displayName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/50 text-sm uppercase tracking-[0.18em]">
                    <span>Level {dbUser.level} Cinephile</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{dbUser.email}</span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      {['Scream King', 'Early Adopter', 'Binge Lord'].map(badge => (
                          <span key={badge} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-300">
                              {badge}
                          </span>
                      ))}
                      <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
                        Taste: {tasteSummary}
                      </span>
                  </div>
              </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map(stat => (
                <div key={stat.label} className="relative glass-panel p-6 rounded-3xl border border-white/5 space-y-4 overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" aria-hidden="true" />
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <div className="space-y-2">
                        <div className="text-2xl font-display font-medium">{stat.value}</div>
                        <div className="text-xs text-white/30 uppercase tracking-widest">{stat.label}</div>
                        {stat.sub && (
                          <div className="text-[11px] text-white/40">{stat.sub}</div>
                        )}
                    </div>
                    {typeof stat.progress === 'number' && (
                      <div className="pt-2">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                            style={{ width: `${stat.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart Section */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute -top-20 right-10 h-40 w-40 rounded-full bg-brand-500/10 blur-[80px]" aria-hidden="true" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-medium">Cinephile DNA</h3>
                      <p className="text-sm text-white/50">Your taste signature based on every interaction.</p>
                    </div>
                    <span className="text-xs text-brand-400 font-medium uppercase tracking-widest">Real-time taste chart</span>
                </div>
                <CinephileRadar data={dnaData} />
            </div>

            {/* DNA Breakdown */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-medium">DNA Breakdown</h3>
                  <p className="text-sm text-white/50">Where your taste is headed.</p>
                </div>
                <div className="space-y-4">
                    {dnaEntries.map((entry) => (
                        <div key={entry.key} className="space-y-2">
                            <div className="flex justify-between text-xs uppercase tracking-wider text-white/40">
                                <span>{entry.label}</span>
                                <span>{entry.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-brand-500 rounded-full" 
                                    style={{ width: `${entry.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-display font-medium">Recently Saved</h3>
                <p className="text-sm text-white/50">Your latest picks, ready when you are.</p>
              </div>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-300 hover:text-brand-200 transition-colors"
              >
                View full collection
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {recentWatchlist.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentWatchlist.map((item) => {
                  const href = item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`
                  const posterUrl = getPosterUrl(item.poster, 'w342')
                  return (
                    <Link key={item.id} href={href as any} className="group space-y-3">
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        {posterUrl ? (
                          <Image
                            src={posterUrl}
                            alt={item.title}
                            fill
                            sizes="200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                            No Poster
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium line-clamp-2">{item.title}</div>
                        <div className="text-xs text-white/40 uppercase tracking-wide">
                          {item.mediaType === 'tv' ? 'Series' : 'Movie'} · {watchlistDateFormatter.format(item.addedAt)}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/50">
                Your watchlist is empty. Save a few titles and they will show up here.
              </div>
            )}
          </section>

          <aside className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-display font-medium">Account</h3>
                <p className="text-sm text-white/50">Update your Clerk profile details.</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-300">
                <Settings className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-white/60">
                <span>Email</span>
                <span className="text-white/80">{dbUser.email}</span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                <span>Member since</span>
                <span className="text-white/80">{memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                <span>Last synced</span>
                <span className="text-white/80">{lastSynced}</span>
              </div>
            </div>

            <Link
              href={"/user-profile" as any}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-background text-sm font-semibold py-3 hover:bg-brand-50 transition-colors"
            >
              Open Clerk Profile
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            
            {clerkEnabled && (
              <SignOutButton>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 text-white/80 text-sm font-semibold py-3 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign out
                </button>
              </SignOutButton>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
