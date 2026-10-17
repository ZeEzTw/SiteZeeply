# SiteZeeply

Site-ul [zeeply.studio](https://zeeply.studio): pagina de start, magazinele `3d/` și `wool/` și o pagină pentru fiecare produs.

## Cum adaugi un produs

1. Creează un folder nou:
   - 3D: `Photos/(45) Nume produs/`
   - Wool: `Zeeply_Wool/Nume produs/`
2. Pune pozele în folder, cu numele `1.jpg`, `2.jpg`… (prima e coperta). Le poți pune direct de pe telefon: scriptul le transformă automat în webp de 1200px, iar originalele rămân în `.originale/`, care nu se publică.
3. Adaugă fișierele text (vezi mai jos).
4. Rulează scriptul pentru magazinul respectiv. El actualizează catalogul și toate paginile de produs.
   - 3D: `python3 generate_products.py`
   - Wool: `python3 generate_wool_products.py`

## Fișiere text pentru produsele 3D

| Fișier | Conținut |
|---|---|
| `price.txt` | `40` |
| `description.txt` | descrierea produsului |
| `category.txt` | `Keycaps`, `F1`, `Flori`, `Stranger Things`, `Big Products` sau `General` |
| `trending.txt` | `true` ca să apară la Trending |
| `pinned.txt` | `true` ca să apară primul în listă |
| `name.txt` | alt nume decât cel al folderului (opțional) |

Produsele Wool folosesc un singur `description.txt`. Din el se citesc automat prețul (`Preț: 40 lei`) și rândurile `Dimensiuni:`, `Material:`, `Textură:`, `Culori:`, `Detalii:`, `Accesorii:`. Merg și `trending.txt` și `pinned.txt`, la fel ca la 3D.

## Detalii opționale pe pagina produsului (ambele magazine)

| Fișier | Ce face |
|---|---|
| `detalii.txt` | Tabelul „Detalii produs”. Câte un rând `Etichetă: valoare`, de exemplu `Dimensiuni: 8 x 6 x 3 cm` sau `Material: PLA mat` |
| `culori.txt` | Culorile produsului, afișate ca buline. Câte una pe rând: `Roșu`, sau o nuanță exactă: `Roșu #e10600` |
| `culori-la-alegere.txt` | Culorile dintre care alege clientul. Culoarea aleasă apare în coș și în emailul de comandă |
| `dimensiuni.jpg` | Poza cu dimensiunile. Apare sub „Detalii produs”, nu în galerie |

## Dacă editezi direct `3d/products.json` sau `wool/products.json`

Rulează `python3 generate_product_pages.py`, ca paginile de produs să se actualizeze.

Nu modifica de mână fișierele din `3d/p/` și `wool/p/`. Se rescriu la fiecare generare.
