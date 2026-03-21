document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    const discoverBtn = document.getElementById('discover-btn');

    // Smooth Scroll for "Discover Collection" Button
    if (discoverBtn) {
        discoverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }

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
    const renderProducts = (categoryPlugin) => {
        // Update Title & Subtitle based on category
        const titles = {
            'All': { title: 'The Full Collection', subtitle: 'Zeeply Exclusive' },
            'Trending': { title: 'Trending Now', subtitle: 'Most Popular' },
            'Keycaps': { title: 'Custom Keycaps', subtitle: 'Mechanical Art' },
            'F1': { title: 'Formula 1 Collection', subtitle: 'Race Ready' },
            'Stranger Things': { title: 'Stranger Things', subtitle: 'Upside Down' },
            'Big Products': { title: 'Big Products', subtitle: 'Large Format' }
        };

        const current = titles[categoryPlugin] || { title: categoryPlugin, subtitle: 'Zeeply Exclusive' };
        
        const stringTitle = current.title;
        const stringSubtitle = current.subtitle;

        // Verify elements exist to avoid errors
        const titleEl = document.getElementById('collection-title');
        const subtitleEl = document.getElementById('collection-subtitle');
        if (titleEl) titleEl.textContent = stringTitle.toUpperCase();
        if (subtitleEl) subtitleEl.textContent = stringSubtitle.toUpperCase();

        grid.innerHTML = '';
        
        let filteredProducts = products;
        if (categoryPlugin === 'Trending') {
            filteredProducts = products.filter(p => p.is_trending === true);
        } else if (categoryPlugin !== 'All') {
            filteredProducts = products.filter(p => p.category === categoryPlugin);
        }
    
        if (filteredProducts.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 text-xs tracking-widest">NO ITEMS FOUND IN THIS CATEGORY</div>`;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card group cursor-pointer';
            // Adjusted delay slightly so it feels snappier on filter switch
            card.style.transitionDelay = `${(index % 4) * 50}ms`;

            // Slideshow Logic: Initial image is the cover
            let currentImgIndex = 0;
            const images = product.all_images;
            const description = product.description || "Limited stock available for this design.";

            card.innerHTML = `
                <div class="aspect-[4/5] overflow-hidden bg-zinc-900 relative product-image-container">
                    <!-- Image: grayscale by default, colored on hover -->
                    <img src="${product.cover_image}" alt="${product.name}" loading="lazy" 
                            class="w-full h-full object-cover  group-hover:scale-105 transition-all duration-700 main-product-image">
                    
                    <!-- Progress Indicators for Slideshow -->
                    <div class="absolute top-4 left-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        ${images.map((_, i) => `<div class="h-0.5 flex-1 bg-white/20 rounded-full indicator-${i} ${i === 0 ? 'bg-white/80' : ''}"></div>`).join('')}
                    </div>

                    <!-- Hover Overlay with Description -->
                    <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end h-2/3">
                        <p class="text-[10px] text-gray-300 font-light tracking-wide mb-4 line-clamp-3">
                            ${description}
                        </p>
                        <button class="w-full py-3 bg-white text-black text-[10px] uppercase font-bold tracking-widest hover:bg-gray-200 transition">
                            DM TO ORDER
                        </button>
                    </div>
                </div>
                <div class="mt-6 flex justify-between items-start px-2">
                    <div>
                        <h3 class="text-xs font-semibold tracking-widest mb-1 uppercase">${product.name}</h3>
                        <p class="text-[9px] text-gray-500 line-clamp-1 max-w-[150px] font-light uppercase tracking-tighter">
                            ARCHIVE ITEM AVAILABLE
                        </p>
                    </div>
                    <span class="text-[10px] font-bold tracking-widest text-zinc-400 whitespace-nowrap shrink-0 ml-4">${product.price} LEI</span>
                </div>
            `;

            // Slideshow Interval Variable
            let slideshowInterval;
            const mainImage = card.querySelector('.main-product-image');
            const indicators = card.querySelectorAll('[class^="h-0.5"]');

            const startSlideshow = () => {
                if (images.length <= 1) return;
                slideshowInterval = setInterval(() => {
                    currentImgIndex = (currentImgIndex + 1) % images.length;
                    mainImage.src = images[currentImgIndex];
                    
                    // Update indicators
                    indicators.forEach((ind, i) => {
                        if (i === currentImgIndex) {
                            ind.classList.replace('bg-white/20', 'bg-white/80');
                        } else {
                            ind.classList.replace('bg-white/80', 'bg-white/20');
                        }
                    });
                }, 1500); // Cycle every 1.5 seconds
            };

            const stopSlideshow = () => {
                clearInterval(slideshowInterval);
                currentImgIndex = 0;
                mainImage.src = product.cover_image;
                indicators.forEach((ind, i) => {
                    if (i === 0) ind.classList.replace('bg-white/20', 'bg-white/80');
                    else ind.classList.replace('bg-white/80', 'bg-white/20');
                });
            };

            // Event Listeners for Hover
            card.addEventListener('mouseenter', startSlideshow);
            card.addEventListener('mouseleave', stopSlideshow);
            
            // Click Handling: On mobile, toggle description. On desktop, go to Instagram.
            card.addEventListener('click', (e) => {
                if (window.innerWidth < 768) {
                    const descOverlay = card.querySelector('.absolute.inset-x-0.bottom-0');
                    const isVisible = descOverlay.classList.contains('mobile-desc-active');
                    
                    if (!isVisible) {
                        // Show overlay using the dedicated CSS class
                        descOverlay.classList.add('mobile-desc-active');
                    } else {
                        // If already visible, clicking again goes to Instagram
                        window.open('https://www.instagram.com/zeepl.y/', '_blank');
                    }
                } else {
                    window.open('https://www.instagram.com/zeepl.y/', '_blank');
                }
            });

            grid.appendChild(card);
            observer.observe(card);
        });
    };

    // Initialize with All
    if (typeof products !== 'undefined') {
        renderProducts('All');

        // Tab Handling
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update Active State
                tabs.forEach(t => {
                    t.classList.remove('active', 'text-white', 'border-b-2', 'border-white');
                    t.classList.add('text-gray-500');
                });
                tab.classList.add('active', 'text-white', 'border-b-2', 'border-white');
                tab.classList.remove('text-gray-500');

                // Filter
                const category = tab.getAttribute('data-category');
                renderProducts(category);
            });
        });

    } else {
        console.error('Products data not found. Ensure products.js is linked in index.html');
    }
});
