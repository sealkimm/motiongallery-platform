import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EXAMPLE_SELECT } from '@/features/example/constants/exampleSelect';
import {
  groupExamplesByCategory,
  transformExampleData,
} from '@/features/example/utils';
import CategorySection from '@/features/home/components/CategorySection';
import HeroSection from '@/features/home/components/HeroSection';

export const dynamic = 'force-dynamic';

const HomePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('examples')
    .select(EXAMPLE_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error('예제 목록을 불러오지 못했습니다.');

  const examples = transformExampleData(data, user?.id);
  const examplesByCategory = groupExamplesByCategory(examples);

  return (
    <>
      <HeroSection />
      <div className="relative overflow-hidden pb-40">
        <div className="container flex flex-col gap-24">
          {examplesByCategory.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              examples={category.examples}
              isFirstSection={index === 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
