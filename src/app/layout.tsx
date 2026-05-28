import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import '@/styles/globals.css';

import AppThemeProvider from '@/providers/AppThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';

import FloatingAddButton from '@/components/button/FloatingAddButton';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
});

// 페이지별 다르게 하기
export const metadata: Metadata = {
  title: 'Motion Gallery - 애니메이션 및 모션 효과 갤러리',
  description: 'GSAP, Three.js, CSS 및 기타 기술을 활용한 애니메이션 예제 모음',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <AppThemeProvider>
            <Toaster position="top-center" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              {children}
            </div>
            <FloatingAddButton />
          </AppThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
