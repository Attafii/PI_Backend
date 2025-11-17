const { Formation, Session } = require('../models/Formation');
const Utilisateur = require('../models/Utilisateur');
const InscritSession = require('../models/InscritSession');
const mongoose = require('mongoose');

async function assisterSession(req, res) {
  try {
    const { candidatId, sessionId } = req.body;

    // Vérifier si le candidat existe
    const candidat = await Utilisateur.findById(candidatId);
    if (!candidat) {
      return res.status(404).json({ message: "Candidat introuvable." });
    }

    // Vérifier si la session existe
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    // Vérifier le nombre d'inscriptions pour la session
    const inscriptionsCount = await InscritSession.countDocuments({ sessions: sessionId });
    if (inscriptionsCount >= 15) {
      return res.status(400).json({ message: "Le nombre maximum d'inscriptions pour cette session a été atteint." });
    }

    let inscription = await InscritSession.findOne({ candidats: candidatId })
      .populate('candidats')
      .populate('sessions');

    // Si l'inscription n'existe pas, créer une nouvelle inscription
    if (!inscription) {
      inscription = new InscritSession({
        candidats: [candidatId],
        sessions: [sessionId],
      });

      await inscription.save();

      inscription = await InscritSession.findById(inscription._id)
        .populate('candidats')
        .populate('sessions');

      return res.status(201).json(inscription);
    }

    // Si le candidat est déjà inscrit à la session, on ne fait rien
    if (inscription.sessions.some((sess) => sess.equals(sessionId))) {
      return res.status(400).json({ message: "Le candidat est déjà inscrit à cette session." });
    }

    // Si le candidat n'est pas inscrit à cette session, on ajoute la session
    inscription.sessions.push(sessionId);
    await inscription.save();

    // Renvoyer l'inscription mise à jour
    inscription = await InscritSession.findById(inscription._id)
      .populate('candidats')
      .populate('sessions');

    return res.status(200).json(inscription);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de l'inscription à la session." });
  }
}

module.exports = { assisterSession };
