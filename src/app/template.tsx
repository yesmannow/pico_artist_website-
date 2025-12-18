'use client';

import TransitionTemplate from '@/components/ui/TransitionTemplate';

export default function Template({ children }: { children: React.ReactNode }) {
  return <TransitionTemplate>{children}</TransitionTemplate>;
}
