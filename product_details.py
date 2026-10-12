"""Optional product details shared by both product generators.

Files a product folder may contain (all optional):
  detalii.txt            lines "Etichetă: valoare", e.g. "Dimensiuni: 8 x 6 x 3 cm", "Material: PLA mat"
  culori.txt             the product's colors, one per line ("Roșu" or "Roșu #e10600")
  culori-la-alegere.txt  colors the customer can pick from (choice goes into the cart)
  dimensiuni.jpg/.png    a photo with the measurements, shown under the details (not in the gallery)

Wool products keep using description.txt: its "Dimensiuni:", "Material:", "Culori:" … lines
are read from there.
"""
import os
import re
import shutil

from PIL import Image, ImageOps

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
MAX_SIDE = 1200

# Romanian color names -> swatch color. Longer names first so "verde mentă" wins over "verde".
COLORS = [
    (r'gri perlat', 'Gri perlat', '#c9ccd1'),
    (r'roz bombon', 'Roz bombon', '#f472b6'),
    (r'verde ment[ăa]', 'Verde mentă', '#a7f3d0'),
    (r'verde lime', 'Verde lime', '#a3e635'),
    (r'albastru[- ]denim', 'Albastru denim', '#4f6d9a'),
    (r'galben[- ]solar', 'Galben', '#fbbf24'),
    (r'galben aprins', 'Galben', '#facc15'),
    (r'alb[ăaei]?', 'Alb', '#ffffff'),
    (r'negr\w*|neagr\w*', 'Negru', '#111111'),
    (r'gri', 'Gri', '#9ca3af'),
    (r'ro[șs]\w*', 'Roșu', '#dc2626'),
    (r'roz', 'Roz', '#f9a8d4'),
    (r'portocal\w*', 'Portocaliu', '#f97316'),
    (r'galben\w*', 'Galben', '#facc15'),
    (r'verde|verzi', 'Verde', '#22c55e'),
    (r'albastr\w*', 'Albastru', '#3b82f6'),
    (r'maro', 'Maro', '#8b5a2b'),
    (r'mov', 'Mov', '#8b5cf6'),
    (r'turcoaz', 'Turcoaz', '#14b8a6'),
    (r'bordo', 'Bordo', '#7f1d1d'),
    (r'auri\w*', 'Auriu', '#d4af37'),
    (r'argint\w*', 'Argintiu', '#c0c0c0'),
    (r'bej', 'Bej', '#e8d8c3'),
    (r'crem', 'Crem', '#f5efe0'),
    (r'transparent', 'Transparent', '#e5e7eb'),
]

# Spec labels read from wool description.txt, mapped to how they show on the page
WOOL_LABELS = {
    'dimensiuni': 'Dimensiuni', 'mărime': 'Dimensiuni', 'marime': 'Dimensiuni',
    'material': 'Material', 'textură': 'Textură', 'textura': 'Textură',
    'culori': 'Culori', 'detalii': 'Detalii', 'accesorii': 'Accesorii',
}


def colors_in_text(text):
    """Color swatches for every known color word in a sentence, in order, without duplicates."""
    found = []
    for pattern, name, hex_ in COLORS:
        for m in re.finditer(rf'(?<!\w)(?:{pattern})(?!\w)', text, re.IGNORECASE):
            if any(m.start() < end and start < m.end() for start, end, _ in found):
                continue  # already covered by a longer name ("gri perlat" vs "gri")
            found.append((m.start(), m.end(), {'name': name, 'hex': hex_}))
    seen, colors = set(), []
    for _, _, c in sorted(found, key=lambda f: f[0]):
        if c['name'] not in seen:
            seen.add(c['name'])
            colors.append(c)
    return colors


def color_from_line(line):
    """'Roșu' or 'Roșu #e10600' -> swatch."""
    m = re.match(r'(.+?)\s+(#[0-9a-fA-F]{6})$', line.strip())
    if m:
        return {'name': m.group(1).strip(), 'hex': m.group(2).lower()}
    known = colors_in_text(line)
    return {'name': line.strip(), 'hex': known[0]['hex'] if known else '#9ca3af'}


def read_lines(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding='utf-8') as f:
        return [l.strip() for l in f if l.strip()]


def is_dimensions_image(filename):
    return os.path.splitext(filename)[0].lower() in ('dimensiuni', 'dimensions')


def optimize_images(folder):
    """New photos -> webp, max 1200px. Originals are kept in <folder>/.originale/ (not published)."""
    for f in sorted(os.listdir(folder)):
        path = os.path.join(folder, f)
        stem, ext = os.path.splitext(f)
        ext = ext.lower()
        if not os.path.isfile(path) or ext not in IMAGE_EXTENSIONS or ext == '.gif':
            continue
        img = Image.open(path)
        if ext == '.webp' and max(img.size) <= 1600:
            continue
        backup = os.path.join(folder, '.originale')
        os.makedirs(backup, exist_ok=True)
        shutil.copy2(path, os.path.join(backup, f))
        img = ImageOps.exif_transpose(img)
        img = img.convert('RGBA' if img.mode in ('RGBA', 'LA', 'P') else 'RGB')
        img.thumbnail((MAX_SIDE, MAX_SIDE))
        img.save(os.path.join(folder, stem + '.webp'), 'WEBP', quality=80, method=6)
        if ext != '.webp':
            os.remove(path)
        print(f'  optimizat: {f} -> {stem}.webp')


def specs_from_lines(lines):
    specs = []
    for line in lines:
        if ':' not in line:
            continue
        label, value = (s.strip() for s in line.split(':', 1))
        if label and value:
            specs.append({'label': label[0].upper() + label[1:], 'value': value})
    return specs


def wool_specs(description_text):
    specs = []
    for line in description_text.splitlines():
        if ':' not in line:
            continue
        label, value = (s.strip() for s in line.split(':', 1))
        key = label.lower()
        if key in WOOL_LABELS and value:
            specs.append({'label': WOOL_LABELS[key], 'value': value})
    return specs


def extras(folder, web_prefix, specs=None):
    """Optional fields for products.json; only keys that have data are returned."""
    out = {}
    specs = (specs or []) + specs_from_lines(read_lines(os.path.join(folder, 'detalii.txt')))
    if specs:
        out['specs'] = specs

    choice = read_lines(os.path.join(folder, 'culori-la-alegere.txt'))
    fixed = read_lines(os.path.join(folder, 'culori.txt'))
    if choice:
        out['colors'] = [color_from_line(l) for l in choice]
        out['color_choice'] = True
    elif fixed:
        out['colors'] = [color_from_line(l) for l in fixed]
    else:
        # Fall back to colors mentioned in the "Culori" (or "Detalii") spec
        for spec in specs:
            if spec['label'] == 'Culori' or 'culori' in spec['value'].lower():
                colors = colors_in_text(spec['value'])
                if colors:
                    out['colors'] = colors
                    break

    for f in sorted(os.listdir(folder)):
        if is_dimensions_image(f) and os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS:
            out['dimensions_image'] = f'{web_prefix}/{f}'
    return out
