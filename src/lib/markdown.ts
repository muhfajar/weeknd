import {load, dump} from 'js-yaml';
import {AppFrontmatter} from '../types/app';

export interface ParsedMarkdown {
    frontmatter: AppFrontmatter;
    content: string;
}

export function parseMarkdown(rawMarkdown: string): ParsedMarkdown {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
    const match = rawMarkdown.trim().match(frontmatterRegex);

    if (!match) {
        return {
            frontmatter: {
                name: 'Untitled App',
                tagline: '',
                developer: 'Unknown',
                website: '#',
                platform: 'web',
                category: 'Utilities',
            },
            content: rawMarkdown,
        };
    }

    const yamlBlock = match[1];
    const bodyContent = match[2];

    let parsedYaml: Partial<AppFrontmatter> = {};
    try {
        parsedYaml = (load(yamlBlock) as Partial<AppFrontmatter>) || {};
    } catch (err) {
        console.error('Failed to parse YAML frontmatter:', err);
    }

    const creatorLinkVal =
        parsedYaml.creator_link ||
        (parsedYaml as Record<string, any>).developer_url ||
        parsedYaml.developerUrl ||
        (parsedYaml as Record<string, any>).developer_link ||
        parsedYaml.twitter ||
        (parsedYaml as Record<string, any>).github ||
        undefined;

    const frontmatter: AppFrontmatter = {
        name: parsedYaml.name || 'Untitled App',
        tagline: parsedYaml.tagline || '',
        developer: parsedYaml.developer || 'Anonymous',
        creator_link: creatorLinkVal,
        developerUrl: creatorLinkVal,
        website: parsedYaml.website || '#',
        platform: parsedYaml.platform || 'web',
        category: parsedYaml.category || 'Utilities',
        featured_slugs: Array.isArray((parsedYaml as Record<string, any>).featured_slugs)
            ? (parsedYaml as Record<string, any>).featured_slugs
            : undefined,
        icon: parsedYaml.icon || '',
        screenshots: Array.isArray(parsedYaml.screenshots) ? parsedYaml.screenshots : [],
        ios: parsedYaml.ios || undefined,
        android: parsedYaml.android || undefined,
        twitter: parsedYaml.twitter || undefined,
        created_at: (parsedYaml as Record<string, any>).created_at
            ? String((parsedYaml as Record<string, any>).created_at)
            : (parsedYaml as Record<string, any>).date_added
                ? String((parsedYaml as Record<string, any>).date_added)
                : parsedYaml.date
                    ? String(parsedYaml.date)
                    : undefined,
        date_added: (parsedYaml as Record<string, any>).date_added
            ? String((parsedYaml as Record<string, any>).date_added)
            : undefined,
        date: parsedYaml.date ? String(parsedYaml.date) : undefined,
    };

    return {
        frontmatter,
        content: bodyContent.trim(),
    };
}

export function generateMarkdownString(
    data: Partial<AppFrontmatter> & { description: string }
): string {
    const frontmatterObj = {
        name: data.name || '',
        tagline: data.tagline || '',
        developer: data.developer || '',
        creator_link: data.creator_link || data.developerUrl || (data as Record<string, any>).developer_url || '',
        website: data.website || '',
        platform: (data.platform || 'web').toLowerCase(),
        category: data.category || 'Utilities',
        created_at: data.created_at || new Date().toISOString().split('T')[0],
        icon: data.icon || '',
        screenshots: data.screenshots || [],
        ios: data.ios || '',
        android: data.android || '',
    };

    const yamlStr = dump(frontmatterObj);
    return `---\n${yamlStr}---\n\n${data.description || ''}\n`;
}