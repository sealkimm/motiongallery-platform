import { createSupabaseServerClient } from '@/lib/supabase/server';
import ContentAnimator from '@/components/animations/ContentAnimator';
import MarkdownViewer from '@/components/editor/MarkdownViewer';
import { categories } from '@/features/category/data/categories';
import { getExampleComments } from '@/features/comment/api/getExampleComments';
import CommentSection from '@/features/comment/components/CommentSection';
import ExampleMetaSection from '@/features/example/components/ExampleMetaSection';
import type { UserRelation } from '@/features/example/types/example';

interface ExamplePageProps {
  params: {
    type: string;
    id: string;
  };
}

const ExamplePage = async ({ params }: ExamplePageProps) => {
  const { type, id } = await params;
  const supabase = await createSupabaseServerClient();

  const category = categories.find(c => c.type === type);

  const [userResult, exampleResult, commentResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('examples')
      .select(
        `*, author:users(id, nickname, avatar_url), likes!left(user_id), bookmarks!left(user_id)`,
      )
      .eq('id', id)
      .eq('type', type)
      .single(),
    getExampleComments({
      id,
      page: 0,
      pageSize: 10,
    }),
  ]);

  const {
    data: { user },
  } = userResult;
  const { data: rawExample, error: exampleError } = exampleResult;

  const example = rawExample && {
    ...rawExample,
    isLiked: rawExample.likes.some((i: UserRelation) => i.user_id === user?.id),
    isBookmarked: rawExample.bookmarks.some(
      (i: UserRelation) => i.user_id === user?.id,
    ),
  };

  if (!category) {
    throw new Error(`카테고리를 찾을 수 없습니다: ${type}`);
  }

  if (exampleError) {
    throw new Error('예제를 불러오지 못했습니다.');
  }

  if (!example) {
    throw new Error('예제를 찾을 수 없습니다.');
  }

  const isAuthor = user?.id === example?.author.id;
  const { data: comments, hasMore, totalCount } = commentResult;

  return (
    <div className="pb-20 pt-24">
      <div className="container">
        <ContentAnimator>
          <ExampleMetaSection example={example} isAuthor={isAuthor} />
          <MarkdownViewer content={example.content} />
          {/* 관련 예제(나중에 추가) => 이전, 다음 예제*/}
          {/* <RelatedExampleSection
            examples={relatedExamples}
            category={category}
          /> */}
          <CommentSection
            exampleId={id}
            comments={comments}
            hasMore={hasMore}
            totalCount={totalCount}
          />
        </ContentAnimator>
      </div>
    </div>
  );
};

export default ExamplePage;
