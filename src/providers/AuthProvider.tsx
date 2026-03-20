'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase/client';
import type { User } from '@/features/auth/types/user';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

const AUTH_USER_CACHE_KEY = 'motiongallery-auth-user';

const getFallbackNickname = (authUser: SupabaseAuthUser) => {
  const nickname =
    authUser.user_metadata?.nickname ??
    authUser.user_metadata?.name ??
    authUser.email?.split('@')[0];

  return nickname || '사용자';
};

const getFallbackAvatarUrl = (authUser: SupabaseAuthUser) => {
  return (
    authUser.user_metadata?.avatar_url ??
    authUser.user_metadata?.picture ??
    undefined
  );
};

const mapAuthUserToUser = (authUser: SupabaseAuthUser): User => {
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    nickname: getFallbackNickname(authUser),
    avatar_url: getFallbackAvatarUrl(authUser),
    created_at: authUser.created_at,
  };
};

const getCachedUser = (userId: string) => {
  if (typeof window === 'undefined') return null;

  const cachedUser = window.sessionStorage.getItem(AUTH_USER_CACHE_KEY);
  if (!cachedUser) return null;

  try {
    const parsedUser = JSON.parse(cachedUser) as User;
    return parsedUser.id === userId ? parsedUser : null;
  } catch {
    return null;
  }
};

const setCachedUser = (user: User) => {
  if (typeof window === 'undefined') return;

  window.sessionStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
};

const clearCachedUser = () => {
  if (typeof window === 'undefined') return;

  window.sessionStorage.removeItem(AUTH_USER_CACHE_KEY);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDBUser = async (authUserId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single();

    if (error) {
      console.error('[AuthProvider] fetchDBUser 에러', error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleCallbackId: number | null = null;

    const syncProfile = async (authUser: SupabaseAuthUser) => {
      const dbUser = await fetchDBUser(authUser.id);

      if (!mounted || !dbUser) return;

      setCachedUser(dbUser);
      setUser(prevUser => {
        if (!prevUser || prevUser.id !== dbUser.id) return prevUser;
        return dbUser;
      });
    };

    const scheduleProfileSync = (authUser: SupabaseAuthUser) => {
      const requestIdleCallback = window.requestIdleCallback?.bind(window);

      if (requestIdleCallback) {
        idleCallbackId = requestIdleCallback(() => {
          void syncProfile(authUser);
        }, { timeout: 1500 });
        return;
      }

      timeoutId = window.setTimeout(() => {
        void syncProfile(authUser);
      }, 300);
    };

    const applyAuthUser = (authUser: SupabaseAuthUser | null) => {
      if (!authUser) {
        clearCachedUser();
        setUser(null);
        setIsLoading(false);
        return;
      }

      const cachedUser = getCachedUser(authUser.id);
      const fallbackUser = cachedUser ?? mapAuthUserToUser(authUser);

      setUser(fallbackUser);
      setIsLoading(false);

      if (!cachedUser) {
        scheduleProfileSync(authUser);
      }
    };

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      applyAuthUser(data.session?.user ?? null);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      applyAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (timeoutId) clearTimeout(timeoutId);
      if (idleCallbackId !== null && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearCachedUser();
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
