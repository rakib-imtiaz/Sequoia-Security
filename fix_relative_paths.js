/**
 * Fix Relative Paths Script
 * 
 * This script fixes the path issues in HTML files by converting absolute paths (starting with /)
 * to relative paths based on the file's location in the directory structure.
 * 
 * Run this script with Node.js to apply the fix to all HTML files in the project.
 */

const fs = require('fs');
const path = require('path');

// The root directory of the project - use the current directory
const ROOT_DIR = '.';

// Find all HTML files in the project
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== '.git' && file !== 'node_modules') {
            // Recursive call for directories
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            // Add HTML files to the list
            fileList.push(filePath);
        }
    }
    
    return fileList;
}

// Calculate the relative path from the HTML file to the root
function getRelativePathToRoot(htmlFilePath) {
    const relativePath = path.relative(path.dirname(htmlFilePath), ROOT_DIR);
    return relativePath === '' ? '.' : relativePath;
}

// Fix paths in the HTML file
function fixPaths(filePath) {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    const relativeToRoot = getRelativePathToRoot(filePath);
    
    // Replace <base href="/"> with <base href="">
    content = content.replace(/<base\s+href="\/"\s*\/?>/g, '<base href="">');
    
    // Replace paths in loadComponent calls
    content = content.replace(/loadComponent\(['"]\/([^'"]+)['"]/g, (match, p1) => {
        return `loadComponent('${relativeToRoot}/${p1}'`;
    });
    
    // Replace paths in asset references
    content = content.replace(/(src|href)=["']\/([^'"]+)["']/g, (match, attr, p1) => {
        return `${attr}="${relativeToRoot}/${p1}"`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
}

// Main function
function fixRelativePaths() {
    const htmlFiles = findHtmlFiles(ROOT_DIR);
    let fixedCount = 0;
    
    for (const file of htmlFiles) {
        try {
            fixPaths(file);
            fixedCount++;
        } catch (error) {
            console.error(`Error fixing ${file}:`, error);
        }
    }
    
    console.log(`\nFixed paths in ${fixedCount} files.`);
}

// Run the fix
fixRelativePaths(); 