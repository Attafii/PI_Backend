const mongoose = require('mongoose');

// Milestone sub-schema for phased payments
const MilestoneSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  montant: {
    type: Number,
    required: true
  },
  dateLimite: {
    type: Date
  },
  statut: {
    type: String,
    enum: ['En attente', 'En cours', 'Complété', 'Payé'],
    default: 'En attente'
  },
  livrables: [{
    nom: String,
    url: String,
    dateUpload: { type: Date, default: Date.now }
  }],
  dateCompletion: {
    type: Date
  },
  dateApprobation: {
    type: Date
  }
});

// Main Contract Schema
const ContratSchema = new mongoose.Schema({
  // Project reference
  publicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication',
    required: true
  },
  
  // Parties
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  freelanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  
  // Contract details
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Financial terms
  montantTotal: {
    type: Number,
    required: true
  },
  devise: {
    type: String,
    default: 'TND'
  },
  
  // Timeline
  dateDebut: {
    type: Date,
    default: Date.now
  },
  dateFinEstimee: {
    type: Date
  },
  dateFinReelle: {
    type: Date
  },
  delaiJours: {
    type: Number
  },
  
  // Contract status
  statut: {
    type: String,
    enum: ['Brouillon', 'Actif', 'En cours', 'Terminé', 'Annulé', 'En litige'],
    default: 'Brouillon'
  },
  
  // Legal terms
  termes: {
    type: String,
    default: `CONTRAT DE PRESTATION DE SERVICES

ENTRE LES SOUSSIGNÉS :

Le Client, ci-après dénommé "le Client"
ET
Le Freelancer, ci-après dénommé "le Prestataire"

ARTICLE 1 - OBJET DU CONTRAT
Le présent contrat a pour objet la réalisation du projet défini dans la publication associée.

ARTICLE 2 - OBLIGATIONS DU PRESTATAIRE
Le Prestataire s'engage à :
- Réaliser la prestation dans les délais convenus
- Livrer un travail de qualité professionnelle
- Respecter la confidentialité du projet

ARTICLE 3 - OBLIGATIONS DU CLIENT
Le Client s'engage à :
- Fournir toutes les informations nécessaires
- Répondre aux demandes dans des délais raisonnables
- Effectuer les paiements selon le calendrier convenu

ARTICLE 4 - PRIX ET CONDITIONS DE PAIEMENT
Le montant total de la prestation est défini dans les termes du contrat.
Les paiements seront effectués selon les jalons définis.

ARTICLE 5 - PROPRIÉTÉ INTELLECTUELLE
Les droits de propriété intellectuelle seront transférés au Client après paiement intégral.

ARTICLE 6 - RÉSILIATION
Chaque partie peut résilier le contrat en cas de manquement grave de l'autre partie.

ARTICLE 7 - LITIGES
En cas de litige, les parties s'engagent à rechercher une solution amiable.`
  },
  
  // Signatures
  signatureClient: {
    signed: { type: Boolean, default: false },
    date: Date,
    ipAddress: String,
    userAgent: String
  },
  signatureFreelance: {
    signed: { type: Boolean, default: false },
    date: Date,
    ipAddress: String,
    userAgent: String
  },
  
  // Milestones for phased payments
  milestones: [MilestoneSchema],
  
  // Progress tracking
  avancement: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Modification history
  historiqueModifications: [{
    date: { type: Date, default: Date.now },
    utilisateurId: mongoose.Schema.Types.ObjectId,
    action: String,
    details: String
  }],
  
  // Notes and comments
  notes: [{
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    contenu: String,
    date: { type: Date, default: Date.now }
  }]
  
}, {
  timestamps: true
});

// Indexes for better query performance
ContratSchema.index({ clientId: 1, statut: 1 });
ContratSchema.index({ freelanceId: 1, statut: 1 });
ContratSchema.index({ publicationId: 1 });

// Virtual for checking if contract is fully signed
ContratSchema.virtual('estSigne').get(function() {
  return this.signatureClient.signed && this.signatureFreelance.signed;
});

// Method to calculate milestone progress
ContratSchema.methods.calculerAvancement = function() {
  if (!this.milestones || this.milestones.length === 0) {
    return 0;
  }
  
  const completedMilestones = this.milestones.filter(m => m.statut === 'Payé' || m.statut === 'Complété').length;
  return Math.round((completedMilestones / this.milestones.length) * 100);
};

// Method to check if contract can be activated
ContratSchema.methods.peutEtreActive = function() {
  return this.signatureClient.signed && this.signatureFreelance.signed && this.statut === 'Brouillon';
};

const Contrat = mongoose.model('Contrat', ContratSchema);

module.exports = Contrat;
