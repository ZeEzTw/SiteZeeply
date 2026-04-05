document.addEventListener('DOMContentLoaded', () => {
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

    // Render Function
    const renderProducts = (categoryFilter) => {
        const titles = {
            'All': { title: 'All Creations', subtitle: 'Handmade Collection' },
            'Trending': { title: 'Trending Now', subtitle: 'Most Popular' }
        };

        const current = titles[categoryFilter] || { title: 'All Creations', subtitle: 'Handmade Collection' };

        const titleEl = document.getElementById('collection-title');
        const subtitleEl = document.getElementById('collection-subtitle');
        if (titleEl) titleEl.textContent = current.title.toUpperCase();
        if (subtitleEl) subtitleEl.textContent = current.subtitle.toUpperCase();

        grid.innerHTML = '';

        let filteredProducts = products;
        if (categoryFilter === 'Trending') {
            filteredProducts = products.filter(p => p.is_trending === true);
        }

        if (filteredProducts.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400 text-xs tracking-widest">NO ITEMS FOUND IN THIS CATEGORY</div>`;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card group cursor-pointer';
            card.style.transitionDelay = `${(index % 3) * 50}ms`;

            let currentImgIndex = 0;
            const images = product.all_images;
            const description = product.description || "Handcrafted with premium velvet yarn.";

            const dmMessage = encodeURIComponent(`Hi! I'm interested in ordering: ${product.name} (${product.price} LEI)`);
            const dmLink = `https://ig.me/m/thread.ntales?text=${dmMessage}`;

            card.innerHTML = `
                <div class="aspect-[4/5] overflow-hidden bg-gray-50 rounded-lg relative product-image-container">
                    <img src="${product.cover_image}" alt="${product.name}" loading="lazy"
                            class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 main-product-image">

                    <!-- Progress Indicators for Slideshow -->
                    <div class="absolute top-4 left-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        ${images.map((_, i) => `<div class="h-0.5 flex-1 bg-black/10 rounded-full indicator-${i} ${i === 0 ? 'bg-black/50' : ''}"></div>`).join('')}
                    </div>

                    <!-- Hover Overlay with Description -->
                    <div class="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-white via-white/90 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end h-2/3">
                        <p class="text-[10px] md:text-xs text-gray-600 font-light tracking-wide mb-4">
                            ${description}
                        </p>
                        <a href="${dmLink}" target="_blank" class="block w-full py-3 bg-gray-900 text-white text-[10px] text-center uppercase font-bold tracking-widest hover:bg-gray-700 transition rounded" onclick="event.stopPropagation()">
                            DM TO ORDER
                        </a>
                    </div>
                </div>
                <div class="mt-4 md:mt-6 flex justify-between items-start px-1 md:px-2">
                    <div class="min-w-0 flex-1">
                        <h3 class="text-[10px] md:text-xs font-semibold tracking-wide md:tracking-widest mb-1 uppercase break-words text-gray-900">${product.name}</h3>
                        <p class="text-[8px] md:text-[9px] text-gray-400 font-light uppercase tracking-tighter">
                            HANDCRAFTED ITEM
                        </p>
                    </div>
                    <span class="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 whitespace-nowrap shrink-0 ml-2 md:ml-4">${product.price} LEI</span>
                </div>
            `;

            // Slideshow
            let slideshowInterval;
            const mainImage = card.querySelector('.main-product-image');
            const indicators = card.querySelectorAll('[class^="h-0.5"]');

            const startSlideshow = () => {
                if (images.length <= 1) return;
                slideshowInterval = setInterval(() => {
                    currentImgIndex = (currentImgIndex + 1) % images.length;
                    mainImage.src = images[currentImgIndex];
                    indicators.forEach((ind, i) => {
                        if (i === currentImgIndex) {
                            ind.classList.replace('bg-black/10', 'bg-black/50');
                        } else {
                            ind.classList.replace('bg-black/50', 'bg-black/10');
                        }
                    });
                }, 1500);
            };

            const stopSlideshow = () => {
                clearInterval(slideshowInterval);
                currentImgIndex = 0;
                mainImage.src = product.cover_image;
                indicators.forEach((ind, i) => {
                    if (i === 0) ind.classList.replace('bg-black/10', 'bg-black/50');
                    else ind.classList.replace('bg-black/50', 'bg-black/10');
                });
            };

            card.addEventListener('mouseenter', startSlideshow);
            card.addEventListener('mouseleave', stopSlideshow);

            let mobileOverlayTimer = null;

            const dismissOverlay = (overlay) => {
                overlay.classList.remove('mobile-desc-active');
                clearTimeout(mobileOverlayTimer);
                mobileOverlayTimer = null;
            };

            card.addEventListener('click', (e) => {
                if (window.goatcounter && window.goatcounter.count) {
                    window.goatcounter.count({
                        path: 'wool-product-' + product.name.replace(/\s+/g, '-').toLowerCase(),
                        title: 'Clicked Wool Product: ' + product.name,
                        event: true,
                    });
                }

                if (window.innerWidth < 768) {
                    const descOverlay = card.querySelector('.absolute.inset-x-0.bottom-0');
                    const isVisible = descOverlay.classList.contains('mobile-desc-active');

                    if (!isVisible) {
                        document.querySelectorAll('.mobile-desc-active').forEach(el => {
                            el.classList.remove('mobile-desc-active');
                        });
                        descOverlay.classList.add('mobile-desc-active');
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

    // Initialize
    if (typeof products !== 'undefined') {
        renderProducts('All');

        // Tab Handling
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active', 'text-gray-900', 'border-b-2', 'border-gray-900');
                    t.classList.add('text-gray-400');
                });
                tab.classList.add('active', 'text-gray-900', 'border-b-2', 'border-gray-900');
                tab.classList.remove('text-gray-400');

                const category = tab.getAttribute('data-category');
                renderProducts(category);
            });
        });

    } else {
        console.error('Products data not found. Ensure products.js is linked.');
    }
});
