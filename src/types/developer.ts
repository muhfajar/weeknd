export interface DeveloperFrontmatter {
    name: string;
    bio?: string;
    website?: string;
    avatar?: string;
    twitter?: string;
    instagram?: string;
    threads?: string;
    mastodon?: string;
    nostr?: string;
    bluesky?: string;
    linkedin?: string;
    github?: string;
}

export interface DeveloperItem extends DeveloperFrontmatter {
    slug: string;
    content: string;
    rawContent?: string;
}
