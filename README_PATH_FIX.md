# Path Resolution Fix

## Issue Description

The website is encountering a "Cannot GET" error when trying to navigate to pages like `/pages/security_services/guard_services.html`. This happens because:

1. The HTML files use `<base href="/">` which makes all relative URLs resolve from the website root
2. Asset paths and component loading paths use absolute paths like `/header.html` and `/assets/css/components.css`
3. The server is likely not configured to properly resolve these absolute paths

## The Fix

The solution involves converting all absolute paths to relative paths based on each file's location in the directory structure:

1. Changing `<base href="/">` to `<base href="">`
2. Updating component loading paths like `/header.html` to use relative paths like `../../header.html`
3. Fixing asset references to use relative paths instead of root-based paths

## How to Run the Fix Script

A Node.js script has been created to automatically fix all path issues across your HTML files.

### Requirements
- Node.js installed on your system

### Steps to run the fix script:

1. Open a terminal/command prompt
2. Navigate to the Sequoia-Security folder
3. Run the script with:

```bash
node fix_relative_paths.js
```

This will automatically:
- Replace `<base href="/">` with `<base href="">`
- Fix component loading paths to use relative paths
- Update all asset references to use relative paths

## Manual Fix (If you prefer)

If you prefer to fix this issue manually, you need to:

1. In each HTML file, change `<base href="/">` to `<base href="">`

2. Update the loadComponent calls with the proper relative path to the root:
   - For files in the root directory: `loadComponent('header.html', 'header-container')`
   - For files in /pages: `loadComponent('../header.html', 'header-container')`
   - For files in /pages/security_services: `loadComponent('../../../header.html', 'header-container')`
   - For files in /pages/Industries: `loadComponent('../../header.html', 'header-container')`

3. Update asset references with the proper relative path to the root:
   - For files in the root directory: `src="assets/images/logo.png"`
   - For files in /pages: `src="../assets/images/logo.png"`
   - For files in /pages/security_services: `src="../../../assets/images/logo.png"`
   - For files in /pages/Industries: `src="../../assets/images/logo.png"`

## Alternative Solution

Alternatively, you could set up a proper web server configuration that correctly handles absolute paths. This would involve:

1. Setting up a local development server (like http-server, live-server, etc.)
2. Configuring it to serve your Sequoia-Security directory as the web root
3. Keeping all your absolute paths as they are

## Testing

After applying the fix (either automatically with the script or manually), test the following:

1. Open the website and navigate to the index page
2. Click links to different pages, especially those in subdirectories
3. Verify that all pages load without "Cannot GET" errors
4. Check that all images, CSS, and other assets load correctly
5. Ensure the mobile menu still works correctly on all pages 