type CategoryFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryFilters({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
