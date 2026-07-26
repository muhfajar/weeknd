import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
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
    User
} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';
import {AppItem} from '../types/app';

interface AppDetailModalProps {
    app: AppItem | null;
    onClose: () => void;
    onShowToast: (msg: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({app, onClose, onShowToast}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'raw'>('details');
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedMd, setCopiedMd] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedScreenshot) {
                    setSelectedScreenshot(null);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, selectedScreenshot]);

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

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{opacity: 0, scale: 0.96, y: 10}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.96, y: 10}}
                    transition={{duration: 0.2}}
                    className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
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
                                <div className="flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-[#262626]">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1E1E1E] border border-[#333333] overflow-hidden flex items-center justify-center shrink-0">
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
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-400"/> Featured
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm font-mono text-[#888888] mt-1">
                                            {app.tagline}
                                        </p>

                                        {/* Category & Platform */}
                                        <div className="flex items-center gap-2 mt-2.5 text-xs font-mono text-[#666666]">
                                            <span className="px-2 py-0.5 rounded bg-[#1E1E1E] text-zinc-300 border border-[#333333]">
                                                {app.category}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-[#1E1E1E] text-red-400 border border-[#333333]">
                                                {app.platform}
                                            </span>
                                        </div>

                                        {/* Action Links directly under App Category */}
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            {app.website && (
                                                <a
                                                    href={app.website}
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
                                                    href={app.ios}
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
                                                    href={app.android}
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

                                {/* Screenshots Gallery */}
                                {app.screenshots && app.screenshots.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider">
                                            Screenshots
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {app.screenshots.map((src, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setSelectedScreenshot(src)}
                                                    className="group relative rounded-xl overflow-hidden border border-[#262626] bg-[#0A0A0A] aspect-video cursor-pointer hover:border-red-500/50 transition-all"
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`${app.name} preview ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="p-2 rounded-full bg-[#141414]/90 text-red-400 border border-[#333333]">
                              <Maximize2 className="w-4 h-4"/>
                            </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Markdown Body Description */}
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider">
                                        About {app.name}
                                    </h4>
                                    <div
                                        className="p-4 sm:p-5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-sm font-mono text-zinc-300 leading-relaxed prose prose-invert max-w-none prose-headings:font-mono prose-headings:text-white prose-a:text-red-400 prose-code:text-red-300 prose-code:bg-[#1A1A1A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                                        <ReactMarkdown>{app.content}</ReactMarkdown>
                                    </div>
                                </div>

                                {/* Creator Link Footer */}
                                <div
                                    className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3 text-xs font-mono">
                                    {app.creator_link || app.developerUrl ? (
                                        <a
                                            href={app.creator_link || app.developerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors"
                                            title="Creator's personal website, social profile, or portfolio"
                                        >
                                            <User className="w-3.5 h-3.5 text-red-400"/>
                                            <span>Created by <strong className="text-zinc-200">{app.developer}</strong></span>
                                            <ExternalLink className="w-3 h-3 text-[#666666]"/>
                                        </a>
                                    ) : (
                                        <span className="text-[#888888]">Created by <strong
                                            className="text-zinc-200">{app.developer}</strong></span>
                                    )}
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
                {selectedScreenshot && (
                    <div
                        onClick={() => setSelectedScreenshot(null)}
                        className="fixed inset-0 z-60 bg-zinc-950/90 backdrop-blur-lg flex items-center justify-center p-4"
                    >
                        <div className="relative max-w-5xl w-full">
                            <button
                                onClick={() => setSelectedScreenshot(null)}
                                className="absolute -top-10 right-0 text-zinc-400 hover:text-zinc-100"
                            >
                                <X className="w-6 h-6"/>
                            </button>
                            <img
                                src={selectedScreenshot}
                                alt="Enlarged screenshot preview"
                                className="w-full max-h-[80vh] object-contain rounded-xl border border-zinc-800"
                            />
                        </div>
                    </div>
                )}
            </div>
        </AnimatePresence>
    );
};