# 🌿 Last Meadow Online - NEXTERA Bot

[![Version](https://img.shields.io/badge/Version-1.4-5865F2?style=for-the-badge)](https://github.com/Skreball)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **L'assistant intelligent pour Last Meadow Online.** Automatisez vos cycles de récolte Discord, suivez votre loot en temps réel et optimisez votre progression avec un overlay dynamique et déplaçable.

---

## 📸 Aperçu du Projet

| Widget Actif (Vert) | Mode Attente (Rouge) | Dashboard Pop-up |
| :---: | :---: | :---: |
| ![Widget OK](https://via.placeholder.com/200x150?text=Widget+Vert) | ![Widget Wait](https://via.placeholder.com/200x150?text=Widget+Rouge) | ![Popup View](https://via.placeholder.com/200x150?text=Popup+Stats) |

---

## 📥 Installation (Mode Développeur)

Comme cette extension est un outil de productivité privé, elle s'installe via le mode développeur de votre navigateur (Chrome, Brave, Edge ou Opera).

1.  **Cloner le dépôt** :
    ```bash
    git clone [https://github.com/Skreball/nextera-lmo-bot.git](https://github.com/Skreball/nextera-lmo-bot.git)
    ```
    *(Ou téléchargez le projet en `.zip` et extrayez-le).*

2.  **Ouvrir les Extensions** :
    Tapez `chrome://extensions/` dans votre barre d'adresse.

3.  **Activer le Mode Développeur** :
    Basculez l'interrupteur **"Mode développeur"** (en haut à droite) sur ON.

4.  **Charger le projet** :
    Cliquez sur le bouton **"Charger l'extension décompressée"** et sélectionnez le dossier racine du projet (celui contenant le fichier `manifest.json`).

5.  **Épingler l'icône** :
    Cliquez sur l'icône "Puzzle" de votre barre d'outils et épinglez **NEXTERA BOT** pour suivre l'état du sniffer.

---

## 🚀 Comment lancer le Bot ?

L'extension utilise une technique de **"Request Sniffing"**. Elle a besoin de voir passer une action réelle pour apprendre à la reproduire.

### Étape 1 : Préparation
Ouvrez **Discord** dans votre navigateur et connectez-vous. Le widget NEXTERA apparaîtra en haut à droite en **ROUGE** avec le message : `ACTION REQUIRED ON DISCORD`.

### Étape 2 : Le Déclenchement (L'action mère)
Pour que le bot commence à travailler, vous devez effectuer **une séquence complète manuellement** :
1.  Lancez l'activité **Last Meadow Online** dans un salon.
2.  Lancez une récolte (cliquez sur **Start**).
3.  Attendez la fin du timer du jeu.
4.  Cliquez sur le bouton de validation (**Complete/Finish**).

### Étape 3 : Automatisation
Dès que vous avez validé manuellement, le widget passe instantanément au **VERT** :
*   Le bot a maintenant capturé vos identifiants de session (Token/Headers).
*   Il va désormais simuler ces requêtes en boucle avec des délais aléatoires "humains".
*   **Vous pouvez maintenant changer d'onglet ou réduire la fenêtre**, le bot continuera de récolter pour vous.

---

## ⚙️ Contrôles du Widget

*   **🕹️ Déplacement** : Cliquez et maintenez le bandeau bleu `NEXTERA BOT` pour placer l'overlay où vous voulez.
*   **📉 Réduction [-]** : Cliquez sur le bouton en haut à droite pour compacter le widget si vous jouez ou discutez.
*   **📈 Agrandissement [+]** : Affiche les compteurs de ressources (Bois, Métal, Cuir) et votre progression d'XP.
*   **🚫 Masquage** : Via la pop-up de l'extension, vous pouvez désactiver l'affichage du widget sans arrêter le bot.

---

## 🛡️ Sécurité & Rate Limits

Le bot intègre une gestion intelligente des erreurs :
*   **Code 429 (Rate Limit)** : Si Discord détecte trop de requêtes, le bot passe en **JAUNE**, s'arrête 5 secondes, puis reprend doucement.
*   **Code 404/401 (Session)** : Si vous actualisez Discord, les identifiants changent. Le bot repasse en **ROUGE** et attend que vous refassiez l'action de l'étape 2.

---

## 👨‍💻 Contribution & Crédits

Développé par **NEXTERA**.

[![GitHub](https://img.shields.io/badge/GitHub-Skreball-5865F2?style=for-the-badge&logo=github)](https://github.com/Skreball)

---
*Ce projet est destiné à un usage éducatif et personnel. L'utilisation de bots sur Discord peut aller à l'encontre de leurs conditions d'utilisation.*
