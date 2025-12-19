
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
// Augmentation de la limite pour supporter les images Base64 HD sans crash
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// --- Connexion Base de Données ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connecté avec succès');
    // On ne fait le seeding QUE si nécessaire pour éviter de polluer les données réelles de l'utilisateur
    checkAndSeed();
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
    image: String, // Stockage Base64 optimisé
    rating: { type: Number, default: 5 },
    sku: String,
    unit: String,
    stock: { type: Number, default: 0 },
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
    date: { type: Date, default: Date.now },
    discountApplied: {
      code: String,
      amount: Number
    }
});
const Order = mongoose.model('Order', OrderSchema);

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, default: 'admin' }
});
const Admin = mongoose.model('Admin', AdminSchema);

const CouponSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: Number,
    active: { type: Boolean, default: true }
});
const Coupon = mongoose.model('Coupon', CouponSchema);

const SettingsSchema = new mongoose.Schema({
    contactInfo: {
        address: String,
        phone: String,
        email: String,
        hours: String,
        instagram: String,
        facebook: String,
        twitter: String,
        whatsAppAgents: Array
    },
    siteSettings: {
        heroTitle: String,
        heroSubtitle: String,
        heroImage: String,
        heroSlogan: String,
        wholesaleThreshold: Number,
        paymentMethods: [
          {
            id: String,
            name: String,
            active: Boolean
          }
        ]
    }
});
const Settings = mongoose.model('Settings', SettingsSchema);

// --- SEEDING INTELLIGENT ---
async function checkAndSeed() {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            console.log("🌱 Initialisation des paramètres site...");
            await Settings.create({
                contactInfo: {
                    address: "ACI 2000, Bamako, Mali",
                    phone: "+223 70 00 00 00",
                    email: "contact@djonkoud.ml",
                    hours: "Lun - Sam : 09h00 - 19h00",
                    whatsAppAgents: [
                      { id: '1', name: 'Service Boutique', phone: '+223 70 00 00 00', role: 'retail', active: true }
                    ]
                },
                siteSettings: {
                    heroTitle: "L'Âme du Mali",
                    heroSubtitle: "Mali • Tradition • Luxe",
                    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
                    heroSlogan: "L'essence du Mali, l'âme du luxe.",
                    wholesaleThreshold: 200000,
                    paymentMethods: [
                      { id: 'WAVE', name: 'Wave / Mobile Money', active: true },
                      { id: 'ORANGE_MONEY', name: 'Orange Money', active: true },
                      { id: 'CARD', name: 'Carte Bancaire / VISA', active: true },
                      { id: 'CASH', name: 'Paiement à la livraison', active: true },
                      { id: 'WHATSAPP', name: 'Conseiller Privé WhatsApp', active: true }
                    ]
                }
            });
        }
        
        const admin = await Admin.findOne();
        if (!admin) {
            await Admin.create({ email: 'admin@djonkoud.ml', password: 'admin123' });
        }
    } catch (e) { console.error(e); }
}

// --- Routes API ---
app.get('/api/status', (req, res) => res.json({ status: 'Connected', timestamp: Date.now() }));

// Settings
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/settings', async (req, res) => {
    try {
        const updated = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Auth
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email, password });
        if (user) res.json({ success: true, user: { email: user.email, name: 'Admin' } });
        else res.status(401).json({ success: false, message: "Identifiants invalides" });
    } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.put('/api/auth/update', async (req, res) => {
    try {
        const { currentEmail, newEmail, newPassword } = req.body;
        const updateData = {};
        if (newEmail) updateData.email = newEmail;
        if (newPassword) updateData.password = newPassword;

        const updated = await Admin.findOneAndUpdate({ email: currentEmail }, updateData, { new: true });
        if (updated) res.json({ success: true, user: { email: updated.email } });
        else res.status(404).json({ success: false, message: "Utilisateur non identifié" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 });
        res.json(products);
    } catch (e) { res.status(500).json({ error: "Erreur de chargement" }); }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product({ ...req.body, id: req.body.id || Date.now().toString() });
        await product.save();
        res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.deleteOne({ id: req.params.id });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Orders
app.get('/api/orders', async (req, res) => {
    try { res.json(await Order.find().sort({ date: -1 })); } catch (e) { res.status(500).send(e); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, order });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Serveur Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DJONKOUD SERVER démarré sur le port ${PORT}`);
});
