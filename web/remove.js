// Remove .html extension from URL
(function() {
    'use strict';
    
    // Function to remove .html from current URL
    function removeHtmlExtension() {
        const currentUrl = window.location.href;
        const currentPath = window.location.pathname;
        
        // Check if URL ends with .html
        if (currentPath.endsWith('.html')) {
            // Create new URL without .html
            const newPath = currentPath.replace(/\.html$/, '');
            const newUrl = window.location.origin + newPath + window.location.search + window.location.hash;
            
            // Replace the current URL without adding to history
            window.history.replaceState({}, document.title, newUrl);
        }
    }
    
    // Function to handle all internal links
    function handleInternalLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal link with .html extension
            if (href && !href.startsWith('http') && !href.startsWith('//') && href.includes('.html')) {
                // Remove .html from the href
                const newHref = href.replace(/\.html/g, '');
                link.setAttribute('href', newHref);
            }
        });
    }
    
    // Run when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeHtmlExtension();
            handleInternalLinks();
        });
    } else {
        // DOM is already loaded
        removeHtmlExtension();
        handleInternalLinks();
    }
    
    // Handle dynamic content (if any links are added later)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                handleInternalLinks();
            }
        });
    });
    
    // Start observing when DOM is ready
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
})();

// Console notification
console.log('%c URL Cleaner Active ', 'background: #ff3366; color: #0a0a0a; font-size: 12px; font-weight: bold; padding: 5px;');
console.log('%c .html extensions removed from URLs ', 'color: #00ffff; font-size: 10px;');
