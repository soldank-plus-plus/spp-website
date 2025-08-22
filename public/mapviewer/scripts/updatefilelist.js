/*
This script updates filelist in data folder
It watches for changes in climb and ctf folders and updates filelist accordingly.

To launch this script you have to be in public/mapviewer folder then
node scripts/updatefilelist.js to update filelist.
 */

const fs = require('fs');
const path = require('path');

const folders = [
    { base: path.join(__dirname, '..', 'data', 'climb'), prefix: 'climb' }, // changed from 'kz' to 'climb'
    { base: path.join(__dirname, '..', 'data', 'gather'), prefix: 'ctf' }
];

const filelistPath = path.join(__dirname, '..', 'data', 'filelist');
let previousList = [];

if (fs.existsSync(filelistPath)) {
    previousList = fs.readFileSync(filelistPath, 'utf-8')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
}

function getFiles(dir, prefix = '') {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => fs.statSync(path.join(dir, f)).isFile())
        .map(f => `${prefix}${f}`);
}

function updateFilelist() {
    let newList = [];

    folders.forEach(({ base, prefix }) => {
        const subfolders = [
            { path: 'maps/', prefix: `${prefix}/maps/` },
            { path: 'scenery-gfx/', prefix: `${prefix}/scenery-gfx/` },
            { path: 'textures/', prefix: `${prefix}/textures/` },
            { path: 'textures/edges/', prefix: `${prefix}/textures/edges/` }
        ];

        subfolders.forEach(sub => {
            const fullPath = path.join(base, sub.path);
            newList.push(...getFiles(fullPath, sub.prefix));
        });
    });

    // Write only if changed
    if (newList.join('\n') !== previousList.join('\n')) {
        fs.writeFileSync(filelistPath, newList.join('\n'));
        previousList = newList;
        console.log(`filelist updated: ${new Date().toLocaleTimeString()}`);
    }
}

updateFilelist();

folders.forEach(({ base }) => {
    const watchDirs = ['maps', 'scenery-gfx', 'textures', 'textures/edges'];
    watchDirs.forEach(sub => {
        const fullPath = path.join(base, sub);
        if (fs.existsSync(fullPath)) {
            fs.watch(fullPath, { recursive: false }, updateFilelist);
        }
    });
});

console.log('Watching climb and ctf (gather) folders for changes...');
