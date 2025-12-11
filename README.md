# DJONKOUD PARFUM - Guide Technique Complet

Ce document contient toutes les instructions pour déployer, mettre à jour et gérer la plateforme Djonkoud sur AWS EC2.

---

## 🚀 1. Déploiement Initial (AWS CloudFormation)

1.  Allez sur la **Console AWS** > **CloudFormation**.
2.  Créez une stack en uploadant le fichier `aws-cloudformation.yaml`.
3.  Une fois terminée, récupérez l'**IP Publique** dans l'onglet "Outputs".
4.  Votre serveur est prêt (Nginx, Node.js, MongoDB sont installés).

---

## 🔑 2. ÉTAPE CRUCIALE : Lier le Serveur à GitHub (À faire 1 seule fois)

Pour que la commande `update-app` fonctionne, votre serveur EC2 doit avoir le droit de télécharger votre code privé depuis GitHub. Voici comment faire :

### Étape A : Générer une "Clé" sur le Serveur
1.  Ouvrez le terminal de votre ordinateur (PowerShell ou Terminal).
2.  Connectez-vous à votre serveur AWS :
    ```bash
    ssh -i "votre-cle.pem" ubuntu@IP_DU_SERVEUR
    ```
3.  Une fois connecté (vous verrez `ubuntu@ip...`), tapez cette commande pour créer une clé d'identité pour le serveur :
    ```bash
    ssh-keygen -t ed25519 -C "server@djonkoud"
    ```
    *(Appuyez sur Entrée 3 fois pour tout laisser par défaut, ne mettez pas de mot de passe).*

4.  Affichez la clé publique :
    ```bash
    cat /home/ubuntu/.ssh/id_ed25519.pub
    ```
5.  **Copiez** tout le texte qui s'affiche (ça commence par `ssh-ed25519...`).

### Étape B : Donner la clé à GitHub
1.  Allez sur votre projet **GitHub** dans votre navigateur.
2.  Cliquez sur **Settings** (Paramètres du projet) > **Deploy Keys** (dans le menu à gauche).
3.  Cliquez sur **Add deploy key**.
4.  **Title** : "Serveur AWS EC2".
5.  **Key** : Collez le texte que vous avez copié à l'étape A.
6.  Cliquez sur **Add key**.

### Étape C : Installer le site pour la première fois
Retournez sur votre terminal (toujours connecté au serveur EC2) et tapez ceci :

```bash
# 1. On supprime le dossier vide créé par défaut
sudo rm -rf /var/www/djonkoud

# 2. On télécharge le code (Remplacez URL_GITHUB par le lien SSH de votre repo !)
# Le lien ressemble à : git@github.com:VOTRE_NOM/djonkoud.git
git clone git@github.com:VOTRE_NOM/djonkoud.git /var/www/djonkoud

# 3. On installe tout
cd /var/www/djonkoud
npm install
npm run build
sudo systemctl restart nginx
```

---

## 🔄 3. Mises à jour Quotidiennes (Automatique)

Une fois l'étape 2 terminée, la vie est belle.

Quand vous avez fait des modifications sur votre ordinateur et que vous avez fait un "Push" sur GitHub :

1.  Connectez-vous au serveur : `ssh -i ... ubuntu@IP`
2.  Lancez simplement la commande magique :
    ```bash
    sudo update-app
    ```

**C'est tout !** Le script va :
*   Parler à GitHub.
*   Télécharger les nouveautés.
*   Reconstruire le site.
*   Redémarrer le serveur.

---

## 📱 4. Gestion des Réseaux Sociaux & Liens

Vous avez deux façons de modifier les liens Facebook, Instagram, etc.

### Méthode 1 : Via l'Espace Admin (Recommandé)
C'est la méthode "No-Code".
1.  Connectez-vous sur `http://VOTRE_IP/admin/login`
2.  Allez dans **Paramètres** > Onglet **Contact & Réseaux**.
3.  Modifiez les champs "Instagram", "Facebook", "Twitter".
4.  Cliquez sur **Sauvegarder**.

### Méthode 2 : Via le Code (Pour changer les valeurs par défaut)
Si vous voulez changer les valeurs qui sont là au démarrage :
1.  Ouvrez le fichier `src/context/StoreContext.tsx` sur votre ordinateur.
2.  Cherchez les lignes 38 à 45.
3.  Remplacez `djonkoud_parfum` par votre vrai pseudo.

---

## 📍 5. Intégration Google Maps

Pour afficher la vraie carte de votre boutique :

1.  Allez sur [Google Maps](https://www.google.com/maps).
2.  Cherchez votre adresse exacte à Bamako.
3.  Cliquez sur **Partager** > **Intégrer une carte**.
4.  Copiez le lien `https://...` qui est à l'intérieur de `src="..."`.
5.  Ouvrez le fichier `src/pages/Contact.tsx`.
6.  Allez à la **Ligne 170** (environ).
7.  Remplacez l'URL existante par la vôtre.

---

## 🛠 Commandes Utiles (Mémo)

*   **Voir les logs du backend** : `pm2 logs`
*   **Redémarrer le site** : `sudo systemctl restart nginx`
*   **Mettre à jour le code** : `sudo update-app`
