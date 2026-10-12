const products = [
  {
    "name": "Statuie GTA VI",
    "category": "General",
    "is_trending": true,
    "cover_image": "../Photos/(43)GTA6_Statuie/1.webp",
    "all_images": [
      "../Photos/(43)GTA6_Statuie/1.webp",
      "../Photos/(43)GTA6_Statuie/2.webp",
      "../Photos/(43)GTA6_Statuie/3.webp",
      "../Photos/(43)GTA6_Statuie/4.webp"
    ],
    "price": "40",
    "description": "Pe 25 iunie a \u00eenceput preorder-ul pentru GTA 6. Adaug\u0103 \u00een comand\u0103 \u0219i trofeul de birou GTA 6, pentru o a\u0219teptare care merit\u0103!"
  },
  {
    "name": "One Wish Willow",
    "category": "General",
    "is_trending": false,
    "cover_image": "../Photos/(44)OneWithWillow/1.webp",
    "all_images": [
      "../Photos/(44)OneWithWillow/1.webp",
      "../Photos/(44)OneWithWillow/2.webp"
    ],
    "price": "25",
    "description": "Ia-\u021bi dorin\u021ba acum! \u201eOne Wish Willow\u201d din Obsession."
  },
  {
    "name": "Buchet de Lalele \u201eEverbloom\u201d cu Vaza inclusa",
    "category": "Flori",
    "is_trending": true,
    "cover_image": "../Photos/(01) Buchet de Lalele \u201eEverbloom\u201d cu Vaza inclusa/1.webp",
    "all_images": [
      "../Photos/(01) Buchet de Lalele \u201eEverbloom\u201d cu Vaza inclusa/1.webp",
      "../Photos/(01) Buchet de Lalele \u201eEverbloom\u201d cu Vaza inclusa/2.webp",
      "../Photos/(01) Buchet de Lalele \u201eEverbloom\u201d cu Vaza inclusa/3.webp"
    ],
    "price": "80",
    "description": "Yoyo l-a postat \u00een videoclipul ei, de la noi! Este o vaz\u0103 printat\u0103 3D cu lalele printate 3D, disponibile \u00een orice culoare."
  },
  {
    "name": "F1 Race Calendar - Matte Edition",
    "category": "F1",
    "is_trending": true,
    "cover_image": "../Photos/(02) F1 Race Calendar - Matte Edition/1.webp",
    "all_images": [
      "../Photos/(02) F1 Race Calendar - Matte Edition/1.webp",
      "../Photos/(02) F1 Race Calendar - Matte Edition/2.webp",
      "../Photos/(02) F1 Race Calendar - Matte Edition/3.webp",
      "../Photos/(02) F1 Race Calendar - Matte Edition/4.webp",
      "../Photos/(02) F1 Race Calendar - Matte Edition/5.webp",
      "../Photos/(02) F1 Race Calendar - Matte Edition/7.webp"
    ],
    "price": "40",
    "description": "Calendar premium pentru sezonul F1 2026, cu finisaj mat."
  },
  {
    "name": "Suport Pix-uri F1",
    "category": "F1",
    "is_trending": true,
    "cover_image": "../Photos/(03) Suport Pix-uri F1/1.webp",
    "all_images": [
      "../Photos/(03) Suport Pix-uri F1/1.webp",
      "../Photos/(03) Suport Pix-uri F1/2.webp",
      "../Photos/(03) Suport Pix-uri F1/3.webp",
      "../Photos/(03) Suport Pix-uri F1/4.webp",
      "../Photos/(03) Suport Pix-uri F1/5.webp",
      "../Photos/(03) Suport Pix-uri F1/6.webp"
    ],
    "price": "45",
    "description": "Organizator de birou elegant, \u00een stil F1, pentru pixurile tale."
  },
  {
    "name": "Formula 1 Wall Display",
    "category": "F1",
    "is_trending": false,
    "cover_image": "../Photos/(04) Formula 1 Wall Display/1.webp",
    "all_images": [
      "../Photos/(04) Formula 1 Wall Display/1.webp",
      "../Photos/(04) Formula 1 Wall Display/2.webp",
      "../Photos/(04) Formula 1 Wall Display/3.webp",
      "../Photos/(04) Formula 1 Wall Display/4.webp",
      "../Photos/(04) Formula 1 Wall Display/5.webp",
      "../Photos/(04) Formula 1 Wall Display/6.webp"
    ],
    "price": "70",
    "description": "Un superb decor de perete cu o ma\u0219in\u0103 de Formula 1, perfect pentru pasiona\u021bii de curse."
  },
  {
    "name": "Stranger Things Kinder Joy Display",
    "category": "Stranger Things",
    "is_trending": true,
    "cover_image": "../Photos/(05) Stranger Things Kinder Joy Display/1.webp",
    "all_images": [
      "../Photos/(05) Stranger Things Kinder Joy Display/1.webp",
      "../Photos/(05) Stranger Things Kinder Joy Display/2.webp",
      "../Photos/(05) Stranger Things Kinder Joy Display/3.webp",
      "../Photos/(05) Stranger Things Kinder Joy Display/4.webp",
      "../Photos/(05) Stranger Things Kinder Joy Display/5.webp",
      "../Photos/(05) Stranger Things Kinder Joy Display/6.webp"
    ],
    "price": "120",
    "description": "Vitrin\u0103 de colec\u021bie exclusivist\u0103, \u00een form\u0103 de carte, pentru figurinele tale."
  },
  {
    "name": "Personalized Newborn Frame - Boy",
    "category": "Personalized",
    "is_trending": false,
    "cover_image": "../Photos/(06) Personalized Newborn Frame - Boy/1.webp",
    "all_images": [
      "../Photos/(06) Personalized Newborn Frame - Boy/1.webp",
      "../Photos/(06) Personalized Newborn Frame - Boy/2.webp"
    ],
    "price": "50",
    "description": "O ram\u0103 personalizat\u0103 superb\u0103 pentru nou-n\u0103scu\u021bi b\u0103ie\u021bi. Include nume, dat\u0103, or\u0103, greutate \u0219i \u00een\u0103l\u021bime personalizate."
  },
  {
    "name": "Personalized Newborn Frame - Girl",
    "category": "Personalized",
    "is_trending": false,
    "cover_image": "../Photos/(07) Personalized Newborn Frame - Girl/1.webp",
    "all_images": [
      "../Photos/(07) Personalized Newborn Frame - Girl/1.webp",
      "../Photos/(07) Personalized Newborn Frame - Girl/2.webp"
    ],
    "price": "50",
    "description": "O ram\u0103 personalizat\u0103 superb\u0103 pentru nou-n\u0103scute feti\u021be. Include nume, dat\u0103, or\u0103, greutate \u0219i \u00een\u0103l\u021bime personalizate."
  },
  {
    "name": "Figurine Fiends McDonalds Support",
    "category": "Big Products",
    "is_trending": true,
    "cover_image": "../Photos/(08) Figurine Fiends McDonalds Support/1.webp",
    "all_images": [
      "../Photos/(08) Figurine Fiends McDonalds Support/1.webp",
      "../Photos/(08) Figurine Fiends McDonalds Support/2.webp",
      "../Photos/(08) Figurine Fiends McDonalds Support/3.webp"
    ],
    "price": "120",
    "description": "Suport premium pentru expunerea figurinelor tale preferate."
  },
  {
    "name": "Counter Strike keycap",
    "category": "Keycaps",
    "is_trending": true,
    "cover_image": "../Photos/(09) Counter Strike keycap/1.webp",
    "all_images": [
      "../Photos/(09) Counter Strike keycap/1.webp",
      "../Photos/(09) Counter Strike keycap/6.webp",
      "../Photos/(09) Counter Strike keycap/7.webp",
      "../Photos/(09) Counter Strike keycap/8.webp"
    ],
    "price": "25",
    "description": "Keycap Counter-Strike cu finisaj mat, de \u00eenalt\u0103 calitate."
  },
  {
    "name": "League of Legends keycap",
    "category": "Keycaps",
    "is_trending": true,
    "cover_image": "../Photos/(10) League of Legends keycap/1.webp",
    "all_images": [
      "../Photos/(10) League of Legends keycap/1.webp",
      "../Photos/(10) League of Legends keycap/6.webp",
      "../Photos/(10) League of Legends keycap/7.webp",
      "../Photos/(10) League of Legends keycap/9.webp"
    ],
    "price": "25",
    "description": "Keycap League of Legends premium, cu finisaj mat."
  },
  {
    "name": "Valorant keycap",
    "category": "Keycaps",
    "is_trending": true,
    "cover_image": "../Photos/(11) Valorant keycap/1.webp",
    "all_images": [
      "../Photos/(11) Valorant keycap/1.webp",
      "../Photos/(11) Valorant keycap/2.webp",
      "../Photos/(11) Valorant keycap/3.webp",
      "../Photos/(11) Valorant keycap/4.webp",
      "../Photos/(11) Valorant keycap/5.webp",
      "../Photos/(11) Valorant keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap Valorant personalizat, pentru pasiona\u021bii de gaming."
  },
  {
    "name": "Dota2",
    "category": "Keycaps",
    "is_trending": true,
    "cover_image": "../Photos/(12) Dota2/1.webp",
    "all_images": [
      "../Photos/(12) Dota2/1.webp",
      "../Photos/(12) Dota2/2.webp",
      "../Photos/(12) Dota2/3.webp",
      "../Photos/(12) Dota2/4.webp",
      "../Photos/(12) Dota2/5.webp"
    ],
    "price": "25",
    "description": "Keycap Dota 2 detaliat, cu design mat."
  },
  {
    "name": "Heart keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(13) Heart keycap/1.webp",
    "all_images": [
      "../Photos/(13) Heart keycap/1.webp",
      "../Photos/(13) Heart keycap/4.webp",
      "../Photos/(13) Heart keycap/5.webp",
      "../Photos/(13) Heart keycap/6.webp",
      "../Photos/(13) Heart keycap/7.webp"
    ],
    "price": "25",
    "description": "Keycap superb \u00een form\u0103 de inim\u0103, pentru tastatura ta."
  },
  {
    "name": "Heart Lego",
    "category": "General",
    "is_trending": true,
    "cover_image": "../Photos/(14) Heart Lego/1.webp",
    "all_images": [
      "../Photos/(14) Heart Lego/1.webp",
      "../Photos/(14) Heart Lego/2.webp"
    ],
    "price": "20",
    "description": "Inim\u0103 din Lego, lucrat\u0103 manual, pentru colec\u021bia ta."
  },
  {
    "name": "Heart Puzzle",
    "category": "General",
    "is_trending": false,
    "cover_image": "../Photos/(15) Heart Puzzle/1.webp",
    "all_images": [
      "../Photos/(15) Heart Puzzle/1.webp",
      "../Photos/(15) Heart Puzzle/2.webp"
    ],
    "price": "30",
    "description": "Puzzle elegant \u00een form\u0103 de inim\u0103, perfect pentru cei dragi."
  },
  {
    "name": "Rust keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(16) Rust keycap/1.webp",
    "all_images": [
      "../Photos/(16) Rust keycap/1.webp",
      "../Photos/(16) Rust keycap/2.webp",
      "../Photos/(16) Rust keycap/3.webp",
      "../Photos/(16) Rust keycap/4.webp"
    ],
    "price": "25",
    "description": "Keycap mat inspirat din Rust, cu un aspect robust."
  },
  {
    "name": "Garry'S Mod",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(17) Garry'S Mod/1.webp",
    "all_images": [
      "../Photos/(17) Garry'S Mod/1.webp",
      "../Photos/(17) Garry'S Mod/2.webp",
      "../Photos/(17) Garry'S Mod/3.webp",
      "../Photos/(17) Garry'S Mod/4.webp",
      "../Photos/(17) Garry'S Mod/5.webp"
    ],
    "price": "25",
    "description": "Keycap personalizat, inspirat din iconicul Garry's Mod."
  },
  {
    "name": "Apex Legends keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(18) Apex Legends keycap/1.webp",
    "all_images": [
      "../Photos/(18) Apex Legends keycap/1.webp",
      "../Photos/(18) Apex Legends keycap/2.webp",
      "../Photos/(18) Apex Legends keycap/3.webp",
      "../Photos/(18) Apex Legends keycap/4.webp",
      "../Photos/(18) Apex Legends keycap/5.webp",
      "../Photos/(18) Apex Legends keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap Apex Legends, realizat cu precizie."
  },
  {
    "name": "Terraria keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(19) Terraria keycap/1.webp",
    "all_images": [
      "../Photos/(19) Terraria keycap/1.webp",
      "../Photos/(19) Terraria keycap/2.webp",
      "../Photos/(19) Terraria keycap/3.webp",
      "../Photos/(19) Terraria keycap/4.webp",
      "../Photos/(19) Terraria keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat, \u00een stil clasic, inspirat din Terraria."
  },
  {
    "name": "Team Fortress 2 keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(20) Team Fortress 2 keycap/1.webp",
    "all_images": [
      "../Photos/(20) Team Fortress 2 keycap/1.webp",
      "../Photos/(20) Team Fortress 2 keycap/2.webp",
      "../Photos/(20) Team Fortress 2 keycap/3.webp",
      "../Photos/(20) Team Fortress 2 keycap/4.webp",
      "../Photos/(20) Team Fortress 2 keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap de colec\u021bie Team Fortress 2, de calitate premium."
  },
  {
    "name": "Escape From Tarkov keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(21) Escape From Tarkov keycap/1.webp",
    "all_images": [
      "../Photos/(21) Escape From Tarkov keycap/1.webp",
      "../Photos/(21) Escape From Tarkov keycap/2.webp",
      "../Photos/(21) Escape From Tarkov keycap/3.webp",
      "../Photos/(21) Escape From Tarkov keycap/4.webp"
    ],
    "price": "25",
    "description": "Keycap tactic Escape From Tarkov, cu finisaj mat."
  },
  {
    "name": "Overwatch keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(22) Overwatch keycap/1.webp",
    "all_images": [
      "../Photos/(22) Overwatch keycap/1.webp",
      "../Photos/(22) Overwatch keycap/2.webp",
      "../Photos/(22) Overwatch keycap/3.webp",
      "../Photos/(22) Overwatch keycap/4.webp",
      "../Photos/(22) Overwatch keycap/5.webp",
      "../Photos/(22) Overwatch keycap/6.webp",
      "../Photos/(22) Overwatch keycap/7.webp"
    ],
    "price": "25",
    "description": "Keycap Overwatch, pentru fanii adev\u0103ra\u021bi."
  },
  {
    "name": "N7 keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(23) N7 keycap/1.webp",
    "all_images": [
      "../Photos/(23) N7 keycap/1.webp",
      "../Photos/(23) N7 keycap/2.webp",
      "../Photos/(23) N7 keycap/3.webp",
      "../Photos/(23) N7 keycap/4.webp",
      "../Photos/(23) N7 keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat premium, inspirat din Mass Effect N7."
  },
  {
    "name": "The Sims keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(24) The Sims keycap/1.webp",
    "all_images": [
      "../Photos/(24) The Sims keycap/1.webp",
      "../Photos/(24) The Sims keycap/2.webp",
      "../Photos/(24) The Sims keycap/3.webp",
      "../Photos/(24) The Sims keycap/4.webp",
      "../Photos/(24) The Sims keycap/5.webp",
      "../Photos/(24) The Sims keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap personalizat cu iconicul Plumbob din The Sims."
  },
  {
    "name": "Aphex Twin keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(25) Aphex Twin keycap/1.webp",
    "all_images": [
      "../Photos/(25) Aphex Twin keycap/1.webp",
      "../Photos/(25) Aphex Twin keycap/2.webp",
      "../Photos/(25) Aphex Twin keycap/3.webp",
      "../Photos/(25) Aphex Twin keycap/4.webp",
      "../Photos/(25) Aphex Twin keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat minimalist, cu logo-ul Aphex Twin."
  },
  {
    "name": "Minecraft keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(26) Minecraft keycap/1.webp",
    "all_images": [
      "../Photos/(26) Minecraft keycap/1.webp",
      "../Photos/(26) Minecraft keycap/2.webp",
      "../Photos/(26) Minecraft keycap/3.webp",
      "../Photos/(26) Minecraft keycap/4.webp",
      "../Photos/(26) Minecraft keycap/5.webp",
      "../Photos/(26) Minecraft keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap personalizat inspirat din Minecraft, cu aspectul cubic caracteristic."
  },
  {
    "name": "Rockstar keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(27) Rockstar keycap/1.webp",
    "all_images": [
      "../Photos/(27) Rockstar keycap/1.webp",
      "../Photos/(27) Rockstar keycap/2.webp",
      "../Photos/(27) Rockstar keycap/3.webp",
      "../Photos/(27) Rockstar keycap/4.webp"
    ],
    "price": "25",
    "description": "Keycap mat premium, cu logo-ul Rockstar Games."
  },
  {
    "name": "Candycan keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(28) Candycan keycap/1.webp",
    "all_images": [
      "../Photos/(28) Candycan keycap/1.webp",
      "../Photos/(28) Candycan keycap/2.webp",
      "../Photos/(28) Candycan keycap/3.webp",
      "../Photos/(28) Candycan keycap/4.webp",
      "../Photos/(28) Candycan keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap cu design dulce de acadea \u0219i finisaj mat festiv."
  },
  {
    "name": "The Upside Down Bookmark",
    "category": "Stranger Things",
    "is_trending": true,
    "cover_image": "../Photos/(29) The Upside Down Bookmark/1.webp",
    "all_images": [
      "../Photos/(29) The Upside Down Bookmark/1.webp",
      "../Photos/(29) The Upside Down Bookmark/2.webp",
      "../Photos/(29) The Upside Down Bookmark/3.webp"
    ],
    "price": "15",
    "description": "Semn de carte inspirat din Stranger Things, cu un aspect misterios."
  },
  {
    "name": "Stranger Things keychain",
    "category": "Stranger Things",
    "is_trending": true,
    "cover_image": "../Photos/(30) Stranger Things keychain/1.webp",
    "all_images": [
      "../Photos/(30) Stranger Things keychain/1.webp",
      "../Photos/(30) Stranger Things keychain/2.webp"
    ],
    "price": "15",
    "description": "Breloc mat Stranger Things, pentru fanii serialului."
  },
  {
    "name": "Pika keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(31) Pika keycap/1.webp",
    "all_images": [
      "../Photos/(31) Pika keycap/1.webp",
      "../Photos/(31) Pika keycap/2.webp",
      "../Photos/(31) Pika keycap/3.webp",
      "../Photos/(31) Pika keycap/4.webp",
      "../Photos/(31) Pika keycap/5.webp",
      "../Photos/(31) Pika keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap mat premium, dr\u0103g\u0103la\u0219, inspirat din Pika."
  },
  {
    "name": "SantaClaus keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(32) SantaClaus keycap/1.webp",
    "all_images": [
      "../Photos/(32) SantaClaus keycap/1.webp",
      "../Photos/(32) SantaClaus keycap/2.webp",
      "../Photos/(32) SantaClaus keycap/3.webp",
      "../Photos/(32) SantaClaus keycap/4.webp",
      "../Photos/(32) SantaClaus keycap/5.webp",
      "../Photos/(32) SantaClaus keycap/6.webp",
      "../Photos/(32) SantaClaus keycap/7.webp",
      "../Photos/(32) SantaClaus keycap/8.webp",
      "../Photos/(32) SantaClaus keycap/9.webp"
    ],
    "price": "25",
    "description": "Keycap festiv cu Mo\u0219 Cr\u0103ciun, edi\u021bie mat\u0103 de s\u0103rb\u0103tori."
  },
  {
    "name": "Wolft Keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(33) Wolft Keycap/1.webp",
    "all_images": [
      "../Photos/(33) Wolft Keycap/1.webp",
      "../Photos/(33) Wolft Keycap/2.webp",
      "../Photos/(33) Wolft Keycap/3.webp",
      "../Photos/(33) Wolft Keycap/4.webp",
      "../Photos/(33) Wolft Keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat premium, cu un design feroce de lup."
  },
  {
    "name": "The Finals keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(34) The Finals keycap/1.webp",
    "all_images": [
      "../Photos/(34) The Finals keycap/1.webp",
      "../Photos/(34) The Finals keycap/2.webp",
      "../Photos/(34) The Finals keycap/3.webp",
      "../Photos/(34) The Finals keycap/4.webp",
      "../Photos/(34) The Finals keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat The Finals, pentru jocul competitiv."
  },
  {
    "name": "Half Life keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(35) Half Life keycap/1.webp",
    "all_images": [
      "../Photos/(35) Half Life keycap/1.webp",
      "../Photos/(35) Half Life keycap/2.webp",
      "../Photos/(35) Half Life keycap/3.webp",
      "../Photos/(35) Half Life keycap/4.webp",
      "../Photos/(35) Half Life keycap/5.webp",
      "../Photos/(35) Half Life keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap mat legendar, cu simbolul Lambda din Half-Life."
  },
  {
    "name": "Suport Cheie Masina",
    "category": "General",
    "is_trending": false,
    "cover_image": "../Photos/(36) Suport Cheie Masina/1.webp",
    "all_images": [
      "../Photos/(36) Suport Cheie Masina/1.webp",
      "../Photos/(36) Suport Cheie Masina/2.webp",
      "../Photos/(36) Suport Cheie Masina/3.webp"
    ],
    "price": "50",
    "description": "Suport premium Zeeply pentru cheile ma\u0219inii tale."
  },
  {
    "name": "Snowman keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(37) Snowman keycap/1.webp",
    "all_images": [
      "../Photos/(37) Snowman keycap/1.webp",
      "../Photos/(37) Snowman keycap/2.webp",
      "../Photos/(37) Snowman keycap/3.webp",
      "../Photos/(37) Snowman keycap/4.webp",
      "../Photos/(37) Snowman keycap/5.webp"
    ],
    "price": "25",
    "description": "Keycap de iarn\u0103 cu om de z\u0103pad\u0103, cu finisaj mat de sezon."
  },
  {
    "name": "Turtadulce",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(38) Turtadulce/1.webp",
    "all_images": [
      "../Photos/(38) Turtadulce/1.webp",
      "../Photos/(38) Turtadulce/2.webp",
      "../Photos/(38) Turtadulce/3.webp",
      "../Photos/(38) Turtadulce/4.webp",
      "../Photos/(38) Turtadulce/5.webp"
    ],
    "price": "25",
    "description": "Keycap mat personalizat, inspirat din turt\u0103 dulce."
  },
  {
    "name": "Radiations keycap",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(39) Radiations keycap/1.webp",
    "all_images": [
      "../Photos/(39) Radiations keycap/1.webp",
      "../Photos/(39) Radiations keycap/2.webp",
      "../Photos/(39) Radiations keycap/3.webp",
      "../Photos/(39) Radiations keycap/4.webp",
      "../Photos/(39) Radiations keycap/5.webp",
      "../Photos/(39) Radiations keycap/6.webp"
    ],
    "price": "25",
    "description": "Keycap mat cu design \u00een stil radioactiv."
  },
  {
    "name": "Ciocolata",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(40) Ciocolata/1.webp",
    "all_images": [
      "../Photos/(40) Ciocolata/1.webp",
      "../Photos/(40) Ciocolata/2.webp",
      "../Photos/(40) Ciocolata/3.webp",
      "../Photos/(40) Ciocolata/4.webp",
      "../Photos/(40) Ciocolata/5.webp"
    ],
    "price": "25",
    "description": "Keycap personalizat \u00een form\u0103 de baton de ciocolat\u0103."
  },
  {
    "name": "Justachillfrog",
    "category": "Keycaps",
    "is_trending": false,
    "cover_image": "../Photos/(41) Justachillfrog/1.webp",
    "all_images": [
      "../Photos/(41) Justachillfrog/1.webp",
      "../Photos/(41) Justachillfrog/2.webp",
      "../Photos/(41) Justachillfrog/3.webp"
    ],
    "price": "25",
    "description": "Keycap mat premium cu o broscu\u021b\u0103 relaxat\u0103, Chillfrog."
  },
  {
    "name": "Barberpole",
    "category": "Big Products",
    "is_trending": false,
    "cover_image": "../Photos/(42) Barberpole/1.webp",
    "all_images": [
      "../Photos/(42) Barberpole/1.webp",
      "../Photos/(42) Barberpole/2.webp"
    ],
    "price": "250",
    "description": "St\u00e2lp de frizerie (barber pole) de dimensiuni mari, cu design clasic \u00een spiral\u0103. Decor de impact pentru orice salon sau frizerie."
  }
];