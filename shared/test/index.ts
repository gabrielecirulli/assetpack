import { copyFileSync, ensureDirSync, ensureFileSync } from 'fs-extra';
import path from 'path';
import { getRoot } from './find';

export interface Folder
{
    name: string;
    files: File[];
    folders: Folder[];
}

export interface File
{
    name: string;
    content: string;
}

export function getOutputDir(pkg: string, test: string)
{
    return path.join(path.join(getRoot(), `packages/${pkg}`), '.testOutput', test);
}

export function getInputDir(pkg: string, test: string)
{
    return path.join(path.join(getRoot(), `packages/${pkg}`), '.testInput', test);
}

export function createFolder(pkg: string, folder: Folder, base?: string)
{
    base = base || getInputDir(pkg, '');
    const baseFolder = path.join(base, folder.name);

    ensureDirSync(baseFolder);

    folder.files.forEach((file) =>
    {
        const filePath = path.join(baseFolder, file.name);

        ensureFileSync(filePath);
        copyFileSync(file.content, filePath);
    });
    folder.folders.forEach((folder) =>
    {
        createFolder(pkg, folder, baseFolder);
    });
}

export function assetPath(pkg: string, pth: string): string
{
    return path.join(path.join(getRoot(), `packages/${pkg}`), 'test/resources', pth);
}