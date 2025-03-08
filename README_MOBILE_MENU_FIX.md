# Mobile Menu Fix

## Issue Description

The mobile menu on the Sequoia Security website works correctly on the index page but fails to function on other pages. This happens because:

1. The index.html file properly initializes the mobile menu with the `initializeMobileMenu()` function
2. Other pages either don't call this function or have a different implementation that doesn't work correctly

## The Fix

The solution involves two key changes to all pages:

1. Adding a call to `initializeMobileMenu()` in the `loadComponent()` function after the header is loaded
2. Ensuring all pages have the correct implementation of the `initializeMobileMenu()` function

## How to Run the Fix Script

A Node.js script has been created to automatically fix this issue across all HTML files in the project. 

### Requirements
- Node.js installed on your system

### Steps to run the fix script:

1. Open a terminal/command prompt
2. Navigate to the Sequoia-Security folder
3. Run the script with:

```bash
node fix_mobile_menu.js
```

This will automatically fix all HTML files in the project by:
- Adding the mobile menu initialization code to the `loadComponent` function
- Adding the correct `initializeMobileMenu` function to pages that don't have it

## Manual Fix (If you prefer)

If you prefer to fix this issue manually, you need to make the following changes to each page:

1. Find the `loadComponent` function in each HTML file
2. Add the following code after the line that sets the innerHTML:

```javascript
// Initialize mobile menu after header loads
if (containerId === 'header-container') {
    initializeMobileMenu();
}
```

3. Add the following function to each HTML file (before the closing body tag):

```javascript
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
```

## Testing

After applying the fix (either automatically with the script or manually), test the following:

1. Open the website and navigate to the index page
2. Verify the mobile menu works on the index page (narrow your browser or use responsive mode)
3. Navigate to other pages and verify the mobile menu works there too
4. Test opening and closing the menu with:
   - The hamburger button
   - The close button
   - Clicking outside the menu
   - Pressing the ESC key 