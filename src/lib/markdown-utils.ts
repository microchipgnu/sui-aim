import fs from 'fs';
import path from 'path';

// Recursive function to read markdown files
export const readMarkdownFilesRecursively = (dir: string, baseDir: string): any[] => {
    const files: any[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
            files.push(...readMarkdownFilesRecursively(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push({
                path: relativePath,
                content: fs.readFileSync(fullPath, 'utf8')
            });
        }
    }

    return files;
};

export const getMarkdownFiles = () => {
    const filesDirectory = path.join(process.cwd(), 'src', 'lib', 'files');
    return readMarkdownFilesRecursively(filesDirectory, filesDirectory);
}; 