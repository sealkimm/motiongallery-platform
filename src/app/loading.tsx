const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(139, 92, 246, 0.28) 0%, rgba(139, 92, 246, 0.12) 22%, transparent 48%), linear-gradient(180deg, #050505 0%, #0a0a0a 100%)',
        }}
      />
      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border border-white/10" />
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-white/15 border-t-white/80 motion-reduce:animate-none" />
          <div className="absolute h-3 w-3 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
        </div>
        <div className="space-y-2">
          <p className="gradient-text text-2xl font-semibold tracking-tight md:text-3xl">
            Motion Gallery
          </p>
          <p className="text-sm text-white/65 md:text-base">
            레퍼런스를 준비하는 중입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
