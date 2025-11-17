const Publication = require('../models/Publication');
const Utilisateur = require('../models/Utilisateur'); // Assurez-vous d'importer le modèle Utilisateur

// --- Client: Publier une nouvelle offre ---
async function createPublication(req, res) {
    try {
        // Le client ID pourrait être extrait du token JWT (authentification)
        // Pour l'instant, on suppose qu'il est fourni dans le corps de la requête ou directement disponible.
        const { titre, description, specialiteRequise, budget, clientId } = req.body; 

        if (!titre || !description || !clientId) {
            return res.status(400).json({ error: "Missing required fields (titre, description, clientId)" });
        }

        // Vérification que l'utilisateur existe et a le rôle 'client' (ajustez selon vos rôles)
        const client = await Utilisateur.findById(clientId);
        if (!client /* || client.role !== 'client' */) { // Décommentez pour forcer le rôle 'client'
            return res.status(403).json({ error: "Invalid client ID or role" });
        }

        const newPublication = await Publication.create({
            titre,
            description,
            client: clientId,
            specialiteRequise,
            budget
        });

        res.status(201).json({ 
            message: "Publication created successfully", 
            publication: newPublication 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while creating the publication" });
    }
}

// --- Développeur: Postuler à une offre ---
async function applyToPublication(req, res) {
    try {
        // Le candidat ID pourrait être extrait du token JWT
        const { candidatId, message } = req.body; 
        const { id } = req.params; // L'ID de la publication

        if (!candidatId || !message) {
            return res.status(400).json({ error: "Missing required fields (candidatId, message)" });
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({ error: "Publication not found" });
        }

        // Vérifier si le candidat a déjà postulé
        const alreadyApplied = publication.candidatures.some(
            c => c.candidatId.toString() === candidatId
        );

        if (alreadyApplied) {
            return res.status(400).json({ error: "You have already applied to this job." });
        }

        const nouvelleCandidature = {
            candidatId,
            message,
        };

        publication.candidatures.push(nouvelleCandidature);
        await publication.save();

        res.status(200).json({ 
            message: "Application submitted successfully", 
            publication: publication 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while applying" });
    }
}

// --- Récupérer toutes les publications ---
async function getAllPublications(req, res) {
    try {
        // Utiliser .populate('client') pour récupérer les infos du client
        const publications = await Publication.find().populate('client', 'nom prenom email'); // Sélectionner les champs du client
        res.status(200).json(publications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching publications" });
    }
}

// --- Récupérer une publication par ID avec les infos du client et des candidats ---
async function getPublicationById(req, res) {
    try {
        const publication = await Publication.findById(req.params.id)
            .populate('client', 'nom prenom email') 
            .populate('candidatures.candidatId', 'nom prenom email specialite'); // Populater les infos des candidats
            
        if (!publication) {
            return res.status(404).json({ error: "Publication not found" });
        }

        res.status(200).json(publication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching the publication" });
    }
}

module.exports = {
    createPublication,
    applyToPublication,
    getAllPublications,
    getPublicationById
};