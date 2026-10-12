// Product page: photo gallery (swipe / thumbnails / arrows) and "Adaugă în coș".
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const thumbs = [...document.querySelectorAll('.gallery-thumb')];
    const dots = [...document.querySelectorAll('.gallery-dot')];
    const activeRing = thumbs.length ? thumbs[0].parentElement.dataset.active : '';
    let current = 0;

    const goTo = (n) => {
        const slides = gallery.children.length;
        current = (n + slides) % slides;
        gallery.scrollTo({ left: current * gallery.clientWidth });
    };

    const markActive = (n) => {
        current = n;
        dots.forEach((d, i) => d.classList.toggle('active', i === n));
        thumbs.forEach((t, i) => {
            t.classList.toggle(activeRing, i === n);
            t.classList.toggle('ring-transparent', i !== n);
            t.classList.toggle('opacity-60', i !== n);
        });
    };

    // Swiping (or scrolling) the gallery updates the counter and the thumbnails
    gallery.addEventListener('scroll', () => {
        const n = Math.round(gallery.scrollLeft / gallery.clientWidth);
        if (n !== current) markActive(n);
    }, { passive: true });

    thumbs.forEach(t => t.addEventListener('click', () => goTo(Number(t.dataset.slide))));
    document.querySelectorAll('.gallery-arrow').forEach(a =>
        a.addEventListener('click', () => goTo(current + Number(a.dataset.step))));
    document.addEventListener('keydown', (e) => {
        if (document.documentElement.classList.contains('zc-open')) return;
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });
    markActive(0);

    // Color choice (products with culori-la-alegere.txt)
    const colorOptions = document.getElementById('color-options');
    let chosenColor = '';
    if (colorOptions) {
        const ring = colorOptions.dataset.active;
        const swatches = [...colorOptions.querySelectorAll('.color-swatch')];
        chosenColor = swatches[0].dataset.color;
        swatches.forEach(s => s.addEventListener('click', () => {
            swatches.forEach(o => {
                const on = o === s;
                o.setAttribute('aria-pressed', on);
                o.classList.toggle(ring, on);
                o.classList.toggle('ring-transparent', !on);
            });
            chosenColor = s.dataset.color;
            document.getElementById('color-name').textContent = chosenColor;
        }));
    }

    const addBtn = document.getElementById('product-add');
    addBtn.addEventListener('click', () => {
        if (!window.ZeeplyCart) return;
        const { shop, name, price, image } = addBtn.dataset;
        window.ZeeplyCart.add({ shop, name, price, image, variant: chosenColor });
        const label = addBtn.querySelector('.add-label');
        label.textContent = 'Adăugat ✓';
        setTimeout(() => { label.textContent = 'Adaugă în coș'; }, 1200);
    });
});
