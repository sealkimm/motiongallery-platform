import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const MIN_TOTAL_LENGTH = 50;

const isMeaningfulText = (text: string) => {
  const raw = (text ?? '').trim();
  if (!raw) return false;

  const noSpace = raw.replace(/\s/g, '');
  const meaningfulOnly = noSpace.replace(/[^\p{L}\p{N}]/gu, '');
  const ratio = meaningfulOnly.length / Math.max(noSpace.length, 1);

  return ratio > 0.4;
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, description, content } = body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const totalText = `${title}${description}${content}`.trim();

    if (totalText.length < MIN_TOTAL_LENGTH) {
      return NextResponse.json(
        { error: '콘텐츠가 너무 짧아 태그를 생성할 수 없습니다.' },
        { status: 400 },
      );
    }

    if (!isMeaningfulText(totalText)) {
      return NextResponse.json(
        { error: '콘텐츠에 의미 있는 텍스트가 부족합니다.' },
        { status: 400 },
      );
    }

    const prompt = `
다음 애니메이션 콘텐츠를 분석해 관련 태그 5개를 추천해줘.

규칙:
- 한글 또는 영문 섞어서 사용 가능
- 짧은 명사형 단어
- 띄어쓰기 없이
- 코드명, 함수명은 사용하지 말 것
- 설명 없이 JSON 배열만 반환

형식:
["tag1","tag2","tag3","tag4","tag5"]

제목: ${title}
설명: ${description}
내용: ${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const tags = JSON.parse(cleanText);

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Tag suggestion error:', error);
    return NextResponse.json(
      { error: '태그 추천에 실패했습니다.' },
      { status: 500 },
    );
  }
};
