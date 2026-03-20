import { getHomeExamples } from '@/features/example/api/getHomeExamples';
import CategorySection from '@/features/home/components/CategorySection';
import HeroSection from '@/features/home/components/HeroSection';
import ScrollTriggerRefresher from '@/features/home/components/ScrollTriggerRefresher';

export const dynamic = 'force-dynamic';

const HomePage = async () => {
  const examplesByCategory = await getHomeExamples();

  return (
    <>
      <ScrollTriggerRefresher />
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
