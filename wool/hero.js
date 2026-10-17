// Wool hero: as the visitor scrolls through #hero, Pufi's arch photo under the
// title grows into a big card, and on wide screens the two other photos fan out
// beside it. Progress (0 → 1) also goes to the --p CSS variable for the text,
// confetti and caption.
(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const stage = hero.querySelector('.wool-hero-stage');
    const text = hero.querySelector('.wool-hero-text');
    const cards = {};
    hero.querySelectorAll('[data-card]').forEach(el => { cards[el.dataset.card] = el; });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NAV = 80;
    const RATIO = 0.78; // card width / height

    let g = null;
    let ticking = false;

    const measure = () => {
        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const margin = vw < 760 ? 16 : 32;

        // Start: arch from just under the text down to the bottom of the screen
        stage.style.setProperty('--p', 0);
        const top = text.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 32;
        const h0 = Math.max(160, vh - top - Math.max(24, vh * 0.05));
        const start = { w: Math.min(h0 * RATIO, vw - 48), h: h0, y: top };

        // End: a big card filling the space under the nav
        const h1 = vh - NAV - 2 * margin;
        const end = { w: Math.min(h1 * RATIO, vw - 2 * margin), h: h1, y: NAV + margin };

        // Side cards only where they fit next to the big one
        const sideH = h1 * 0.8;
        const sideW = sideH * RATIO;
        const gap = 28;
        const sides = vw >= 900 ? Math.min(end.w / 2 + gap + sideW / 2, (vw - sideW) / 2 - margin - 24) : 0;

        g = { vw, vh, start, end, sideH, sideW, sides };
        stage.style.setProperty('--caption-bottom', `${vh - end.y - end.h}px`);
    };

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const mix = (a, b, t) => a + (b - a) * t;

    const place = (el, w, h, cx, cy, rotate, radius) => {
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = `translate(${cx - w / 2}px, ${cy - h / 2}px) rotate(${rotate}deg)`;
        el.style.borderRadius = radius;
    };

    const update = () => {
        ticking = false;
        const scrollable = hero.offsetHeight - stage.clientHeight;
        const raw = reduceMotion || scrollable <= 0 ? 0 : -hero.getBoundingClientRect().top / scrollable;
        const p = Math.min(1, Math.max(0, raw));
        const e = ease(p);
        const { vw, start, end } = g;

        const w = mix(start.w, end.w, e);
        const h = mix(start.h, end.h, e);
        const cy = mix(start.y, end.y, e) + h / 2;
        const arch = mix(w / 2, 28, e);
        place(cards.main, w, h, vw / 2, cy, -3 * (1 - e), `${arch}px ${arch}px 28px 28px`);

        // Side cards slide out from behind the main one, only on wide screens
        const s = g.sides ? ease(Math.min(1, Math.max(0, (p - 0.35) / 0.65))) : 0;
        const sw = mix(w * 0.9, g.sideW, s);
        const sh = mix(h * 0.9, g.sideH, s);
        [['left', -1], ['right', 1]].forEach(([name, dir]) => {
            const el = cards[name];
            el.style.opacity = s > 0 ? 1 : 0;
            place(el, sw, sh, vw / 2 + dir * g.sides * s, cy + 14 * s, dir * 6 * s, '24px');
        });

        stage.style.setProperty('--p', p.toFixed(4));
        hero.classList.toggle('is-end', p > 0.9);
    };

    const requestUpdate = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };
    const relayout = () => { measure(); update(); };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    relayout();
    setTimeout(relayout, 1600); // after the title's fade-in has settled
    hero.classList.add('is-ready');
})();
