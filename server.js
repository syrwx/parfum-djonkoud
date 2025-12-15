
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// --- GESTION ANTI-CRASH ---
process.on('uncaughtException', (err) => {
  console.error('💥 ERREUR CRITIQUE NON GÉRÉE :', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 PROMESSE REJETÉE NON GÉRÉE :', reason);
});

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/djonkoud';

// --- Middleware ---
app.use(cors());
// Augmentation de la limite pour accepter les grandes images en Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware Anti-Cache pour l'API (Assure de voir les modifs admin tout de suite)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// --- SERVIR LE FRONTEND (FICHIERS STATIQUES) ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- Connexion Base de Données ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connecté avec succès');
    seedDatabase(); 
    seedAdmin();
  })
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// --- Schémas ---
const ProductSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: String,
    price: Number,
    category: String,
    description: String,
    story: String,
    notes: [String],
    image: String,
    rating: Number,
    sku: String,
    unit: String,
    stock: Number,
    logoOverlay: String
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: Array,
    total: Number,
    paymentMethod: String,
    status: { type: String, default: 'pending' },
    instructions: String,
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, default: 'admin' }
});
const Admin = mongoose.model('Admin', AdminSchema);

// --- DONNÉES INITIALES (Images Premium) ---
const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Thiouraye Royal de Ségou",
    price: 15000,
    category: "Encens",
    description: "Un mélange ancestral de graines de gowé et de résines rares.",
    story: "Inspiré par les cours royales de l'Empire Bambara, cet encens était brûlé lors des grandes cérémonies pour attirer prospérité et protection.",
    notes: ["Gowé", "Musc", "Ambre", "Oud"],
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1616401784845-180886ba9ca2?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1605218427368-36317b2c94d0?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    stock: 45
  },
  {
    id: "7",
    name: "Bois d'Agar Pur (Oud)",
    price: 3500000,
    category: "Matière Première",
    description: "Copeaux de bois d'agar naturel et rare, importés d'Asie.",
    story: "Une pièce de collection pour les connaisseurs. Ce bois d'agar dégage une fragrance complexe et spirituelle.",
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
    description: "Mélange luxueux de bois d'agar et de résine de Luban.",
    story: "La rencontre majestueuse entre la sève sacrée de l'arbre à encens et la profondeur du bois d'oud.",
    notes: ["Oliban", "Oud", "Agrumes séchés"],
    image: "https://images.unsplash.com/photo-1608528577891-9b7e7b5a1b1a?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    sku: "GP-ORL-STD",
    unit: "Paquet",
    stock: 60
  }
];

async function seedDatabase() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log('📦 Base de produits vide, injection des données initiales...');
            await Product.insertMany(INITIAL_PRODUCTS);
            console.log('✅ Produits injectés !');
        }
    } catch (error) {
        console.error('Erreur seeding produits:', error);
    }
}

async function seedAdmin() {
    try {
        const admin = await Admin.findOne();
        if (!admin) {
            await Admin.create({ email: 'admin@djonkoud.ml', password: 'admin123' });
            console.log('✅ Admin par défaut créé');
        }
    } catch (error) { console.error(error); }
}

// --- Routes API ---

app.get('/api/status', (req, res) => res.json({ status: 'Online' }));

// AUTH (Login & Update Password)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Authentification simple (sans hash pour ce MVP, en prod utiliser bcrypt)
        const user = await Admin.findOne({ email, password });
        if (user) res.json({ success: true, user: { email: user.email, name: 'Admin' } });
        else res.status(401).json({ success: false });
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

app.put('/api/auth/update', async (req, res) => {
    try {
        const { currentEmail, newEmail, newPassword } = req.body;
        const update = {};
        if (newEmail) update.email = newEmail;
        if (newPassword) update.password = newPassword;
        
        // Mise à jour de l'admin trouvé par l'email courant
        const updated = await Admin.findOneAndUpdate({ email: currentEmail }, update, { new: true });
        
        if (updated) {
            console.log("✅ Profil admin mis à jour");
            res.json({ success: true, user: updated });
        }
        else res.status(404).json({ success: false });
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

app.post('/api/products', async (req, res) => {
    try {
        const imageSize = req.body.image ? Math.round(req.body.image.length / 1024) + 'KB' : 'Pas d\'image';
        console.log(`📝 Création produit: ${req.body.name} (Image: ${imageSize})`);
        
        // Utilisation de ID fourni ou fallback
        const newProductData = { ...req.body };
        if (!newProductData.id) newProductData.id = Date.now().toString();

        const product = new Product(newProductData);
        await product.save();
        
        console.log('✅ Produit sauvegardé en DB !');
        res.json(product);
    } catch (e) { 
        console.error('❌ Erreur sauvegarde produit:', e);
        res.status(500).json({ error: "Erreur lors de la sauvegarde" }); 
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        console.log(`📝 Mise à jour produit ID: ${req.params.id}`);
        // { new: true } est CRUCIAL pour retourner l'objet mis à jour
        const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        
        if(product) {
            console.log('✅ Produit mis à jour irréversiblement en DB !');
            res.json(product);
        } else {
            console.warn('⚠️ Produit non trouvé pour mise à jour');
            res.status(404).json({ error: "Produit non trouvé" });
        }
    } catch (e) { 
        console.error("Erreur PUT:", e);
        res.status(500).json({ error: "Erreur" }); 
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        console.log(`🗑 Suppression produit ID: ${req.params.id}`);
        const result = await Product.deleteOne({ id: req.params.id });
        
        if (result.deletedCount > 0) {
            console.log('✅ Produit supprimé définitivement');
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Produit non trouvé" });
        }
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

// ORDERS
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const orderId = `CMD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const order = new Order({ ...orderData, id: orderId });
        await order.save();
        res.json({ success: true, order });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la commande" }); 
    }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findOneAndUpdate({ id: req.params.id }, { status });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

// --- ROUTE CATCH-ALL POUR REACT ROUTER ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- Démarrage Serveur ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
