# Sequoia Security Website

This repository contains the Sequoia Security website. This README provides information about recent fixes to address two main issues:

1. Mobile menu not working on pages other than the index page
2. "Cannot GET" errors when navigating to pages in subdirectories

## Fix 1: Mobile Menu on All Pages

### Issue Description

The mobile menu on the Sequoia Security website works correctly on the index page but fails to function on other pages. This happens because:

1. The index.html file properly initializes the mobile menu with the `initializeMobileMenu()` function
2. Other pages either don't call this function or have a different implementation that doesn't work correctly

### Solution

The solution involves two key changes to all pages:

1. Adding a call to `initializeMobileMenu()` in the `loadComponent()` function after the header is loaded
2. Ensuring all pages have the correct implementation of the `initializeMobileMenu()` function

A script has been created to automatically apply this fix: `fix_mobile_menu.js`

## Fix 2: Path Resolution for Navigation

### Issue Description

The website encounters "Cannot GET" errors when trying to navigate to pages like `/pages/security_services/guard_services.html`. This happens because:

1. The HTML files use `<base href="/">` which makes all relative URLs resolve from the website root
2. Asset paths and component loading paths use absolute paths like `/header.html` and `/assets/css/components.css`
3. The server may not be configured to properly resolve these absolute paths

### Solution

The solution involves converting all absolute paths to relative paths based on each file's location in the directory structure:

1. Changing `<base href="/">` to `<base href="">`
2. Updating component loading paths like `/header.html` to use relative paths like `../../header.html`
3. Fixing asset references to use relative paths instead of root-based paths

A script has been created to automatically apply this fix: `fix_relative_paths.js`

## How to Run the Fix Scripts

### Requirements
- Node.js installed on your system

### Steps to run the scripts:

1. Open a terminal/command prompt
2. Navigate to the Sequoia-Security folder
3. Run the scripts with:

```bash
node fix_mobile_menu.js
node fix_relative_paths.js
```

## Manually Fixing the Issues

If you prefer to fix these issues manually, detailed instructions are provided in:

- `README_MOBILE_MENU_FIX.md` for the mobile menu issue
- `README_PATH_FIX.md` for the path resolution issue

## Testing

After applying these fixes, you should test:

1. Open the website and navigate to the index page
2. Verify the mobile menu works on the index page
3. Navigate to other pages and verify:
   - Pages load without "Cannot GET" errors
   - Mobile menu works on all pages
   - Images, CSS, and other assets load correctly

## Project Structure

The project follows a standard structure:

- `assets/` - Contains static assets (CSS, JS, images)
- `pages/` - Contains HTML pages organized by section
- `header.html` and `footer.html` - Components loaded into all pages
- `index.html` - The main homepage
- `*.js` scripts - Utility scripts for fixing common issues 