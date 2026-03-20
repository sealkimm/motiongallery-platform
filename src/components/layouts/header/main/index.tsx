'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import AuthButtons from './AuthButtons';
import CategoryNav from './CategoryNav';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import UserMenu from './UserMenu';

const MainHeader = () => {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeCategory = pathname === '/' ? 'all' : pathname.split('/')[1];

  return (
    <>
      <div className="hidden">{isLoading}</div>
      <header
        className="fade-down-enter fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/0 backdrop-blur-md"
      >
        <div className="container relative flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative text-2xl font-bold">
              <span className="gradient-text">Motion Gallery</span>
            </Link>
          </div>
          <div className="relative flex items-center">
            <CategoryNav activeCategory={activeCategory} />
            {user && <UserMenu user={user} onSignOut={signOut} />}
            <AuthButtons isAuthenticated={!!user} />

            {/* 모바일 메뉴 버튼 */}
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(prev => !prev)}
            />
          </div>
        </div>
      </header>

      {/* 모바일 카테고리 메뉴 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeCategory={activeCategory}
      />
    </>
  );
};

export default MainHeader;
