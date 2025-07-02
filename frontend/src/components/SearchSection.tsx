
import React from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";

interface SearchSectionProps {
  searchQuery: string;
  filteredCount: number;
  onSearch: (v: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  filteredCount,
  onSearch,
}) => (
  <div>
    <div className="flex justify-center">
      <SearchBar onSearch={onSearch} searchQuery={searchQuery} />
    </div>
    {searchQuery && (
      <div className="mb-8 mt-4">
        <p className="text-gray-600 text-center">
          Resultados para "<strong>{searchQuery}</strong>" ({filteredCount} item{filteredCount !== 1 ? "s" : ""} encontrado{filteredCount !== 1 ? "s" : ""})
        </p>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => onSearch("")}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Limpar busca
          </Button>
        </div>
      </div>
    )}
  </div>
);

export default SearchSection;
