'use client';

const HeroSection = () => {
  return (
    <div className="relative pb-28 pt-48">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(102, 0, 204, 0.2) 0%, rgba(102, 0, 204, 0.1) 30%, transparent 80%)',
        }}
      ></div>
      <div className="container relative max-w-4xl text-center">
        <div
          className="fade-up-enter"
          style={{ animationDelay: '120ms' }}
        >
          <h1 className="gradient-text mb-6 text-4xl font-bold md:text-6xl">
            모션 레퍼런스를 공유하는 공간
          </h1>
          <p className="mb-12 text-xl text-gray-300 md:text-2xl">
            GSAP, Three.js, CSS로 만든 다양한 인터랙션 예제를 살펴보고 작업에
            참고할 아이디어를 찾거나 직접 만든 레퍼런스를 함께 공유해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
