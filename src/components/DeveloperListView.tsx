import React, {useState} from 'react';
import {Search, Users, ExternalLink, ArrowRight, Globe} from 'lucide-react';
import {DeveloperItem} from '../types/developer';
import {AppItem} from '../types/app';
import {getAppsForDeveloper} from '../lib/developers';

interface DeveloperListViewProps {
    developers: DeveloperItem[];
    apps: AppItem[];
    onSelectDeveloper: (dev: DeveloperItem) => void;
}

export const DeveloperListView: React.FC<DeveloperListViewProps> = ({
                                                                        developers,
                                                                        apps,
                                                                        onSelectDeveloper,
                                                                    }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = developers.filter((dev) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            dev.name.toLowerCase().includes(q) ||
            (dev.bio && dev.bio.toLowerCase().includes(q)) ||
            dev.slug.toLowerCase().includes(q)
        );
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
            {/* Page Header */}
            <div className="space-y-4 border-b border-[#262626] pb-8">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        Indie Creators
                    </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
                    Developers on weeknd.dev
                </h1>
                <p className="text-sm font-mono text-zinc-300 max-w-4xl leading-relaxed">
                    Meet the independent makers, designers, and engineers crafting software on [mostly] weekends.
                </p>

                {/* Search Bar */}
                <div className="pt-2 max-w-md">
                    <div className="relative">
                        <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search developers by name or bio..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#262626] rounded-xl text-xs font-mono text-white placeholder:text-[#666666] focus:outline-none focus:border-red-500/70 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Developer Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((dev) => {
                        const devApps = getAppsForDeveloper(dev, apps);

                        return (
                            <div
                                key={dev.slug}
                                onClick={() => onSelectDeveloper(dev)}
                                className="group bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#3a3a3a] rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 shadow-lg relative overflow-hidden"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            {dev.avatar ? (
                                                <img
                                                    src={dev.avatar}
                                                    alt={dev.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-[#262626]"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-zinc-800 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-lg shadow-sm">
                                                    {dev.name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <h2 className="text-base font-bold text-white group-hover:text-red-400 transition-colors font-mono">
                                                    {dev.name}
                                                </h2>
                                                <span className="text-[11px] font-mono text-[#888888]">
                                                    @{dev.slug}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-[#666666] group-hover:text-white group-hover:border-red-500/40 transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {dev.bio && (
                                        <p className="text-xs font-mono text-zinc-300 line-clamp-2 leading-relaxed">
                                            {dev.bio}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-[#262626] flex items-center justify-between text-xs font-mono text-[#888888]">
                                    <span className="inline-flex items-center gap-1.5 text-zinc-300">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        {devApps.length} {devApps.length === 1 ? 'App' : 'Apps'}
                                    </span>

                                    {dev.website && (
                                        <span className="inline-flex items-center gap-1 hover:text-white transition-colors">
                                            <Globe className="w-3.5 h-3.5" />
                                            <span>Website</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 text-center space-y-3">
                    <Users className="w-8 h-8 text-[#666666] mx-auto" />
                    <h3 className="text-sm font-mono text-white">No developers found</h3>
                    <p className="text-xs font-mono text-[#888888]">
                        Try searching with a different keyword.
                    </p>
                </div>
            )}
        </div>
    );
};
