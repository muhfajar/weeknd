import {AppItem, CategoryType, PlatformType, SortOption} from '../types/app';
import {parseMarkdown} from './markdown';

// Eagerly import all .md files in the /apps directory
const markdownFiles = import.meta.glob('/apps/*.md', {query: '?raw', eager: true});

export function getFeaturedSlugs(): Set<string> {
    const featuredFile = markdownFiles['/apps/_featured.md'];
    if (!featuredFile) return new Set();

    const rawMarkdown = typeof featuredFile === 'string'
        ? featuredFile
        : (featuredFile as { default: string }).default || '';

    const {frontmatter, content} = parseMarkdown(rawMarkdown);
    const set = new Set<string>();

    // 1. Check frontmatter featured_slugs array if available
    if (Array.isArray(frontmatter.featured_slugs)) {
        frontmatter.featured_slugs.forEach((item: unknown) => {
            if (typeof item === 'string') set.add(item.trim().toLowerCase());
        });
    }

    // 2. Check markdown list items (- slug or * slug or markdown link)
    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        // Match bullet lists: "- ooo-club", "* ooo-club", "1. ooo-club", or "- [OOO Club](ooo-club)"
        const match = trimmed.match(/^(?:[-*]|\d+\.)\s+(?:\[.*?\]\((.*?)\)|`?([a-zA-Z0-9_-]+)`?)/);
        if (match) {
            const rawSlug = match[1] || match[2];
            if (rawSlug) {
                set.add(rawSlug.trim().toLowerCase());
            }
        }
    }

    return set;
}

export function getAllApps(): AppItem[] {
    const apps: AppItem[] = [];
    const featuredSlugs = getFeaturedSlugs();

    for (const filepath in markdownFiles) {
        // Extract slug from path like "/apps/ooo-club.md" -> "ooo-club"
        const slug = filepath.replace(/^\/apps\//, '').replace(/\.md$/, '');

        // Skip _featured.md meta file from app list
        if (slug.toLowerCase() === '_featured') {
            continue;
        }

        const rawModule = markdownFiles[filepath];
        const rawMarkdown = typeof rawModule === 'string'
            ? rawModule
            : (rawModule as { default: string }).default || '';

        const {frontmatter, content} = parseMarkdown(rawMarkdown);
        const isFeatured = featuredSlugs.has(slug.toLowerCase());

        const dateAdded = frontmatter.created_at || frontmatter.date_added || frontmatter.date;

        apps.push({
            slug,
            ...frontmatter,
            featured: isFeatured,
            content,
            rawContent: rawMarkdown,
            dateAdded,
        });
    }

    return apps;
}

export function getAppBySlug(slug: string): AppItem | undefined {
    const apps = getAllApps();
    return apps.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
}

function getAppTime(app: AppItem): number {
    const rawDate = app.dateAdded || app.created_at || app.date_added || app.date;
    if (!rawDate) return 0;
    const t = new Date(rawDate).getTime();
    return isNaN(t) ? 0 : t;
}

export function filterAndSortApps(
    apps: AppItem[],
    options: {
        searchQuery?: string;
        platform?: PlatformType | string;
        category?: CategoryType | string;
        sortBy?: SortOption;
        featuredOnly?: boolean;
    }
): AppItem[] {
    const {searchQuery = '', platform = 'all', category = 'All', sortBy = 'newest', featuredOnly = false} = options;

    let result = [...apps];

    if (featuredOnly) {
        result = result.filter((a) => a.featured);
    }

    // Search filter
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.developer.toLowerCase().includes(q) ||
                a.tagline.toLowerCase().includes(q) ||
                a.category.toLowerCase().includes(q) ||
                a.platform.toLowerCase().includes(q)
        );
    }

    // Platform filter
    if (platform && platform !== 'all') {
        const p = platform.toLowerCase();
        result = result.filter((a) => {
            const appPlat = a.platform.toLowerCase();
            if (p === 'macos' || p === 'mac') {
                return appPlat === 'macos' || appPlat === 'mac' || appPlat.includes('mac') || appPlat.includes('desktop');
            }
            if (p === 'windows') {
                return appPlat === 'windows' || appPlat.includes('win') || appPlat.includes('desktop');
            }
            if (p === 'linux') {
                return appPlat === 'linux' || appPlat.includes('linux') || appPlat.includes('desktop');
            }
            if (p === 'ios') {
                return appPlat.includes('ios') || appPlat.includes('mobile') || !!a.ios;
            }
            if (p === 'android') {
                return appPlat.includes('android') || appPlat.includes('mobile') || !!a.android;
            }
            if (p === 'web') {
                return appPlat.includes('web') || appPlat === '' || appPlat === 'all';
            }
            return appPlat.includes(p);
        });
    }

    // Category filter
    if (category && category !== 'All') {
        result = result.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    // Sorting
    if (sortBy === 'a-z') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'oldest') {
        result.sort((a, b) => {
            const timeA = getAppTime(a);
            const timeB = getAppTime(b);
            if (timeA !== timeB) {
                return timeA - timeB;
            }
            return a.name.localeCompare(b.name);
        });
    } else if (sortBy === 'featured') {
        result.sort((a, b) => {
            if (a.featured !== b.featured) {
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            }
            const timeDiff = getAppTime(b) - getAppTime(a);
            if (timeDiff !== 0) {
                return timeDiff;
            }
            return a.name.localeCompare(b.name);
        });
    } else {
        // Default newest first (sorted by file metadata created time in /apps/*.md)
        result.sort((a, b) => {
            const timeA = getAppTime(a);
            const timeB = getAppTime(b);
            if (timeA !== timeB) {
                return timeB - timeA;
            }
            return a.name.localeCompare(b.name);
        });
    }

    return result;
}

export const CATEGORIES: CategoryType[] = [
    'All',
    'AI',
    'Productivity',
    'Travel',
    'Developer Tools',
    'Design',
    'Finance',
    'Health',
    'Social',
    'Entertainment',
    'Education',
    'Utilities',
];

export const PLATFORMS: { id: PlatformType; label: string }[] = [
    {id: 'all', label: 'All'},
    {id: 'web', label: 'Web'},
    {id: 'ios', label: 'iOS'},
    {id: 'android', label: 'Android'},
    {id: 'macos', label: 'macOS'},
    {id: 'windows', label: 'Windows'},
    {id: 'linux', label: 'Linux'},
];