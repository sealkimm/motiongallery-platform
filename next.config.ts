import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, //개발 중 버그를 더 잘 잡아내기 위한 안전 장치, 컴포넌트를 두 번 렌더링해서 사이드 이펙트를 체크, 배포에는 영향 XXX
  // swcMinify: true, // 코드 최적화
  images: {
    // domains: [''],
    domains: [
      'fftdjzgcvucsqrqpdgrf.supabase.co',
      'cdn.crowdpic.net',
      'shots.codepen.io',
      'codesandbox.io',
      'img.youtube.com',
      'vumbnail.com',
    ],
  },
};

export default nextConfig;
