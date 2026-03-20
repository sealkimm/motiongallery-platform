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
      <div className="relative flex w-full max-w-sm flex-col items-center gap-4 px-6 text-center">
        <p className="gradient-text text-2xl font-semibold tracking-tight md:text-3xl">
          Motion Gallery
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="loading-progress h-full w-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
