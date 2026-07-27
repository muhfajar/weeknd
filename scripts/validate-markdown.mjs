import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
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

// --- Diff helpers ---

/**
 * Check if a file is newly added (no previous version in HEAD).
 */
function isNewFile(filePath) {
    try {
        execSync(`git rev-parse HEAD:"${filePath}" 2>/dev/null`, { stdio: 'pipe' });
        return false;
    } catch {
        return true;
    }
}

/**
 * Get the frontmatter line range from the raw file content.
 * Returns [startLine, endLine] (1-indexed, inclusive) or null.
 */
function getFrontmatterRange(raw) {
    const lines = raw.split('\n');
    if (lines[0]?.trim() !== '---') return null;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') return [1, i + 1]; // 1-indexed
    }
    return null;
}

/**
 * Get the set of frontmatter keys that were changed in the staged diff.
 * Uses hunk line numbers to determine if a changed line falls within frontmatter.
 * Returns null for new files (validate everything).
 * Returns empty set if no frontmatter keys changed (validate nothing).
 */
function getChangedFrontmatterKeys(filePath) {
    if (isNewFile(filePath)) return null;

    let diff;
    try {
        diff = execSync(`git diff --cached -U0 -- "${filePath}"`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        });
    } catch {
        return null;
    }

    if (!diff) return new Set(); // no changes → validate nothing

    // Determine frontmatter range from the actual file
    let raw;
    try {
        raw = readFileSync(filePath, 'utf-8');
    } catch {
        return null;
    }
    const range = getFrontmatterRange(raw);
    if (!range) return null;
    const [fmStart, fmEnd] = range; // 1-indexed

    const keys = new Set();
    let lastKey = null;
    let newLineNum = 0; // current line number in the new (staged) file

    for (const line of diff.split('\n')) {
        // Parse hunk header: @@ -oldStart,oldCount +newStart,newCount @@
        const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
        if (hunkMatch) {
            newLineNum = parseInt(hunkMatch[1], 10);
            lastKey = null;
            continue;
        }

        if (line.startsWith('+')) {
            // Added line — check if it's in the frontmatter range
            if (newLineNum >= fmStart && newLineNum <= fmEnd) {
                const content = line.slice(1);
                const keyMatch = content.match(/^(\w[\w_]*?)\s*:/);
                if (keyMatch) {
                    lastKey = keyMatch[1];
                    keys.add(keyMatch[1]);
                } else if (/^\s+-\s/.test(content) && lastKey) {
                    keys.add(lastKey);
                } else {
                    lastKey = null;
                }
            }
            newLineNum++;
        } else if (line.startsWith('-')) {
            // Deleted line — doesn't advance new line number
            // but still tracks the key for array items
            if (newLineNum >= fmStart && newLineNum <= fmEnd) {
                const content = line.slice(1);
                const keyMatch = content.match(/^(\w[\w_]*?)\s*:/);
                if (keyMatch) {
                    lastKey = keyMatch[1];
                    keys.add(keyMatch[1]);
                } else if (/^\s+-\s/.test(content) && lastKey) {
                    keys.add(lastKey);
                } else {
                    lastKey = null;
                }
            }
        } else {
            // Context line — advance line number
            newLineNum++;
            lastKey = null;
        }
    }

    return keys;
}

// --- Frontmatter ---

function parseFrontmatter(raw) {
    const match = raw.trim().match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    try {
        return load(match[1]) || {};
    } catch {
        return null;
    }
}

// --- Validation ---

/**
 * Validate a single markdown file.
 * @param {string} filePath
 * @param {string} raw - raw file content
 * @param {Set<string>|null} changedKeys - keys changed in diff, null = validate all
 * @returns {string[]} error messages (empty = valid)
 */
function validate(filePath, raw, changedKeys) {
    const errors = [];
    const fm = parseFrontmatter(raw);

    if (!fm) {
        errors.push('Missing or invalid YAML frontmatter');
        return errors;
    }

    const isApp = filePath.startsWith('apps/');
    const isDev = filePath.startsWith('dev/');
    const isSpecial = /[/\\]_[^/\\]+\.md$/.test(filePath);
    if (isSpecial) return [];

    const requiredFields = isApp ? APP_REQUIRED_FIELDS : DEV_REQUIRED_FIELDS;
    const shouldValidate = (field) => changedKeys === null || changedKeys.has(field);

    // Required fields check — only for changed fields (or all if new file)
    for (const field of requiredFields) {
        if (!shouldValidate(field)) continue;
        const val = fm[field];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    if (isApp) {
        // Platform validation
        if (shouldValidate('platform') && fm.platform) {
            const platform = String(fm.platform).trim().toLowerCase();
            if (!VALID_PLATFORMS.includes(platform)) {
                errors.push(
                    `Invalid platform: "${fm.platform}". Must be one of: ${VALID_PLATFORMS.join(', ')}`
                );
            }
        }

        // Category validation
        if (shouldValidate('category') && fm.category) {
            const category = String(fm.category).trim();
            if (!VALID_CATEGORIES.includes(category)) {
                errors.push(
                    `Invalid category: "${fm.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
                );
            }
        }

        // created_at validation — only if a date-related key was changed
        const dateKeyChanged =
            shouldValidate('created_at') || shouldValidate('date_added') || shouldValidate('date');
        const dateStr = fm.created_at || fm.date_added || fm.date;
        if (dateKeyChanged && dateStr) {
            const raw = String(dateStr).trim();
            const dateVal = new Date(raw);
            if (isNaN(dateVal.getTime())) {
                errors.push(`Invalid date format: "${dateStr}" (expected YYYY-MM-DD)`);
            } else {
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
if (files.length === 0) process.exit(0);

let hasErrors = false;

for (const file of files) {
    let raw;
    try {
        raw = readFileSync(file, 'utf-8');
    } catch {
        continue;
    }

    const changedKeys = getChangedFrontmatterKeys(file);
    const errors = validate(file, raw, changedKeys);

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
