import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  placeholder: string;
  filterEl?: React.ReactNode;
}

export function FilterBar({ search, onSearch, placeholder, filterEl }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {filterEl}
    </div>
  );
}
