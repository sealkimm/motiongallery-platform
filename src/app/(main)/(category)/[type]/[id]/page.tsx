import { createSupabaseServerClient } from '@/lib/supabase/server';
import ContentAnimator from '@/components/animations/ContentAnimator';
import MarkdownViewer from '@/components/editor/MarkdownViewer';
import { categories } from '@/features/category/data/categories';
import { getExampleComments } from '@/features/comment/api/getExampleComments';
import CommentSection from '@/features/comment/components/CommentSection';
import ExampleMetaSection from '@/features/example/components/ExampleMetaSection';
import { normalizeExampleAuthor } from '@/features/example/utils';

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
        `
          id,
          type,
          title,
          description,
          content,
          created_by,
          created_at,
          thumbnail,
          tags,
          comment_count,
          like_count,
          author:users(id, nickname, avatar_url)
        `,
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

  let isLiked = false;
  let isBookmarked = false;

  if (user?.id) {
    const [
      { data: likedRows, error: likedError },
      { data: bookmarkedRows, error: bookmarkedError },
    ] = await Promise.all([
      supabase
        .from('likes')
        .select('example_id')
        .eq('user_id', user.id)
        .eq('example_id', id)
        .limit(1),
      supabase
        .from('bookmarks')
        .select('example_id')
        .eq('user_id', user.id)
        .eq('example_id', id)
        .limit(1),
    ]);

    if (likedError || bookmarkedError) {
      throw new Error('사용자 상호작용 정보를 불러오지 못했습니다.');
    }

    isLiked = (likedRows?.length ?? 0) > 0;
    isBookmarked = (bookmarkedRows?.length ?? 0) > 0;
  }

  const example = rawExample && {
    ...rawExample,
    author: normalizeExampleAuthor(rawExample.author),
    commentCount: rawExample.comment_count ?? 0,
    likeCount: rawExample.like_count ?? 0,
    isLiked,
    isBookmarked,
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
  const { data: comments, hasMore } = commentResult;

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
            totalCount={example.commentCount}
          />
        </ContentAnimator>
      </div>
    </div>
  );
};

export default ExamplePage;
