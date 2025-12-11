# 🇲🇱 DJONKOUD PARFUM

**L'Essence du Mali - Plateforme E-commerce Premium & Intelligence Artificielle.**

Une application web complète (Frontend + Backend) pour une marque de parfumerie de luxe malienne. Elle intègre un catalogue produit, un panier, une gestion de commande via WhatsApp/API, un Back-office administrateur et une IA de recommandation de parfums.

---

## 🛠 Stack Technique

*   **Frontend :** React 18, Vite, TypeScript, Tailwind CSS.
*   **Backend :** Node.js, Express.
*   **Base de données :** MongoDB.
*   **IA :** Google Gemini API (Griot Parfumeur).
*   **Icônes :** Lucide React.

---

## 💻 Installation Locale (Développement)

Suivez ces étapes pour lancer le projet sur votre machine.

### 1. Prérequis
*   Node.js (v18 ou supérieur)
*   MongoDB (doit être installé et lancé localement)

### 2. Installation
```bash
# Cloner le projet
git clone https://github.com/votre-pseudo/djonkoud-app.git
cd djonkoud-app

# Installer les dépendances
npm install
```

### 3. Configuration (.env)
Créez un fichier `.env` à la racine du projet pour configurer l'IA (optionnel pour le dev, mais recommandé) :

```env
# Clé API Google Gemini (https://aistudio.google.com/)
API_KEY=votre_cle_api_ici

# Port du serveur (Défaut: 3000)
PORT=3000

# URL MongoDB (Défaut: locale)
MONGO_URI=mongodb://127.0.0.1:27017/djonkoud
```

### 4. Lancer le projet
Vous avez besoin de deux terminaux :

**Terminal 1 (Frontend) :**
```bash
npm run dev
```
> Le site sera accessible sur `http://localhost:5173`

**Terminal 2 (Backend) :**
```bash
npm run server
```
> L'API sera accessible sur `http://localhost:3000`

---

## 💳 Configuration des Paiements (Orange Money, Wave, Carte)

Le projet est configuré par défaut pour rediriger les paiements vers WhatsApp ou simuler une validation. Voici comment intégrer les vrais paiements :

### 1. Paiement via WhatsApp (Par défaut)
C'est la méthode la plus simple. Le client envoie sa commande sur WhatsApp et vous finalisez le paiement (Wave/OM) manuellement avec lui.
*   **Où changer les numéros ?**
    *   Fichier : `context/StoreContext.tsx`
    *   Ligne : Cherchez l'objet `whatsAppAgents`. Modifiez les numéros de téléphone pour chaque service (Commercial, Export, Grossiste).

### 2. Intégration API Réelle (Automatisée)
Pour connecter une vraie passerelle de paiement (ex: **CinetPay, PayDunya, Stripe**) afin de débiter les clients automatiquement :

*   **Fichier à modifier :** `pages/Checkout.tsx`
*   **Fonction à modifier :** `handlePayment` (environ ligne 118).
*   **Instruction :**
    Actuellement, la fonction crée directement la commande dans la base de données (`/api/orders`).
    Vous devez insérer le code de votre fournisseur de paiement AVANT l'appel à l'API.

    *Exemple de logique à implémenter :*
    ```javascript
    const handlePayment = async () => {
       // 1. Appeler l'API de paiement (ex: CinetPay)
       const paymentResult = await CinetPay.process({ ... });

       // 2. Si le paiement est validé, on enregistre la commande
       if (paymentResult.status === 'ACCEPTED') {
          // Appel au backend (code existant)
          const response = await fetch('/api/orders', ...);
       }
    }
    ```

---

## 📱 Fonctionnalités Clés

### Partie Publique
*   **Catalogue Immersion :** Présentation luxueuse des encens et parfums.
*   **Griot Parfumeur (IA) :** Recommandation de produits basée sur l'humeur et l'occasion via Gemini.
*   **Panier & Checkout :** Tunnel de commande optimisé pour le marché local (Wave, Orange Money, WhatsApp).
*   **Routage WhatsApp Intelligent :** Redirection automatique vers l'agent commercial approprié (Export, Grossiste, Bamako).

### Partie Administration (`/admin`)
*   **Dashboard :** Vue d'ensemble du CA et des commandes.
*   **Gestion Produits :** Ajouter/Modifier/Supprimer des articles.
*   **Gestion Commandes :** Suivi des statuts (En préparation, Livré...).
*   **Configuration :** Modification des textes, images d'accueil et numéros WhatsApp sans toucher au code.

---

## 🚀 Guide de Déploiement (Production AWS)

Ce guide vous explique étape par étape comment mettre le site en ligne sur un serveur Ubuntu (AWS EC2).

### ÉTAPE 1 : PRÉPARATION
Avant de mettre en ligne :
1.  Configurez vos vrais numéros dans `context/StoreContext.tsx`.
2.  Ajoutez votre clé API Gemini dans `services/geminiService.ts` (ou via variable d'environnement).
3.  Poussez votre code sur GitHub.

### ÉTAPE 2 : CRÉER LE SERVEUR
1.  Allez sur **AWS EC2** -> **Launch Instance**.
2.  OS : **Ubuntu Server 22.04 LTS**.
3.  Type : `t2.micro` (Gratuit).
4.  Sécurité : Ouvrez les ports **22 (SSH), 80 (HTTP), 443 (HTTPS)**.

### ÉTAPE 3 : INSTALLATION AUTOMATIQUE
Connectez-vous à votre serveur et lancez l'installation :

```bash
# 1. Connexion SSH
ssh -i "votre-cle.pem" ubuntu@VOTRE_IP_PUBLIQUE

# 2. Cloner le code (Utilisez votre URL GitHub)
git clone https://github.com/VOTRE_PSEUDO/djonkoud-app.git /var/www/djonkoud

# 3. Lancer le script de déploiement
cd /var/www/djonkoud
chmod +x deploy.sh
sudo ./deploy.sh
```

Le script va automatiquement :
*   Installer Node.js, Nginx, MongoDB.
*   Configurer le serveur web.
*   Lancer l'application.

### ÉTAPE 4 : ACCÈS ADMIN
Une fois en ligne, accédez à l'admin via `http://votre-ip/admin/login`.
*   **Email :** `admin@djonkoud.ml`
*   **Mot de passe :** `admin123`

---

## 📂 Structure du Projet

```
/
├── components/      # Composants React (UI, Layouts...)
├── context/         # Gestion d'état global (Panier, Auth, Store)
├── pages/           # Pages du site (Publiques et Admin)
├── services/        # Logique métier (Appels API, Gemini)
├── server.js        # Point d'entrée Backend (Express)
├── deploy.sh        # Script d'installation serveur
└── index.html       # Point d'entrée Frontend
```
