"use client";

import { useMemo } from "react";
import {
  RotateCcw,
  Sparkles,
  Star,
  Check,
  SlidersHorizontal,
  X,
  Layers,
  Tag,
  IndianRupee,
} from "lucide-react";

export interface CategoryOption {
  name: string;
  count: number;
}

export interface TagOption {
  name: string;
  count: number;
}

interface ProductFilterSidebarProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;

  tags: TagOption[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;

  priceRange: [number, number];
  minPriceLimit: number;
  maxPriceLimit: number;
  onChangePrice: (range: [number, number]) => void;

  minRating: number;
  onChangeMinRating: (rating: number) => void;

  featuredOnly: boolean;
  onChangeFeaturedOnly: (val: boolean) => void;

  inStockOnly: boolean;
  onChangeInStockOnly: (val: boolean) => void;

  onResetFilters: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;

  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ProductFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  tags,
  selectedTags,
  onToggleTag,
  priceRange,
  minPriceLimit,
  maxPriceLimit,
  onChangePrice,
  minRating,
  onChangeMinRating,
  featuredOnly,
  onChangeFeaturedOnly,
  inStockOnly,
  onChangeInStockOnly,
  onResetFilters,
  hasActiveFilters,
  activeFiltersCount,
  isMobile = false,
  onCloseMobile,
}: ProductFilterSidebarProps) {

  const pricePresets = [
    { label: "Under ₹50", range: [minPriceLimit, 50] as [number, number] },
    { label: "₹50 - ₹100", range: [50, 100] as [number, number] },
    { label: "₹100 - ₹150", range: [100, 150] as [number, number] },
    { label: "Above ₹150", range: [150, maxPriceLimit] as [number, number] },
  ];

  return (
    <aside className="flex flex-col gap-6">

      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Filter Products</h3>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Filters
            </span>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-gray-400" />
            Category
          </span>
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => onSelectCategory("All")}
              className="text-[11px] text-orange-600 hover:underline font-medium"
            >
              Show all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-orange-500 text-white font-semibold shadow-xs"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
            Price Range
          </span>
          <span className="text-xs font-semibold text-gray-800">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>

        <div className="px-1 pt-1">
          <input
            type="range"
            min={minPriceLimit}
            max={maxPriceLimit}
            step={5}
            value={priceRange[1]}
            onChange={(e) =>
              onChangePrice([priceRange[0], Math.max(priceRange[0], Number(e.target.value))])
            }
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1">
            <span>₹{minPriceLimit}</span>
            <span>₹{maxPriceLimit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-gray-400 block font-medium">Min (₹)</label>
            <input
              type="number"
              min={minPriceLimit}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChangePrice([Math.min(val, priceRange[1]), priceRange[1]]);
              }}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block font-medium">Max (₹)</label>
            <input
              type="number"
              min={priceRange[0]}
              max={maxPriceLimit}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChangePrice([priceRange[0], Math.max(val, priceRange[0])]);
              }}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {pricePresets.map((preset) => {
            const isSelected =
              priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChangePrice(preset.range)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? "bg-orange-100 text-orange-800 border border-orange-300 font-semibold"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="space-y-3 border-t border-gray-200 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              Tags / Type
            </span>
            {selectedTags.length > 0 && (
              <span className="text-[10px] text-orange-600 font-semibold">
                {selectedTags.length} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => onToggleTag(tag.name)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-xs font-semibold"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span>{tag.name}</span>
                  <span
                    className={`rounded-full px-1 text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tag.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-gray-200 pt-5">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-gray-400" />
          Minimum Rating
        </span>

        <div className="space-y-1">
          {[
            { label: "Any Rating", value: 0 },
            { label: "4.5 & up", value: 4.5 },
            { label: "4.0 & up", value: 4.0 },
          ].map((r) => {
            const isSelected = minRating === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => onChangeMinRating(r.value)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                  isSelected
                    ? "bg-orange-50 text-orange-700 font-semibold border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {r.value > 0 ? (
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(r.value)
                              ? "fill-amber-400 text-amber-400"
                              : i < r.value
                              ? "fill-amber-200 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                  <span>{r.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-orange-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-5">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Preferences
        </span>

        <label className="flex items-center justify-between cursor-pointer rounded-lg p-2 hover:bg-gray-50 transition">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-medium text-gray-700">
              Featured Items Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onChangeFeaturedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer rounded-lg p-2 hover:bg-gray-50 transition">
          <span className="text-xs font-medium text-gray-700">
            In-Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onChangeInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
          />
        </label>
      </div>

      {/* Mobile Drawer Bottom Actions */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 flex gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset All
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-600"
          >
            Show Results
          </button>
        </div>
      )}
    </aside>
  );
}
