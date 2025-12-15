'use client';

import { useState } from 'react';

import type { FormValues } from '@/features/example/formSchema';

const useAITag = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTags = async (formValues: FormValues) => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/tag-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '태그 생성에 실패했습니다.');
        return [];
      }

      return data.tags ?? [];
    } catch (error) {
      console.error(error);
      setError('태그 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    generateTags,
    isGenerating,
    error,
    clearError,
  };
};

export default useAITag;
