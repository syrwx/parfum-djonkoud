# DJONKOUD PARFUM - Guide Technique Complet

Ce document est votre bible pour déployer, mettre à jour et interconnecter le système.

---

## 🚀 Partie 1 : Déploiement Initial (AWS)

1.  Allez sur la **Console AWS** > **CloudFormation**.
2.  Créez une stack en uploadant le fichier `aws-cloudformation.yaml`.
3.  Une fois terminée, récupérez l'**IP Publique** dans l'onglet "Outputs".
4.  Votre serveur est prêt (Nginx, Node.js, MongoDB sont installés).

---

## 💻 Partie 2 : Installation & Connexion Backend

C'est ici que l'on connecte le "Cerveau" (Backend) au "Visage" (Frontend).

### Comment ça marche ?
1.  **Frontend (React)** : Tourne dans le navigateur du client.
2.  **Nginx (Le Gardien)** : Reçoit les requêtes. Si c'est pour voir le site, il sert les fichiers React. Si c'est pour l'API (ex: `/api/orders`), il passe le relais au Backend.
3.  **Backend (Node.js)** : Tourne sur le port 3000 du serveur.
4.  **MongoDB** : Stocke les données sur le port 27017 (accessible uniquement par le Backend).

### Étape A : Créer le fichier Serveur
Sur votre ordinateur, créez un fichier nommé `server.js` à la racine de votre projet avec ce contenu de démarrage :

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/djonkoud')
  .then(() => console.log('✅ MongoDB Connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Schéma Commande
const OrderSchema = new mongoose.Schema({
    customerName: String,
    total: Number,
    items: Array,
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// Routes API
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', message: 'Bienvenue sur API Djonkoud' });
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ success: true, order: newOrder });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Démarrage
app.listen(3000, () => {
    console.log('🚀 Serveur Backend démarré sur le port 3000');
});
```

Ajoutez aussi ces lignes dans votre `package.json` sous "scripts" :
```json
"start:server": "node server.js"
```

### Étape B : Lancer le Backend sur EC2
Une fois que vous avez envoyé ce fichier sur GitHub et fait un `update-app` sur le serveur :

1.  Connectez-vous en SSH :
    ```bash
    ssh -i "cle.pem" ubuntu@IP
    ```
2.  Allez dans le dossier :
    ```bash
    cd /var/www/djonkoud
    ```
3.  Installez les outils backend :
    ```bash
    npm install express mongoose cors
    ```
4.  Lancez le serveur avec PM2 (pour qu'il ne s'arrête jamais) :
    ```bash
    pm2 start server.js --name "djonkoud-api"
    pm2 save
    pm2 startup
    ```

*Félicitations ! Votre API est vivante.* Vous pouvez tester en allant sur `http://VOTRE_IP/api/status`.

---

## 🔑 Partie 3 : Lier le Serveur à GitHub (Clés de Déploiement)

Pour que la commande `update-app` fonctionne, votre serveur EC2 doit avoir le droit de télécharger votre code privé depuis GitHub.

1.  **Sur le serveur (SSH)**, générez la clé :
    ```bash
    ssh-keygen -t ed25519 -C "server@djonkoud"
    # (Entrée 3 fois)
    cat /home/ubuntu/.ssh/id_ed25519.pub
    ```
    *Copiez le texte affiché.*

2.  **Sur GitHub** :
    *   Allez dans **Settings** > **Deploy Keys** > **Add deploy key**.
    *   Collez la clé et validez.

3.  **Sur le serveur**, première installation :
    ```bash
    sudo rm -rf /var/www/djonkoud
    # REMPLACEZ PAR VOTRE LIEN GITHUB SSH :
    git clone git@github.com:VOTRE_USER/djonkoud.git /var/www/djonkoud
    cd /var/www/djonkoud
    npm install
    npm run build
    ```

---

## 🔄 Partie 4 : Mises à jour (La méthode facile)

Quand vous modifiez le code (Frontend ou Backend) sur votre ordi et l'envoyez sur GitHub :

1.  Connectez-vous au serveur.
2.  Tapez : `sudo update-app`

Le script va tout faire : télécharger le code, reconstruire le site React, et redémarrer le serveur API Node.js.

---

## 📱 Partie 5 : Fonctionnalités Maliennes

### Checkout WhatsApp
J'ai intégré un bouton spécial dans le panier.
*   **Fonctionnement :** Il prend le contenu du panier et le formate en un message texte clair.
*   **Configuration :** Il utilise le numéro de téléphone défini dans l'Admin ou `StoreContext`. Assurez-vous que ce numéro a un compte WhatsApp actif.

### Google Maps
Pour changer la carte dans la page Contact :
1.  Allez sur Google Maps, trouvez votre boutique.
2.  Cliquez "Partager" > "Intégrer".
3.  Copiez le lien `https://...`
4.  Collez-le dans `src/pages/Contact.tsx` à la place de l'URL existante.

---

## 🛠 Mémo des Commandes

*   `pm2 status` : Voir si le backend tourne.
*   `pm2 logs` : Voir les erreurs du backend.
*   `sudo update-app` : Tout mettre à jour.
