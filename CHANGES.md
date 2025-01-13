# Changelog

Tous les changements notables d'**AMS** (Academia Management Sync) seront documentés dans ce fichier.  
Le format suit les conventions de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et respecte le versioning sémantique [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2025-01-13
### 🚀 Ajouté
- Initialisation du projet AMS.
- Gestion des utilisateurs avec rôles et permissions.
- Dashboard personnalisé pour les administrateurs, enseignants, étudiants, et autres types d’utilisateurs.
- API And Course and Subject Updated

### 🐛 Corrigé
- Correction des erreurs de migration lors de l’installation initiale sur PostgreSQL.
- Résolution d’un bug lié au formulaire de création d'un rôle.

### 🛠️ Modifié
- Amélioration des performances des requêtes SQL pour la recherche dans la base de données.
- Refactorisation du système de gestion des rôles pour plus de flexibilité.
- Mise à jour de la documentation d’installation dans le fichier README.md.
- API And Course and Subject Updated

---

## [0.9.0] - 2024-12-28
### 🚀 Ajouté
- Implémentation du système de base des utilisateurs : authentification, inscription et gestion des mots de passe.
- Création des migrations initiales pour les bases de données PostgreSQL.
- Mise en place d’un système d'authentication NextAuth

### 🛠️ Modifié
- Mise à jour du design de la page de connexion avec ShadCN.

---

## [0.8.0] - 2024-12-13
### 🚀 Ajouté
- Initialisation du projet avec une structure modulaire pour faciliter l’évolution.
- Intégration des dépendances clés (NextAuth, Shadcn, TailwindCSS).

---

## Historique des versions
Les versions antérieures à `0.8.0` ont été utilisées pour des tests internes et ne sont pas documentées ici.

---

## Légende des sections
- **🚀 Ajouté** : Nouvelles fonctionnalités ou modules introduits.
- **🛠️ Modifié** : Changements dans les fonctionnalités existantes.
- **🐛 Corrigé** : Bugs résolus.
- **⚠️ Supprimé** : Fonctionnalités supprimées.
- **🔒 Sécurité** : Mises à jour liées à la sécurité.
