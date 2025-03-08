/**
 * Fix Live Server Paths Script
 * 
 * This script updates all paths in HTML files to work with VS Code's Live Server.
 * It replaces relative paths with absolute paths that include the project folder name.
 * 
 * Run this script with Node.js to apply the fix to all HTML files in the project.
 */

const fs = require('fs');
const path = require('path');

// Project root folder name 
const PROJECT_FOLDER = 'Sequoia-Security';

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

// Fix paths in the HTML file
function fixPaths(filePath) {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix component loading
    content = content.replace(/loadComponent\(['"](\.\.\/)*([^'"]+)['"]/g, 
        `loadComponent('/${PROJECT_FOLDER}/$2'`);
    
    // Fix asset references (CSS, JS, images)
    content = content.replace(/(src|href)=['"](\.\.\/)*assets\/([^'"]+)['"]/g, 
        `$1="/${PROJECT_FOLDER}/assets/$3"`);
    
    // Also match direct paths that might be remaining
    content = content.replace(/(src|href)=['"]\/assets\/([^'"]+)['"]/g, 
        `$1="/${PROJECT_FOLDER}/assets/$2"`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
}

// Main function
function fixLiveServerPaths() {
    const htmlFiles = findHtmlFiles('.');
    let fixedCount = 0;
    
    for (const file of htmlFiles) {
        try {
            fixPaths(file);
            fixedCount++;
        } catch (error) {
            console.error(`Error fixing ${file}:`, error);
        }
    }
    
    console.log(`\nFixed paths in ${fixedCount} files for Live Server compatibility.`);
}

// Run the fix
fixLiveServerPaths(); 