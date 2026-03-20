import { Search } from 'lucide-react';

import { SearchInput } from '@/components/SearchInput';

import type { Category } from '../types/category';

interface SearchBarProps {
  category: Category;
  onSearch: (query: string) => void;
}

const CategorySearchBar = ({ category, onSearch }: SearchBarProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative mb-10 max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search size={18} className="text-gray-400" />
      </div>
      <SearchInput
        type="text"
        placeholder={`${category.title} 애니메이션을 검색`}
        className="pl-10"
        onChange={handleOnChange}
      />
    </div>
  );
};

export default CategorySearchBar;
