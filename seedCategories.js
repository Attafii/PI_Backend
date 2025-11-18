const mongoose = require('mongoose');
require('dotenv').config();
const Categorie = require('./src/models/Categorie');

const categories = [
  {
    nom_categorie: 'Développement Web',
    description: 'Création de sites web, applications web, e-commerce, WordPress, etc.',
    icone: '💻',
    couleur: '#3B82F6',
    ordre: 1
  },
  {
    nom_categorie: 'Développement Mobile',
    description: 'Applications iOS, Android, React Native, Flutter',
    icone: '📱',
    couleur: '#8B5CF6',
    ordre: 2
  },
  {
    nom_categorie: 'Intelligence Artificielle',
    description: 'Machine Learning, Deep Learning, NLP, Computer Vision',
    icone: '🤖',
    couleur: '#EC4899',
    ordre: 3
  },
  {
    nom_categorie: 'Design Graphique',
    description: 'Logo, identité visuelle, illustrations, UI/UX',
    icone: '🎨',
    couleur: '#F59E0B',
    ordre: 4
  },
  {
    nom_categorie: 'Montage Vidéo',
    description: 'Montage, post-production, animation, effets spéciaux',
    icone: '🎬',
    couleur: '#EF4444',
    ordre: 5
  },
  {
    nom_categorie: 'Rédaction & Traduction',
    description: 'Rédaction web, articles, traduction, copywriting',
    icone: '✍️',
    couleur: '#10B981',
    ordre: 6
  },
  {
    nom_categorie: 'Marketing Digital',
    description: 'SEO, SEA, réseaux sociaux, email marketing, stratégie digitale',
    icone: '📊',
    couleur: '#06B6D4',
    ordre: 7
  },
  {
    nom_categorie: 'Data Science',
    description: 'Analyse de données, visualisation, Big Data, Business Intelligence',
    icone: '📈',
    couleur: '#6366F1',
    ordre: 8
  },
  {
    nom_categorie: 'Architecture & Design',
    description: 'Architecture 3D, design d\'intérieur, modélisation',
    icone: '🏛️',
    couleur: '#84CC16',
    ordre: 9
  },
  {
    nom_categorie: 'Photographie',
    description: 'Photographie produit, événementiel, retouche photo',
    icone: '📷',
    couleur: '#F97316',
    ordre: 10
  },
  {
    nom_categorie: 'Conseil & Expertise',
    description: 'Consulting business, stratégie, gestion de projet',
    icone: '💼',
    couleur: '#14B8A6',
    ordre: 11
  },
  {
    nom_categorie: 'Audio & Musique',
    description: 'Production musicale, mixage, sound design, voix off',
    icone: '🎵',
    couleur: '#A855F7',
    ordre: 12
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Categorie.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const result = await Categorie.insertMany(categories);
    console.log(`✅ Inserted ${result.length} categories successfully!`);

    // Display inserted categories
    result.forEach(cat => {
      console.log(`${cat.icone} ${cat.nom_categorie} - ${cat.couleur}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
