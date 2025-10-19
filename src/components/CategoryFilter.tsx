interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          className={`px-8 py-4 rounded-full border-2 transition-all duration-300 font-medium ${
            selectedCategory === category
              ? 'border-[#667eea] text-[#667eea] bg-[#667eea]/5'
              : 'border-gray-200 text-gray-700 hover:border-[#667eea] hover:text-[#667eea] hover:bg-[#667eea]/5'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
