'use client';

import dynamic from 'next/dynamic';
import { commands, type ICommand } from '@uiw/react-md-editor';

import { sanitizeMarkdownContent } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
}

const customCommands: ICommand[] = [
  { ...commands.title1, icon: <span>H1</span> },
  { ...commands.title2, icon: <span>H2</span> },
  { ...commands.title3, icon: <span>H3</span> },
  commands.divider,
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.divider,
  commands.code,
  commands.codeBlock,
  commands.link,
];

const extraCommands: ICommand[] = [
  commands.codeEdit,
  commands.codeLive,
  commands.fullscreen,
];

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const isMobile = useIsMobile();
  const cleanedValue = sanitizeMarkdownContent(value);

  return (
    <div className="md-editor-container">
      <MDEditor
        data-color-mode="dark"
        value={cleanedValue}
        onChange={onChange}
        commands={customCommands}
        extraCommands={extraCommands}
        preview={isMobile ? 'edit' : 'live'}
      />
    </div>
  );
};

export default MarkdownEditor;
