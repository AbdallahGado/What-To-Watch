'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowRight, Loader2 } from 'lucide-react';
import { createSession, joinSession } from '@/app/actions/swipe';
import { toast } from 'sonner';

export function SquadSwipePanel() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const session = await createSession();
        toast.success(`Room ${session.code} ready`);
        router.push(`/swipe/${session.code}`);
      } catch (error) {
        console.error(error);
        toast.error('Could not create session');
      }
    });
  };

  const handleJoin = () => {
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 4) {
      toast.error('Enter a valid room code');
      return;
    }
    startTransition(async () => {
      try {
        const session = await joinSession(normalized);
        toast.success(`Joined ${session.code}`);
        router.push(`/swipe/${session.code}`);
      } catch (error) {
        console.error(error);
        toast.error('Could not join session');
      }
    });
  };

  return (
    <section className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-display font-medium">Squad Swipe</h3>
          <p className="text-sm text-white/50">
            Swipe trending titles with friends until you match on something to watch.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-300 shrink-0">
          <Users className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCreate}
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 text-white text-sm font-semibold py-3 hover:bg-brand-400 transition-colors disabled:opacity-60"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        Start a new room
      </button>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 right-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-[11px] uppercase tracking-[0.2em] text-white/30 bg-[#0f0f12]">
            or join
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ROOM CODE"
          maxLength={8}
          className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm tracking-[0.2em] uppercase placeholder:text-white/25 focus:outline-none focus:border-brand-400/50"
          aria-label="Room code"
        />
        <button
          type="button"
          onClick={handleJoin}
          disabled={isPending}
          className="px-5 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-60"
        >
          Join
        </button>
      </div>
    </section>
  );
}
