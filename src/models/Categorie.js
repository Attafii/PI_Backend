const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
  nom_categorie: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String,
    required: true
  },
  icone: { 
    type: String,
    default: '💼' // Emoji or icon class name
  },
  couleur: {
    type: String,
    default: '#3B82F6' // Hex color code
  },
  actif: {
    type: Boolean,
    default: true
  },
  ordre: {
    type: Number,
    default: 0
  },
  nombrePublications: {
    type: Number,
    default: 0
  },
  //Ajouter la relation avec formation ObjectID
  formations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }],
}, {
  timestamps: true
});

const Categorie = mongoose.model('Categorie', CategorieSchema);

module.exports = Categorie;
