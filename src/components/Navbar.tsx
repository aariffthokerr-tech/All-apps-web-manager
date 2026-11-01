import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { PROJECT_CATEGORIES, ProjectCategory } from '../types/project';

interface NavbarProps {
  selectedCategory: 'All Creations' | ProjectCategory;
  onSelectCategory: (cat: 'All Creations' | ProjectCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSecretAdminTrigger: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSecretAdminTrigger,
}) => {
  const tapTimestampsRef = useRef<number[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    const recent = tapTimestampsRef.current.filter((t) => now - t < 1800);
    recent.push(now);
    tapTimestampsRef.current = recent;

    if (recent.length >= 5) {
      tapTimestampsRef.current = [];
      onSecretAdminTrigger();
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-surface border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single-line Brand Wordmark (with 5-tap secret Admin trigger) */}
        <a
          href="#top"
          onClick={handleLogoClick}
          title="PocketBawal — Tap 5 times rapidly for Creator Studio"
          className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#06B6D4] bg-clip-text text-transparent whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md"
        >
          PocketBawal
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Store categories"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3B8]"
        >
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#F8FAFC] border-[#06B6D4]'
                    : 'border-transparent hover:text-[#F8FAFC]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Search Action */}
        <div className="flex items-center shrink-0">
          <div className="relative flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search apps, APKs, tools..."
              aria-label="Search apps, APKs, and web tools"
              className="w-44 sm:w-60 lg:w-64 pl-9 pr-8 py-1.5 text-sm bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#0D101B] text-[#F8FAFC] placeholder-[#94A3B8] rounded-xl border border-white/[0.09] focus:border-[#06B6D4] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="absolute right-2 p-1 text-[#94A3B8] hover:text-[#F8FAFC] rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
