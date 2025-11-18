const Publication = require("../models/Publication");
const Utilisateur = require("../models/Utilisateur");

// --- Client: Publier une nouvelle offre ---
async function createPublication(req, res) {
  try {
    const { titre, description, specialiteRequise, budget, clientId } =
      req.body;

    if (!titre || !description || !clientId) {
      return res
        .status(400)
        .json({
          error: "Missing required fields (titre, description, clientId)",
        });
    }

    const client = await Utilisateur.findById(clientId);
    if (!client) {
      return res.status(403).json({ error: "Invalid client ID or role" });
    }

    const newPublication = await Publication.create({
      titre,
      description,
      client: clientId,
      specialiteRequise,
      budget,
    });

    res.status(201).json({
      message: "Publication created successfully",
      publication: newPublication,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the publication" });
  }
}

// --- Développeur: Postuler à une offre ---
async function applyToPublication(req, res) {
  try {
    const { candidatId, message } = req.body;
    const { id } = req.params;

    if (!candidatId || !message) {
      return res
        .status(400)
        .json({ error: "Missing required fields (candidatId, message)" });
    }

    const publication = await Publication.findById(id);
    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    const alreadyApplied = publication.candidatures.some(
      (c) => c.candidatId.toString() === candidatId
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied to this job." });
    }

    const nouvelleCandidature = {
      candidatId,
      message,
    };

    publication.candidatures.push(nouvelleCandidature);
    await publication.save();

    res.status(200).json({
      message: "Application submitted successfully",
      publication: publication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while applying" });
  }
}

// --- Client: Accepter une candidature ---
async function acceptCandidature(req, res) {
  try {
    const { publicationId, candidatureId } = req.params;

    const publication = await Publication.findById(publicationId);
    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    const candidature = publication.candidatures.id(candidatureId);
    if (!candidature) {
      return res.status(404).json({ error: "Candidature not found" });
    }

    // Update candidature status to "Acceptée"
    candidature.statut = "Acceptée";
    publication.candidatureAcceptee = candidature.candidatId;
    publication.prixFinal = candidature.prixPropose;
    publication.delaiFinal = candidature.delaiPropose;
    publication.statut = "En cours";

    await publication.save();

    res.status(200).json({
      message: "Candidature accepted successfully",
      publication: publication,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while accepting the candidature" });
  }
}

// --- Récupérer toutes les publications ---
async function getAllPublications(req, res) {
  try {
    const publications = await Publication.find().populate(
      "client",
      "nom prenom email"
    );
    res.status(200).json(publications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching publications" });
  }
}

// --- Récupérer une publication par ID avec les infos du client et des candidats ---
async function getPublicationById(req, res) {
  try {
    const publication = await Publication.findById(req.params.id)
      .populate("client", "nom prenom email")
      .populate("candidatures.candidatId", "nom prenom email specialite");

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    res.status(200).json(publication);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the publication" });
  }
}

// --- Récupérer les publications d'un client ---
async function getClientPublications(req, res) {
  try {
    const { clientId } = req.params;
    const publications = await Publication.find({ client: clientId })
      .populate("client", "nom prenom email")
      .populate("candidatures.candidatId", "nom prenom email specialite");

    res.status(200).json(publications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching client publications" });
  }
}

// --- Récupérer les candidatures d'un freelance ---
async function getFreelanceCandidatures(req, res) {
  try {
    const { freelanceId } = req.params;
    const publications = await Publication.find({
      "candidatures.candidatId": freelanceId,
    })
      .populate("client", "nom prenom email")
      .populate("candidatures.candidatId", "nom prenom email specialite");

    res.status(200).json(publications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching candidatures" });
  }
}

// --- Mettre à jour une publication ---
async function updatePublication(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const publication = await Publication.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
      .populate("client", "nom prenom email")
      .populate("candidatures.candidatId", "nom prenom email specialite");

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    res.status(200).json(publication);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the publication" });
  }
}

// --- Supprimer une publication ---
async function deletePublication(req, res) {
  try {
    const { id } = req.params;
    const publication = await Publication.findByIdAndDelete(id);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the publication" });
  }
}

module.exports = {
  createPublication,
  applyToPublication,
  acceptCandidature,
  getAllPublications,
  getPublicationById,
  getClientPublications,
  getFreelanceCandidatures,
  updatePublication,
  deletePublication,
};
