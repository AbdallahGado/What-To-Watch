import { auth, currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { CinephileRadar } from '@/app/components/CinephileRadar'
import { Navbar } from '@/app/components/Navbar'
import { Star, Trophy, Clock, Heart } from 'lucide-react'
import Image from 'next/image'

export default async function ProfilePage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect('/')
  }

  let dbUser = await db.user.findUnique({
    where: { id: userId },
    include: { dna: true, watchlist: true }
  })

  if (!dbUser) {
    try {
      dbUser = await db.user.create({
        data: {
          id: userId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          imageUrl: user.imageUrl,
          dna: {
            create: {}
          }
        },
        include: { dna: true, watchlist: true }
      })
    } catch (error) {
      console.error('Failed to auto-initialize user:', error)
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
          <p className="text-white/60 max-w-md">
            We couldn't initialize your profile. Please ensure <code>DATABASE_URL</code> is correctly set in your <code>.env.local</code> and your database is running.
          </p>
        </div>
      )
    }
  }

  const dnaData = dbUser.dna || {
    action: 0, comedy: 0, drama: 0, horror: 0, sciFi: 0, romance: 0, thriller: 0
  }

  const stats = [
    { label: 'Level', value: dbUser.level, icon: Trophy, color: 'text-yellow-500' },
    { label: 'XP', value: `${dbUser.xp} / ${(dbUser.level) * 1000}`, icon: Star, color: 'text-brand-400' },
    { label: 'Watched', value: dbUser.watchlist.length, icon: Clock, color: 'text-blue-400' },
    { label: 'Favorites', value: '12', icon: Heart, color: 'text-red-400' },
  ]

  const profileInitial = (user.firstName || user.lastName || 'U')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="profile" />
      
      <main className="max-w-6xl mx-auto px-6 pt-32">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-brand-500 to-accent-500 overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden bg-background relative flex items-center justify-center text-white text-3xl font-bold">
                    {user.imageUrl ? (
                        <Image 
                            src={user.imageUrl} 
                            alt={user.firstName || 'User'} 
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span>{profileInitial}</span>
                    )}
                </div>
            </div>
            
            <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                    {user.firstName} {user.lastName}
                </h1>
                <p className="text-white/50 text-lg font-light tracking-wide uppercase">
                    Level {dbUser.level} Cinephile
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {['Scream King', 'Early Adopter', 'Binge Lord'].map(badge => (
                        <span key={badge} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-300">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map(stat => (
                <div key={stat.label} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                        <div className="text-2xl font-display font-medium">{stat.value}</div>
                        <div className="text-xs text-white/30 uppercase tracking-widest">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart Section */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-display font-medium">Cinephile DNA</h3>
                    <span className="text-xs text-brand-400 font-medium">REAL-TIME TASTE CHART</span>
                </div>
                <CinephileRadar data={dnaData} />
            </div>

            {/* DNA Breakdown */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                <h3 className="text-xl font-display font-medium">DNA Breakdown</h3>
                <div className="space-y-4">
                    {Object.entries(dnaData).filter(([k]) => k !== 'id' && k !== 'userId' && k !== 'updatedAt').map(([key, val]: [any, any]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between text-xs uppercase tracking-wider text-white/40">
                                <span>{key}</span>
                                <span>{val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-brand-500 rounded-full" 
                                    style={{ width: `${val}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
