import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { Category } from '@/features/category/types/category';
import type { ExampleCardData } from '@/features/example/types/example';

import { Card, CardContent } from '../../../components/ui/card';
import { getCardStyles } from './ExampleCard.styles';
import ExampleCardInteractiveActions from './ExampleCardInteractiveActions';
import WriterInfo from './WriterInfo';

const DEFAULT_THUMBNAIL = '/default-thumbnail.png';

interface ExampleCardProps {
  category: Category;
  example: ExampleCardData;
  layout?: 'horizontal' | 'vertical';
  priority?: boolean;
}

const ExampleCard = ({
  category,
  example,
  layout = 'vertical',
  priority = false,
}: ExampleCardProps) => {
  const isHorizontal = layout === 'horizontal';
  const styles = getCardStyles(isHorizontal);
  const imageSrc = example.thumbnail || DEFAULT_THUMBNAIL;
  const interactiveExample = {
    id: example.id,
    type: example.type,
    likeCount: example.likeCount,
    commentCount: example.commentCount,
    isLiked: example.isLiked,
    isBookmarked: example.isBookmarked,
  };

  return (
    <Link
      href={`/${example.type}/${example.id}`}
      className="example-card group block"
    >
      <div
        className={`bg-gradient-to-br ${category.color} h-full rounded-xl p-[2px] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02] group-active:scale-[0.98]`}
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
                  <ExampleCardInteractiveActions example={interactiveExample} />
                  <div className={category.textColor}>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default ExampleCard;
