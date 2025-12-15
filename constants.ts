import { Product, Order, PaymentMethod } from './types';

export const BRAND_NAME = "DJONKOUD PARFUM";
export const CURRENCY = "FCFA";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Thiouraye Royal de Ségou",
    price: 15000,
    category: "Encens",
    description: "Un mélange ancestral de graines de gowé et de résines rares.",
    story: "Inspiré par les cours royales de l'Empire Bambara, cet encens était brûlé lors des grandes cérémonies pour attirer prospérité et protection.",
    notes: ["Gowé", "Musc", "Ambre", "Oud"],
    image: "https://picsum.photos/id/106/800/800",
    rating: 4.9,
    stock: 50
  },
  {
    id: "2",
    name: "Brume du Djoliba",
    price: 22500,
    category: "Parfum d'Intérieur",
    description: "Une fraîcheur aquatique mêlée aux fleurs des rives du Niger.",
    story: "Le fleuve Niger, source de vie, apporte une brise fraîche au crépuscule. Cette brume capture l'instant où le soleil se couche sur l'eau.",
    notes: ["Lotus", "Bergamote", "Santal", "Jasmin"],
    image: "https://picsum.photos/id/292/800/800",
    rating: 4.7,
    stock: 30
  },
  {
    id: "3",
    name: "Nuit à Tombouctou",
    price: 18000,
    category: "Bougie Parfumée",
    description: "Chaleur épicée et mystère du désert sous les étoiles.",
    story: "Évoque le silence mystique des bibliothèques anciennes et la chaleur du thé à la menthe servi sous une tente nomade.",
    notes: ["Épices", "Tabac", "Vanille", "Cuir"],
    image: "https://picsum.photos/id/319/800/800",
    rating: 4.8,
    stock: 25
  },
  {
    id: "4",
    name: "Or de Bamako",
    price: 35000,
    category: "Coffret Prestige",
    description: "L'élégance absolue dans un coffret serti de motifs bogolan.",
    story: "Un hommage à la richesse culturelle du Mali, réunissant nos meilleures créations pour une expérience olfactive inoubliable.",
    notes: ["Safran", "Rose", "Oud", "Patchouli"],
    image: "https://picsum.photos/id/360/800/800",
    rating: 5.0,
    stock: 10
  },
  {
    id: "5",
    name: "Diguidjé Sacré",
    price: 12000,
    category: "Encens",
    description: "L'authenticité des racines parfumées pour purifier l'atmosphère.",
    story: "Utilisé par les mères pour bénir la maison, le Diguidjé apporte une note terreuse et apaisante qui reconnecte à la terre.",
    notes: ["Vétiver", "Terre cuite", "Encens pur"],
    image: "https://picsum.photos/id/514/800/800",
    rating: 4.6,
    stock: 100
  },
  {
    id: "6",
    name: "Fleur de Karité",
    price: 20000,
    category: "Parfum d'Intérieur",
    description: "Douceur enveloppante et crémeuse pour un intérieur cocooning.",
    story: "Célébration de l'arbre de vie, le Karité. Une odeur douce, presque laiteuse, qui rappelle les soins de beauté traditionnels.",
    notes: ["Karité", "Amande", "Fleur d'oranger"],
    image: "https://picsum.photos/id/600/800/800",
    rating: 4.8,
    stock: 45
  },
  {
    id: "7",
    name: "Bois d'Agar Pur (Oud) - Qualité Supérieure",
    price: 3500000,
    category: "Matière Première",
    description: "Copeaux de bois d'agar naturel et rare, importés d'Asie (Cambodge, Inde). L'or noir des parfumeurs.",
    story: "Une pièce de collection pour les connaisseurs. Ce bois d'agar, vieilli naturellement, dégage une fragrance complexe et spirituelle, connectant l'âme aux traditions millénaires.",
    notes: ["Bois d'Agar", "Cuir Ancien", "Résine"],
    image: "https://images.unsplash.com/photo-1621867208182-1c2543883a45?q=80&w=800&auto=format&fit=crop",
    rating: 5.0,
    sku: "GP-OUD-SUP-KILO",
    unit: "KG",
    stock: 5
  },
  {
    id: "8",
    name: "Oud Royal Luban",
    price: 12000,
    category: "Encens",
    description: "Mélange luxueux de bois d'agar et de résine de Luban (encens/oliban). Un parfum noble et raffiné.",
    story: "La rencontre majestueuse entre la sève sacrée de l'arbre à encens et la profondeur du bois d'oud. Utilisé pour purifier les demeures nobles.",
    notes: ["Oliban", "Oud", "Agrumes séchés"],
    image: "https://images.unsplash.com/photo-1608528577891-9b7e7b5a1b1a?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    sku: "GP-ORL-STD",
    unit: "Paquet",
    stock: 60
  },
  {
    id: "9",
    name: "Djekalan Grand Cru",
    price: 9500,
    category: "Encens Traditionnel",
    description: "Racines de Djekalan sélectionnées, lavées et parfumées artisanalement.",
    story: "Le secret des foyers maliens. Ces racines, récoltées au bord du fleuve, diffusent une chaleur apaisante et une odeur de terre mouillée après la pluie.",
    notes: ["Vétiver", "Terre", "Fleurs sauvages"],
    image: "https://images.unsplash.com/photo-1598514930379-3221b069fa72?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    sku: "GP-DJK-GC",
    unit: "Paquet",
    stock: 80
  },
  {
    id: "10",
    name: "Woussoulan Ambre Intense",
    price: 18000,
    category: "Encens",
    description: "La puissance du Woussoulan traditionnel sublimée par un cœur d'ambre gris.",
    story: "Une recette gardée jalousement, où les écorces macèrent des mois durant dans des huiles précieuses pour offrir une fumée dense et envoûtante.",
    notes: ["Ambre", "Épices", "Musc"],
    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    sku: "GP-WAI-INT",
    unit: "Pot 250g",
    stock: 40
  },
  {
    id: "11",
    name: "Bakhour Sultan",
    price: 14500,
    category: "Encens",
    description: "Copeaux de bois imprégnés d'huiles parfumées, de safran et de rose.",
    story: "Un hommage à l'hospitalité légendaire. Ce Bakhour est brûlé pour honorer les invités de marque, emplissant l'espace d'une douceur florale et boisée.",
    notes: ["Rose de Damas", "Safran", "Santal"],
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    sku: "GP-BKH-SUL",
    unit: "Paquet",
    stock: 55
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "CMD-24001",
    customerName: "Fatoumata Diop",
    customerEmail: "f.diop@example.com",
    items: [{ ...PRODUCTS[0], quantity: 1 }, { ...PRODUCTS[2], quantity: 1 }],
    total: 33000,
    status: 'delivered',
    paymentMethod: PaymentMethod.WAVE,
    date: "2024-05-15T14:30:00Z",
    shippingAddress: "ACI 2000, Bamako"
  },
  {
    id: "CMD-24002",
    customerName: "Moussa Traoré",
    customerEmail: "m.traore@example.com",
    items: [{ ...PRODUCTS[3], quantity: 1 }],
    total: 35000,
    status: 'preparing',
    paymentMethod: PaymentMethod.ORANGE_MONEY,
    date: "2024-05-18T09:15:00Z",
    shippingAddress: "Badalabougou, Bamako"
  },
  {
    id: "CMD-24003",
    customerName: "Amina Cissé",
    items: [{ ...PRODUCTS[1], quantity: 1 }, { ...PRODUCTS[4], quantity: 1 }],
    total: 34500,
    status: 'paid',
    paymentMethod: PaymentMethod.WAVE,
    date: "2024-05-19T18:45:00Z",
    shippingAddress: "Sotuba, Bamako"
  }
];

export const SLOGANS = [
  "L'âme du Mali, l'essence du luxe.",
  "Respirez la tradition, vivez l'exception.",
  "Djonkoud : L'élégance olfactive de nos ancêtres.",
  "Au-delà du parfum, un héritage.",
  "La signature invisible de votre intérieur."
];