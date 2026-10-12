// Shared product catalog for /3d/ and /wool/.
// Each page defines window.ZEEPLY_CATALOG (theme, titles, Instagram handle) before loading this file.
document.addEventListener('DOMContentLoaded', () => {
    const config = window.ZEEPLY_CATALOG;
    const theme = config.theme;
    const grid = document.getElementById('product-grid');
    const discoverBtn = document.getElementById('discover-btn');
    const navShop = document.getElementById('nav-shop');

    // Smooth Scroll for "Discover Collection" and "Shop" nav link
    const smoothScrollToProducts = (e) => {
        e.preventDefault();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    };
    if (discoverBtn) discoverBtn.addEventListener('click', smoothScrollToProducts);
    if (navShop) navShop.addEventListener('click', smoothScrollToProducts);

    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const canHover = window.matchMedia('(hover: hover)').matches;

    // Opens a direct message thread on mobile, the inbox on desktop
    const dmLink = `https://ig.me/m/${config.instagram}`;

    // Render Function
    const renderProducts = (category) => {
        // Update Title & Subtitle based on category
        const current = config.titles[category] || { title: category, subtitle: config.fallbackSubtitle };

        const titleEl = document.getElementById('collection-title');
        const subtitleEl = document.getElementById('collection-subtitle');
        if (titleEl) titleEl.textContent = current.title.toUpperCase();
        if (subtitleEl) subtitleEl.textContent = current.subtitle.toUpperCase();

        grid.innerHTML = '';

        // Categories that have their own tab
        const tabbedCategories = config.tabbedCategories;

        let filteredProducts = products;
        if (category === 'Trending') {
            // Show trending products + products from categories without a dedicated tab
            filteredProducts = products.filter(p => p.is_trending === true || (tabbedCategories && !tabbedCategories.includes(p.category)));
        } else if (category !== 'All') {
            filteredProducts = products.filter(p => p.category === category);
        }

        if (filteredProducts.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-20 ${theme.empty} text-xs tracking-widest">NO ITEMS FOUND IN THIS CATEGORY</div>`;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card group cursor-pointer';
            card.style.transitionDelay = `${(index % config.columns) * 50}ms`;

            // Slideshow Logic: Initial image is the cover
            let currentImgIndex = 0;
            const images = product.all_images;
            const description = product.description || config.defaultDescription;

            card.innerHTML = `
                <div class="aspect-[4/5] overflow-hidden ${theme.imageBox} relative product-image-container">
                    <img src="${product.cover_image}" alt="${product.name}" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 main-product-image">

                    <!-- Progress Indicators for Slideshow -->
                    <div class="absolute top-4 left-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        ${images.map((_, i) => `<div class="h-0.5 flex-1 ${theme.indicatorOff} rounded-full indicator-${i} ${i === 0 ? theme.indicatorOn : ''}"></div>`).join('')}
                    </div>

                    <!-- Hover Overlay with Description -->
                    <div class="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t ${theme.overlay} translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end h-2/3">
                        <p class="text-[10px] md:text-xs ${theme.overlayText} font-light tracking-wide">
                            ${description}
                        </p>
                    </div>
                </div>
                <div class="mt-4 md:mt-6 flex justify-between items-start px-1 md:px-2">
                    <div class="min-w-0 flex-1">
                        <h3 class="text-[10px] md:text-xs font-semibold tracking-wide md:tracking-widest mb-1 uppercase break-words ${theme.name}">${product.name}</h3>
                        <p class="text-[8px] md:text-[9px] ${theme.tagline} font-light uppercase tracking-tighter">
                            ${config.tagline}
                        </p>
                    </div>
                    <span class="text-[10px] md:text-xs font-bold tracking-widest ${theme.price} whitespace-nowrap shrink-0 ml-2 md:ml-4">${product.price} LEI</span>
                </div>
                <div class="mt-3 px-1 md:px-2">
                    <button type="button" class="add-to-cart w-full py-2.5 md:py-3 ${theme.cta} text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] transition">
                        Adaugă în coș
                    </button>
                    <a href="${dmLink}" target="_blank" class="dm-link mt-2 w-full py-2 md:py-2.5 flex items-center justify-center gap-1.5 border ${theme.dmLink} text-[9px] md:text-[10px] uppercase font-semibold tracking-[0.12em] md:tracking-[0.18em] transition">
                        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        <span><span class="hidden sm:inline">Scrie-ne pe </span>Instagram</span>
                    </a>
                </div>
            `;

            let slideshowInterval;
            const mainImage = card.querySelector('.main-product-image');
            const indicators = card.querySelectorAll('[class^="h-0.5"]');

            const setActiveIndicator = (active) => {
                indicators.forEach((ind, i) => {
                    if (i === active) ind.classList.replace(theme.indicatorOff, theme.indicatorOn);
                    else ind.classList.replace(theme.indicatorOn, theme.indicatorOff);
                });
            };

            const startSlideshow = () => {
                if (images.length <= 1) return;
                slideshowInterval = setInterval(() => {
                    currentImgIndex = (currentImgIndex + 1) % images.length;
                    mainImage.src = images[currentImgIndex];
                    setActiveIndicator(currentImgIndex);
                }, 1500); // Cycle every 1.5 seconds
            };

            const stopSlideshow = () => {
                clearInterval(slideshowInterval);
                currentImgIndex = 0;
                mainImage.src = product.cover_image;
                setActiveIndicator(0);
            };

            const addBtn = card.querySelector('.add-to-cart');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!window.ZeeplyCart) return;
                window.ZeeplyCart.add({ shop: config.shop, name: product.name, price: product.price, image: product.cover_image });
                addBtn.textContent = 'Adăugat ✓';
                setTimeout(() => { addBtn.textContent = 'Adaugă în coș'; }, 1200);
            });

            card.querySelector('.dm-link').addEventListener('click', (e) => e.stopPropagation());

            // Slideshow on hover only for real pointers (see style.css, iOS tap handling)
            if (canHover) {
                card.addEventListener('mouseenter', startSlideshow);
                card.addEventListener('mouseleave', stopSlideshow);
            }

            // Mobile overlay auto-dismiss timer
            let mobileOverlayTimer = null;

            const dismissOverlay = (overlay) => {
                overlay.classList.remove('mobile-desc-active');
                clearTimeout(mobileOverlayTimer);
                mobileOverlayTimer = null;
            };

            // Click Handling: On mobile, toggle description.
            card.addEventListener('click', () => {
                // Track product click in GoatCounter
                if (window.goatcounter && window.goatcounter.count) {
                    window.goatcounter.count({
                        path: config.analytics.path + product.name.replace(/\s+/g, '-').toLowerCase(),
                        title: config.analytics.title + product.name,
                        event: true,
                    });
                }

                if (window.innerWidth < 768) {
                    const descOverlay = card.querySelector('.absolute.inset-x-0.bottom-0');
                    const isVisible = descOverlay.classList.contains('mobile-desc-active');

                    if (!isVisible) {
                        // Close any other open overlays first
                        document.querySelectorAll('.mobile-desc-active').forEach(el => {
                            el.classList.remove('mobile-desc-active');
                        });
                        descOverlay.classList.add('mobile-desc-active');
                        // Auto-dismiss after 5 seconds
                        clearTimeout(mobileOverlayTimer);
                        mobileOverlayTimer = setTimeout(() => dismissOverlay(descOverlay), 5000);
                    } else {
                        dismissOverlay(descOverlay);
                    }
                }
            });

            grid.appendChild(card);
            observer.observe(card);
        });
    };

    // Close mobile overlays when tapping outside any product card
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.product-card')) {
            document.querySelectorAll('.mobile-desc-active').forEach(el => {
                el.classList.remove('mobile-desc-active');
            });
        }
    });

    // Initialize with All
    if (typeof products !== 'undefined') {
        renderProducts('All');

        // Tab Handling
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active', ...theme.tabActive);
                    t.classList.add(theme.tabInactive);
                });
                tab.classList.add('active', ...theme.tabActive);
                tab.classList.remove(theme.tabInactive);

                renderProducts(tab.getAttribute('data-category'));
            });
        });

    } else {
        console.error('Products data not found. Ensure products.js is linked in index.html');
    }
});
