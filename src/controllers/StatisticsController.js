require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// async function getCandidatsCount(req, res) { 
//     try {
//         const candidatsCount = await Utilisateur.countDocuments({ role: 'candidat' });
//         res.status(200).json({ message: 'Nombre de candidats', count: candidatsCount });
//     } catch (error) {
//         console.error(error); // Afficher l'erreur dans la console pour un débogage plus détaillé
//         res.status(500).json({ message: error.message });
//     }
// }

// async function getFormateursCount(req, res) {
//     try {
//         const formateursCount = await Utilisateur.countDocuments({ role: 'formateur' });
//         res.status(200).json({ message: 'Nombre de formateurs', count: formateursCount });
//     } catch (error) {
//         console.error(error); // Afficher l'erreur dans la console pour un débogage plus détaillé
//         res.status(500).json({ message: error.message });
//     }
// }


async function getSessionsByFormation(req, res) {
    try {
        const formationId = req.params.formationId;  // Récupère l'ID de la formation

        // Comptage des sessions liées à la formation
        const sessionsCount = await Session.countDocuments({ formationId: formationId, date_debut: { $gte: new Date() } });

        res.status(200).json({ count: sessionsCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getSessionsByFormateur(req, res) {
    try {
        const formateurId = req.params.formateurId;  // Récupère l'ID du formateur

        // Comptage des sessions assurées par le formateur
        const sessionsCount = await Session.countDocuments({ formateurId: formateurId, date_debut: { $lte: new Date() } });

        res.status(200).json({ count: sessionsCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getSessionsByFormation,
    getSessionsByFormateur
}