import React from 'react';
import {
    Globe,
    User,
    ArrowLeft,
    ExternalLink,
    Grid,
    Share2,
    Check,
} from 'lucide-react';
import {DeveloperItem} from '../types/developer';
import {AppItem} from '../types/app';
import {AppCard} from './AppCard';
import {MarkdownRenderer} from './MarkdownRenderer';
import {getAppsForDeveloper} from '../lib/developers';

interface DeveloperProfileViewProps {
    developer: DeveloperItem;
    apps: AppItem[];
    onBack: () => void;
    onSelectApp: (app: AppItem) => void;
    onVisitApp: (app: AppItem) => void;
    onShowToast?: (msg: string) => void;
}

export const DeveloperProfileView: React.FC<DeveloperProfileViewProps> = ({
                                                                              developer,
                                                                              apps,
                                                                              onBack,
                                                                              onSelectApp,
                                                                              onVisitApp,
                                                                              onShowToast,
                                                                          }) => {
    const [copied, setCopied] = React.useState(false);

    // Filter apps created by or linked to this developer dynamically
    const devApps = getAppsForDeveloper(developer, apps);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        if (onShowToast) onShowToast('Developer profile link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const socials = [
        {key: 'twitter', label: 'X / Twitter', url: developer.twitter, icon: '𝕏'},
        {key: 'bluesky', label: 'Bluesky', url: developer.bluesky, icon: '🦋'},
        {key: 'mastodon', label: 'Mastodon', url: developer.mastodon, icon: '🐘'},
        {key: 'threads', label: 'Threads', url: developer.threads, icon: '🧵'},
        {key: 'instagram', label: 'Instagram', url: developer.instagram, icon: '📸'},
        {key: 'linkedin', label: 'LinkedIn', url: developer.linkedin, icon: '💼'},
        {key: 'nostr', label: 'Nostr', url: developer.nostr, icon: '💜'},
        {key: 'github', label: 'GitHub', url: developer.github, icon: '💻'},
    ].filter((s) => Boolean(s.url));

    return (
        <div className="w-full lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
            {/* Header / Back Navigation */}
            <div className="flex items-center justify-between gap-4 border-b border-[#262626] pb-6">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-white bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] px-3.5 py-2 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Back</span>
                </button>

                <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-white bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] px-3.5 py-2 rounded-xl transition-all"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Share2 className="w-3.5 h-3.5"/>}
                    <span>{copied ? 'Copied Link' : 'Share Profile'}</span>
                </button>
            </div>

            {/* Developer Banner / Profile Card */}
            <div
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"/>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-4 sm:gap-5">
                        {developer.avatar ? (
                            <img
                                src={developer.avatar}
                                alt={developer.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#262626] shadow-md flex-shrink-0"
                            />
                        ) : (
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-zinc-800 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-xl sm:text-2xl flex-shrink-0 shadow-md">
                                {developer.name.slice(0, 2).toUpperCase()}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-[10px] font-mono tracking-widest text-red-400 uppercase px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                    Indie Builder
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                {developer.name}
                            </h1>
                            {developer.bio && (
                                <div className="max-w-2xl">
                                    <MarkdownRenderer content={developer.bio} justify={true}/>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Website Button */}
                    {developer.website && (
                        <a
                            href={developer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-mono font-medium shadow-md transition-all self-start"
                        >
                            <Globe className="w-4 h-4"/>
                            <span>Personal Website</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-70"/>
                        </a>
                    )}
                </div>

                {/* Social Links Row */}
                {socials.length > 0 && (
                    <div className="pt-4 border-t border-[#262626] space-y-3">
                        <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                            Connect & Follow
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            {socials.map((s) => (
                                <a
                                    key={s.key}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#1f1f1f] border border-[#262626] hover:border-red-500/50 rounded-xl text-xs font-mono text-zinc-200 hover:text-white transition-all shadow-sm"
                                >
                                    <span>{s.icon}</span>
                                    <span>{s.label}</span>
                                    <ExternalLink className="w-3 h-3 text-[#666666]"/>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extended Markdown Content */}
                {developer.content && (
                    <div className="pt-4 border-t border-[#262626]">
                        <MarkdownRenderer content={developer.content} justify={true}/>
                    </div>
                )}
            </div>

            {/* Submitted Apps Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                    <div className="flex items-center gap-2.5">
                        <Grid className="w-4 h-4 text-red-400"/>
                        <h2 className="text-lg font-bold text-white font-mono">
                            Submitted Apps ({devApps.length})
                        </h2>
                    </div>
                </div>

                {devApps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {devApps.map((app) => (
                            <AppCard
                                key={app.slug}
                                app={app}
                                onClick={() => onSelectApp(app)}
                                onVisit={() => onVisitApp(app)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 text-center space-y-3">
                        <User className="w-8 h-8 text-[#666666] mx-auto"/>
                        <h3 className="text-sm font-mono text-white">No apps linked yet</h3>
                        <p className="text-xs font-mono text-[#888888] max-w-md mx-auto">
                            This developer profile exists, but no apps on weeknd.dev have been tagged with this profile
                            yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
