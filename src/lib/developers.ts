import {load} from 'js-yaml';
import {DeveloperFrontmatter, DeveloperItem} from '../types/developer';

// Eagerly import all .md files in the /dev directory
const devMarkdownFiles = import.meta.glob('/dev/*.md', {query: '?raw', eager: true});

export function parseDeveloperMarkdown(rawMarkdown: string): { frontmatter: DeveloperFrontmatter; content: string } {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
    const match = rawMarkdown.trim().match(frontmatterRegex);

    if (!match) {
        return {
            frontmatter: {
                name: 'Unknown Developer',
            },
            content: rawMarkdown,
        };
    }

    const yamlBlock = match[1];
    const bodyContent = match[2];

    let parsedYaml: Partial<DeveloperFrontmatter> = {};
    try {
        parsedYaml = (load(yamlBlock) as Partial<DeveloperFrontmatter>) || {};
    } catch (err) {
        console.error('Failed to parse developer YAML frontmatter:', err);
    }

    const frontmatter: DeveloperFrontmatter = {
        name: parsedYaml.name || 'Anonymous Developer',
        bio: parsedYaml.bio || '',
        website: parsedYaml.website || '',
        avatar: parsedYaml.avatar || '',
        twitter: parsedYaml.twitter || undefined,
        instagram: parsedYaml.instagram || undefined,
        threads: parsedYaml.threads || undefined,
        mastodon: parsedYaml.mastodon || undefined,
        nostr: parsedYaml.nostr || undefined,
        bluesky: parsedYaml.bluesky || undefined,
        linkedin: parsedYaml.linkedin || undefined,
        github: parsedYaml.github || undefined,
    };

    return {
        frontmatter,
        content: bodyContent.trim(),
    };
}

export function getAllDevelopers(): DeveloperItem[] {
    const developers: DeveloperItem[] = [];

    for (const filepath in devMarkdownFiles) {
        const slug = filepath.replace(/^\/dev\//, '').replace(/\.md$/, '');
        const rawModule = devMarkdownFiles[filepath];
        const rawMarkdown = typeof rawModule === 'string'
            ? rawModule
            : (rawModule as { default: string }).default || '';

        const {frontmatter, content} = parseDeveloperMarkdown(rawMarkdown);

        developers.push({
            slug,
            ...frontmatter,
            content,
            rawContent: rawMarkdown,
        });
    }

    return developers;
}

export function getDeveloperBySlug(slug: string): DeveloperItem | undefined {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().replace(/^\/dev\//, '').replace(/^dev\//, '').replace(/\.md$/, '');
    const developers = getAllDevelopers();
    return developers.find((d) => d.slug.toLowerCase() === cleanSlug);
}
