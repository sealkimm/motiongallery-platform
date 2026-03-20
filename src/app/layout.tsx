import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

import { AuthProvider } from '@/providers/AuthProvider';

import FloatingAddButton from '@/components/button/FloatingAddButton';
import VisitorTracker from '@/components/common/VisitorTracker';
import { Toaster } from '@/components/ui/sonner';

import Theme from '../providers/theme-provider';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
});

// 페이지별 다르게 하기
export const metadata: Metadata = {
  title: 'Motion Gallery - 애니메이션 및 모션 효과 갤러리',
  description: 'GSAP, Three.js, CSS 및 기타 기술을 활용한 애니메이션 예제 모음',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Theme>
            <VisitorTracker />
            <Toaster position="top-center" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              {children}
            </div>
            <FloatingAddButton />
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
