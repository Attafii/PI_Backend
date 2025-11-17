const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  date_debut: { type: Date },
  date_fin: { type: Date },
  planning_seances: { type: String }, // URL ou fichier
  formationId: { type: mongoose.Schema.Types.ObjectId, ref: "Formation"},
});

const FormationSchema = new mongoose.Schema({
  titre: { type: String, },
  description: { type: String},
  programme: { type: String }, // URL ou fichier
  niveau_difficulte: { type: String, enum: ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"] },
  changehorraire: { type: Number },
  image:{type:String},
  categorieId: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie"},
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }], // Relation
});

const Session = mongoose.model("Session", SessionSchema);
const Formation = mongoose.model("Formation", FormationSchema);

module.exports = { Formation, Session };
