import React, {useState, useEffect, useRef} from 'react';
import {Navbar} from './components/Navbar';
import {Directory} from './components/Directory';
import {AppDetailModal} from './components/AppDetailModal';
import {SubmitView} from './components/SubmitView';
import {DeveloperListView} from './components/DeveloperListView';
import {DeveloperProfileView} from './components/DeveloperProfileView';
import {Footer} from './components/Footer';
import {Toast} from './components/Toast';
import {getAllApps, getAppBySlug} from './lib/apps';
import {getAllDevelopers, getDeveloperBySlug} from './lib/developers';
import {AppItem} from './types/app';
import {DeveloperItem} from './types/developer';

export default function App() {
    const [currentTab, setCurrentTab] = useState<'home' | 'apps' | 'dev' | 'submit'>('home');
    const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
    const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('weeknd_theme');
            if (saved === 'light' || saved === 'dark') return saved;
        }
        return 'light';
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
    const developers = getAllDevelopers();

    // Parse URL on load & popstate
    const syncStateFromUrl = () => {
        const path = window.location.pathname.replace(/\/$/, '');
        const hash = window.location.hash.replace(/^#/, '').replace(/\/$/, '');
        const params = new URLSearchParams(window.location.search);

        // 1. Check explicitly for /submit
        if (path === '/submit' || hash === '/submit' || hash === 'submit') {
            setSelectedDeveloper(null);
            setCurrentTab('submit');
            return;
        }

        // 2. Check explicitly for /dev (all developers list)
        if (path === '/dev' || hash === '/dev' || hash === 'dev' || params.get('dev') === 'all') {
            setSelectedDeveloper(null);
            setCurrentTab('dev');
            return;
        }

        // 3. Look for developer slug in path, hash, or params
        let devSlug: string | null = null;

        if (params.get('dev') && params.get('dev') !== 'all') {
            devSlug = params.get('dev');
        } else if (path.startsWith('/dev/')) {
            devSlug = path.replace('/dev/', '');
        } else if (hash.startsWith('/dev/')) {
            devSlug = hash.replace('/dev/', '');
        } else if (path.length > 1) {
            devSlug = path.substring(1);
        } else if (hash.length > 0 && hash !== '/') {
            devSlug = hash.replace(/^\//, '');
        }

        if (devSlug) {
            const cleanSlug = devSlug.trim().toLowerCase();
            const dev = getDeveloperBySlug(cleanSlug);
            if (dev) {
                setSelectedDeveloper(dev);
                setCurrentTab('dev');

                const appSlug = params.get('app');
                if (appSlug) {
                    const matchedApp = getAppBySlug(appSlug);
                    if (matchedApp) setSelectedApp(matchedApp);
                }
                return;
            }
        }

        // 4. Default: Apps / Home
        const appSlug = params.get('app');
        if (appSlug) {
            const matched = getAppBySlug(appSlug);
            if (matched) {
                setSelectedApp(matched);
            }
        }
    };

    useEffect(() => {
        syncStateFromUrl();

        const handlePopState = () => {
            syncStateFromUrl();
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
        if (selectedDeveloper) {
            window.history.pushState({}, '', `/${selectedDeveloper.slug}`);
        } else if (currentTab === 'dev') {
            window.history.pushState({}, '', '/dev');
        } else {
            window.history.pushState({}, '', window.location.pathname);
        }
    };

    const handleSelectDeveloper = (dev: DeveloperItem) => {
        setSelectedDeveloper(dev);
        setCurrentTab('dev');
        window.history.pushState({dev: dev.slug}, '', `/${dev.slug}`);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSelectDeveloperBySlug = (slug: string) => {
        const dev = getDeveloperBySlug(slug);
        setSelectedApp(null);
        if (dev) {
            handleSelectDeveloper(dev);
        } else {
            setToastMessage(`Developer profile "${slug}" not found.`);
        }
    };

    const handleNavigateTab = (tab: 'home' | 'apps' | 'dev' | 'submit') => {
        setCurrentTab(tab);
        if (tab === 'dev') {
            setSelectedDeveloper(null);
            window.history.pushState({}, '', '/dev');
        } else if (tab === 'home' || tab === 'apps') {
            setSelectedDeveloper(null);
            window.history.pushState({}, '', '/');
        } else if (tab === 'submit') {
            setSelectedDeveloper(null);
            window.history.pushState({}, '', '/submit');
        }
        window.scrollTo({top: 0, behavior: 'smooth'});
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
        setSelectedDeveloper(null);
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
                onNavigate={handleNavigateTab}
                currentTab={currentTab}
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

                {currentTab === 'dev' && (
                    selectedDeveloper ? (
                        <DeveloperProfileView
                            developer={selectedDeveloper}
                            apps={apps}
                            onBack={() => {
                                setSelectedDeveloper(null);
                                window.history.pushState({}, '', '/dev');
                            }}
                            onSelectApp={handleSelectApp}
                            onVisitApp={handleVisitApp}
                            onShowToast={(msg) => setToastMessage(msg)}
                        />
                    ) : (
                        <DeveloperListView
                            developers={developers}
                            apps={apps}
                            onSelectDeveloper={handleSelectDeveloper}
                        />
                    )
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
                onSelectDeveloperBySlug={handleSelectDeveloperBySlug}
            />

            {/* Notification Toast */}
            <Toast
                message={toastMessage}
                onClose={() => setToastMessage(null)}
            />

            {/* Footer */}
            <Footer onNavigate={handleNavigateTab}/>

        </div>
    );
}