
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

// --- DONNÉES INITIALES ---
const INITIAL_PRODUCTS = [
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

// AUTH
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
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
        const updated = await Admin.findOneAndUpdate({ email: currentEmail }, update, { new: true });
        if (updated) res.json({ success: true, user: updated });
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
        
        const product = new Product(req.body);
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
        const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if(product) console.log('✅ Produit mis à jour en DB !');
        else console.warn('⚠️ Produit non trouvé pour mise à jour');
        res.json(product);
    } catch (e) { res.status(500).json({ error: "Erreur" }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        console.log(`🗑 Suppression produit ID: ${req.params.id}`);
        await Product.deleteOne({ id: req.params.id });
        res.json({ success: true });
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
