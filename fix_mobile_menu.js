/**
 * Fix Mobile Menu Script
 * 
 * This script fixes the mobile menu by adding the correct initialization code to all HTML pages.
 * Run this script with Node.js to apply the fix to all HTML files in the project.
 */

const fs = require('fs');
const path = require('path');

// The mobile menu initialization function that needs to be added to all pages
const mobileMenuInitFunction = `
    <script>
        // Function to initialize mobile menu
        function initializeMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const openButton = document.getElementById('mobile-menu-button');
            const closeButton = document.getElementById('mobile-menu-close');

            if (menu && openButton && closeButton) {
                const toggleMenu = (show) => {
                    menu.classList.toggle('active', show);
                    openButton.classList.toggle('active', show);
                    document.body.classList.toggle('overflow-hidden', show);
                    
                    // If closing, wait for animation to complete before hiding
                    if (!show) {
                        setTimeout(() => {
                            if (!menu.classList.contains('active')) {
                                menu.classList.add('invisible');
                            }
                        }, 300); // Match transition duration
                    } else {
                        menu.classList.remove('invisible');
                    }
                };

                // Open menu
                openButton.addEventListener('click', () => {
                    console.log('Opening menu');
                    toggleMenu(true);
                });

                // Close menu
                const closeMenu = () => {
                    console.log('Closing menu');
                    toggleMenu(false);
                };

                // Close button click
                closeButton.addEventListener('click', closeMenu);

                // Click outside to close
                menu.addEventListener('click', (e) => {
                    if (e.target === menu) {
                        closeMenu();
                    }
                });

                // ESC key to close
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && menu.classList.contains('active')) {
                        closeMenu();
                    }
                });
            }
        }
    </script>
</body>`;

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

// Fix the loadComponent function in a file
function fixLoadComponentFunction(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the loadComponent function to initialize mobile menu
    const loadComponentRegex = /async\s+function\s+loadComponent\s*\([^)]*\)\s*\{[\s\S]*?(document\.getElementById\(containerId\)\.innerHTML\s*=\s*html;)/;
    
    if (loadComponentRegex.test(content)) {
        content = content.replace(
            loadComponentRegex,
            (match, p1) => {
                return match.replace(
                    p1,
                    `${p1}\n                \n                // Initialize mobile menu after header loads\n                if (containerId === 'header-container') {\n                    initializeMobileMenu();\n                }`
                );
            }
        );
    }
    
    // Add the initializeMobileMenu function if it doesn't exist
    if (!content.includes('function initializeMobileMenu()')) {
        content = content.replace('</body>', mobileMenuInitFunction);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
}

// Main function
function fixMobileMenus() {
    const htmlFiles = findHtmlFiles('.');
    let fixedCount = 0;
    
    for (const file of htmlFiles) {
        // Skip the header.html file as it doesn't need the fix
        if (file.endsWith('header.html')) {
            continue;
        }
        
        try {
            fixLoadComponentFunction(file);
            fixedCount++;
        } catch (error) {
            console.error(`Error fixing ${file}:`, error);
        }
    }
    
    console.log(`\nFixed mobile menu in ${fixedCount} files.`);
}

// Run the fix
fixMobileMenus(); 