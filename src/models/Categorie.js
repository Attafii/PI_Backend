const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
  nom_categorie: { type: String },
  description: { type: String},
  //Ajouter la relation avec formation ObjectID
  formations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }],
});

const Categorie = mongoose.model('Categorie', CategorieSchema);

module.exports = Categorie;
