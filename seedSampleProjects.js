const mongoose = require('mongoose');
require('dotenv').config();

const Publication = require('./src/models/Publication');
const Utilisateur = require('./src/models/Utilisateur');
const Categorie = require('./src/models/Categorie');

async function seedSampleProjects() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie');

    // Récupérer le client et la catégorie
    const client = await Utilisateur.findOne({ email: 'client@test.com' });
    const devCategory = await Categorie.findOne({ nom: 'Développement Web & Mobile' });
    const designCategory = await Categorie.findOne({ nom: 'Design Graphique & UI/UX' });
    const aiCategory = await Categorie.findOne({ nom: 'Intelligence Artificielle & ML' });

    if (!client) {
      console.log('❌ Compte client non trouvé. Exécutez d\'abord seedTestUsers.js');
      mongoose.connection.close();
      return;
    }

    // Supprimer les anciens projets de test
    await Publication.deleteMany({ client: client._id });
    console.log('🗑️  Anciens projets de test supprimés');

    // Créer des projets d'exemple
    const sampleProjects = [
      {
        titre: 'Développement d\'une application e-commerce React',
        description: 'Je recherche un développeur React expérimenté pour créer une plateforme e-commerce moderne. L\'application doit inclure un panier, un système de paiement sécurisé, et un dashboard admin.\n\nFonctionnalités requises:\n- Catalogue de produits avec filtres\n- Panier et checkout\n- Intégration Stripe\n- Dashboard administrateur\n- Responsive design',
        budget: 3500,
        dateLimite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
        client: client._id,
        categorie: devCategory?._id,
        statut: 'Ouvert'
      },
      {
        titre: 'Refonte UI/UX d\'une application mobile',
        description: 'Nous avons besoin d\'un designer UI/UX pour repenser l\'interface de notre application mobile de fitness. L\'objectif est d\'améliorer l\'expérience utilisateur et moderniser le design.\n\nLivrables attendus:\n- Wireframes\n- Maquettes haute fidélité (Figma)\n- Prototype interactif\n- Guide de style',
        budget: 2000,
        dateLimite: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        client: client._id,
        categorie: designCategory?._id,
        statut: 'Ouvert'
      },
      {
        titre: 'Intégration d\'un chatbot IA pour site web',
        description: 'Recherche un expert en IA pour intégrer un chatbot intelligent sur notre site web. Le bot doit pouvoir répondre aux questions fréquentes et qualifier les leads.\n\nTechnologies souhaitées:\n- GPT-4 ou similaire\n- Formation sur nos données\n- Interface personnalisable',
        budget: 4500,
        dateLimite: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        client: client._id,
        categorie: aiCategory?._id,
        statut: 'Ouvert'
      },
      {
        titre: 'Développement API REST avec Node.js',
        description: 'Projet de création d\'une API REST complète pour notre nouvelle application. Documentation avec Swagger requise.',
        budget: 2500,
        dateLimite: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        client: client._id,
        categorie: devCategory?._id,
        statut: 'Ouvert'
      },
      {
        titre: 'Mission longue durée - Développeur Full Stack',
        description: 'Nous recherchons un développeur Full Stack pour une mission de 3 mois renouvelable. Travail à distance, 4-5 jours par semaine.\n\nStack technique:\n- Frontend: React, TypeScript\n- Backend: Node.js, PostgreSQL\n- DevOps: Docker, AWS',
        budget: 18000,
        dateLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        client: client._id,
        categorie: devCategory?._id,
        statut: 'Ouvert'
      }
    ];

    // Insérer les projets
    const createdProjects = await Publication.insertMany(sampleProjects);
    
    console.log(`✅ ${createdProjects.length} projets d'exemple créés\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 PROJETS CRÉÉS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.titre}`);
      console.log(`   💰 Budget: ${project.budget}€`);
      console.log(`   📅 Date limite: ${project.dateLimite.toLocaleDateString('fr-FR')}`);
      console.log(`   🏷️  Catégorie: ${project.categorie ? 'Oui' : 'Non assignée'}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Vous pouvez maintenant:');
    console.log('   1. Vous connecter en tant que client pour voir vos projets');
    console.log('   2. Vous connecter en tant que freelance pour postuler');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur lors de la création des projets:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

console.log('\n🚀 Création de projets d\'exemple...\n');
seedSampleProjects();
