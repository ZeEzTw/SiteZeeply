"""Generate one static page per product: /3d/p/<slug>/ and /wool/p/<slug>/.

Static pages (not one JS page) so Google, Instagram and WhatsApp see the right
title, description and photo. Run after editing products.json; the product
generators (generate_products.py, generate_wool_products.py) call it too.

    python3 generate_product_pages.py
"""
import html
import json
import os
import re
import shutil
import unicodedata

from PIL import Image, ImageFilter, ImageOps

SITE = 'https://zeeply.studio'

SHOPS = {
    '3d': {
        'label': 'Zeeply 3D',
        'instagram': 'zeeply.3d',
        'stylesheet': '../../../style.css?v=3',
        'muted': 'text-gray-400',
        'strong': 'text-white',
        'line': 'border-white/10',
        'image_bg': 'bg-zinc-900',
        'kicker': 'text-red-500',
        'cta': 'bg-white text-black hover:bg-gray-200',
        'dm': 'border-white/40 text-white hover:bg-white/10',
        'divider': 'bg-white/15',
        'divider_text': 'text-gray-500',
        'panel': 'bg-white/[0.03] border-white/10',
        'thumb_active': 'ring-white',
        'hide_category': {'General'},
    },
    'wool': {
        'label': 'Zeeply Wool',
        'instagram': 'zeeply.wool',
        'stylesheet': '../../style-wool.css?v=3',
        'muted': 'text-gray-500',
        'strong': 'text-gray-900',
        'line': 'border-gray-200',
        'image_bg': 'bg-gray-50',
        'kicker': 'text-rose-400',
        'cta': 'bg-gray-900 text-white hover:bg-gray-700 rounded',
        'dm': 'border-gray-900/30 text-gray-900 hover:bg-gray-900/5 rounded',
        'divider': 'bg-gray-200',
        'divider_text': 'text-gray-400',
        'panel': 'bg-gray-50/70 border-gray-200',
        'thumb_active': 'ring-gray-900',
        'hide_category': set(),
    },
}

CART_ICON = '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>'
IG_ICON = '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>'


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-') or 'produs'


def add_slugs(products):
    """Give every product a unique, URL-safe slug (keeps an existing one)."""
    used = set()
    for p in products:
        base = p.get('slug') or slugify(p['name'])
        slug, n = base, 2
        while slug in used:
            slug, n = f'{base}-{n}', n + 1
        p['slug'] = slug
        used.add(slug)
    return products


def site_path(shop_rel_path):
    """'../Photos/x/1.webp' (relative to /3d/) -> 'Photos/x/1.webp' (relative to the site root)."""
    return os.path.normpath(os.path.join('shop', shop_rel_path)).replace(os.sep, '/')


def url_quote(path):
    from urllib.parse import quote
    return quote(path, safe='/()')


def shop_chrome(shop):
    """Nav and footer copied from the shop page, with links rewritten for /<shop>/p/<slug>/."""
    page = open(f'{shop}/index.html', encoding='utf-8').read()
    nav = page[page.index('<nav'):page.index('</nav>') + len('</nav>')]
    footer = page[page.index('<footer'):page.index('</footer>') + len('</footer>')]

    def relink(block):
        block = block.replace('"../', '"../../../')  # first, so the links below stay untouched
        block = block.replace('href="#products"', 'href="../../#product-grid"')
        block = block.replace('href="#"', 'href="../../"')
        return block.replace('id="nav-shop" ', '')

    return relink(nav), relink(footer)


def og_image(cover_file, out_file):
    """1200x630 preview: the whole photo over a blurred copy of itself."""
    if os.path.exists(out_file) and os.path.getmtime(out_file) >= os.path.getmtime(cover_file):
        return
    img = Image.open(cover_file).convert('RGB')
    bg = ImageOps.fit(img, (1200, 630)).filter(ImageFilter.GaussianBlur(30))
    fg = ImageOps.contain(img, (1200, 630))
    bg.paste(fg, ((1200 - fg.width) // 2, (630 - fg.height) // 2))
    bg.save(out_file, 'JPEG', quality=82, optimize=True, progressive=True)


def related_products(product, products, count=4):
    same = [p for p in products if p is not product and p['category'] == product['category']]
    others = [p for p in products if p is not product and p['category'] != product['category']]
    return (same + others)[:count]


def render_page(shop, product, products, nav, footer):
    t = SHOPS[shop]
    e = lambda s: html.escape(str(s), quote=True)
    url = f"{SITE}/{shop}/p/{product['slug']}/"
    images = [site_path(i) for i in product['all_images']]
    desc = product['description']
    title = f"{product['name']} | {t['label']}"
    meta_desc = desc if len(desc) <= 160 else desc[:157].rsplit(' ', 1)[0] + '…'
    show_category = product['category'] not in t['hide_category']

    json_ld = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product['name'],
        'description': desc,
        'image': [f'{SITE}/{url_quote(i)}' for i in images],
        'brand': {'@type': 'Brand', 'name': 'Zeeply'},
        'offers': {
            '@type': 'Offer',
            'price': product['price'],
            'priceCurrency': 'RON',
            'availability': 'https://schema.org/InStock',
            'url': url,
        },
    }

    slides = '\n'.join(
        f'''                    <div class="snap-center shrink-0 w-full aspect-[4/5] {t['image_bg']}">
                        <img src="../../../{e(url_quote(img))}" alt="{e(product['name'])} – poza {n + 1}" class="w-full h-full object-cover" {'fetchpriority="high"' if n == 0 else 'loading="lazy"'}>
                    </div>''' for n, img in enumerate(images))
    thumbs = '\n'.join(
        f'''                    <button type="button" data-slide="{n}" class="gallery-thumb shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden ring-2 ring-inset ring-transparent {t['image_bg']} transition" aria-label="Poza {n + 1}">
                        <img src="../../../{e(url_quote(img))}" alt="" class="w-full h-full object-cover" loading="lazy">
                    </button>''' for n, img in enumerate(images)) if len(images) > 1 else ''

    cards = '\n'.join(
        f'''                <a href="../{e(r['slug'])}/" class="group block" data-goatcounter-click="{shop}-related-{e(r['slug'])}">
                    <div class="aspect-[4/5] overflow-hidden {t['image_bg']}">
                        <img src="../../../{e(url_quote(site_path(r['cover_image'])))}" alt="{e(r['name'])}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                    </div>
                    <div class="mt-3 flex justify-between gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-wide {t['strong']}">
                        <span class="min-w-0 break-words">{e(r['name'])}</span>
                        <span class="shrink-0 {t['muted']}">{e(r['price'])} LEI</span>
                    </div>
                </a>''' for r in related_products(product, products))

    return f'''<!DOCTYPE html>
<!-- Generated by generate_product_pages.py: edit products.json / the template, not this file -->
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{e(title)}</title>
    <meta name="description" content="{e(meta_desc)}">
    <link rel="canonical" href="{url}">
    <meta property="og:title" content="{e(product['name'])} – {product['price']} LEI">
    <meta property="og:description" content="{e(meta_desc)}">
    <meta property="og:image" content="{url}og.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="product">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/webp" href="../../../Logo/logo.webp">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../../dist.css?v=4">
    <link rel="stylesheet" href="{t['stylesheet']}">
    <script type="application/ld+json">{json.dumps(json_ld, ensure_ascii=False)}</script>
    <script data-goatcounter="https://zeeply.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
</head>
<body class="overflow-x-hidden">

    {nav}

    <main class="pt-28 md:pt-32 pb-20 px-4 md:px-20">
        <div class="max-w-[1200px] mx-auto">
            <a href="../../#product-grid" class="inline-block mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.2em] {t['muted']} hover:opacity-70 transition" data-goatcounter-click="{shop}-product-back">← Înapoi la colecție</a>

            <div class="grid md:grid-cols-2 gap-8 md:gap-14 items-start">
                <!-- Gallery: swipe on phones, thumbnails/arrows on desktop -->
                <div class="min-w-0">
                    <div class="relative">
                        <div id="gallery" class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
{slides}
                        </div>
                        {'' if len(images) < 2 else f"""<button type="button" data-step="-1" class="gallery-arrow hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition" aria-label="Poza anterioară">‹</button>
                        <button type="button" data-step="1" class="gallery-arrow hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition" aria-label="Poza următoare">›</button>
                        <div class="md:hidden absolute bottom-3 inset-x-0 text-center text-[10px] tracking-widest text-white/90"><span class="px-2 py-1 rounded-full bg-black/40"><span id="gallery-count">1</span> / {len(images)}</span></div>"""}
                    </div>
                    <div class="mt-3 flex gap-2 overflow-x-auto no-scrollbar" data-active="{t['thumb_active']}">
{thumbs}
                    </div>
                </div>

                <!-- Info -->
                <div class="md:sticky md:top-28">
                    {f'<span class="block mb-3 text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold {t["kicker"]}">{e(product["category"])}</span>' if show_category else ''}
                    <h1 class="text-2xl md:text-4xl font-bold uppercase tracking-tight heading-font {t['strong']}">{e(product['name'])}</h1>
                    <p class="mt-3 text-xl md:text-2xl font-semibold tracking-wider {t['strong']}">{e(product['price'])} LEI</p>
                    <p class="mt-5 text-sm md:text-base leading-relaxed {t['muted']}">{e(desc)}</p>

                    <div class="mt-8">
                        <button type="button" id="product-add" data-shop="{shop}" data-name="{e(product['name'])}" data-price="{e(product['price'])}" data-image="/{e(url_quote(images[0]))}"
                            class="add-to-cart w-full py-4 flex items-center justify-center gap-2 {t['cta']} text-[11px] uppercase font-bold tracking-[0.2em] transition" data-goatcounter-click="{shop}-product-add">
                            {CART_ICON}<span class="add-label">Adaugă în coș</span>
                        </button>
                        <div class="flex items-center gap-3 my-3" aria-hidden="true">
                            <span class="h-px flex-1 {t['divider']}"></span>
                            <span class="text-[10px] lowercase tracking-widest {t['divider_text']}">sau</span>
                            <span class="h-px flex-1 {t['divider']}"></span>
                        </div>
                        <a href="https://www.instagram.com/{t['instagram']}/" target="_blank" class="dm-link w-full py-3.5 flex items-center justify-center gap-2 border {t['dm']} text-[11px] uppercase font-semibold tracking-[0.18em] transition" data-goatcounter-click="{shop}-product-dm">
                            {IG_ICON}<span>Comandă prin mesaj</span>
                        </a>
                    </div>

                    <ul class="mt-8 p-5 border rounded-xl {t['panel']} space-y-3 text-xs md:text-sm {t['muted']}">
                        <li>✓ Făcut de noi, în atelierul Zeeply</li>
                        <li>✓ Livrare prin Colete-Online: curier la adresă sau easybox</li>
                        <li>✓ Transport gratuit la comenzi de peste 50 LEI</li>
                        <li>✓ Nu plătești nimic online: confirmăm comanda pe WhatsApp, apoi plătești ramburs, prin transfer sau Revolut</li>
                    </ul>
                </div>
            </div>

            <section class="mt-20 md:mt-28">
                <h2 class="mb-6 md:mb-8 text-sm md:text-base font-semibold uppercase tracking-[0.25em] heading-font {t['strong']}">Îți mai pot plăcea</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10">
{cards}
                </div>
            </section>
        </div>
    </main>

    {footer}

    <script>window.ZEEPLY_CATALOG = {{ instagram: '{t['instagram']}', shop: '{shop}' }};</script>
    <script src="../../../cart.js?v=7"></script>
    <script src="../../../product.js?v=1"></script>
</body>
</html>
'''


def build():
    sitemap = [f'{SITE}/', f'{SITE}/3d/', f'{SITE}/wool/', f'{SITE}/about/', f'{SITE}/shipping/', f'{SITE}/terms/']
    for shop in SHOPS:
        products = json.load(open(f'{shop}/products.json', encoding='utf-8'))
        if any('slug' not in p for p in products):
            # Catalog edited by hand: add the missing slugs so grid links and pages match
            add_slugs(products)
            ascii_only = shop == '3d'  # keep each catalog's existing JSON style
            text = json.dumps(products, indent=2, ensure_ascii=ascii_only)
            open(f'{shop}/products.json', 'w', encoding='utf-8').write(text)
            open(f'{shop}/products.js', 'w', encoding='utf-8').write(f'const products = {text};')
        nav, footer = shop_chrome(shop)
        out_root = f'{shop}/p'
        wanted = {p['slug'] for p in products}
        # Remove pages of products that no longer exist
        if os.path.isdir(out_root):
            for old in os.listdir(out_root):
                if old not in wanted:
                    shutil.rmtree(os.path.join(out_root, old))
        for product in products:
            out_dir = os.path.join(out_root, product['slug'])
            os.makedirs(out_dir, exist_ok=True)
            with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(render_page(shop, product, products, nav, footer))
            og_image(site_path(product['cover_image']), os.path.join(out_dir, 'og.jpg'))
            sitemap.append(f"{SITE}/{shop}/p/{product['slug']}/")
        print(f'{shop}: {len(products)} pagini de produs')

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        f.writelines(f'  <url><loc>{u}</loc></url>\n' for u in sitemap)
        f.write('</urlset>\n')

    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')


if __name__ == '__main__':
    build()
