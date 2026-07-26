import React, {useState} from 'react';
import {Terminal, Plus, Github, Search, Menu, X, Sun, Moon} from 'lucide-react';

interface NavbarProps {
    onNavigate: (tab: 'home' | 'apps' | 'submit') => void;
    onFocusSearch?: () => void;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
                                                  onNavigate,
                                                  onFocusSearch,
                                                  theme = 'dark',
                                                  onToggleTheme,
                                              }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (tab: 'home' | 'apps' | 'submit') => {
        onNavigate(tab);
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Brand Logo & Tagline */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleNavClick('home')}
                            className="group flex items-center gap-2.5 text-left focus:outline-none"
                        >
                            <div
                                className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center text-zinc-100 group-hover:border-red-500/50 group-hover:text-red-400 transition-all duration-200">
                                <Terminal className="w-4 h-4"/>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <span
                    className="font-semibold tracking-tight text-white text-base font-mono group-hover:text-red-400 transition-colors">
                  weeknd<span className="text-red-500">.dev</span><span
                    className="animate-caret ml-0.5 select-none">_</span>
                </span>
                            </div>
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden sm:flex items-center gap-3">
                        {onFocusSearch && (
                            <button
                                onClick={onFocusSearch}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#888888] bg-[#141414] border border-[#262626] rounded-lg hover:border-[#333333] hover:text-white transition-all"
                                title="Search apps (Press /)"
                            >
                                <Search className="w-3.5 h-3.5"/>
                                <span>Quick Search</span>
                                <kbd
                                    className="px-1.5 py-0.5 text-[10px] bg-[#222222] text-[#888888] rounded border border-[#333333] font-mono">
                                    /
                                </kbd>
                            </button>
                        )}

                        <button
                            onClick={() => handleNavClick('submit')}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold text-white bg-red-500 hover:bg-red-400 rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]"/>
                            <span>Submit App</span>
                        </button>

                        <a
                            href="https://github.com/muhfajar/weeknd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#888888] hover:text-white bg-[#141414] border border-[#262626] rounded-lg hover:border-[#333333] transition-all"
                            aria-label="GitHub Repository"
                        >
                            <Github className="w-4 h-4"/>
                        </a>

                        {/* Theme Toggle Button */}
                        {onToggleTheme && (
                            <button
                                onClick={onToggleTheme}
                                className="p-2 text-[#888888] hover:text-white bg-[#141414] border border-[#262626] rounded-lg hover:border-[#333333] transition-all flex items-center justify-center"
                                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4 text-amber-400"/>
                                ) : (
                                    <Moon className="w-4 h-4 text-zinc-700"/>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="flex sm:hidden items-center gap-2">
                        <button
                            onClick={() => handleNavClick('submit')}
                            className="px-3 py-2 text-xs font-mono font-medium text-white bg-red-500 rounded-lg"
                        >
                            Submit
                        </button>

                        {onToggleTheme && (
                            <button
                                onClick={onToggleTheme}
                                className="p-2 text-[#888888] hover:text-white bg-[#141414] border border-[#262626] rounded-lg hover:border-[#333333] transition-all flex items-center justify-center"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4 text-amber-400"/>
                                ) : (
                                    <Moon className="w-4 h-4 text-zinc-700"/>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-[#888888] hover:text-white bg-[#141414] border border-[#262626] rounded-lg hover:border-[#333333] transition-all flex items-center justify-center"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-3 pb-5 space-y-2">

                    {onToggleTheme && (
                        <button
                            onClick={() => {
                                onToggleTheme();
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-mono flex items-center justify-between text-zinc-300 hover:bg-zinc-900"
                        >
                            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400"/>
                            ) : (
                                <Moon className="w-4 h-4 text-zinc-600"/>
                            )}
                        </button>
                    )}

                    <button
                        onClick={() => handleNavClick('submit')}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-mono flex items-center justify-between text-zinc-300 hover:bg-zinc-900"
                    >
                        <span>Github</span>
                        <Github className="w-4 h-4 text-zinc-400"/>
                    </button>

                </div>
            )}
        </header>
    );
};