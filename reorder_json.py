import json

def reorder_products():
    input_file = 'products.json'
    try:
        with open(input_file, 'r') as f:
            products = json.load(f)
    except FileNotFoundError:
        print("products.json not found")
        return

    # User Request: "first cv (Cs), lol, valorant, rust all the games"
    
    # 1. Strict Priority List
    priority_keywords = ["Cs", "Lol", "Valorant", "Rust"]
    
    # 2. Other Games List (secondary priority)
    # Based on typical game names found in the file
    other_games_keywords = [
        "Apex", "Dota", "Over", "Tf2", "Minecraft", "Garry", "Terraria", 
        "Escape", "Finals", "Half Life", "N7", "The Sims", 
        # Adding more game-like names if present
        "Aphex Twin", "God of War", "Call of Duty", "Fortnite", "Gaming",
        "Cyberpunk", "Witcher", "Assassin"
    ]

    tier1_items = []
    tier2_items = []
    tier3_items = []

    used_indices = set()

    def matches(name, keyword):
        return keyword.lower() in name.lower()

    # 1. Tier 1: Strict Priority
    for kw in priority_keywords:
        for i, p in enumerate(products):
            if i in used_indices:
                continue
            if matches(p['name'], kw):
                tier1_items.append(p)
                used_indices.add(i)

    # 2. Tier 2: Other Games
    for i, p in enumerate(products):
        if i in used_indices:
            continue
        
        is_game = False
        for kw in other_games_keywords:
            if matches(p['name'], kw):
                is_game = True
                break
        
        # Also check category strictly for keycaps if appropriate, 
        # but user specifically asked for "games". Assuming keycaps ARE games mostly.
        # But let's check explicit keywords first.
        # If not matched by keyword, we can check category later if needed.
        if is_game:
            tier2_items.append(p)
            used_indices.add(i)

    # 3. Tier 3: Everything else
    for i, p in enumerate(products):
        if i not in used_indices:
            tier3_items.append(p)

    # Combine
    final_order = tier1_items + tier2_items + tier3_items

    # Write back
    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(final_order, f, indent=2)
    
    # Update products.js
    with open('products.js', 'w', encoding='utf-8') as f:
        f.write(f"const products = {json.dumps(final_order, indent=2)};")

    print(f"Reordered {len(final_order)} products.")
    print("New Top 5:", [p['name'] for p in final_order[:5]])

if __name__ == "__main__":
    reorder_products()
