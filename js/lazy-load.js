// Lazy Load for Videos and Images
// Uses Intersection Observer to load videos only when visible

document.addEventListener('DOMContentLoaded', function() {
    // Disable all videos initially and prepare for lazy loading
    const allVideos = document.querySelectorAll('video');
    
    allVideos.forEach(video => {
        const source = video.querySelector('source');
        if (source && source.src) {
            // Save src to data-src
            source.dataset.src = source.src;
            // Remove src to prevent loading
            source.removeAttribute('src');
            // Set preload to none
            video.preload = 'none';
            // Remove autoplay
            video.removeAttribute('autoplay');
            // Mark for lazy loading
            video.dataset.lazy = 'true';
        }
    });
    
    // Lazy load videos when they come into view
    const lazyVideos = document.querySelectorAll('video[data-lazy]');
    
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');
                
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                    video.play().catch(e => {
                        // Autoplay might be blocked, that's fine
                        console.log('Autoplay prevented:', e);
                    });
                    video.removeAttribute('data-lazy');
                }
                
                observer.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });
    
    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });
    
    // Lazy load images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Handle toggle sections - trigger lazy load when expanded
    const toggleHeaders = document.querySelectorAll('.divHeader');
    toggleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if (content && content.classList.contains('divToggleContent')) {
                setTimeout(() => {
                    const videos = content.querySelectorAll('video[data-lazy]');
                    videos.forEach(video => {
                        const rect = video.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const source = video.querySelector('source[data-src]');
                            if (source && source.dataset.src) {
                                source.src = source.dataset.src;
                                video.load();
                                video.play().catch(e => {
                                    console.log('Autoplay prevented:', e);
                                });
                                video.removeAttribute('data-lazy');
                            }
                        }
                    });
                }, 100);
            }
        });
    });
});
