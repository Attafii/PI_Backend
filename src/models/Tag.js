// models/Tag.js
const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true }, // Nom unique pour chaque tag
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
