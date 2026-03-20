import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { categories } from '@/features/category/data/categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
}

const MobileMenu = ({ isOpen, onClose, activeCategory }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      className={cn(
        'fixed inset-0 z-40 bg-black/95 pt-20 backdrop-blur-md transition-all duration-200 ease-out motion-reduce:transition-none',
        'pointer-events-auto translate-y-0 opacity-100',
      )}
    >
      <nav className="flex flex-col gap-6 px-4 py-8">
        <Button
          asChild
          variant="ghost"
          onClick={onClose}
          className={cn(
            'h-auto justify-start border-b border-white/10 text-2xl font-medium',
            activeCategory === 'all' ? 'text-foreground' : 'text-gray-300',
          )}
        >
          <Link href={`/`}>All</Link>
        </Button>
        {categories.map(category => (
          <Button
            asChild
            key={category.type}
            variant="ghost"
            onClick={onClose}
            className={cn(
              'h-auto justify-start border-b border-white/10 text-2xl font-medium',
              activeCategory === category.type
                ? 'text-foreground'
                : 'text-gray-300',
            )}
          >
            <Link href={`/${category.type}`}>{category.title}</Link>
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default MobileMenu;
