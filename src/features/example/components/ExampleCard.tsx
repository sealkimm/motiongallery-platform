'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';

import useExampleInteractions from '@/hooks/useExampleInteractions';
import type { Category } from '@/features/category/types/category';
import ExampleCardActions from '@/features/example/components/ExampleCardActions';
import type { ExampleDetails } from '@/features/example/types/example';

import { Card, CardContent } from '../../../components/ui/card';
import { getCardStyles } from './ExampleCard.styles';
import WriterInfo from './WriterInfo';

const DEFAULT_THUMBNAIL = '/default-thumbnail.png';

interface ExampleCardProps {
  category: Category;
  example: ExampleDetails;
  layout?: 'horizontal' | 'vertical';
  priority?: boolean;
}

const ExampleCard = ({
  category,
  example,
  layout = 'vertical',
  priority = false,
}: ExampleCardProps) => {
  const router = useRouter();
  const interactions = useExampleInteractions({ example });
  const isHorizontal = layout === 'horizontal';
  const [imageSrc, setImageSrc] = useState(
    example.thumbnail || DEFAULT_THUMBNAIL,
  );

  const handleComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/${example.type}/${example.id}#comment`);
  };

  const styles = getCardStyles(isHorizontal);

  return (
    <Link href={`/${example.type}/${example.id}`} className="example-card">
      <motion.div
        whileHover={{ y: isHorizontal ? -5 : -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-gradient-to-br ${category.color} h-full rounded-xl p-[2px]`}
      >
        <Card className={styles.container}>
          <div className={styles.imageWrapper}>
            <div
              className={`absolute bg-gradient-to-b ${category.color} inset-0 h-full w-full opacity-30 mix-blend-overlay`}
            ></div>
            <Image
              src={imageSrc}
              alt={example.title}
              width={isHorizontal ? 120 : 320}
              height={isHorizontal ? 120 : 160}
              sizes={
                isHorizontal
                  ? '(max-width: 768px) 33vw, 120px'
                  : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
              }
              className="h-full w-full object-cover"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onError={() => {
                if (imageSrc !== DEFAULT_THUMBNAIL) {
                  setImageSrc(DEFAULT_THUMBNAIL);
                }
              }}
            />
          </div>
          <CardContent className={styles.content}>
            <div>
              <h3 className={styles.title}>{example.title}</h3>
              <p className={styles.desc}>
                {example.description}
                {isHorizontal && <ArrowRight size={14} />}
              </p>
            </div>
            {!isHorizontal && (
              <>
                <WriterInfo author={example.author} variant="card" />
                <div className="mt-3 flex items-center justify-between">
                  <ExampleCardActions
                    {...interactions}
                    commentCount={example.commentCount}
                    handleComment={handleComment}
                  />
                  <div className={category.textColor}>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ExampleCard;
