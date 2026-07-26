export type PlatformType = 'all' | 'web' | 'mobile' | 'ios' | 'android';

export type CategoryType =
    | 'All'
    | 'AI'
    | 'Productivity'
    | 'Developer Tools'
    | 'Travel'
    | 'Finance'
    | 'Lifestyle'
    | 'Education'
    | 'Utilities'
    | 'Entertainment'
    | 'Social';

export interface AppFrontmatter {
    name: string;
    tagline: string;
    developer: string;
    developerUrl?: string;
    website: string;
    platform: string;
    category: string;
    featured?: boolean;
    featured_slugs?: string[];
    icon?: string;
    screenshots?: string[];
    ios?: string;
    android?: string;
    creator_link?: string;
    twitter?: string;
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
