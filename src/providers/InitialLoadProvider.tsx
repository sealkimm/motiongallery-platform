'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface InitialLoadContextValue {
  isInitialLoadComplete: boolean;
  completeInitialLoad: () => void;
}

const InitialLoadContext = createContext<InitialLoadContextValue | null>(null);

const InitialLoadProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const value = useMemo(
    () => ({
      isInitialLoadComplete,
      completeInitialLoad: () => setIsInitialLoadComplete(true),
    }),
    [isInitialLoadComplete],
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
