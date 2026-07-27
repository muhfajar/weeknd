import React, {useState} from 'react';
import {
    GitPullRequest,
    Copy,
    Check,
    ExternalLink,
    Code2,
    FileCode,
    Sparkles,
} from 'lucide-react';
import {generateMarkdownString} from '../lib/markdown';
import {CategoryType} from '../types/app';
import {CATEGORIES, PLATFORMS} from '../lib/apps';

interface SubmitViewProps {
    onShowToast: (msg: string) => void;
}

const DEFAULT_TEMPLATE = `---
name: App Name
tagline: A brief, inspiring one-sentence tagline.
developer: Your Name or Studio
developer_url: https://yourwebsite.com or https://x.com/username
linked_profile: your-developer-slug
website: https://your-app.com
platform: web # web | ios | android | macos | windows | linux
category: Productivity
created_at: YYYY-MM-DD
icon: https://example.com/icon.png
screenshots:
  - https://example.com/screenshot1.png
  - https://example.com/screenshot2.png
ios: 
android: 
---

Write a clear, thoughtful description of what your app does, why you built it, and its core features. Markdown formatting like headers, bullet lists, and code blocks are supported.
`;

export const SubmitView: React.FC<SubmitViewProps> = ({onShowToast}) => {
    const [copiedTemplate, setCopiedTemplate] = useState(false);

    // Interactive Live Builder state
    const [builderName, setBuilderName] = useState('My Indie App');
    const [builderTagline, setBuilderTagline] = useState('The minimalist tool for deep focus.');
    const [builderDev, setBuilderDev] = useState('Maker Name');
    const [builderDevUrl, setBuilderDevUrl] = useState('https://x.com/maker');
    const [builderLinkedProfile, setBuilderLinkedProfile] = useState('');
    const [builderWeb, setBuilderWeb] = useState('https://myapp.dev');
    const [builderPlatform, setBuilderPlatform] = useState('web');
    const [builderCategory, setBuilderCategory] = useState<CategoryType>('Productivity');
    const [builderDesc, setBuilderDesc] = useState('Built on weekends to solve daily workflow friction. Fully customizable, fast, and light.');
    const [builderIcon] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80');
    const [builderScreenshot] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');

    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(DEFAULT_TEMPLATE);
        setCopiedTemplate(true);
        onShowToast('Markdown template copied to clipboard!');
        setTimeout(() => setCopiedTemplate(false), 2000);
    };

    const generatedMarkdown = generateMarkdownString({
        name: builderName,
        tagline: builderTagline,
        developer: builderDev,
        developer_url: builderDevUrl,
        linked_profile: builderLinkedProfile || undefined,
        website: builderWeb,
        platform: builderPlatform,
        category: builderCategory,
        description: builderDesc,
        icon: builderIcon,
        screenshots: builderScreenshot ? [builderScreenshot] : [],
    });

    const handleCopyGenerated = () => {
        navigator.clipboard.writeText(generatedMarkdown);
        onShowToast(`Markdown for "${builderName}" copied! Add it to /apps/${builderName.toLowerCase().replace(/\s+/g, '-')}.md`);
    };

    return (
        <div className="w-full lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    <GitPullRequest className="w-3.5 h-3.5"/>
                    <span>Contribute via GitHub PR</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white">
                    Submit an App
                </h1>
                <p className="text-sm font-mono text-[#888888] leading-relaxed">
                    weeknd.dev is 100% open-source and community-driven. Every listing lives as a simple Markdown file
                    in our GitHub repository.
                </p>
            </div>

            {/* GITHUB PULL REQUEST WORKFLOW */}
            <div className="space-y-8">

                {/* Step-by-Step Instructions */}
                <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
                    <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-red-500"/>
                        <span>How Contribution Works</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                Step 1
              </span>
                            <h4 className="font-semibold text-zinc-200">Fork Repository</h4>
                            <p className="text-[#888888] leading-relaxed">
                                Fork <code className="text-red-400">https://github.com/muhfajar/weeknd</code> on GitHub
                                to your
                                personal account.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                Step 2
              </span>
                            <h4 className="font-semibold text-zinc-200">Create Markdown File</h4>
                            <p className="text-[#888888] leading-relaxed">
                                Add one file inside <code className="text-red-400">/apps/your-app-name.md</code> using
                                our schema.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                Step 3
              </span>
                            <h4 className="font-semibold text-zinc-200">Open Pull Request</h4>
                            <p className="text-[#888888] leading-relaxed">
                                Submit a PR. Once merged, your app will automatically be published to the directory.
                            </p>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={handleCopyTemplate}
                            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-500 text-white font-mono font-semibold text-xs hover:bg-red-400 transition-colors shadow-sm"
                        >
                            {copiedTemplate ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                            <span>{copiedTemplate ? 'Template Copied!' : 'Copy Blank Template'}</span>
                        </button>

                        <a
                            href="https://github.com/muhfajar/weeknd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1E1E1E] hover:bg-[#262626] text-zinc-200 font-mono text-xs border border-[#333333] transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-red-400"/>
                            <span>Open GitHub Repository</span>
                        </a>
                    </div>
                </div>

                {/* Interactive Live Markdown File Builder */}
                <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-6">
                    <div>
                        <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-red-500"/>
                            <span>Interactive Markdown Generator</span>
                        </h3>
                        <p className="text-xs font-mono text-[#888888] mt-1">
                            Fill in your details below to generate the exact `.md` file content ready for your Pull
                            Request.
                        </p>
                    </div>

                    <div className="space-y-6">

                        {/* Inputs (Top Section - Full Width) */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">App
                                        Name</label>
                                    <input
                                        type="text"
                                        value={builderName}
                                        onChange={(e) => setBuilderName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Developer
                                        / Studio</label>
                                    <input
                                        type="text"
                                        value={builderDev}
                                        onChange={(e) => setBuilderDev(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">
                                        Developer URL
                                    </label>
                                    <input
                                        type="text"
                                        value={builderDevUrl}
                                        onChange={(e) => setBuilderDevUrl(e.target.value)}
                                        placeholder="https://yourwebsite.com or https://x.com/handle"
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">
                                        Developer profile slug (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={builderLinkedProfile}
                                        onChange={(e) => setBuilderLinkedProfile(e.target.value)}
                                        placeholder="e.g. fajar"
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Tagline</label>
                                <input
                                    type="text"
                                    value={builderTagline}
                                    onChange={(e) => setBuilderTagline(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Website
                                        URL</label>
                                    <input
                                        type="text"
                                        value={builderWeb}
                                        onChange={(e) => setBuilderWeb(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Platform
                                        (comma separated)</label>
                                    <input
                                        type="text"
                                        value={builderPlatform}
                                        onChange={(e) => setBuilderPlatform(e.target.value)}
                                        placeholder="e.g. web, macos, ios"
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {PLATFORMS.filter((p) => p.id !== 'all').map((plat) => {
                                            const currentList = builderPlatform.split(',').map((s) => s.trim().toLowerCase());
                                            const active = currentList.includes(plat.id);
                                            return (
                                                <button
                                                    key={plat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        let nextList = [...currentList].filter(Boolean);
                                                        if (active) {
                                                            nextList = nextList.filter((x) => x !== plat.id);
                                                        } else {
                                                            nextList.push(plat.id);
                                                        }
                                                        setBuilderPlatform(nextList.join(', '));
                                                    }}
                                                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                                                        active
                                                            ? 'bg-red-500/20 text-red-300 border-red-500/50'
                                                            : 'bg-[#0A0A0A] text-[#666666] border-[#262626] hover:text-white'
                                                    }`}
                                                >
                                                    {active ? '✓' : '+'} {plat.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Category</label>
                                    <select
                                        value={builderCategory}
                                        onChange={(e) => setBuilderCategory(e.target.value as CategoryType)}
                                        className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                    >
                                        {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-[#888888] mb-1.5 whitespace-nowrap">Description
                                    (Markdown)</label>
                                <textarea
                                    rows={4}
                                    value={builderDesc}
                                    onChange={(e) => setBuilderDesc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500/70"
                                />
                            </div>
                        </div>

                        {/* Generated Markdown Preview (Bottom Section) */}
                        <div
                            className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#0A0A0A] border border-[#262626]">
                            <div>
                                <div className="flex flex-col gap-3 pb-3 border-b border-[#262626]">
                                    <div
                                        className="flex items-center gap-2 text-xs font-mono font-semibold text-red-400 min-w-0">
                                        <FileCode className="w-4 h-4 shrink-0"/>
                                        <span className="truncate">
                                            /apps/{builderName ? builderName.toLowerCase().replace(/\s+/g, '-') : 'app'}.md
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopyGenerated}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-mono font-medium border border-red-500/50 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                                    >
                                        <Copy className="w-4 h-4"/>
                                        <span>Copy Output</span>
                                    </button>
                                </div>

                                <pre
                                    className="mt-3 text-[11px] font-mono text-[#CCCCCC] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                                    {generatedMarkdown}
                                </pre>
                            </div>

                            <div
                                className="mt-4 pt-3 border-t border-[#262626] text-[11px] font-mono text-[#888888] flex items-center justify-between">
                                <span>Target path: <code className="text-white">/apps/filename.md</code></span>
                                <span>100% Git native</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};