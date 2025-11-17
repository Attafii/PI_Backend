const mongoose = require('mongoose');

const InscritSessionSchema = new mongoose.Schema({
  candidats: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Utilisateur', 
    }
  ],
  sessions: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Session', 
    }
  ], 
  dateCreation: { 
    type: Date, 
    default: Date.now 
  },
});

const InscritSession = mongoose.model('InscritSession', InscritSessionSchema);

module.exports = InscritSession;
