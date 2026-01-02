
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const sharp = require('sharp');
const app = express();

// --- CONFIGURATION DU CACHE MÉMOIRE ---
let productCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

const clearProductCache = () => {
  productCache = null;
  cacheTimestamp = 0;
  console.log('🧹 Cache des produits invalidé.');
};

// --- UTILITAIRE DE COMPRESSION D'IMAGE ---
const optimizeImage = async (base64String) => {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String;
  }
  try {
    const parts = base64String.split(';base64,');
    const buffer = Buffer.from(parts[1], 'base64');
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    return `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('❌ Erreur optimisation image:', error);
    return base64String;
  }
};

// --- GESTION ANTI-CRASH ---
process.on('uncaughtException', (err) => console.error('💥 CRASH:', err));
process.on('unhandledRejection', (reason) => console.error('💥 REJET:', reason));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/djonkoud';

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- SERVIR LES FICHIERS STATIQUES ---
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  index: ['index.html']
}));

// --- Connexion Base de Données ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connecté');
    seedInitialConfig();
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// --- Schémas ---
const Product = mongoose.model('Product', new mongoose.Schema({
    id: { type: String, unique: true },
    name: String,
    price: Number,
    category: String,
    description: String,
    story: String,
    notes: [String],
    image: String,
    rating: { type: Number, default: 5 },
    sku: String,
    unit: String,
    stock: { type: Number, default: 0 },
    logoOverlay: String
}));

const Admin = mongoose.model('Admin', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Settings = mongoose.model('Settings', new mongoose.Schema({
    contactInfo: Object,
    siteSettings: Object
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    items: Array,
    total: Number,
    paymentMethod: String,
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
}));

async function seedInitialConfig() {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            await Settings.create({
                contactInfo: { address: "ACI 2000, Bamako, Mali", phone: "+223 70 00 00 00", email: "contact@djonkoud.ml", whatsAppAgents: [] },
                siteSettings: { 
                  heroTitle: "L'Âme du Mali", 
                  heroSubtitle: "Tradition & Luxe", 
                  heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop", 
                  heroSlogan: "L'essence du Mali.", 
                  wholesaleThreshold: 200000, 
                  paymentMethods: [
                    { id: 'WAVE', name: 'Wave', active: true },
                    { id: 'ORANGE_MONEY', name: 'Orange Money', active: true },
                    { id: 'WHATSAPP', name: 'WhatsApp', active: true }
                  ],
                  billboard: {
                    active: false,
                    title: "Offre Spéciale",
                    subtitle: "Découvrez nos essences les plus rares",
                    buttonText: "Découvrir",
                    link: "/collection",
                    image: "https://images.unsplash.com/photo-1605218427368-36317b2c94d0?q=80&w=1200&auto=format&fit=crop"
                  }
                }
            });
        }
        const admin = await Admin.findOne();
        if (!admin) await Admin.create({ email: 'admin@djonkoud.ml', password: 'admin123' });
    } catch (e) { console.error(e); }
}

// --- Routes API ---
app.get('/api/products', async (req, res) => {
    try {
        const now = Date.now();
        if (productCache && (now - cacheTimestamp < CACHE_TTL)) return res.json(productCache);
        const products = await Product.find().sort({ _id: -1 });
        productCache = products;
        cacheTimestamp = now;
        res.json(products);
    } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post('/api/products', async (req, res) => {
    try {
        const data = req.body;
        if (data.image) data.image = await optimizeImage(data.image);
        const product = new Product({ ...data, id: data.id || Date.now().toString() });
        await product.save();
        clearProductCache();
        res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const data = req.body;
        if (data.image && data.image.startsWith('data:image')) {
          data.image = await optimizeImage(data.image);
        }
        const product = await Product.findOneAndUpdate({ id: req.params.id }, data, { new: true });
        clearProductCache();
        res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.deleteOne({ id: req.params.id });
        clearProductCache();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email, password });
    if (user) res.json({ success: true, user: { email: user.email } });
    else res.status(401).json({ success: false });
});

app.get('/api/settings', async (req, res) => res.json(await Settings.findOne()));
app.put('/api/settings', async (req, res) => {
    const updated = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
});

app.get('/api/orders', async (req, res) => res.json(await Order.find().sort({ date: -1 })));
app.post('/api/orders', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true });
});

app.get('/api/status', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState }));

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVEUR DJONKOUD OPTIMISÉ SUR PORT ${PORT}`);
});
