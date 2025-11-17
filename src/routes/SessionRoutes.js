const express = require("express");
const sessionController = require("../controllers/SessionController");

const router = express.Router();
router.get("/sessions", sessionController.getAllSessions);
router.get("/sessions/email", sessionController.getSessionsByEmail);
// Ajouter une session
router.post("/addSession", sessionController.addSession);

// Récupérer toutes les sessions d'une formation
router.get("/sessions/getSessionsByFormation/:formationId", sessionController.getSessionsByFormation);
router.get("/sessions/getCountSessionsByFormation/:formationId", sessionController.getCountSessionsByFormation);
// Mettre à jour une session
router.put("/sessions/update/:id", sessionController.updateSession);

// Supprimer une session
router.delete("/sessions/delete/:id", sessionController.deleteSession);

module.exports = router;
