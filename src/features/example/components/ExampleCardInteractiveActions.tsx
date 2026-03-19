'use client';

import { useRouter } from 'next/navigation';

import useExampleInteractions from '@/hooks/useExampleInteractions';

import ExampleCardActions from './ExampleCardActions';

interface ExampleCardInteractiveActionsProps {
  example: {
    id: string;
    type: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

const ExampleCardInteractiveActions = ({
  example,
}: ExampleCardInteractiveActionsProps) => {
  const router = useRouter();
  const interactions = useExampleInteractions({ example });

  const handleComment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/${example.type}/${example.id}#comment`);
  };

  return (
    <ExampleCardActions
      {...interactions}
      commentCount={example.commentCount}
      handleComment={handleComment}
    />
  );
};

export default ExampleCardInteractiveActions;
