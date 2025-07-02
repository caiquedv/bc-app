
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchQuery?: string; // Nova prop para controlar o valor do input externamente
}

const SearchBar = ({ onSearch, searchQuery = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(searchQuery);

  // Sincroniza o estado local com a prop externa
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Buscar no cardápio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" className="bg-red-600 hover:bg-red-700">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
