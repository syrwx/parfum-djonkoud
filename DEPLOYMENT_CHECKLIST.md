# ✅ CHECKLIST DE DÉPLOIEMENT

Suivez ces étapes dans l'ordre précis pour éviter les erreurs AWS.

## ÉTAPE 1 : Sauvegarder le code (GitHub)
Le serveur AWS va télécharger le code qui se trouve sur GitHub. Si votre code n'est que sur votre ordinateur, le serveur ne le verra pas.

1.  Ouvrez votre terminal.
2.  Exécutez les commandes suivantes :
    ```bash
    git add .
    git commit -m "Prêt pour déploiement"
    git push origin main
    ```
3.  Vérifiez sur le site web GitHub que vos fichiers sont bien à jour.

## ÉTAPE 2 : Lancer le serveur (AWS)
Si une pile précédente a échoué (Status: ROLLBACK_COMPLETE ou DELETE_COMPLETE), **elle est inutilisable**.

1.  Connectez-vous à la console **AWS CloudFormation**.
2.  Cliquez sur **Créer une pile** (Create Stack) > **Avec de nouvelles ressources**.
3.  Choisissez **"Importer un fichier de modèle"** (Upload a template file).
4.  Sélectionnez votre fichier `aws-cloudformation.yaml` (celui sur votre PC).
5.  Cliquez sur **Suivant**.

## ÉTAPE 3 : Configuration (Crucial)
1.  **Nom de la pile :** Donnez un nom UNIQUE (ex: `Djonkoud-App-V2`). Ne réutilisez pas un nom qui a planté.
2.  **InstanceType :** Vérifiez que `t3.micro` est sélectionné (c'est le standard gratuit actuel).
3.  **GitHubRepoUrl :** Vérifiez que le lien pointe bien vers VOTRE projet.
4.  Cliquez sur **Suivant** jusqu'à la fin, puis **Soumettre**.

## ÉTAPE 4 : Patience
L'installation prend environ **5 à 8 minutes**.
AWS va :
1.  Créer le serveur.
2.  Installer Node.js, Nginx et MongoDB.
3.  Cloner votre code depuis GitHub.
4.  Lancer le site.

Si tout va bien, le statut passera au vert : **CREATE_COMPLETE**.
