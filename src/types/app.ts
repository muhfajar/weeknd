export type PlatformType = 'all' | 'web' | 'ios' | 'android' | 'macos' | 'windows' | 'linux';

export type CategoryType =
    | 'All'
    | 'AI'
    | 'Productivity'
    | 'Travel'
    | 'Developer Tools'
    | 'Design'
    | 'Video Editing'
    | 'Finance'
    | 'Health'
    | 'Social'
    | 'Entertainment'
    | 'Education'
    | 'Utilities';

export interface AppFrontmatter {
    name: string;
    tagline: string;
    developer: string;
    developer_url?: string;
    developerUrl?: string;
    linked_profile?: string;
    website: string;
    platform: string;
    category: string;
    featured?: boolean;
    featured_slugs?: string[];
    icon?: string;
    screenshots?: string[];
    ios?: string;
    android?: string;
    created_at?: string;
    date_added?: string;
    date?: string;
}

export interface AppItem extends AppFrontmatter {
    slug: string;
    content: string;
    rawContent: string;
    dateAdded?: string;
}

export type SortOption = 'newest' | 'oldest' | 'featured' | 'a-z' | 'z-a';
