import { useState, useEffect } from 'react';
import { fetchTags } from '../utils/api';
import { Tag, X, Plus } from 'lucide-react';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await fetchTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const filteredTags = availableTags.filter(
    tag => tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag)
  );

  return (
    <div>
      <label className="block text-sm font-bold mb-2">标签</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-lego-blue text-white px-2 py-1 text-sm"
          >
            <Tag size={12} />
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-white/20 rounded"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入标签后按回车添加"
          className="w-full p-2 border-2 border-black"
        />
        {inputValue && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-black max-h-40 overflow-y-auto">
            {filteredTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Tag size={14} />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      {inputValue && !selectedTags.includes(inputValue.trim()) && (
        <button
          type="button"
          onClick={() => handleAddTag(inputValue)}
          className="mt-1 text-sm text-lego-blue hover:underline flex items-center gap-1"
        >
          <Plus size={14} />
          创建标签 "{inputValue.trim()}"
        </button>
      )}
    </div>
  );
}
