// routes/tagRoutes.js
const express = require("express");
const { addTag, getAllTags, updateTag, deleteTag, getTagById } = require("../controllers/TagController");

const router = express.Router();

router.post("/addTag", addTag); // Ajouter un tag
router.get("/Tags", getAllTags); // Récupérer tous les tags
router.get("/tags/:id", getTagById); // Récupérer un tag par ID
router.put("/updateTag/:id", updateTag);
router.delete("/deleteTag/:id", deleteTag);
module.exports = router;
