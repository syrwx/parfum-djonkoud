# DJONKOUD PARFUM - Guide Technique

## ✅ GUIDE D'INSTALLATION ULTRA-RAPIDE

Puisque vous avez déjà mis votre code sur GitHub, l'installation se fait en **3 étapes** :

### 1. Lancez votre serveur AWS
Utilisez le fichier `aws-cloudformation.yaml` dans CloudFormation pour créer le serveur. Récupérez l'IP publique.

### 2. Connectez-vous en SSH
```bash
ssh -i "votre-cle.pem" ubuntu@VOTRE_IP_PUBLIQUE
```

### 3. Lancez le script d'installation automatique
Une fois connecté, copiez-collez ces commandes :

```bash
# 1. Récupérer le code (si ce n'est pas déjà fait)
# Remplacez par VOTRE lien GitHub
git clone git@github.com:VOTRE_UTILISATEUR/VOTRE_REPO.git /var/www/djonkoud

# 2. Lancer le script magique
cd /var/www/djonkoud
chmod +x deploy.sh
./deploy.sh
```

**C'est tout !** 
Le script `deploy.sh` va :
*   Mettre à jour le serveur.
*   Installer Node.js, MongoDB et Nginx.
*   Configurer la base de données.
*   Construire le site.
*   Lancer l'API Backend.

---

## 🔐 Identifiants par défaut
*   **Admin Panel :** `admin@djonkoud.ml` / `admin123`
*   **Base de données :** MongoDB tourne en local sur le port 27017 sans mot de passe (accessible uniquement depuis le serveur pour la sécurité).

## 🛠 Commandes utiles
*   `pm2 status` : Voir si l'API tourne.
*   `pm2 logs` : Voir les journaux de l'API.
*   `git pull && ./deploy.sh` : Mettre à jour le site après une modification.
