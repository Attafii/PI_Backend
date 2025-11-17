const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String},
  prenom: { type: String },
  email: { type: String},
  mdp: { type: String},
  num_tel: { type: String },
  num_cin: { type: String },
  photo: { type: String },
  cv_pdf: { type: String },
  specialite: { type: String },
  role: { type: String }, 
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
