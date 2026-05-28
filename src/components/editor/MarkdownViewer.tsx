'use client';

import dynamic from 'next/dynamic';

import { sanitizeMarkdownContent } from '@/lib/utils';

/////////???????????
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  const cleanedContent = sanitizeMarkdownContent(content);

  return (
    <div className="mb-10">
      <div className="md-viewer-container">
        <MarkdownPreview data-color-mode="dark" source={cleanedContent} />
      </div>
    </div>
  );
};

export default MarkdownViewer;
