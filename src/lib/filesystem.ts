import { getMarkdownFiles } from './markdown-utils';

interface CodeFile {
    path: string;
    content: string;
}

// Initialize default files from markdown files
const defaultFiles: CodeFile[] = getMarkdownFiles();

class FileSystem {
    private files: CodeFile[] = [];

    constructor(initialFiles?: CodeFile[]) {
        if (initialFiles) {
            this.files = [...initialFiles];
        } else {
            this.files = [...defaultFiles];
        }
    }

    addFile(file: CodeFile) {
        this.files.push(file);
    }

    getFileByPath(path: string): CodeFile | undefined {
        return this.files.find(file => file.path === path);
    }

    getAllFiles(): CodeFile[] {
        return getMarkdownFiles();
    }

    updateFile(path: string, content: string): boolean {
        const index = this.files.findIndex(file => file.path === path);
        if (index !== -1) {
            this.files[index].content = content;
            return true;
        }
        return false;
    }

    deleteFile(path: string): boolean {
        const index = this.files.findIndex(file => file.path === path);
        if (index !== -1) {
            this.files.splice(index, 1);
            return true;
        }
        return false;
    }
}

export const createFileSystem = (initialFiles?: CodeFile[]) => {
    return new FileSystem(initialFiles);
};

export type { CodeFile };
