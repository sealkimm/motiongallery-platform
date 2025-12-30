'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import { gsap, useGSAP } from '@/lib/gsap';
import VisitorStats from '@/components/common/VisitorStats';

import AuthButtons from './AuthButtons';
import CategoryNav from './CategoryNav';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import UserMenu from './UserMenu';

const MainHeader = () => {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const { user, isLoading, signOut } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 리팩토링

  useEffect(() => {
    if (pathname === '/') {
      setActiveCategory('all');
    } else {
      const type = pathname.split('/')[1];
      setActiveCategory(type);
    }
  }, [pathname]);

  // 로딩부분 깔끔하게 다시 만들기
  useGSAP(
    () => {
      if (!headerRef.current) return;

      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    },
    { scope: headerRef },
  );

  // ✳️✳️✳️✳️ 로그인할때 에러때문에 넣은 로딩인데 이거때문에 모션 안되서 잠시 지움 -> 다시 확인 꼭 하기!!
  // if (isLoading)
  //   return (
  //     <div className="flex h-full w-full items-center justify-center bg-green-500">
  //       로딩중...
  //     </div>
  //   );

  return (
    <>
      <div className="hidden">{isLoading}</div>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/0 backdrop-blur-md"
      >
        <div className="container relative flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative text-2xl font-bold">
              <span className="gradient-text">Motion Gallery</span>
            </Link>
            <VisitorStats className="hidden xl:flex" />
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
