import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, //개발 중 버그를 더 잘 잡아내기 위한 안전 장치, 컴포넌트를 두 번 렌더링해서 사이드 이펙트를 체크, 배포에는 영향 XXX
  productionBrowserSourceMaps: true,
  // swcMinify: true, // 코드 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fftdjzgcvucsqrqpdgrf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.crowdpic.net',
      },
      {
        protocol: 'https',
        hostname: 'shots.codepen.io',
      },
      {
        protocol: 'https',
        hostname: 'codesandbox.io',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
    ],
  },
};

export default nextConfig;
