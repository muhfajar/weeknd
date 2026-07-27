import React, {useState, useEffect, useRef} from 'react';
import {
    Search,
    X,
    SlidersHorizontal,
    ArrowUpDown,
    Filter,
    LayoutGrid,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {AppItem, CategoryType, PlatformType, SortOption} from '../types/app';
import {CATEGORIES, PLATFORMS, filterAndSortApps, parsePlatforms} from '../lib/apps';
import {AppCard} from './AppCard';

const ITEMS_PER_PAGE = 5;

interface DirectoryProps {
    apps: AppItem[];
    onSelectApp: (app: AppItem) => void;
    onVisitApp: (app: AppItem) => void;
    searchRef?: React.RefObject<HTMLInputElement | null>;
}

export const Directory: React.FC<DirectoryProps> = ({
                                                        apps,
                                                        onSelectApp,
                                                        onVisitApp,
                                                        searchRef,
                                                    }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | string>('all');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | string>('All');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const localSearchRef = useRef<HTMLInputElement>(null);
    const activeSearchInput = searchRef || localSearchRef;

    // Keyboard shortcut '/' to focus search input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== activeSearchInput.current) {
                e.preventDefault();
                activeSearchInput.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeSearchInput]);

    const filteredApps = filterAndSortApps(apps, {
        searchQuery,
        platform: selectedPlatform,
        category: selectedCategory,
        sortBy,
    });

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedPlatform, selectedCategory, sortBy]);

    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE) || 1;
    const validPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredApps.length);
    const paginatedApps = filteredApps.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        const directorySection = document.getElementById('directory-section');
        if (directorySection) {
            directorySection.scrollIntoView({behavior: 'smooth'});
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedPlatform('all');
        setSelectedCategory('All');
        setSortBy('newest');
    };

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedPlatform !== 'all' ||
        selectedCategory !== 'All' ||
        sortBy !== 'newest';

    // Helper to count apps per category
    const getCategoryCount = (categoryName: string) => {
        if (categoryName === 'All') return apps.length;
        return apps.filter(
            (a) => a.category.toLowerCase() === categoryName.toLowerCase()
        ).length;
    };

    // Helper to count apps per platform
    const getPlatformCount = (platformId: string) => {
        if (platformId === 'all') return apps.length;
        return apps.filter((a) => {
            const appPlatforms = parsePlatforms(a.platform).map((p) => p.toLowerCase());
            return appPlatforms.some((p) => {
                if (platformId === 'macos' || platformId === 'mac') {
                    return p === 'macos' || p === 'mac' || p.includes('mac') || p.includes('desktop');
                }
                if (platformId === 'windows') {
                    return p === 'windows' || p.includes('win') || p.includes('desktop');
                }
                if (platformId === 'linux') {
                    return p === 'linux' || p.includes('linux') || p.includes('desktop');
                }
                if (platformId === 'ios') {
                    return p.includes('ios') || p.includes('mobile') || !!a.ios;
                }
                if (platformId === 'android') {
                    return p.includes('android') || p.includes('mobile') || !!a.android;
                }
                if (platformId === 'web') {
                    return p.includes('web') || p === 'all';
                }
                return p.includes(platformId);
            });
        }).length;
    };

    return (
        <section id="directory-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* ================= SIDEBAR (Filter & Intro UI) ================= */}
                <aside
                    className={`w-full lg:w-80 shrink-0 space-y-6 ${
                        mobileFilterOpen ? 'block' : 'hidden lg:block'
                    }`}
                >
                    {/* Search Box Widget */}
                    <div
                        className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 relative">
                            {/* Background Subtle Radial Glow */}
                            <div
                                className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 blur-2xl rounded-full pointer-events-none"/>

                            <span className="font-semibold text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-red-400"/>
                Search Directory
              </span>
                            <kbd
                                className="px-1.5 py-0.5 text-[10px] bg-[#222222] text-[#888888] rounded border border-[#333333]">
                                /
                            </kbd>
                        </div>

                        <div className="relative">
                            <input
                                ref={activeSearchInput as React.RefObject<HTMLInputElement>}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search name, creator, keyword..."
                                className="w-full pl-3 pr-8 py-2 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs font-mono text-white placeholder-[#666666] focus:outline-none focus:border-red-500/70 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5"/>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Platform Filters Widget */}
                    <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3">
                        <div className="text-xs font-mono font-semibold text-white flex items-center justify-between">
                            <span>Platform</span>
                            <span className="text-[11px] text-[#888888]">Filter</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            {PLATFORMS.map((plat) => {
                                const count = getPlatformCount(plat.id);
                                const isSelected = selectedPlatform === plat.id;

                                return (
                                    <button
                                        key={plat.id}
                                        onClick={() => setSelectedPlatform(plat.id)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                                            isSelected
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/40 font-semibold'
                                                : 'bg-[#0A0A0A] text-[#888888] border border-[#262626] hover:text-zinc-200 hover:border-[#333333]'
                                        }`}
                                    >
                                        <span>{plat.label}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-[#1E1E1E] text-zinc-400'}`}>
                      {count}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category List Widget */}
                    <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-red-400"/>
                Categories
              </span>
                            <span
                                className="text-[11px] text-[#888888] font-normal">{CATEGORIES.length - 1} types</span>
                        </div>

                        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                            {CATEGORIES.map((cat) => {
                                const count = getCategoryCount(cat);
                                const isSelected = selectedCategory === cat;

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                                            isSelected
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/40 font-semibold'
                                                : 'text-[#888888] hover:text-white hover:bg-[#1E1E1E]'
                                        }`}
                                    >
                                        <span className="truncate">{cat}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2 font-semibold ${
                                                isSelected
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-[#1E1E1E] text-zinc-400'
                                            }`}
                                        >
                      {count}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort Selector */}
                    <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3">
                        <div className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                            <ArrowUpDown className="w-3.5 h-3.5 text-red-400"/>
                            <span>Sort Order</span>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs font-mono text-zinc-200 appearance-none focus:outline-none focus:border-red-500/70 transition-all cursor-pointer"
                        >
                            <option value="newest">Sort: Newest First</option>
                            <option value="oldest">Sort: Oldest First</option>
                            <option value="featured">Sort: Featured First</option>
                            <option value="a-z">Sort: A – Z</option>
                            <option value="z-a">Sort: Z – A</option>
                        </select>
                    </div>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5"/>
                            <span>Reset All Filters</span>
                        </button>
                    )}
                </aside>

                {/* ================= MAIN DIRECTORY CONTENT ================= */}
                <div className="flex-1 w-full space-y-5">

                    {/* Main Top Header Bar */}
                    <div
                        className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-red-500"/>
                                <h1 className="text-lg font-mono font-bold text-white">
                                    {selectedCategory === 'All' ? 'All Software' : `${selectedCategory} Apps`}
                                </h1>
                                <span
                                    className="px-2 py-0.5 rounded-full bg-[#1E1E1E] text-red-400 text-xs font-mono border border-[#333333]">
                  {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
                </span>
                            </div>
                            <p className="text-xs font-mono text-[#888888] mt-1">
                                Software crafted by indie builders, collected on weeknd.dev
                            </p>
                        </div>

                        {/* Controls Right: Mobile Filter Button & Sort Indicator */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#333333] text-xs font-mono text-zinc-200 hover:text-white"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5 text-red-400"/>
                                <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters & Search'}</span>
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 rounded-full bg-red-500"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                            <span className="text-[#888888]">Active Filters:</span>

                            {selectedCategory !== 'All' && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-zinc-200">
                  <span>Category: <strong>{selectedCategory}</strong></span>
                  <button onClick={() => setSelectedCategory('All')} className="text-[#888888] hover:text-white">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
                            )}

                            {selectedPlatform !== 'all' && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-zinc-200">
                  <span>Platform: <strong className="uppercase">{selectedPlatform}</strong></span>
                  <button onClick={() => setSelectedPlatform('all')} className="text-[#888888] hover:text-white">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
                            )}

                            {searchQuery && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-zinc-200">
                  <span>Search: "<strong>{searchQuery}</strong>"</span>
                  <button onClick={() => setSearchQuery('')} className="text-[#888888] hover:text-white">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
                            )}

                            {sortBy !== 'newest' && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-zinc-200">
                  <span>Sort: <strong>{sortBy}</strong></span>
                  <button onClick={() => setSortBy('newest')} className="text-[#888888] hover:text-white">
                    <X className="w-3 h-3"/>
                  </button>
                </span>
                            )}

                            <button
                                onClick={clearFilters}
                                className="text-red-400 hover:underline ml-1 text-xs"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Directory App Grid */}
                    {filteredApps.length > 0 ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {paginatedApps.map((app) => (
                                    <AppCard
                                        key={app.slug}
                                        app={app}
                                        onClick={() => onSelectApp(app)}
                                        onVisit={() => onVisitApp(app)}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div
                                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#262626] font-mono text-xs">
                                    <div className="text-[#888888]">
                                        Showing <span className="text-white font-semibold">{startIndex + 1}</span>–<span
                                        className="text-white font-semibold">{endIndex}</span> of <span
                                        className="text-white font-semibold">{filteredApps.length}</span> apps
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handlePageChange(validPage - 1)}
                                            disabled={validPage === 1}
                                            className="p-2 rounded-xl bg-[#141414] border border-[#262626] text-zinc-200 hover:text-white hover:border-[#333333] disabled:opacity-40 disabled:hover:text-zinc-200 disabled:hover:border-[#262626] disabled:cursor-not-allowed transition-all"
                                            aria-label="Previous Page"
                                        >
                                            <ChevronLeft className="w-4 h-4"/>
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`min-w-[32px] h-8 px-2.5 rounded-xl text-xs font-mono transition-all ${
                                                        validPage === page
                                                            ? 'bg-red-500 text-white font-semibold shadow-md'
                                                            : 'bg-[#141414] text-[#888888] border border-[#262626] hover:text-white hover:border-[#333333]'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(validPage + 1)}
                                            disabled={validPage === totalPages}
                                            className="p-2 rounded-xl bg-[#141414] border border-[#262626] text-zinc-200 hover:text-white hover:border-[#333333] disabled:opacity-40 disabled:hover:text-zinc-200 disabled:hover:border-[#262626] disabled:cursor-not-allowed transition-all"
                                            aria-label="Next Page"
                                        >
                                            <ChevronRight className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty Search State */
                        <div className="py-16 px-6 text-center rounded-2xl bg-[#141414] border border-[#262626] my-4">
                            <div
                                className="w-12 h-12 mx-auto rounded-xl bg-[#1E1E1E] border border-[#333333] flex items-center justify-center text-zinc-400 mb-4">
                                <Search className="w-6 h-6 text-red-400"/>
                            </div>
                            <h3 className="text-base font-mono font-semibold text-white">
                                No software matching your selection
                            </h3>
                            <p className="text-xs font-mono text-[#888888] mt-2 max-w-md mx-auto leading-relaxed">
                                We couldn't find any listings matching "{searchQuery}" or selected category filters.
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#262626] text-zinc-200 text-xs font-mono border border-[#333333] transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </section>
    );
};