'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

interface InitialLoadContextValue {
  isInitialLoadComplete: boolean;
  completeInitialLoad: () => void;
}

const InitialLoadContext = createContext<InitialLoadContextValue | null>(null);

const InitialLoadProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(
    () => pathname !== '/',
  );
  const completeInitialLoad = useCallback(() => {
    setIsInitialLoadComplete(true);
  }, []);

  const value = useMemo(
    () => ({
      isInitialLoadComplete,
      completeInitialLoad,
    }),
    [completeInitialLoad, isInitialLoadComplete],
  );

  return (
    <InitialLoadContext.Provider value={value}>
      {children}
    </InitialLoadContext.Provider>
  );
};

export const useInitialLoad = () => {
  const context = useContext(InitialLoadContext);

  if (!context) {
    throw new Error('useInitialLoad must be used within InitialLoadProvider');
  }

  return context;
};

export default InitialLoadProvider;
