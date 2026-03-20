import type { Category } from '@/features/category/types/category';

export const categories: Category[] = [
  {
    id: 1,
    type: 'gsap',
    title: 'GSAP',
    description: '스크롤 연출과 타임라인 기반 애니메이션 예제를 모아두었습니다.',
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500',
  },
  {
    id: 2,
    type: 'threejs',
    title: 'Three.js',
    description: '3D 인터랙션과 공간감 있는 모션 예제를 살펴볼 수 있습니다.',
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
  },
  {
    id: 3,
    type: 'css',
    title: 'CSS',
    description: '가볍게 적용할 수 있는 CSS 애니메이션과 전환 효과를 모았습니다.',
    color: 'from-green-500 to-emerald-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
  },
  {
    id: 4,
    type: 'other',
    title: 'Other',
    description: '그 외 다양한 방식으로 구현한 모션 예제를 확인해보세요.',
    color: 'from-gray-400 to-zinc-300',
    textColor: 'text-gray-300',
    borderColor: 'border-gray-300',
  },
];
