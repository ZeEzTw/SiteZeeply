// Shopping cart + checkout drawer, shared by /3d/ and /wool/.
// The cart lives in localStorage, so one cart spans both shops.
// Orders are sent as an email through FormSubmit (no backend needed).
(() => {
    // FormSubmit endpoint. After the first order, FormSubmit emails an activation link
    // plus a random alias — put the alias here instead of the address to keep it private.
    const ORDER_ENDPOINT = 'https://formsubmit.co/ajax/neagoe.andrei@live.com';
    const FREE_SHIPPING_FROM = 50;
    const SHIPPING_ESTIMATE = '8–20 LEI';
    const STORAGE_KEY = 'zeeply-cart';

    // ---------- State ----------
    const load = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
    };
    let items = load();
    const save = () => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* private mode */ }
        render();
    };

    const subtotal = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = () => items.reduce((sum, i) => sum + i.qty, 0);

    const track = (path, title) => {
        if (window.goatcounter && window.goatcounter.count) {
            window.goatcounter.count({ path, title, event: true });
        }
    };

    const add = (product) => {
        const id = `${product.shop}:${product.name}`;
        const existing = items.find(i => i.id === id);
        if (existing) existing.qty += 1;
        else items.push({ id, name: product.name, price: parseInt(product.price, 10) || 0, image: product.image, shop: product.shop, qty: 1 });
        track(`cart-add-${product.shop}-` + product.name.replace(/\s+/g, '-').toLowerCase(), 'Add to cart: ' + product.name);
        save();
        bump();
    };

    const setQty = (id, qty) => {
        if (qty <= 0) items = items.filter(i => i.id !== id);
        else items.find(i => i.id === id).qty = qty;
        save();
    };

    // ---------- Styles ----------
    const style = document.createElement('style');
    style.textContent = `
        .zc-toggle { position: relative; display: inline-flex; align-items: center; background: none; border: 0; color: inherit; cursor: pointer; padding: 0; }
        .zc-toggle:hover { opacity: .6; }
        .zc-badge { position: absolute; top: -8px; right: -10px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px; background: #e10600; color: #fff; font: 700 9px/16px 'Inter', sans-serif; text-align: center; }
        .zc-badge[hidden] { display: none; }
        .zc-bump { animation: zcBump .4s ease; }
        @keyframes zcBump { 50% { transform: scale(1.35); } }

        .zc-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 90; }
        .zc-drawer { position: fixed; top: 0; right: 0; height: 100dvh; width: min(420px, 100vw); background: #fff; color: #111; z-index: 100;
            transform: translateX(100%); display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif; visibility: hidden; transition: transform .4s cubic-bezier(0.22, 1, 0.36, 1), visibility 0s .4s; }
        .zc-open .zc-backdrop { opacity: 1; pointer-events: auto; }
        .zc-open .zc-drawer { transform: none; visibility: visible; transition-delay: 0s; box-shadow: -20px 0 60px rgba(0,0,0,.25); }
        .zc-head { display: flex; justify-content: space-between; align-items: center; padding: 22px 24px; border-bottom: 1px solid #eee; }
        .zc-head h2 { font: 700 13px 'Montserrat', sans-serif; letter-spacing: .25em; text-transform: uppercase; margin: 0; }
        .zc-x { background: none; border: 0; font-size: 26px; line-height: 1; cursor: pointer; color: #555; padding: 0 4px; }
        .zc-body { flex: 1; overflow-y: auto; padding: 8px 24px 24px; }
        .zc-empty { text-align: center; color: #888; font-size: 12px; letter-spacing: .15em; text-transform: uppercase; padding: 60px 0; }
        .zc-item { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f1f1; }
        .zc-item img { width: 64px; height: 80px; object-fit: cover; border-radius: 4px; background: #f4f4f4; }
        .zc-name { font-size: 12px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
        .zc-shop { font-size: 10px; color: #999; letter-spacing: .1em; text-transform: uppercase; margin-top: 3px; }
        .zc-qty { display: inline-flex; align-items: center; border: 1px solid #ddd; border-radius: 999px; margin-top: 8px; }
        .zc-qty button { background: none; border: 0; width: 28px; height: 26px; cursor: pointer; font-size: 14px; color: #333; }
        .zc-qty span { min-width: 18px; text-align: center; font-size: 12px; }
        .zc-price { font-size: 12px; font-weight: 700; letter-spacing: .05em; white-space: nowrap; }
        .zc-foot { border-top: 1px solid #eee; padding: 18px 24px 22px; }
        .zc-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; color: #444; }
        .zc-row strong { color: #111; }
        .zc-total { font-size: 14px; font-weight: 700; color: #111; margin-top: 4px; }
        .zc-note { font-size: 10px; color: #888; margin: 4px 0 14px; line-height: 1.5; }
        .zc-btn { display: block; width: 100%; padding: 15px; border: 0; border-radius: 4px; background: #111; color: #fff; font: 700 11px 'Inter', sans-serif; letter-spacing: .25em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
        .zc-btn:hover { background: #333; }
        .zc-btn:disabled { background: #999; cursor: wait; }
        .zc-link { display: block; margin-top: 12px; text-align: center; font-size: 11px; color: #666; background: none; border: 0; width: 100%; cursor: pointer; text-decoration: underline; }

        .zc-form label { display: block; font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #555; margin: 14px 0 6px; }
        .zc-form input[type=text], .zc-form input[type=tel], .zc-form input[type=email], .zc-form textarea {
            width: 100%; padding: 11px 12px; border: 1px solid #ddd; border-radius: 4px; font: 14px 'Inter', sans-serif; color: #111; background: #fff; }
        .zc-form input:focus, .zc-form textarea:focus { outline: none; border-color: #111; }
        .zc-form textarea { min-height: 70px; resize: vertical; }
        .zc-two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .zc-pay { display: grid; gap: 8px; }
        .zc-pay label { display: flex; gap: 10px; align-items: flex-start; margin: 0; padding: 12px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;
            font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #111; }
        .zc-pay label:has(input:checked) { border-color: #111; background: #fafafa; }
        .zc-pay small { display: block; color: #888; font-size: 11px; margin-top: 2px; }
        .zc-agree { display: flex !important; gap: 8px; align-items: flex-start; font-size: 11px !important; font-weight: 400 !important; letter-spacing: 0 !important; text-transform: none !important; color: #555 !important; }
        .zc-agree a { color: #111; }
        .zc-error { color: #c00; font-size: 12px; margin-top: 12px; line-height: 1.5; }
        .zc-error a { color: #c00; }
        .zc-done { text-align: center; padding: 50px 10px; }
        .zc-done h3 { font: 700 16px 'Montserrat', sans-serif; letter-spacing: .15em; text-transform: uppercase; margin: 16px 0 10px; }
        .zc-done p { font-size: 13px; color: #555; line-height: 1.6; }
        .zc-done .zc-id { font-weight: 700; color: #111; }
    `;
    document.head.appendChild(style);

    // ---------- Markup ----------
    const root = document.createElement('div');
    root.innerHTML = `
        <div class="zc-backdrop" data-close></div>
        <aside class="zc-drawer" role="dialog" aria-modal="true" aria-label="Coș de cumpărături">
            <div class="zc-head">
                <h2 id="zc-title">Coșul tău</h2>
                <button class="zc-x" data-close aria-label="Închide">&times;</button>
            </div>
            <div class="zc-body" id="zc-body"></div>
            <div class="zc-foot" id="zc-foot"></div>
        </aside>
    `;
    document.body.appendChild(root);

    const body = root.querySelector('#zc-body');
    const foot = root.querySelector('#zc-foot');
    const title = root.querySelector('#zc-title');
    let view = 'cart'; // cart | checkout | done
    let lastOrderId = '';

    const open = () => { document.documentElement.classList.add('zc-open'); document.body.style.overflow = 'hidden'; };
    const close = () => {
        document.documentElement.classList.remove('zc-open');
        document.body.style.overflow = '';
        if (view === 'done') view = 'cart';
        render();
    };
    root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const totalsHtml = () => {
        const sub = subtotal();
        const free = sub >= FREE_SHIPPING_FROM;
        return `
            <div class="zc-row"><span>Subtotal</span><strong>${sub} LEI</strong></div>
            <div class="zc-row"><span>Transport</span><strong>${free ? 'GRATUIT' : SHIPPING_ESTIMATE}</strong></div>
            <div class="zc-row zc-total"><span>Total</span><span>${free ? `${sub} LEI` : `${sub} LEI + transport`}</span></div>
            <p class="zc-note">${free
                ? 'Transport gratuit pentru comenzile de peste 50 LEI.'
                : `Mai adaugă ${FREE_SHIPPING_FROM - sub} LEI pentru transport gratuit. Costul exact al livrării îl confirmăm înainte de expediere.`}</p>
        `;
    };

    const render = () => {
        // Badge
        document.querySelectorAll('.zc-badge').forEach(b => { b.textContent = count(); b.hidden = count() === 0; });

        if (view === 'done') {
            title.textContent = 'Comandă trimisă';
            body.innerHTML = `
                <div class="zc-done">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
                    <h3>Mulțumim!</h3>
                    <p>Comanda <span class="zc-id">${esc(lastOrderId)}</span> a fost trimisă.<br>Te contactăm în curând pentru confirmare.</p>
                </div>`;
            foot.innerHTML = `<button class="zc-btn" data-close>Înapoi la magazin</button>`;
            return;
        }

        if (items.length === 0) {
            view = 'cart';
            title.textContent = 'Coșul tău';
            body.innerHTML = `<div class="zc-empty">Coșul este gol</div>`;
            foot.innerHTML = '';
            return;
        }

        if (view === 'cart') {
            title.textContent = 'Coșul tău';
            body.innerHTML = items.map(i => `
                <div class="zc-item">
                    <img src="${esc(i.image)}" alt="${esc(i.name)}">
                    <div>
                        <div class="zc-name">${esc(i.name)}</div>
                        <div class="zc-shop">Zeeply ${i.shop === 'wool' ? 'Wool' : '3D'}</div>
                        <div class="zc-qty">
                            <button data-qty="-1" data-id="${esc(i.id)}" aria-label="Scade">−</button>
                            <span>${i.qty}</span>
                            <button data-qty="1" data-id="${esc(i.id)}" aria-label="Adaugă">+</button>
                        </div>
                    </div>
                    <div class="zc-price">${i.price * i.qty} LEI</div>
                </div>`).join('');
            foot.innerHTML = totalsHtml() + `<button class="zc-btn" id="zc-checkout">Finalizează comanda</button>`;
            return;
        }

        // Checkout form
        title.textContent = 'Finalizare comandă';
        body.innerHTML = `
            <form class="zc-form" id="zc-form" novalidate>
                <label for="zc-name">Nume complet *</label>
                <input type="text" id="zc-name" name="nume" autocomplete="name" required>
                <div class="zc-two">
                    <div>
                        <label for="zc-phone">Telefon *</label>
                        <input type="tel" id="zc-phone" name="telefon" autocomplete="tel" required>
                    </div>
                    <div>
                        <label for="zc-email">Email</label>
                        <input type="email" id="zc-email" name="email" autocomplete="email">
                    </div>
                </div>
                <div class="zc-two">
                    <div>
                        <label for="zc-county">Județ *</label>
                        <input type="text" id="zc-county" name="judet" autocomplete="address-level1" required>
                    </div>
                    <div>
                        <label for="zc-city">Localitate *</label>
                        <input type="text" id="zc-city" name="localitate" autocomplete="address-level2" required>
                    </div>
                </div>
                <label for="zc-address">Adresă (stradă, număr, bloc, ap.) *</label>
                <input type="text" id="zc-address" name="adresa" autocomplete="street-address" required>

                <label>Metodă de plată *</label>
                <div class="zc-pay">
                    <label><input type="radio" name="plata" value="Ramburs" checked>
                        <span>Ramburs<small>Plătești la curier, când primești coletul.</small></span></label>
                    <label><input type="radio" name="plata" value="Transfer bancar">
                        <span>Transfer bancar<small>Îți trimitem detaliile după confirmarea comenzii.</small></span></label>
                </div>

                <label for="zc-notes">Detalii / personalizare</label>
                <textarea id="zc-notes" name="detalii" placeholder="Ex: culoarea dorită, nume pentru ramă, easybox preferat…"></textarea>

                <label class="zc-agree"><input type="checkbox" id="zc-agree" required>
                    <span>Am citit <a href="../terms/" target="_blank">Termenii</a> și <a href="../shipping/" target="_blank">Politica de livrare</a>.</span></label>
                <div class="zc-error" id="zc-error" hidden></div>
            </form>`;
        foot.innerHTML = totalsHtml() + `
            <button class="zc-btn" type="submit" form="zc-form" id="zc-submit">Trimite comanda</button>
            <button class="zc-link" id="zc-back">← Înapoi la coș</button>`;
    };

    // ---------- Interactions ----------
    root.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('[data-qty]');
        if (qtyBtn) {
            const item = items.find(i => i.id === qtyBtn.dataset.id);
            if (item) setQty(item.id, item.qty + Number(qtyBtn.dataset.qty));
        }
        if (e.target.closest('#zc-checkout')) { view = 'checkout'; render(); body.scrollTop = 0; track('cart-checkout', 'Checkout started'); }
        if (e.target.closest('#zc-back')) { view = 'cart'; render(); }
    });

    const showError = (html) => {
        const el = root.querySelector('#zc-error');
        el.innerHTML = html;
        el.hidden = false;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Hide the validation message as soon as the customer edits the form
    root.addEventListener('input', () => {
        const el = root.querySelector('#zc-error');
        if (el) el.hidden = true;
    });

    root.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form));

        const missing = [...form.querySelectorAll('[required]')].filter(f => f.type === 'checkbox' ? !f.checked : !f.value.trim());
        if (missing.length) {
            missing[0].focus();
            showError(missing[0].type === 'checkbox' ? 'Te rugăm să confirmi că ai citit termenii.' : 'Te rugăm să completezi câmpurile marcate cu *.');
            return;
        }
        if (data.telefon.replace(/\D/g, '').length < 10) {
            form.querySelector('#zc-phone').focus();
            showError('Numărul de telefon pare incomplet.');
            return;
        }

        const sub = subtotal();
        const free = sub >= FREE_SHIPPING_FROM;
        const orderId = 'Z' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

        const payload = {
            _subject: `Comandă nouă ${orderId} — ${sub} LEI`,
            _template: 'table',
            _captcha: 'false',
            'Comandă': orderId,
            'Produse': items.map(i => `${i.qty} × ${i.name} (${i.shop === 'wool' ? 'Wool' : '3D'}) — ${i.price * i.qty} LEI`).join('\n'),
            'Subtotal': `${sub} LEI`,
            'Transport': free ? 'GRATUIT' : `de confirmat (${SHIPPING_ESTIMATE})`,
            'Plată': data.plata,
            'Nume': data.nume,
            'Telefon': data.telefon,
            'Email': data.email || '—',
            'Adresă': `${data.adresa}, ${data.localitate}, jud. ${data.judet}`,
            'Detalii': data.detalii || '—',
        };
        if (data.email) payload._replyto = data.email;

        const submit = root.querySelector('#zc-submit');
        submit.disabled = true;
        submit.textContent = 'Se trimite…';

        try {
            const res = await fetch(ORDER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || res.status);

            track('cart-order', `Order sent: ${sub} LEI`);
            lastOrderId = orderId;
            items = [];
            view = 'done';
            save();
        } catch (err) {
            submit.disabled = false;
            submit.textContent = 'Trimite comanda';
            showError(`Comanda nu a putut fi trimisă. Încearcă din nou sau scrie-ne pe <a href="https://ig.me/m/${(window.ZEEPLY_CATALOG || {}).instagram || 'zeeply.3d'}" target="_blank">Instagram</a>.`);
        }
    });

    // ---------- Nav button ----------
    const bump = () => document.querySelectorAll('.zc-badge').forEach(b => {
        b.classList.remove('zc-bump'); void b.offsetWidth; b.classList.add('zc-bump');
    });

    document.querySelectorAll('[data-cart-slot]').forEach(slot => {
        slot.innerHTML = `
            <button class="zc-toggle" aria-label="Coș de cumpărături" data-goatcounter-click="nav-cart">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span class="zc-badge" hidden>0</span>
            </button>`;
        slot.querySelector('button').addEventListener('click', () => { view = 'cart'; render(); open(); });
    });

    // Keep the badge in sync when the cart changes in another tab (e.g. 3D and Wool open side by side)
    window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) { items = load(); render(); } });

    render();
    window.ZeeplyCart = { add, open };
})();
