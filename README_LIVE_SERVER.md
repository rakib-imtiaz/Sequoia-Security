# Live Server Path Fix

## Issue Description

When using VS Code's Live Server extension to serve the website locally, you might encounter "Error loading component. Please refresh the page." messages. This happens because:

1. Live Server has a specific way of handling paths in the browser
2. Relative paths (like `../header.html`) might not work correctly with Live Server
3. The components (header.html, footer.html) aren't being found at the expected paths

## The Fix

The solution involves updating all paths to use Live Server's expected format, which includes the project folder name:

1. Changing component loading paths like this:
   - From: `loadComponent('../../../header.html', 'header-container')`
   - To: `loadComponent('/Sequoia-Security/header.html', 'header-container')`

2. Updating asset references like this:
   - From: `src="../../../assets/images/logo.png"`
   - To: `src="/Sequoia-Security/assets/images/logo.png"`

## How to Run the Fix Script

A Node.js script has been created to automatically update all paths to work with Live Server.

### Requirements
- Node.js installed on your system

### Steps to run the fix script:

1. Open a terminal/command prompt
2. Navigate to the Sequoia-Security folder
3. Run the script with:

```bash
node fix_live_server_paths.js
```

This will automatically:
- Fix component loading paths to include the project folder name
- Update all asset references to use the correct format for Live Server

## Using Live Server

After applying the fixes, you should:

1. Open VS Code with your project folder
2. Right-click on the index.html file
3. Select "Open with Live Server"
4. The website should now load correctly with all components
5. Navigate to different pages to verify they work

## Preparing for Production Hosting

Note that these path fixes are specific to using VS Code's Live Server for local development. When you deploy to Hostinger:

1. You'll likely need to adjust paths again based on your hosting setup
2. If you're hosting in the root directory, you might need to remove the '/Sequoia-Security' prefix
3. If you're hosting in a subdirectory, you'll need to match that subdirectory name

A separate script (`fix_production_paths.js`) will be needed when you're ready to deploy to production, which we can create when you're ready to deploy. 