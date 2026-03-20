import { cn } from '@/lib/utils';

export const getCardStyles = (isHorizontal: boolean) => ({
  container: cn(
    'flex h-full overflow-hidden rounded-xl border-0 bg-gray-900',
    isHorizontal ? 'flex-row items-center' : 'flex-col',
  ),
  imageWrapper: cn(
    'relative shrink-0 overflow-hidden',
    isHorizontal ? 'aspect-square w-1/3 self-stretch' : 'aspect-[2/1] w-full',
  ),
  title: cn(
    'line-clamp-1 font-semibold',
    isHorizontal ? 'mb-1 text-base' : 'mb-3 text-xl',
  ),
  desc: cn(
    'line-clamp-1 text-gray-400',
    isHorizontal ? 'flex items-center gap-2 text-sm' : 'text-base',
  ),
  content: cn(isHorizontal ? 'p-4' : 'p-6'),
});
