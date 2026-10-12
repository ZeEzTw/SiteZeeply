// Shopping cart + checkout drawer, shared by /3d/ and /wool/.
// The cart lives in localStorage, so one cart spans both shops.
// Orders are sent as an email through FormSubmit (no backend needed).
(() => {
    // FormSubmit endpoint (random alias of the order inbox, so the address stays private).
    const ORDER_ENDPOINT = 'https://formsubmit.co/ajax/948a031619110ce13f6b4c7a94c79cd3';
    const FREE_SHIPPING_FROM = 50;
    const SHIPPING_ESTIMATE = '8–20 LEI';
    const STORAGE_KEY = 'zeeply-cart';

    // ---------- State ----------
    // Images are stored as site-absolute paths so the cart works on every page depth.
    // Older carts saved '../Photos/…' from the shop pages: map those to '/Photos/…'.
    const load = () => {
        try {
            return (JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
                .map(i => ({ ...i, image: String(i.image).replace(/^\.\.\//, '/') }));
        } catch { return []; }
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
        const variant = product.variant || '';
        const id = `${product.shop}:${product.name}${variant ? ':' + variant : ''}`;
        const existing = items.find(i => i.id === id);
        if (existing) existing.qty += 1;
        else items.push({ id, name: product.name, price: parseInt(product.price, 10) || 0, image: new URL(product.image, location.href).pathname, shop: product.shop, variant, qty: 1 });
        track(`cart-add-${product.shop}-` + product.name.replace(/\s+/g, '-').toLowerCase(), 'Add to cart: ' + product.name);
        save();
        bump();
        view = 'cart';
        render();
        open();
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
        .zc-section { font: 700 11px 'Montserrat', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #111; margin: 26px 0 2px; padding-top: 18px; border-top: 1px solid #f1f1f1; }
        .zc-section:first-child { margin-top: 10px; padding-top: 0; border-top: 0; }
        .zc-hint { font-size: 11px; color: #888; margin-top: 5px; line-height: 1.5; }
        .zc-legal { font-size: 10px; color: #999; text-align: center; margin: 10px 0 0; line-height: 1.5; }
        .zc-legal a { color: #666; }
        .zc-steps { background: #f7f7f5; border-radius: 6px; padding: 14px 16px; margin: 14px 0 6px; }
        .zc-steps p { font-size: 11px; color: #666; line-height: 1.5; margin: 0 0 10px; }
        .zc-steps ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; counter-reset: zc; }
        .zc-steps li { counter-increment: zc; display: flex; gap: 10px; align-items: flex-start; font-size: 12px; color: #222; line-height: 1.45; }
        .zc-steps li::before { content: counter(zc); flex: none; width: 18px; height: 18px; border-radius: 50%; background: #111; color: #fff; font: 700 10px/18px 'Inter', sans-serif; text-align: center; margin-top: 1px; }
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
            <div class="zc-row"><span>Transport</span><strong>${free ? 'GRATUIT' : 'se confirmă după comandă'}</strong></div>
            <div class="zc-row zc-total"><span>Total</span><span>${free ? `${sub} LEI` : `${sub} LEI + transport`}</span></div>
            <p class="zc-note">${free
                ? 'Transport gratuit pentru comenzile de peste 50 LEI.'
                : `Livrăm prin Colete-Online și alegem cea mai bună ofertă de curier pentru adresa ta (de obicei ${SHIPPING_ESTIMATE}). Prețul exact ți-l confirmăm pe WhatsApp înainte de expediere. Mai adaugă ${FREE_SHIPPING_FROM - sub} LEI pentru transport gratuit.`}</p>
        `;
    };

    const stepsHtml = () => `
        <div class="zc-steps">
            <p>Zeeply e un atelier mic: fiecare produs e făcut de noi. De aceea confirmăm personal fiecare comandă.</p>
            <ol>
                <li>Trimiți comanda de aici. Nu plătești nimic acum.</li>
                <li>Te contactăm pe WhatsApp: confirmăm produsele și prețul exact al transportului. Livrăm prin Colete-Online, cu cel mai potrivit curier (Sameday, FAN Courier, Cargus, DPD, GLS și alții).</li>
                <li>Plătești cum preferi: ramburs, transfer bancar sau Revolut.</li>
            </ol>
        </div>`;

    const render = () => {
        // Badge
        document.querySelectorAll('.zc-badge').forEach(b => { b.textContent = count(); b.hidden = count() === 0; });

        if (view === 'done') {
            title.textContent = 'Comandă trimisă';
            body.innerHTML = `
                <div class="zc-done">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
                    <h3>Mulțumim!</h3>
                    <p>Comanda <span class="zc-id">${esc(lastOrderId)}</span> a fost trimisă.</p>
                    <p style="margin-top:10px">Te contactăm pe <strong>WhatsApp</strong> în curând ca să confirmăm produsele, transportul și plata.</p>
                </div>`;
            foot.innerHTML = `<button class="zc-btn" data-close>Înapoi la magazin</button>`;
            return;
        }

        if (items.length === 0) {
            view = 'cart';
            title.textContent = 'Coșul tău';
            body.innerHTML = `<div class="zc-empty">Coșul este gol</div>` + stepsHtml();
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
                        <div class="zc-shop">Zeeply ${i.shop === 'wool' ? 'Wool' : '3D'}${i.variant ? ` · Culoare: ${esc(i.variant)}` : ''}</div>
                        <div class="zc-qty">
                            <button data-qty="-1" data-id="${esc(i.id)}" aria-label="Scade">−</button>
                            <span>${i.qty}</span>
                            <button data-qty="1" data-id="${esc(i.id)}" aria-label="Adaugă">+</button>
                        </div>
                    </div>
                    <div class="zc-price">${i.price * i.qty} LEI</div>
                </div>`).join('') + stepsHtml();
            foot.innerHTML = totalsHtml() + `<button class="zc-btn" id="zc-checkout">Finalizează comanda</button>`;
            return;
        }

        // Checkout form
        title.textContent = 'Finalizare comandă';
        body.innerHTML = `
            <form class="zc-form" id="zc-form" novalidate>
                <div class="zc-section">1. Contact</div>
                <label for="zc-name">Nume complet *</label>
                <input type="text" id="zc-name" name="nume" autocomplete="name" required>
                <label for="zc-phone">Telefon (WhatsApp) *</label>
                <input type="tel" id="zc-phone" name="telefon" autocomplete="tel" placeholder="07xx xxx xxx" required>
                <div class="zc-hint">Pe acest număr te contactăm pentru confirmarea comenzii.</div>
                <label for="zc-email">Email (opțional)</label>
                <input type="email" id="zc-email" name="email" autocomplete="email">

                <div class="zc-section">2. Livrare</div>
                <div class="zc-pay" style="margin-top:12px">
                    <label><input type="radio" name="livrare" value="Curier la adresă" checked>
                        <span>Curier la adresă<small>Coletul vine direct la ușa ta.</small></span></label>
                    <label><input type="radio" name="livrare" value="Easybox / locker">
                        <span>Easybox / locker<small>Ridici coletul când vrei, din cel mai apropiat locker.</small></span></label>
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
                <label for="zc-address" id="zc-address-label">Adresă (stradă, număr, bloc, ap.) *</label>
                <input type="text" id="zc-address" name="adresa" autocomplete="street-address" required>
                <div id="zc-locker" hidden>
                    <label for="zc-locker-name">Easybox / locker preferat (opțional)</label>
                    <input type="text" id="zc-locker-name" name="locker" placeholder="Ex: easybox Kaufland Mărăști">
                    <div class="zc-hint">Dacă nu știi, alegem noi lockerul cel mai apropiat de adresa ta și ți-l confirmăm pe WhatsApp.</div>
                </div>
                <div class="zc-hint">Prețul transportului se confirmă după comandă, pe WhatsApp.</div>

                <div class="zc-section">3. Plată</div>
                <div class="zc-hint" style="margin-bottom:10px">Nu plătești nimic acum. Alegi doar cum vrei să plătești după confirmare.</div>
                <div class="zc-pay">
                    <label><input type="radio" name="plata" value="Ramburs" checked>
                        <span>Ramburs<small id="zc-cod-hint">Plătești curierului, cash sau card, când primești coletul.</small></span></label>
                    <label><input type="radio" name="plata" value="Transfer bancar">
                        <span>Transfer bancar<small>Îți trimitem IBAN-ul pe WhatsApp după confirmare.</small></span></label>
                    <label><input type="radio" name="plata" value="Revolut">
                        <span>Revolut<small>Îți trimitem datele Revolut pe WhatsApp după confirmare.</small></span></label>
                </div>

                <div class="zc-section">4. Detalii (opțional)</div>
                <label for="zc-notes" style="margin-top:8px">Culori, personalizări, easybox, întrebări</label>
                <textarea id="zc-notes" name="detalii" placeholder="Ex: lalele roz, numele „Maria” pe ramă…"></textarea>
                <div class="zc-error" id="zc-error" hidden></div>
            </form>`;
        const sub = subtotal();
        foot.innerHTML = `
            <div class="zc-row zc-total"><span>Total</span><span>${sub >= FREE_SHIPPING_FROM ? `${sub} LEI` : `${sub} LEI + transport`}</span></div>
            <button class="zc-btn" type="submit" form="zc-form" id="zc-submit" style="margin-top:10px">Trimite comanda</button>
            <p class="zc-legal">Prin trimitere ești de acord cu <a href="/terms/" target="_blank">Termenii</a> și <a href="/shipping/" target="_blank">Politica de livrare</a>. Datele tale sunt folosite doar pentru comandă și livrare (<a href="/confidentialitate/" target="_blank">Confidențialitate</a>).</p>
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

    // Delivery choice changes the address hint, shows the locker field and the COD wording
    root.addEventListener('change', (e) => {
        if (e.target.name !== 'livrare') return;
        const locker = e.target.value.startsWith('Easybox');
        root.querySelector('#zc-locker').hidden = !locker;
        root.querySelector('#zc-address-label').textContent = locker
            ? 'Adresa ta (căutăm cel mai apropiat locker) *'
            : 'Adresă (stradă, număr, bloc, ap.) *';
        root.querySelector('#zc-cod-hint').textContent = locker
            ? 'Plătești cu cardul la locker, când ridici coletul.'
            : 'Plătești curierului, cash sau card, când primești coletul.';
    });

    // Hide the validation message as soon as the customer edits the form
    root.addEventListener('input', () => {
        const el = root.querySelector('#zc-error');
        if (el) el.hidden = true;
    });

    // Click-to-chat link for the order email (07xx… → 407xx…)
    const waLink = (phone) => {
        let d = phone.replace(/\D/g, '').replace(/^00/, '');
        if (d.startsWith('0')) d = '4' + d;
        return `https://wa.me/${d}`;
    };

    root.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form));

        const missing = [...form.querySelectorAll('[required]')].filter(f => !f.value.trim());
        if (missing.length) {
            missing[0].focus();
            showError('Te rugăm să completezi câmpurile marcate cu *.');
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
            'Produse': items.map(i => `${i.qty} × ${i.name}${i.variant ? ` – culoare ${i.variant}` : ''} (${i.shop === 'wool' ? 'Wool' : '3D'}) — ${i.price * i.qty} LEI`).join('\n'),
            'Subtotal': `${sub} LEI`,
            'Transport': free ? 'GRATUIT' : 'de confirmat cu clientul',
            'Livrare': data.livrare + (data.locker ? ` (${data.locker})` : ''),
            'Plată': data.plata,
            'Nume': data.nume,
            'Telefon (WhatsApp)': data.telefon,
            'Deschide WhatsApp': waLink(data.telefon),
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
            showError(`Comanda nu a putut fi trimisă. Încearcă din nou sau scrie-ne pe <a href="https://www.instagram.com/${(window.ZEEPLY_CATALOG || {}).instagram || 'zeeply.3d'}/" target="_blank">Instagram</a>.`);
        }
    });

    // ---------- Nav button ----------
    const bump = () => document.querySelectorAll('.zc-badge').forEach(b => {
        b.classList.remove('zc-bump'); void b.offsetWidth; b.classList.add('zc-bump');
    });

    document.querySelectorAll('[data-cart-slot]').forEach(slot => {
        slot.innerHTML = `
            <button class="zc-toggle" aria-label="Coș de cumpărături" data-goatcounter-click="nav-cart">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span class="zc-badge" hidden>0</span>
            </button>`;
        slot.querySelector('button').addEventListener('click', () => { view = 'cart'; render(); open(); });
    });

    // Keep the badge in sync when the cart changes in another tab (e.g. 3D and Wool open side by side)
    window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) { items = load(); render(); } });

    render();
    window.ZeeplyCart = { add, open };
})();
