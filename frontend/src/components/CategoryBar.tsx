
import React, { useRef, useState, useEffect } from "react";
import { Category, Product } from "@/lib/api";

interface CategoryBarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: Category[];
  products: Product[];
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  setActiveCategory,
  categories,
  products,
}) => {
  const getOrderedCategories = (allCategories: Category[], allProducts: Product[]): Category[] => {
    if (!allCategories || allCategories.length === 0) return [];
    
    // Filtrar apenas categorias que têm produtos ativos
    const categoriesWithActiveProducts = allCategories.filter(category => {
      return allProducts.some(product => 
        product.category_id === category.id && product.status === "active"
      );
    });
    
    const byName = (name: string) =>
      categoriesWithActiveProducts.find(cat => cat.name.toLowerCase().includes(name));
    const prom = byName("promo");
    const combo = byName("combo");
    const bebidas = byName("bebida");
    const rest = categoriesWithActiveProducts.filter(
      cat => cat !== prom && cat !== combo && cat !== bebidas
    );
    const ordered = [prom, combo, ...rest, bebidas].filter(Boolean) as Category[];
    return ordered;
  };

  const orderedCategories = getOrderedCategories(categories, products);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!orderedCategories.length) return null;

  return (
    <div className="relative w-full mb-5 z-10 select-none">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
            height: 0;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div
        ref={scrollRef}
        className="
          overflow-x-auto
          scrollbar-hide
          whitespace-nowrap
          flex items-center
          
        "
        style={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        tabIndex={0}
      >
        <div className="flex flex-nowrap w-max py-2 border-t border-b border-gray-200">
          {categories.map((category) => {
            const isActive = activeCategory === String(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(String(category.id))}
                className={`
                  font-semibold 
                  flex flex-col items-center
                  px-4 py-2
                  bg-transparent border-none outline-none
                  rounded-md
                  w-auto
                  transition-colors
                  duration-200
                  ${isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"}
                `}
                style={{
                  minWidth: 0,
                  background: "transparent",
                  position: "relative",
                }}
              >
                <span className="whitespace-nowrap text-base relative pb-1">
                  {category.name}
                  {isActive && (
                    <span
                      className="block h-[2px] rounded-full bg-red-600 absolute left-0 right-0 bottom-0"
                      style={{
                        width: "100%",
                        transition: "width 0.18s"
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
