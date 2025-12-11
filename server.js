
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/djonkoud';

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connexion Base de Données ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connecté avec succès'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// --- Schémas de Données (Modèles) ---
const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
        {
            id: String,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    paymentMethod: String,
    status: { type: String, default: 'pending' }, // pending, paid, shipped, delivered, cancelled
    instructions: String,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// --- Routes API ---

// 1. Test de santé
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', message: 'API Djonkoud opérationnelle 🚀' });
});

// 2. Créer une nouvelle commande
app.post('/api/orders', async (req, res) => {
    try {
        console.log("📝 Nouvelle commande reçue:", req.body.customerName);
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, orderId: savedOrder._id });
    } catch (error) {
        console.error("Erreur création commande:", error);
        res.status(500).json({ success: false, error: "Impossible de sauvegarder la commande." });
    }
});

// 3. Récupérer les commandes (Pour l'admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Mettre à jour le statut d'une commande
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Servir le Frontend en Production ---
// Si on n'est pas en mode API pure, on sert les fichiers React
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// --- Démarrage ---
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
