import React from 'react';
import {Terminal, Heart} from 'lucide-react';

interface FooterProps {
    onNavigate?: (tab: 'home' | 'apps' | 'dev' | 'submit') => void;
}

export const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="w-full border-t border-[#262626] bg-[#0A0A0A] py-10 mt-5">
            <div className="w-full lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Brand Info */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-mono text-xs text-zinc-400 font-medium">
                        Collective, Collaborative.
                    </p>
                </div>

                {/* Bottom Credits */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#666666]">
                    <p>© {new Date().getFullYear()} weeknd.dev. Open source under <a
                        href="https://github.com/muhfajar/weeknd/blob/master/LICENSE.md" target="_blank">MIT License</a>.
                    </p>
                    <p className="text-center sm:text-right leading-relaxed">
                        Built with <Heart
                        className="inline-block w-3 h-3 text-red-500 fill-red-500 align-[-1px] mx-0.5"/> by fellow
                        developers crafting software on [mostly] weekends.
                    </p>
                </div>

            </div>
        </footer>
    );
};