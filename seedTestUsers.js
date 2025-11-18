const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Utilisateur = require('./src/models/Utilisateur');

const testUsers = [
  {
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'client@test.com',
    mdp: 'Client123!',
    num_tel: '+33612345678',
    role: 'client',
    emailVerifie: true,
    description: 'Entrepreneur à la recherche de talents freelance pour mes projets digitaux',
    dateInscription: new Date(),
    derniereConnexion: new Date()
  },
  {
    nom: 'Martin',
    prenom: 'Alexandre',
    email: 'freelance@test.com',
    mdp: 'Freelance123!',
    num_tel: '+33698765432',
    role: 'freelance',
    specialite: 'Développement Web & Mobile',
    competences: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Git'],
    tarifHoraire: 45,
    description: 'Développeur Full Stack avec 5 ans d\'expérience. Spécialisé dans les applications web modernes avec React et Node.js. Passionné par la création de solutions élégantes et performantes. J\'ai travaillé sur de nombreux projets e-commerce, SaaS et applications métier. Je privilégie la qualité du code, les bonnes pratiques et une communication claire avec mes clients.',
    note: 4.8,
    nombreAvis: 24,
    emailVerifie: true,
    dateInscription: new Date(),
    derniereConnexion: new Date()
  }
];

async function seedTestUsers() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connexion à MongoDB réussie');

    // Supprimer les anciens comptes de test s'ils existent
    await Utilisateur.deleteMany({ 
      email: { $in: ['client@test.com', 'freelance@test.com'] } 
    });
    console.log('🗑️  Anciens comptes de test supprimés');

    // Hacher les mots de passe et créer les utilisateurs
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.mdp, 10);
      user.mdp = hashedPassword;
      
      const newUser = new Utilisateur(user);
      await newUser.save();
      
      console.log(`✅ Utilisateur créé: ${user.prenom} ${user.nom} (${user.role})`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Mot de passe: ${testUsers.find(u => u.email === user.email).mdp.split('').slice(0, -1).join('') + '!'}`);
    }

    console.log('\n🎉 Comptes de test créés avec succès!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 COMPTES DE TEST');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👤 COMPTE CLIENT:');
    console.log('   Email:    client@test.com');
    console.log('   Password: Client123!');
    console.log('   Role:     Client (pour poster des projets)');
    console.log('\n💼 COMPTE FREELANCE:');
    console.log('   Email:    freelance@test.com');
    console.log('   Password: Freelance123!');
    console.log('   Role:     Freelance (pour postuler aux projets)');
    console.log('   Skills:   React, Node.js, MongoDB, Express');
    console.log('   Rate:     45€/heure');
    console.log('   Rating:   4.8/5 (24 avis)');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Afficher les informations avant l'exécution
console.log('\n🚀 Création des comptes de test...\n');

seedTestUsers();
