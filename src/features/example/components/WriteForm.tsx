'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Tag as TagIcon, X } from 'lucide-react';
import { motion } from 'motion/react';

import useAITag from '@/hooks/useAITag';
import useExample from '@/hooks/useExample';
import useTags from '@/hooks/useTags';
import FormBtnGroup from '@/components/form/FormBtnGroup';
import FormSection from '@/components/form/FormSection';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/features/category/data/categories';
import type { Example } from '@/features/example/types/example';

import Tag from '../../../components/tag/Tag';
import { formSchema, type FormValues } from '../formSchema';

const MarkdownEditor = dynamic(
  () => import('@/components/editor/MarkdownEditor'),
  { ssr: false },
);
interface WriteFormProps {
  exampleData?: Example;
}

// 분리 필요하니
const DEFAULT_FORM_VALUES = {
  type: '',
  title: '',
  description: '',
  content: '',
  thumbnail: '',
};
// form 로그인페이지하고 비교하기
const WriteForm = ({ exampleData }: WriteFormProps) => {
  const { tags, removeTag, handleKeyDown, setTags } = useTags(
    exampleData?.tags ?? [],
  );
  const { generateTags, isGenerating, error, clearError } = useAITag();
  const { createExample, updateExample, isLoading } = useExample();
  const isEditMode = Boolean(exampleData);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: exampleData || DEFAULT_FORM_VALUES,
  });

  const onSubmit = (data: FormValues) => {
    const formData = {
      ...data,
      tags,
    };

    if (isEditMode && exampleData) {
      updateExample({ ...formData, id: exampleData.id });
    } else {
      createExample(formData);
    }
  };

  useEffect(() => {
    if (!exampleData) {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [exampleData, form]);

  const handleAITag = async () => {
    clearError();
    const values = form.getValues();
    const tags = await generateTags(values);
    setTags(tags);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormSection className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">제목</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Scroll Animations..."
                          onKeyDown={e =>
                            e.key === 'Enter' && e.preventDefault()
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        카테고리
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem
                              key={category.type}
                              value={category.type}
                            >
                              {category.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">설명</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder=" 스크롤 애니메이션을 쉽게 만들 수 있는 방법을 소개합니다."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>
            <FormSection>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">내용</FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
            <FormSection>
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-lg">
                    <TagIcon size={18} className="text-primary" />
                    태그
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAITag}
                    disabled={isGenerating}
                    className="border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30"
                  >
                    <Sparkles size={20} />
                    {isGenerating ? (
                      <>
                        생성중...
                        <Loader2 size={20} className="ml-2 animate-spin" />
                      </>
                    ) : (
                      'AI 추천'
                    )}
                  </Button>
                </div>
                <Input
                  placeholder="태그를 엔터로 구분하여 입력하세요(최대 5개)"
                  onKeyDown={handleKeyDown}
                />
                {error && (
                  <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    label={tag}
                    removable
                    onClickRemove={() => removeTag(tag)}
                  />
                ))}
              </div>
            </FormSection>
          </div>
          <FormBtnGroup isEditMode={isEditMode} isLoading={isLoading} />
        </form>
      </Form>
    </motion.div>
  );
};

export default WriteForm;
