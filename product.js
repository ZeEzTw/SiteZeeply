// Product page: photo gallery (swipe / thumbnails / arrows) and "Adaugă în coș".
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const thumbs = [...document.querySelectorAll('.gallery-thumb')];
    const counter = document.getElementById('gallery-count');
    const activeRing = thumbs.length ? thumbs[0].parentElement.dataset.active : '';
    let current = 0;

    const goTo = (n) => {
        const slides = gallery.children.length;
        current = (n + slides) % slides;
        gallery.scrollTo({ left: current * gallery.clientWidth });
    };

    const markActive = (n) => {
        current = n;
        if (counter) counter.textContent = n + 1;
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

    const addBtn = document.getElementById('product-add');
    addBtn.addEventListener('click', () => {
        if (!window.ZeeplyCart) return;
        const { shop, name, price, image } = addBtn.dataset;
        window.ZeeplyCart.add({ shop, name, price, image });
        const label = addBtn.querySelector('.add-label');
        label.textContent = 'Adăugat ✓';
        setTimeout(() => { label.textContent = 'Adaugă în coș'; }, 1200);
    });
});
