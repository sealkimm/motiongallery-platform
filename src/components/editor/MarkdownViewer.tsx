'use client';

import dynamic from 'next/dynamic';

import '@uiw/react-markdown-preview/markdown.css';

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
        <MarkdownPreview source={cleanedContent} />
      </div>
    </div>
  );
};

export default MarkdownViewer;
