const { Session, Formation } = require("../models/Formation");

async function addSession(req, res) {
  try {
    const { date_debut, date_fin, planning_seances, formationId } = req.body;

    // Vérifie si la formation existe
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation introuvable" });
    }

    // Crée une nouvelle session
    const newSession = await Session.create({
      date_debut,
      date_fin,
      planning_seances,
      formationId,
    });

    // Ajoute la session à la formation
    formation.sessions.push(newSession._id);
    await formation.save();

    res.status(201).json({
      message: "Session ajoutée avec succès",
      session: newSession,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la session :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

// async function getSessionsByFormation(req, res) {
//   try {
//     const { formationId } = req.params;

//     const sessions = await Session.find({ formationId });
//     res.status(200).json(sessions);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des sessions :", error);
//     res.status(500).json({ message: "Une erreur est survenue" });
//   }
// }
async function getSessionsByFormation(req, res) {
  try {
    const { formationId } = req.params;

    const sessions = await Session.find().populate({
      path: "formationId",
      select: "titre",  
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

async function getCountSessionsByFormation(req, res) {
  try {
    const { formationId } = req.params;

    const sessionsCount = await Session.countDocuments({ formationId });

    res.status(200).json({ count: sessionsCount });
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}



async function updateSession(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedSession = await Session.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedSession) {
      return res.status(404).json({ message: "Session introuvable" });
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la session :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

async function deleteSession(req, res) {
  try {
    const { id } = req.params;

    const deletedSession = await Session.findByIdAndDelete(id);
    if (!deletedSession) {
      return res.status(404).json({ message: "Session introuvable" });
    }

    await Formation.updateOne(
      { sessions: id },
      { $pull: { sessions: id } }
    );

    res.status(200).json({ message: "Session supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la session :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}
async function getAllSessions(req, res) {
  try {
    const sessions = await Session.find().populate({
      path: "formationId",
      select: "titre",  
    });
    
    if (!sessions.length) {
      return res.status(404).json({ message: "Aucune session trouvée" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les sessions :", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}
async function getSessionsByEmail(req, res) {
  try {
    const { email } = req.query; // Email du candidat passé en paramètre de la requête

    // On récupère les sessions où le candidat est inscrit, avec les informations de formation
    const sessions = await Session.find({ candidatEmail: email })
      .populate({
        path: "formationId",  // On va peupler la référence de la formation
        select: "titre",      // On récupère uniquement le titre de la formation
      });

    if (sessions.length === 0) {
      return res.status(404).json({ message: "Aucune session trouvée pour cet email." });
    }

    // Renvoie les sessions avec les formations associées
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions par email :", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des sessions." });
  }
}

module.exports = {
  addSession,
  getSessionsByFormation,
  updateSession,
  deleteSession,
  getCountSessionsByFormation,
  getAllSessions,
  getSessionsByEmail
};
