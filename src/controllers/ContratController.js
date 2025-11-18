const Contrat = require('../models/Contrat');
const Publication = require('../models/Publication');
const Utilisateur = require('../models/Utilisateur');

// Create a new contract (usually auto-generated after bid acceptance)
const createContrat = async (req, res) => {
  try {
    const {
      publicationId,
      clientId,
      freelanceId,
      montantTotal,
      delaiJours,
      milestones,
      termes
    } = req.body;

    // Fetch publication details
    const publication = await Publication.findById(publicationId);
    if (!publication) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }

    // Calculate estimated end date
    const dateFinEstimee = new Date();
    dateFinEstimee.setDate(dateFinEstimee.getDate() + (delaiJours || 30));

    // Create contract
    const contrat = new Contrat({
      publicationId,
      clientId,
      freelanceId,
      titre: publication.titre,
      description: publication.description,
      montantTotal,
      delaiJours,
      dateFinEstimee,
      milestones: milestones || [],
      termes: termes || undefined // Will use default if not provided
    });

    await contrat.save();

    res.status(201).json({
      message: 'Contrat créé avec succès',
      contrat
    });

  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ message: 'Erreur lors de la création du contrat', error: error.message });
  }
};

// Get contract by ID
const getContratById = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id)
      .populate('clientId', 'nom prenom email photo')
      .populate('freelanceId', 'nom prenom email photo specialite')
      .populate('publicationId');

    if (!contrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    res.status(200).json(contrat);

  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du contrat', error: error.message });
  }
};

// Get all contracts for a client
const getClientContrats = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { statut } = req.query;

    const filter = { clientId };
    if (statut) {
      filter.statut = statut;
    }

    const contrats = await Contrat.find(filter)
      .populate('freelanceId', 'nom prenom email photo specialite')
      .populate('publicationId', 'titre')
      .sort({ createdAt: -1 });

    res.status(200).json(contrats);

  } catch (error) {
    console.error('Error fetching client contracts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error: error.message });
  }
};

// Get all contracts for a freelancer
const getFreelanceContrats = async (req, res) => {
  try {
    const { freelanceId } = req.params;
    const { statut } = req.query;

    const filter = { freelanceId };
    if (statut) {
      filter.statut = statut;
    }

    const contrats = await Contrat.find(filter)
      .populate('clientId', 'nom prenom email photo')
      .populate('publicationId', 'titre')
      .sort({ createdAt: -1 });

    res.status(200).json(contrats);

  } catch (error) {
    console.error('Error fetching freelance contracts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error: error.message });
  }
};

// Sign contract (client or freelancer)
const signContrat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userType, ipAddress, userAgent } = req.body; // userType: 'client' or 'freelance'

    const contrat = await Contrat.findById(id);
    if (!contrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    // Verify user is authorized to sign
    if (userType === 'client' && contrat.clientId.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à signer ce contrat' });
    }
    if (userType === 'freelance' && contrat.freelanceId.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à signer ce contrat' });
    }

    // Apply signature
    const signatureData = {
      signed: true,
      date: new Date(),
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('User-Agent')
    };

    if (userType === 'client') {
      contrat.signatureClient = signatureData;
    } else {
      contrat.signatureFreelance = signatureData;
    }

    // Add to modification history
    contrat.historiqueModifications.push({
      utilisateurId: userId,
      action: 'Signature',
      details: `Signature par le ${userType === 'client' ? 'client' : 'freelancer'}`
    });

    // If both parties signed, activate contract
    if (contrat.peutEtreActive()) {
      contrat.statut = 'Actif';
      contrat.historiqueModifications.push({
        utilisateurId: userId,
        action: 'Activation',
        details: 'Contrat activé suite aux signatures'
      });
    }

    await contrat.save();

    res.status(200).json({
      message: 'Contrat signé avec succès',
      contrat
    });

  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ message: 'Erreur lors de la signature du contrat', error: error.message });
  }
};

// Update contract status
const updateContratStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, userId, raison } = req.body;

    const contrat = await Contrat.findById(id);
    if (!contrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const oldStatut = contrat.statut;
    contrat.statut = statut;

    // Add to modification history
    contrat.historiqueModifications.push({
      utilisateurId: userId,
      action: 'Changement de statut',
      details: `Statut changé de "${oldStatut}" à "${statut}"${raison ? ': ' + raison : ''}`
    });

    // If status is Terminé, set actual end date
    if (statut === 'Terminé') {
      contrat.dateFinReelle = new Date();
      contrat.avancement = 100;
    }

    await contrat.save();

    res.status(200).json({
      message: 'Statut du contrat mis à jour',
      contrat
    });

  } catch (error) {
    console.error('Error updating contract status:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Update milestone status
const updateMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { statut, userId, livrables } = req.body;

    const contrat = await Contrat.findById(id);
    if (!contrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const milestone = contrat.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Jalon non trouvé' });
    }

    const oldStatut = milestone.statut;
    milestone.statut = statut;

    // If milestone completed, set completion date
    if (statut === 'Complété' && oldStatut !== 'Complété') {
      milestone.dateCompletion = new Date();
    }

    // If milestone paid, set approval date
    if (statut === 'Payé' && oldStatut !== 'Payé') {
      milestone.dateApprobation = new Date();
    }

    // Add deliverables if provided
    if (livrables && Array.isArray(livrables)) {
      milestone.livrables.push(...livrables);
    }

    // Add to modification history
    contrat.historiqueModifications.push({
      utilisateurId: userId,
      action: 'Mise à jour jalon',
      details: `Jalon "${milestone.titre}" - statut changé de "${oldStatut}" à "${statut}"`
    });

    // Recalculate overall progress
    contrat.avancement = contrat.calculerAvancement();

    // If all milestones completed and paid, mark contract as En cours or ready to complete
    const allPaid = contrat.milestones.every(m => m.statut === 'Payé');
    if (allPaid && contrat.statut === 'Actif') {
      contrat.statut = 'En cours';
    }

    await contrat.save();

    res.status(200).json({
      message: 'Jalon mis à jour avec succès',
      contrat
    });

  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du jalon', error: error.message });
  }
};

// Add note to contract
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, contenu } = req.body;

    const contrat = await Contrat.findById(id);
    if (!contrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    contrat.notes.push({
      auteur: userId,
      contenu
    });

    await contrat.save();

    res.status(200).json({
      message: 'Note ajoutée avec succès',
      contrat
    });

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note', error: error.message });
  }
};

module.exports = {
  createContrat,
  getContratById,
  getClientContrats,
  getFreelanceContrats,
  signContrat,
  updateContratStatus,
  updateMilestone,
  addNote
};
