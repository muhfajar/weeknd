import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

const VALID_PLATFORMS = ['all', 'web', 'ios', 'android', 'macos', 'windows', 'linux'];
const VALID_CATEGORIES = [
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

const APP_REQUIRED_FIELDS = ['name', 'tagline', 'developer', 'website', 'platform', 'category', 'icon'];
const DEV_REQUIRED_FIELDS = ['name', 'bio'];

/**
 * Parse frontmatter from raw markdown
 */
function parseFrontmatter(raw) {
    const match = raw.trim().match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    try {
        return load(match[1]) || {};
    } catch {
        return null;
    }
}

/**
 * Validate a single markdown file
 * @returns {string[]} array of error messages (empty = valid)
 */
function validate(filePath, raw) {
    const errors = [];
    const fm = parseFrontmatter(raw);

    if (!fm) {
        errors.push('Missing or invalid YAML frontmatter');
        return errors;
    }

    const isApp = filePath.startsWith('apps/');
    const isDev = filePath.startsWith('dev/');
    const isSpecial = /[/\\]_[^/\\]+\.md$/.test(filePath); // skip _featured.md etc.
    if (isSpecial) return [];
    const requiredFields = isApp ? APP_REQUIRED_FIELDS : DEV_REQUIRED_FIELDS;

    // Required fields check
    for (const field of requiredFields) {
        const val = fm[field];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    if (isApp) {
        // Platform validation
        if (fm.platform) {
            const platform = String(fm.platform).trim().toLowerCase();
            if (!VALID_PLATFORMS.includes(platform)) {
                errors.push(
                    `Invalid platform: "${fm.platform}". Must be one of: ${VALID_PLATFORMS.join(', ')}`
                );
            }
        }

        // Category validation
        if (fm.category) {
            const category = String(fm.category).trim();
            if (!VALID_CATEGORIES.includes(category)) {
                errors.push(
                    `Invalid category: "${fm.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
                );
            }
        }

        // created_at validation — must not be older than today
        const dateStr = fm.created_at || fm.date_added || fm.date;
        if (dateStr) {
            const raw = String(dateStr).trim();
            const dateVal = new Date(raw);
            if (isNaN(dateVal.getTime())) {
                errors.push(`Invalid date format: "${dateStr}" (expected YYYY-MM-DD)`);
            } else {
                // Normalize both to YYYY-MM-DD strings for comparison (avoid timezone drift)
                const todayStr = new Date().toISOString().split('T')[0];
                const dateStrNorm = dateVal.toISOString().split('T')[0];
                if (dateStrNorm < todayStr) {
                    errors.push(
                        `created_at "${dateStr}" is in the past. Date must not be older than today (${todayStr})`
                    );
                }
            }
        }
    }

    return errors;
}

// --- Main ---
const files = process.argv.slice(2);
if (files.length === 0) {
    process.exit(0);
}

let hasErrors = false;

for (const file of files) {
    let raw;
    try {
        raw = readFileSync(file, 'utf-8');
    } catch {
        continue; // file might have been deleted during staging
    }

    const errors = validate(file, raw);
    if (errors.length > 0) {
        hasErrors = true;
        console.error(`\n❌ ${file}`);
        for (const err of errors) {
            console.error(`   - ${err}`);
        }
    }
}

if (hasErrors) {
    console.error('\nValidation failed. Fix the errors above and try again.');
    process.exit(1);
}
