import os
import json
import re

# Configuration
BASE_DIR = 'Phothos' 
OUTPUT_JSON = 'products.json'
OUTPUT_JS = 'products.js'

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

def get_products():
    products = []
    
    if not os.path.exists(BASE_DIR):
        print(f"Error: Directory '{BASE_DIR}' not found.")
        return []

    # Get folders sorted by name to preserve the (01), (02) order
    entries = sorted(os.listdir(BASE_DIR))
    
    for folder_name in entries:
        folder_path = os.path.join(BASE_DIR, folder_name)
        
        if not os.path.isdir(folder_path) or folder_name.startswith('.'):
            continue

        # 1. Extract Product Name (removes leading order prefix like "(01) ")
        clean_name = re.sub(r'^[\(\d\)\.\s-]+', '', folder_name).strip()
        
        # 2. Load metadata from text files (with defaults)
        price_file = os.path.join(folder_path, 'price.txt')
        desc_file = os.path.join(folder_path, 'description.txt')
        cat_file = os.path.join(folder_path, 'category.txt')
        trend_file = os.path.join(folder_path, 'trending.txt')

        # Read values or use sensible defaults
        def read_file_safe(path, default=""):
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return f.read().strip()
            return default

        price = read_file_safe(price_file, "25")
        description = read_file_safe(desc_file, f"A premium {clean_name} design, meticulously crafted for the Zeeply collection.")
        category = read_file_safe(cat_file, "Keycaps")
        is_trending = read_file_safe(trend_file, "false").lower() == "true"

        # Special logic: If trending.txt doesn't exist, we can still use a fallback list or just default to False
        # (Already handled by read_file_safe default)

        # 3. Collect Images
        images = []
        try:
            files = sorted(os.listdir(folder_path))
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in IMAGE_EXTENSIONS:
                    # Relative path for web use
                    rel_path = f"{BASE_DIR}/{folder_name}/{f}"
                    images.append(rel_path)
        except OSError as e:
            print(f"Skipping {folder_name}: {e}")
            continue

        if not images:
            continue

        # 4. Build Product Object
        product = {
            "name": clean_name,
            "category": category,
            "is_trending": is_trending,
            "cover_image": images[0],
            "all_images": images,
            "price": price, 
            "description": description
        }
        
        products.append(product)
        print(f"Generated: {clean_name} [{category}]")

    return products

if __name__ == "__main__":
    data = get_products()
    
    # Save as JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    # Save as JS for local frontend access
    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(f"const products = {json.dumps(data, indent=2)};")
    
    print(f"\nSuccess! {len(data)} products written to {OUTPUT_JSON} and {OUTPUT_JS}")
