# 🇲🇱 DJONKOUD PARFUM

**L'Essence du Mali - Plateforme E-commerce Premium & Intelligence Artificielle.**

Une application web complète pour une marque de parfumerie de luxe malienne. Elle intègre un catalogue, un panier, des commandes WhatsApp, un panneau administrateur et une IA (Le Griot) pour recommander des parfums.

---

## 🔐 ADMINISTRATION

L'interface d'administration est accessible via l'URL : `/admin/login` (ou `/#/admin/login` une fois déployé).

**Identifiants par défaut :**
*   **Email :** `admin@djonkoud.ml`
*   **Mot de passe :** `admin123`

Pour changer ces accès, modifiez le fichier `src/context/AuthContext.tsx` et redéployez.

---

## 🚀 DÉPLOIEMENT CONTINU (CD) - AUTOMATIQUE

Le projet est configuré pour se mettre à jour automatiquement sur votre serveur EC2 à chaque fois que vous faites un `git push`.

### 1. Récupérer vos informations
1.  **Hôte (Host) :** L'adresse IP Publique de votre instance EC2 (ex: `13.51.x.x`).
2.  **Clé Privée (Key) :** Le contenu de votre fichier `.pem` (celui que vous avez téléchargé lors de la création de la clé sur AWS). Ouvrez-le avec le bloc-notes et copiez tout, de `-----BEGIN RSA PRIVATE KEY-----` à `-----END RSA PRIVATE KEY-----`.

### 2. Configurer GitHub
Allez sur votre projet GitHub :
1.  Cliquez sur l'onglet **Settings** (Paramètres).
2.  Dans le menu à gauche, cliquez sur **Secrets and variables** > **Actions**.
3.  Cliquez sur le bouton vert **New repository secret**.
4.  Ajoutez les 2 secrets suivants (Respectez bien les majuscules) :

| Nom du Secret | Valeur à coller |
| :--- | :--- |
| `EC2_HOST` | L'adresse IP de votre serveur (ex: `35.180.x.x`) |
| `EC2_KEY` | Tout le contenu du fichier `.pem` |

### 3. C'est tout !
Maintenant, faites une modification, committez et pushez :
```bash
git add .
git commit -m "Mise en place du CD et fix Router"
git push origin main
```
Allez dans l'onglet **Actions** sur GitHub pour voir le déploiement se faire en direct.

**Note importante :** L'URL de l'admin changera légèrement.
*   Avant : `http://VOTRE_IP/admin/login`
*   Après : `http://VOTRE_IP/#/admin/login` (Notez le `#`). Cela garantit que la page fonctionne même si vous rechargez le navigateur.

---

## 🏗 Architecture du Projet

Le projet est divisé en deux parties principales qui discutent ensemble :

1.  **Le Frontend (Ce que le client voit) :**
    *   C'est le dossier `/src` (pages React, composants).
    *   Il est "construit" (`npm run build`) pour devenir des fichiers statiques (HTML/CSS/JS) dans le dossier `/dist`.
2.  **Le Backend (Le cerveau caché) :**
    *   C'est le fichier `server.js`.
    *   Il joue deux rôles :
        *   **Serveur Web :** Il envoie les fichiers du site aux visiteurs.
        *   **API (Serveur de données) :** Il reçoit les commandes et les enregistre dans MongoDB.

---

## 🔑 PRÉREQUIS : TA CLÉ GRATUITE GOOGLE (OBLIGATOIRE)

Pour que l'Intelligence Artificielle (Guide IA) fonctionne, la clé API suivante est configurée :
`AIzaSyCCvmXCSiyQub7R8sjFVNxD4j50DOmGGn8`

---

## 💻 Installation Locale (Sur ton PC)

1.  **Télécharger le code :**
    ```bash
    git clone https://github.com/votre-pseudo/djonkoud-app.git
    cd djonkoud-app
    ```

2.  **Installer les outils :**
    ```bash
    npm install
    ```

3.  **Configurer la clé :**
    Crée un fichier `.env` à la racine et colle ceci :
    ```text
    API_KEY=AIzaSyCCvmXCSiyQub7R8sjFVNxD4j50DOmGGn8
    MONGO_URI=mongodb://127.0.0.1:27017/djonkoud
    ```

4.  **Lancer le projet :**
    *   Ouvre un terminal : `npm run dev` (Site)
    *   Ouvre un 2ème terminal : `npm run server` (Backend)
