// const { Formation } = require("../models/Formation"); 
// const Tag = require("../models/Tag");
// const multer = require('multer');
// const Categorie = require('../models/Categorie'); // Import du modèle Categorie

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const fileType = file.mimetype.split('/')[0];
//    if (fileType === 'application' && file.mimetype.includes('pdf')) {
//       cb(null, 'uploads/programmes'); 
//     } else {
//       cb(new Error('Invalid file type'), false);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 Mo
// }).fields([
//   { name: 'programme', maxCount: 1 }, 
// ]);


const { Formation } = require("../models/Formation");
const Tag = require("../models/Tag");
const multer = require("multer");
const Categorie = require("../models/Categorie");
const fs = require("fs");
const path = require("path");

// Créer les dossiers nécessaires si inexistants
const directories = ["uploads/programmes", "uploads/images"];
directories.forEach((dir) => {
  const dirPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    if (file.mimetype.includes("pdf")) {
      cb(null, "uploads/programmes");
    } else if (fileType === "image") {
      cb(null, "uploads/images");
    } else {
      cb(new Error("Type de fichier invalide"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configuration Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo
}).fields([
  { name: "programme", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Méthode pour ajouter une formation
async function addFormation(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Erreur lors de l'upload :", err.message);
      return res.status(400).json({
        message: "Erreur lors de l'upload du fichier",
        error: err.message,
      });
    }

    try {
      const {
        titre,
        description,
        niveau_difficulte,
        changehorraire,
        categorieId,
        tags, // Les tags doivent être parsés s'ils sont envoyés sous forme de chaîne JSON
      } = req.body;

      if (!titre || !description || !niveau_difficulte || !categorieId) {
        return res
          .status(400)
          .json({ message: "Tous les champs obligatoires doivent être remplis." });
      }

      // Vérification de la catégorie
      const categorie = await Categorie.findById(categorieId);
      if (!categorie) {
        return res.status(404).json({ message: "Catégorie non trouvée." });
      }

      // Vérification des tags (si fournis)
      let validTags = [];
      if (tags) {
        let tagsArray;

        // S'assurer que `tags` est correctement parsé
        try {
          tagsArray = typeof tags === "string" ? JSON.parse(tags) : tags;
        } catch (parseError) {
          return res.status(400).json({
            message: "Les tags doivent être au format JSON valide.",
            error: parseError.message,
          });
        }

        validTags = await Tag.find({ _id: { $in: tagsArray } });
        if (validTags.length !== tagsArray.length) {
          return res
            .status(400)
            .json({ message: "Un ou plusieurs tags sont invalides." });
        }
      }

      // Vérification des fichiers uploadés
      const programme = req.files?.programme ? req.files.programme[0] : null;
      const image = req.files?.image ? req.files.image[0] : null;

      if (!programme) {
        return res.status(400).json({ message: "Le fichier programme est requis." });
      }

      // Construire les chemins des fichiers
      const programmePath = `/uploads/programmes/${programme.filename}`;
      const imagePath = image ? `/uploads/images/${image.filename}` : null;

      // Création de la formation
      const newFormation = new Formation({
        titre,
        description,
        niveau_difficulte,
        changehorraire,
        programme: programmePath,
        image: imagePath,
        categorieId,
        tags: validTags.map((tag) => tag._id),
      });

      // Sauvegarde de la formation
      await newFormation.save();

      // Ajouter l'ID de la formation à la catégorie
      categorie.formations.push(newFormation._id);
      await categorie.save();

      res.status(201).json({
        message: "Formation ajoutée avec succès.",
        formation: newFormation,
      });
    } catch (error) {
      console.error("Erreur serveur :", error.message);
      res.status(500).json({
        message: "Une erreur est survenue lors de l'ajout de la formation.",
        error: error.message,
      });
    }
  });
}



// async function addFormation(req, res) {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ 
//         message: "Erreur lors de l'upload du fichier", 
//         error: err.message 
//       });
//     }

//     try {
//       const { titre, description, niveau_difficulte, changehoraire ,tags} = req.body;

//       if (!titre || !description || !niveau_difficulte) {
//         return res.status(400).json({ 
//           message: "Tous les champs obligatoires doivent être remplis" 
//         });
//       }

//       const programme = req.files?.programme 
//         ? req.files.programme[0].path 
//         : null;
//         const validTags = await Tag.find({ _id: { $in: tags } });
//         if (validTags.length !== tags.length) {
//           return res.status(400).json({ message: "Un ou plusieurs tags sont invalides" });
//         }
//       const newFormation = new Formation({
//         titre,
//         description,
//         programme,
//         niveau_difficulte,
//         changehoraire,
//         tags
//       });

//       await newFormation.save();

//       res.status(201).json({
//         message: "Formation ajoutée avec succès",
//         formation: newFormation,
//       });
//     } catch (error) {
//       console.error("Erreur lors de l'ajout de la formation :", error);
//       res.status(500).json({ 
//         message: "Une erreur est survenue lors de l'ajout de la formation" 
//       });
//     }
//   });
// }

// async function addFormation(req, res) {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({
//         message: "Erreur lors de l'upload du fichier",
//         error: err.message
//       });
//     }

//     try {
//       const { titre, description, niveau_difficulte, changehoraire, categorieId, tags } = req.body;
//       const { programme } = req.files;  // Supposons que 'programme' soit le fichier uploadé pour la formation

//       // Vérification des champs obligatoires
//       if (!titre || !description || !niveau_difficulte || !categorieId) {
//         return res.status(400).json({ message: "Tous les champs de formation obligatoires doivent être remplis" });
//       }

//       // Vérification de la catégorie
//       const categorie = await Categorie.findById(categorieId);
//       if (!categorie) {
//         return res.status(404).json({ message: "Catégorie non trouvée" });
//       }

//       // Vérification des tags
//       let validTags = [];
//       if (tags && tags.length > 0) {
//         validTags = await Tag.find({ _id: { $in: tags } });
//         if (validTags.length !== tags.length) {
//           return res.status(400).json({ message: "Un ou plusieurs tags sont invalides" });
//         }
//       }

//       // Ajouter le chemin du programme si le fichier est présent
//       let programmePath = null;
//       if (programme) {
//         programmePath = `/uploads/programmes/${programme[0].filename}`;  // Utilisation du chemin du programme
//       }

//       // Créer la formation
//       const newFormation = new Formation({
//         titre,
//         description,
//         programme: programmePath, // Chemin du programme
//         niveau_difficulte,
//         changehoraire,
//         categorieId,
//         tags: validTags.map(tag => tag._id)
//       });

//       // Sauvegarder la formation
//       await newFormation.save();

//       // Ajouter l'ID de la formation à la catégorie
//       categorie.formations.push(newFormation._id);
//       await categorie.save();

//       res.status(201).json({
//         message: "Formation ajoutée avec succès",
//         formation: {
//           titre: newFormation.titre,
//           description: newFormation.description,
//           niveau_difficulte: newFormation.niveau_difficulte,
//           programme: `${process.env.BASE_URL}/uploads/programmes/${programme ? programme[0].filename : ''}`, // Renvoie le chemin complet du programme
//         },
//       });
//     } catch (error) {
//       console.error("Erreur lors de l'ajout de la formation :", error);
//       res.status(500).json({
//         message: "Une erreur est survenue lors de l'ajout de la formation"
//       });
//     }
//   });
// }



// Récupérer toutes les formations avec leurs tags
async function getAllFormations(req, res) {
  try {
    const formations = await Formation.find().populate("tags", "nom"); // Inclure les noms des tags
    res.status(200).json(formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Récupérer une formation par ID avec ses tags
async function getFormationById(req, res) {
  try {
    const formation = await Formation.findById(req.params.id).populate("tags", "nom");
    if (!formation) {
      return res.status(404).json({ message: "Formation introuvable" });
    }
    res.status(200).json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Mettre à jour une formation avec ses tags
// async function updateFormation(req, res) {
//   try {
//     const { tags, ...fieldsToUpdate } = req.body;

//     // Mettre à jour les tags si fournis
//     if (tags) {
//       fieldsToUpdate.tags = await Promise.all(
//         tags.map(async (tagName) => {
//           let tag = await Tag.findOne({ nom: tagName });
//           if (!tag) {
//             tag = await Tag.create({ nom: tagName });
//           }
//           return tag._id;
//         })
//       );
//     }

//     const formation = await Formation.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true }).populate("tags", "nom");
//     if (!formation) {
//       return res.status(404).json({ message: "Formation introuvable" });
//     }
//     res.status(200).json(formation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// Supprimer une formation
async function deleteFormation(req, res) {
  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({ message: "Formation introuvable" });
    }    await Formation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Formation supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const getFormationsCountByCategory = async (req, res) => {
  try {
    const result = await Formation.aggregate([
      // Étape 1 : Regrouper les formations par categorieId et compter
      {
        $group: {
          _id: "$categorieId", // Regroupe par categorieId
          count: { $sum: 1 },  // Compte le nombre de formations
        },
      },
      // Étape 2 : Faire un lookup pour joindre avec la collection "categories"
      {
        $lookup: {
          from: "categories",      // Collection "categories"
          localField: "_id",       // champ _id du groupe précédent
          foreignField: "_id",     // Correspond à _id dans "categories"
          as: "categorie",         // Nom du champ pour stocker les informations de la catégorie
        },
      },
      // Étape 3 : Décomposer le tableau "categorie"
      {
        $unwind: {
          path: "$categorie",      // Décompose le tableau "categorie"
          preserveNullAndEmptyArrays: true, // Garde les catégories même sans formations
        },
      },
      // Étape 4 : Projeter uniquement les champs nécessaires
      {
        $project: {
          _id: 0,                                 // Supprime l'_id
          categorieName: "$categorie.nom_categorie", // Nom de la catégorie
          count: 1,                               // Nombre de formations
        },
      },
      // Étape 5 : Ajouter un champ pour s'assurer que les catégories sans formations aient un count de 0
      {
        $addFields: {
          count: { $ifNull: ["$count", 0] }, // Si count est null, mettre 0
        },
      },
    ]);

    // Vérifier que le résultat est cohérent
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors du calcul des formations par catégorie :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// async function download(req, res) {
//   const filePath = `./uploads/programmes/${req.params.fileName}`; // Chemin du fichier
//   const fileName = req.params.fileName; // Nom du fichier

//   res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`); // Force le téléchargement
//   res.setHeader("Content-Type", "application/octet-stream"); // Type MIME générique pour téléchargement

//   res.download(filePath, (err) => {
//     if (err) {
//       console.error("Erreur lors du téléchargement :", err);
//       res.status(500).send("Erreur lors du téléchargement.");
//     }
//   });
// };







module.exports = {
  addFormation,
  getAllFormations,
  getFormationById,
  deleteFormation,
  getFormationsCountByCategory,
};
