const Categorie = require("../models/Categorie.js"); 
const FormationController = require("../controllers/FormationController.js"); 

const mongoose = require('mongoose');
require("dotenv").config();

async function addCategory(req, res) {
    try {
        const { nom_categorie, description } = req.body;
        if (!nom_categorie || !description) {
            return res.status(400).json({ message: "Les champs nom et description sont requis" });
        }
        const newCategory = await Categorie.create({
            nom_categorie,
            description,
        });
        res.status(201).json({
            message: "Catégorie ajoutée avec succès",
            categoryId: newCategory.idCategorie,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de la catégorie :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de l'ajout de la catégorie" });
    }
}

// const { Formation, Session } = require("../models/Formation");


// async function addCategory(req, res) {
//   try {
//     const { nom_categorie, description, formations } = req.body;

//     // Validation des champs requis
//     if (!nom_categorie || !description) {
//       return res.status(400).json({
//         message: "Les champs nom_categorie et description sont requis.",
//       });
//     }

//     // Référencer les formations existantes si des IDs sont fournis
//     const formationIds = formations && formations.length > 0
//       ? formations
//       : [];

//     // Créer la catégorie avec les références des formations
//     const newCategory = await Categorie.create({
//       nom_categorie,
//       description,
//       formations: formationIds,
//     });

//     res.status(201).json({
//       message: "Catégorie ajoutée avec succès.",
//       category: newCategory,
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'ajout de la catégorie :", error);
//     res.status(500).json({ message: "Une erreur est survenue." });
//   }
// }



async function getAllCategory(req, res) {
    try {
        const categories = await Categorie.find().populate({
            path: 'formations', 
            select: 'titre description niveau_difficulte', 
          }); 
        console.log("List of categories: ", categories);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: error.message });
    }
}
async function getCategoryById(req, res) {
    try {
      const categoryId = req.params.id;
      console.log(categoryId);
      const category = await Categorie.findById(categoryId).populate({
        path: 'formations',
        select: 'titre description niveau_difficulte',
      });
  
      if (!category) {
        return res.status(404).json({ message: "Catégorie introuvable" });
      }
  
      res.status(200).json(category);
    } catch (error) {
      console.error("Erreur lors de la récupération de la catégorie :", error);
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
  

async function updateCategory(req, res) {
    try {
        const categoryId = req.params.id; // Assurez-vous que l'ID est correct
        console.log("Category ID:", categoryId);

        // Vérifiez que l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        const fieldsToUpdate = req.body; 

        const updatedCategory = await Categorie.findByIdAndUpdate(
            categoryId,
            fieldsToUpdate,
            { new: true, runValidators: true } 
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "An error occurred" });
    }
}

async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.id;

        // Vérifier que l'ID de la catégorie est valide
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Rechercher la catégorie
        const category = await Categorie.findById(categoryId).populate("formations");
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Supprimer toutes les formations associées à cette catégorie
        if (category.formations && category.formations.length > 0) {
            for (const formation of category.formations) {
                // Supprimer les sessions associées à chaque formation
                if (formation.sessions && formation.sessions.length > 0) {
                    await Session.deleteMany({ _id: { $in: formation.sessions } });
                }
                // Supprimer la formation elle-même
                await Formation.findByIdAndDelete(formation._id);
            }
        }

        // Supprimer la catégorie elle-même
        await Categorie.findByIdAndDelete(categoryId);

        res.status(200).json({ message: "Category, formations, and related sessions deleted successfully." });
    } catch (error) {
        console.error("Error deleting category, formations, and sessions:", error);
        res.status(500).json({ message: "An error occurred while deleting the category." });
    }
}


// async function deleteCategory(req, res) {
//     try {
//         const categoryId = req.params.id;
//         const category = await Categorie.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         await Categorie.deleteOne({ _id: categoryId });

//         res.status(200).json({ message: "Category deleted successfully" });
//     } catch (error) {
//         console.error(error); 
//         res.status(500).json({ message: "An error occurred" });
//     }
// }

module.exports = {
    addCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}