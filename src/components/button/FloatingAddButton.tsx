'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const FloatingAddButton = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    router.push('/write');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={handleClick}
          className="gradient-background h-14 w-14 rounded-full"
        >
          <Plus size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingAddButton;
