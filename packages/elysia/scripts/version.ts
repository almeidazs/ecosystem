import { readFile, writeFile } from 'node:fs/promises';

const OUTPUT_FILE = new URL('../src/version.ts', import.meta.url);
const PACKAGE_JSON_FILE = new URL('../package.json', import.meta.url);

const { name, version } = JSON.parse(await readFile(PACKAGE_JSON_FILE, 'utf8'));

await writeFile(
    OUTPUT_FILE,
    `// AUTO-GENERATED — DO NOT EDIT

/**
 * Current version of [${name}](https://www.npmjs.com/package/${name}).
 */
export const version = '${version}' as const;
`,
    'utf8',
);
