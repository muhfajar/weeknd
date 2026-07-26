import React, {useState, useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
import {Directory} from './components/Directory';
import {AppDetailModal} from './components/AppDetailModal';
import {SubmitView} from './components/SubmitView';
import {Footer} from './components/Footer';
import {Toast} from './components/Toast';
import {getAllApps, getAppBySlug} from './lib/apps';
import {AppItem} from './types/app';

export default function App() {
    const [currentTab, setCurrentTab] = useState<'home' | 'apps' | 'submit'>('home');
    const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('weeknd_theme');
            if (saved === 'light' || saved === 'dark') return saved;
        }
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        localStorage.setItem('weeknd_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const searchInputRef = useRef<HTMLInputElement>(null);
    const apps = getAllApps();

    // Handle URL deep-linking like ?app=ooo-club
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const appSlug = params.get('app');
        if (appSlug) {
            const matched = getAppBySlug(appSlug);
            if (matched) {
                setSelectedApp(matched);
            }
        }

        const handlePopState = () => {
            const p = new URLSearchParams(window.location.search);
            const slug = p.get('app');
            if (slug) {
                const matched = getAppBySlug(slug);
                setSelectedApp(matched || null);
            } else {
                setSelectedApp(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSelectApp = (app: AppItem) => {
        setSelectedApp(app);
        const newUrl = `${window.location.pathname}?app=${app.slug}`;
        window.history.pushState({app: app.slug}, '', newUrl);
    };

    const handleCloseModal = () => {
        setSelectedApp(null);
        const cleanUrl = window.location.pathname;
        window.history.pushState({}, '', cleanUrl);
    };

    const handleVisitApp = (app: AppItem) => {
        if (app.website && app.website !== '#') {
            window.open(app.website, '_blank', 'noopener,noreferrer');
        } else {
            handleSelectApp(app);
        }
    };

    const handleFocusSearch = () => {
        setCurrentTab('home');
        setTimeout(() => {
            searchInputRef.current?.focus();
            const el = document.getElementById('directory-section');
            if (el) {
                el.scrollIntoView({behavior: 'smooth'});
            }
        }, 100);
    };

    return (
        <div
            className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-zinc-950 text-zinc-100 font-mono selection:bg-red-500/20 selection:text-red-300">

            {/* Sticky Navigation */}
            <Navbar
                onNavigate={(tab) => {
                    setCurrentTab(tab);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                onFocusSearch={handleFocusSearch}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            {/* Main View Area */}
            <main className="flex-1">
                {(currentTab === 'home' || currentTab === 'apps') && (
                    <Directory
                        apps={apps}
                        onSelectApp={handleSelectApp}
                        onVisitApp={handleVisitApp}
                        searchRef={searchInputRef}
                    />
                )}

                {currentTab === 'submit' && (
                    <SubmitView onShowToast={(msg) => setToastMessage(msg)}/>
                )}
            </main>

            {/* Detail Modal */}
            <AppDetailModal
                app={selectedApp}
                onClose={handleCloseModal}
                onShowToast={(msg) => setToastMessage(msg)}
            />

            {/* Notification Toast */}
            <Toast
                message={toastMessage}
                onClose={() => setToastMessage(null)}
            />

            {/* Footer */}
            <Footer onNavigate={setCurrentTab}/>

        </div>
    );
}