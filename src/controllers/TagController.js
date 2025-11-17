// controllers/tagController.js
const Tag = require("../models/Tag");
const Formation = require("../models/Formation");

// Ajouter un tag
async function addTag(req, res) {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "Le champ nom est requis." });
        }

        const newTag = await Tag.create({ nom });

        res.status(201).json({ message: "Tag ajouté avec succès", tag: newTag });
    } catch (error) {
        console.error("Erreur lors de l'ajout du tag :", error);
        res.status(500).json({ message: "Une erreur est survenue." });
    }
}

// Récupérer tous les tags
async function getAllTags(req, res) {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        console.error("Erreur lors de la récupération des tags :", error);
        res.status(500).json({ message: "Une erreur est survenue." });
    }
}

// Mettre à jour un tag
async function updateTag(req, res) {
    try {
        const { id } = req.params;
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "Le champ nom est requis." });
        }

        const updatedTag = await Tag.findByIdAndUpdate(id, { nom }, { new: true });

        if (!updatedTag) {
            return res.status(404).json({ message: "Tag non trouvé." });
        }

        res.status(200).json({ message: "Tag mis à jour avec succès", tag: updatedTag });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du tag :", error);
        res.status(500).json({ message: "Une erreur est survenue." });
    }
}

// Supprimer un tag
async function deleteTag(req, res) {
    try {
        const tagId = req.params.id;
        
        // Recherche du tag à supprimer
        const result = await Tag.deleteOne({ _id: tagId });

        if (result.deletedCount === 0) {
            // Si aucun document n'a été supprimé, cela signifie que le tag n'a pas été trouvé
            return res.status(404).json({ message: 'Tag introuvable' });
        }

        res.status(200).json({ message: 'Tag supprimé avec succès' });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: 'Une erreur est survenue' });
    }
}
const getTagById = (req, res) => {
    const tagId = req.params.id;
    // Recherchez le tag dans la base de données avec tagId
    Tag.findById(tagId)
      .then(tag => {
        if (!tag) {
          return res.status(404).json({ message: "Tag non trouvé" });
        }
        res.json(tag);
      })
      .catch(err => {
        res.status(500).json({ message: "Erreur interne du serveur" });
      });
  };

module.exports = { addTag, getAllTags, updateTag, deleteTag,getTagById };
