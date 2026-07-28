import React, {useState, useEffect} from 'react';
import {
    X,
    ExternalLink,
    Globe,
    Share2,
    FileText,
    Smartphone,
    Star,
    Check,
    Maximize2,
    Code,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';
import {AppItem} from '../types/app';
import {MarkdownRenderer} from './MarkdownRenderer';
import {parsePlatforms, formatPlatformLabel, appendRefUrl} from '../lib/apps';

interface AppDetailModalProps {
    app: AppItem | null;
    onClose: () => void;
    onShowToast: (msg: string) => void;
    onSelectDeveloperBySlug?: (slug: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({app, onClose, onShowToast, onSelectDeveloperBySlug}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'raw'>('details');
    const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState<number>(0);
    const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedMd, setCopiedMd] = useState(false);

    useEffect(() => {
        setCurrentScreenshotIndex(0);
        setSelectedScreenshotIndex(null);
    }, [app?.slug]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedScreenshotIndex !== null) {
                    setSelectedScreenshotIndex(null);
                } else {
                    onClose();
                }
            } else if (app?.screenshots && app.screenshots.length > 1) {
                if (e.key === 'ArrowLeft') {
                    if (selectedScreenshotIndex !== null) {
                        setSelectedScreenshotIndex((prev) =>
                            prev === null ? 0 : (prev - 1 + app.screenshots.length) % app.screenshots.length
                        );
                    } else {
                        setCurrentScreenshotIndex((prev) => (prev - 1 + app.screenshots.length) % app.screenshots.length);
                    }
                } else if (e.key === 'ArrowRight') {
                    if (selectedScreenshotIndex !== null) {
                        setSelectedScreenshotIndex((prev) =>
                            prev === null ? 0 : (prev + 1) % app.screenshots.length
                        );
                    } else {
                        setCurrentScreenshotIndex((prev) => (prev + 1) % app.screenshots.length);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, selectedScreenshotIndex, app]);

    if (!app) return null;

    const handleCopyLink = () => {
        const url = `${window.location.origin}?app=${app.slug}`;
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        onShowToast(`Direct link copied for ${app.name}`);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyMarkdown = () => {
        navigator.clipboard.writeText(app.rawContent);
        setCopiedMd(true);
        onShowToast(`Raw Markdown copied for ${app.name}`);
        setTimeout(() => setCopiedMd(false), 2000);
    };

    const prevScreenshot = () => {
        if (!app.screenshots || app.screenshots.length === 0) return;
        setCurrentScreenshotIndex((prev) => (prev - 1 + app.screenshots.length) % app.screenshots.length);
    };

    const nextScreenshot = () => {
        if (!app.screenshots || app.screenshots.length === 0) return;
        setCurrentScreenshotIndex((prev) => (prev + 1) % app.screenshots.length);
    };

    return (
        <AnimatePresence>
            <div
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{opacity: 0, scale: 0.96, y: 10}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.96, y: 10}}
                    transition={{duration: 0.2}}
                    className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
                >
                    {/* Header Bar */}
                    <div
                        className="flex items-center justify-between p-4 sm:p-6 border-b border-[#262626] bg-[#0A0A0A] shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab(activeTab === 'details' ? 'raw' : 'details')}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                                    activeTab === 'raw'
                                        ? 'bg-[#1E1E1E] text-red-400 border border-[#333333]'
                                        : 'bg-[#141414] text-[#888888] hover:text-white border border-[#262626] hover:border-[#333333]'
                                }`}
                                title={activeTab === 'raw' ? 'Click to show rendered app details' : 'Click to view raw markdown source'}
                            >
                                <Code className="w-3.5 h-3.5 text-red-400"/>
                                <span>/apps/{app.slug}.md</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyLink}
                                className="p-2 text-[#888888] hover:text-white bg-[#1E1E1E] hover:bg-[#262626] rounded-lg transition-colors"
                                title="Copy direct share link"
                            >
                                {copiedLink ? <Check className="w-4 h-4 text-red-400"/> : <Share2 className="w-4 h-4"/>}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-[#888888] hover:text-white bg-[#1E1E1E] hover:bg-[#262626] rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>

                    {/* Modal Content Scroll Area */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-zinc-200">
                        {activeTab === 'details' ? (
                            <>
                                {/* Hero / Header info */}
                                <div
                                    className="flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-[#262626]">
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1E1E1E] border border-[#333333] overflow-hidden flex items-center justify-center shrink-0">
                                        {app.icon ? (
                                            <img src={app.icon} alt={app.name} className="w-full h-full object-cover"/>
                                        ) : (
                                            <span className="text-2xl font-mono font-bold text-red-400 uppercase">
                                                {app.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white">
                                                {app.name}
                                            </h2>
                                            {app.featured && (
                                                <span
                                                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-300/10 text-amber-500 border border-amber-400/30 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-500"/> Featured
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm font-mono text-[#888888] mt-1">
                                            {app.tagline}
                                        </p>

                                        {/* Category & Platform */}
                                        <div
                                            className="flex items-center gap-2 mt-2.5 text-xs font-mono text-[#666666] flex-wrap">
                                            <span
                                                className="px-2 py-0.5 rounded bg-[#1E1E1E] text-zinc-300 border border-[#333333]">
                                                {app.category}
                                            </span>
                                            {parsePlatforms(app.platform).map((pToken) => (
                                                <span key={pToken}
                                                      className="px-2 py-0.5 rounded bg-[#1E1E1E] text-red-400 border border-[#333333]">
                                                    {formatPlatformLabel(pToken)}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Links directly under App Category */}
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            {app.website && (
                                                <a
                                                    href={appendRefUrl(app.website)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-mono font-semibold text-xs transition-colors shadow-md"
                                                >
                                                    <Globe className="w-3.5 h-3.5"/>
                                                    <span>Visit Website</span>
                                                    <ExternalLink className="w-3 h-3"/>
                                                </a>
                                            )}

                                            {app.ios && (
                                                <a
                                                    href={appendRefUrl(app.ios)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#262626] text-zinc-200 border border-[#333333] text-xs font-mono transition-colors"
                                                >
                                                    <Smartphone className="w-3.5 h-3.5 text-red-400"/>
                                                    <span>App Store</span>
                                                    <ExternalLink className="w-3 h-3 text-[#666666]"/>
                                                </a>
                                            )}

                                            {app.android && (
                                                <a
                                                    href={appendRefUrl(app.android)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#262626] text-zinc-200 border border-[#333333] text-xs font-mono transition-colors"
                                                >
                                                    <Smartphone className="w-3.5 h-3.5 text-emerald-400"/>
                                                    <span>Google Play</span>
                                                    <ExternalLink className="w-3 h-3 text-[#666666]"/>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshots Carousel */}
                                {app.screenshots && app.screenshots.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider">
                                                Screenshots ({currentScreenshotIndex + 1}/{app.screenshots.length})
                                            </h4>
                                            {app.screenshots.length > 1 && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={prevScreenshot}
                                                        className="p-1.5 rounded-md bg-[#1E1E1E] hover:bg-[#262626] text-zinc-300 border border-[#333333] transition-colors"
                                                        aria-label="Previous screenshot"
                                                    >
                                                        <ChevronLeft className="w-4 h-4"/>
                                                    </button>
                                                    <button
                                                        onClick={nextScreenshot}
                                                        className="p-1.5 rounded-md bg-[#1E1E1E] hover:bg-[#262626] text-zinc-300 border border-[#333333] transition-colors"
                                                        aria-label="Next screenshot"
                                                    >
                                                        <ChevronRight className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Active Carousel Display */}
                                        <div
                                            className="relative group rounded-xl overflow-hidden border border-[#262626] bg-[#0A0A0A] aspect-video">
                                            <img
                                                src={app.screenshots[currentScreenshotIndex] || app.screenshots[0]}
                                                alt={`${app.name} preview ${currentScreenshotIndex + 1}`}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setSelectedScreenshotIndex(currentScreenshotIndex)}
                                            />

                                            {/* Left / Right Nav Overlay Buttons */}
                                            {app.screenshots.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            prevScreenshot();
                                                        }}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft className="w-5 h-5"/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            nextScreenshot();
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight className="w-5 h-5"/>
                                                    </button>
                                                </>
                                            )}

                                            {/* Expand Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedScreenshotIndex(currentScreenshotIndex);
                                                }}
                                                className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-950/70 hover:bg-zinc-900 text-red-400 border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                title="Enlarge screenshot"
                                            >
                                                <Maximize2 className="w-4 h-4"/>
                                            </button>
                                        </div>

                                        {/* Thumbnail Navigation Bar */}
                                        {app.screenshots.length > 1 && (
                                            <div
                                                className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                                                {app.screenshots.map((src, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentScreenshotIndex(idx)}
                                                        className={`relative rounded-lg overflow-hidden border aspect-video w-20 sm:w-24 shrink-0 transition-all ${
                                                            idx === currentScreenshotIndex
                                                                ? 'border-red-500 ring-2 ring-red-500/30'
                                                                : 'border-[#262626] opacity-60 hover:opacity-100'
                                                        }`}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`Thumbnail ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Markdown Body Description */}
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider">
                                        About {app.name}
                                    </h4>
                                    <MarkdownRenderer content={app.content} justify={true}/>
                                </div>

                                {/* Developer Link Footer */}
                                <div
                                    className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3 text-xs font-mono">
                                    {(() => {
                                        const devRef = app.linked_profile || app.developerUrl || app.developer_url;
                                        if (!devRef) {
                                            return (
                                                <span className="text-[#888888]">Created by <strong
                                                    className="text-zinc-200">{app.developer}</strong></span>
                                            );
                                        }

                                        const isExternalUrl = devRef.startsWith('http://') || devRef.startsWith('https://') || devRef.startsWith('mailto:');

                                        if (!isExternalUrl) {
                                            const slug = devRef.replace(/^\/dev\//, '').replace(/^dev\//, '');
                                            return (
                                                <button
                                                    onClick={() => {
                                                        if (onSelectDeveloperBySlug) {
                                                            onSelectDeveloperBySlug(slug);
                                                        } else {
                                                            window.location.href = `/#/${slug}`;
                                                        }
                                                    }}
                                                    className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors cursor-pointer"
                                                    title={`View ${app.developer}'s profile on weeknd.dev`}
                                                >
                                                    <User className="w-3.5 h-3.5 text-red-400"/>
                                                    <span>Created by <strong
                                                        className="text-zinc-200 underline decoration-red-500/40 hover:decoration-red-400">{app.developer}</strong></span>
                                                </button>
                                            );
                                        }

                                        return (
                                            <a
                                                href={appendRefUrl(devRef)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors"
                                                title="Developer's personal website or social profile"
                                            >
                                                <User className="w-3.5 h-3.5 text-red-400"/>
                                                <span>Created by <strong
                                                    className="text-zinc-200">{app.developer}</strong></span>
                                                <ExternalLink className="w-3 h-3 text-[#666666]"/>
                                            </a>
                                        );
                                    })()}
                                </div>
                            </>
                        ) : (
                            /* Raw Markdown View Tab */
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-mono text-[#888888]">
                                        Raw file content stored in weeknd.dev open source repository:
                                    </p>
                                    <button
                                        onClick={handleCopyMarkdown}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#262626] text-zinc-200 text-xs font-mono border border-[#333333] transition-colors"
                                    >
                                        {copiedMd ? <Check className="w-3.5 h-3.5 text-red-400"/> :
                                            <FileText className="w-3.5 h-3.5"/>}
                                        <span>{copiedMd ? 'Copied!' : 'Copy Raw Markdown'}</span>
                                    </button>
                                </div>

                                <pre
                                    className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] overflow-x-auto text-xs font-mono text-red-300/90 leading-relaxed">
                  <code>{app.rawContent}</code>
                </pre>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Lightbox Modal for Screenshots */}
                {selectedScreenshotIndex !== null && app.screenshots && app.screenshots[selectedScreenshotIndex] && (
                    <div
                        onClick={() => setSelectedScreenshotIndex(null)}
                        className="fixed inset-0 z-60 bg-zinc-950/90 backdrop-blur-lg flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full flex flex-col items-center justify-center"
                        >
                            <div className="absolute -top-10 right-0 flex items-center gap-4">
                                <span className="text-xs font-mono text-zinc-400">
                                    {selectedScreenshotIndex + 1} / {app.screenshots.length}
                                </span>
                                <button
                                    onClick={() => setSelectedScreenshotIndex(null)}
                                    className="text-zinc-400 hover:text-zinc-100 p-1"
                                    aria-label="Close lightbox"
                                >
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>

                            <div className="relative w-full flex items-center justify-center">
                                {app.screenshots.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedScreenshotIndex((prev) =>
                                                prev === null ? 0 : (prev - 1 + app.screenshots.length) % app.screenshots.length
                                            );
                                        }}
                                        className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/50 backdrop-blur-md z-10 transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-6 h-6"/>
                                    </button>
                                )}

                                <img
                                    src={app.screenshots[selectedScreenshotIndex]}
                                    alt="Enlarged screenshot preview"
                                    className="w-full max-h-[80vh] object-contain rounded-xl border border-zinc-800"
                                />

                                {app.screenshots.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedScreenshotIndex((prev) =>
                                                prev === null ? 0 : (prev + 1) % app.screenshots.length
                                            );
                                        }}
                                        className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/50 backdrop-blur-md z-10 transition-colors"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-6 h-6"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AnimatePresence>
    );
};
