// Product page: endless photo gallery (swipe / thumbnails / arrows) and "Adaugă în coș".
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const thumbs = [...document.querySelectorAll('.gallery-thumb')];
    const dots = [...document.querySelectorAll('.gallery-dot')];
    const activeRing = thumbs.length ? thumbs[0].parentElement.dataset.active : '';
    const count = gallery.children.length;
    const loop = count > 1;
    let current = 0;

    const markActive = (n) => {
        current = n;
        dots.forEach((d, i) => d.classList.toggle('active', i === n));
        thumbs.forEach((t, i) => {
            t.classList.toggle(activeRing, i === n);
            t.classList.toggle('ring-transparent', i !== n);
            t.classList.toggle('opacity-60', i !== n);
        });
    };

    // Endless loop: a copy of the last photo goes before the first and a copy of the first
    // after the last. Swiping onto a copy jumps (invisibly) to the real photo it shows.
    if (loop) {
        const first = gallery.firstElementChild.cloneNode(true);
        const last = gallery.lastElementChild.cloneNode(true);
        [first, last].forEach(c => {
            c.setAttribute('aria-hidden', 'true');
            c.querySelector('img').removeAttribute('fetchpriority');
        });
        gallery.append(first);
        gallery.prepend(last);
    }
    const offset = loop ? 1 : 0;              // real photo n sits at position n + offset
    const position = () => Math.round(gallery.scrollLeft / gallery.clientWidth);
    const jump = (pos) => gallery.scrollTo({ left: pos * gallery.clientWidth, behavior: 'instant' });
    const slideTo = (pos) => gallery.scrollTo({ left: pos * gallery.clientWidth, behavior: 'smooth' });
    jump(offset);

    const settle = () => {
        if (!loop) return;
        const pos = position();
        if (pos === 0) jump(count);           // copy of the last photo -> the real last one
        else if (pos === count + 1) jump(1);  // copy of the first photo -> the real first one
    };

    // Swiping (or scrolling) the gallery updates the dots and the thumbnails
    let settleTimer;
    gallery.addEventListener('scroll', () => {
        const n = ((position() - offset) % count + count) % count;
        if (n !== current) markActive(n);
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 120); // fallback for browsers without 'scrollend'
    }, { passive: true });
    gallery.addEventListener('scrollend', settle);
    window.addEventListener('resize', () => jump(current + offset));

    const step = (delta) => slideTo(position() + delta);
    thumbs.forEach(t => t.addEventListener('click', () => slideTo(Number(t.dataset.slide) + offset)));
    document.querySelectorAll('.gallery-arrow').forEach(a =>
        a.addEventListener('click', () => step(Number(a.dataset.step))));
    document.addEventListener('keydown', (e) => {
        if (document.documentElement.classList.contains('zc-open')) return;
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
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
