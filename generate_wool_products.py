import os
import json
import re

BASE_DIR = 'Zeeply_Wool'
OUTPUT_JSON = 'wool/products.json'
OUTPUT_JS = 'wool/products.js'

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

def extract_price(text):
    """Extract price from the text file content."""
    match = re.search(r'Preț:\s*(\d+)\s*lei', text, re.IGNORECASE)
    if match:
        return match.group(1)
    return "40"

def extract_description(text):
    """Extract a clean description from the text file."""
    # Take the first meaningful paragraph (skip emoji lines, take first 2-3 sentences)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if not lines:
        return ""
    # Get the main description (first line or two, before bullet points)
    desc_lines = []
    for line in lines:
        if line.startswith(('Material:', 'Textură:', 'Dimensiuni:', 'Mărime:', 'Culori:', 'Preț:', 'Accesorii:', 'Detalii:', 'Ce include')):
            break
        # Clean emoji prefixes
        clean = re.sub(r'^[\U0001F300-\U0001FAD6\u2600-\u27BF\u200d\uFE0F\u2764]+\s*', '', line)
        if clean:
            desc_lines.append(clean)

    return ' '.join(desc_lines[:3]) if desc_lines else lines[0]

def get_products():
    products = []

    if not os.path.exists(BASE_DIR):
        print(f"Error: Directory '{BASE_DIR}' not found.")
        return []

    entries = sorted(os.listdir(BASE_DIR))

    for folder_name in entries:
        folder_path = os.path.join(BASE_DIR, folder_name)

        if not os.path.isdir(folder_path) or folder_name.startswith('.'):
            continue

        clean_name = folder_name.strip()

        # Read the text file for metadata
        text_file = os.path.join(folder_path, 'New Text Document.txt')
        text_content = ""
        if os.path.exists(text_file):
            with open(text_file, 'r', encoding='utf-8') as f:
                text_content = f.read().strip()

        price = extract_price(text_content)
        description = extract_description(text_content) if text_content else f"Handcrafted {clean_name}, made with love from soft velvet yarn."

        # Collect images
        images = []
        try:
            files = sorted(os.listdir(folder_path))
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in IMAGE_EXTENSIONS:
                    rel_path = f"../{BASE_DIR}/{folder_name}/{f}"
                    images.append(rel_path)
        except OSError as e:
            print(f"Skipping {folder_name}: {e}")
            continue

        if not images:
            continue

        product = {
            "name": clean_name,
            "category": "Amigurumi",
            "is_trending": False,
            "cover_image": images[0],
            "all_images": images,
            "price": price,
            "description": description
        }

        products.append(product)
        print(f"Generated: {clean_name} [{price} LEI]")

    return products

if __name__ == "__main__":
    data = get_products()

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(f"const products = {json.dumps(data, indent=2, ensure_ascii=False)};")

    print(f"\nSuccess! {len(data)} products written to {OUTPUT_JSON} and {OUTPUT_JS}")
