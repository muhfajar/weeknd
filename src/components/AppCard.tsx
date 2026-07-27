import React, {useState} from 'react';
import {ExternalLink, Star, Smartphone, Globe, Monitor, Layers} from 'lucide-react';
import {AppItem} from '../types/app';
import {getMergedPlatformBadges} from '../lib/apps';

interface AppCardProps {
    app: AppItem;
    onClick: () => void;
    onVisit: (e: React.MouseEvent) => void;
}

export const AppCard: React.FC<AppCardProps> = ({app, onClick, onVisit}) => {
    const [imageError, setImageError] = useState(false);

    // Platform badges helper
    const renderPlatformBadges = () => {
        const badges = getMergedPlatformBadges(app.platform);

        return badges.map((badge) => {
            let Icon = Globe;
            if (badge.type === 'mobile' || badge.id === 'ios' || badge.id === 'android' || badge.id === 'mobile') {
                Icon = Smartphone;
            } else if (badge.type === 'desktop' || badge.id === 'macos' || badge.id === 'windows' || badge.id === 'linux' || badge.id === 'desktop') {
                Icon = Monitor;
            } else if (badge.type === 'multi') {
                Icon = Layers;
            } else if (badge.type === 'web') {
                Icon = Globe;
            }

            return (
                <span
                    key={badge.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#141414] border border-[#262626] text-[#888888]">
                    <Icon className="w-3 h-3 text-red-400 shrink-0"/>
                    {badge.label}
                </span>
            );
        });
    };

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between h-full p-5 rounded-xl bg-[#141414]/60 border border-[#262626] hover:border-red-500/40 hover:bg-[#141414] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-red-950/20"
        >
            <div className="flex-1 flex flex-col">
                {/* Header: Icon + Name + Developer */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* App Icon */}
                        <div
                            className="relative w-12 h-12 rounded-xl bg-[#1E1E1E] border border-[#333333] overflow-hidden flex items-center justify-center shrink-0 group-hover:border-red-500/50 transition-colors">
                            {app.icon && !imageError ? (
                                <img
                                    src={app.icon}
                                    alt={`${app.name} icon`}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                    loading="lazy"
                                />
                            ) : (
                                <span className="text-lg font-mono font-bold text-red-400 uppercase">
                                    {app.name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Title & Developer */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-mono font-semibold text-white text-base group-hover:text-red-400 transition-colors truncate">
                                    {app.name}
                                </h3>
                                {app.featured && (
                                    <span
                                        className="p-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0"
                                        title="Featured App">
                                        <Star className="w-3 h-3 fill-amber-400"/>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-mono text-[#888888] mt-0.5 truncate">
                                by <span className="text-zinc-300 font-medium">{app.developer}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <p className="mt-4 text-xs font-mono text-[#CCCCCC] line-clamp-2 leading-relaxed min-h-[2.25rem]">
                    {app.tagline}
                </p>
            </div>

            {/* Footer: Category & Platform + Visit Button */}
            <div className="mt-5 pt-4 border-t border-[#262626] flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    {renderPlatformBadges()}
                    <span
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#141414] border border-[#262626] text-[#888888]">
                        {app.category}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVisit(e);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-red-500 hover:text-white border border-[#333333] text-xs font-mono font-medium text-zinc-200 transition-colors shrink-0"
                    title={`Visit ${app.name}`}
                >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3"/>
                </button>
            </div>
        </div>
    );
};