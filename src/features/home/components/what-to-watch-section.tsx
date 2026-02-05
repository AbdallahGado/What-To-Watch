import { WhatToWatchEntry } from '@/features/recommend/what-to-watch-entry';
import { ScrollReveal } from '@/app/components/ScrollReveal';

export function WhatToWatchEntrySection() {
  return (
    <ScrollReveal delay={0.15}>
        <WhatToWatchEntry />
    </ScrollReveal>
  );
}
