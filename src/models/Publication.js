const mongoose = require('mongoose');

// Schéma pour une candidature à une publication
const candidatureSchema = new mongoose.Schema({
  candidatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Utilisateur', // Référence au modèle Utilisateur pour le développeur
    required: true 
  },
  dateCandidature: { 
    type: Date, 
    default: Date.now 
  },
  // Vous pouvez ajouter d'autres champs comme une lettre de motivation, un prix proposé, etc.
  message: { 
    type: String 
  } 
});

// Schéma pour la publication (l'offre d'emploi)
const publicationSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Utilisateur', // Référence au modèle Utilisateur pour le client
    required: true 
  },
  specialiteRequise: { 
    type: String 
  },
  budget: { 
    type: Number 
  },
  dateCreation: { 
    type: Date, 
    default: Date.now 
  },
  statut: { // Ex: 'Ouvert', 'En cours', 'Terminé'
    type: String, 
    default: 'Ouvert' 
  },
  candidatures: [candidatureSchema] // Tableau des candidatures
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;