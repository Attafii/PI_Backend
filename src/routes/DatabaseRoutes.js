const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Get all collections
router.get("/database/collections", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    res.json({ collections: collectionNames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all documents from a specific collection
router.get("/database/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const data = await mongoose.connection.db.collection(collection).find({}).toArray();
    res.json({ collection, count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database stats
router.get("/database/stats/overview", async (req, res) => {
  try {
    const stats = await mongoose.connection.db.stats();
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    const collectionStats = await Promise.all(
      collections.map(async (col) => {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        return { name: col.name, count };
      })
    );

    res.json({
      database: stats.db,
      collections: collectionStats,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
