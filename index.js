const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use('/uploads', express.static('uploads'));  // Pour servir les fichiers du dossier 'uploads'

//Connexion à la base de donnée mongodb
const mongoose = require('mongoose');
mongoose.set('strictPopulate', false);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Test pour le fonctionnement de l'URI
app.get('/api', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

// Serve database viewer
app.get('/database-viewer', (req, res) => {
    res.sendFile(__dirname + '/database-viewer.html');
});

//configuration des routes
const userRoutes = require('./src/routes/UtilisateurRoutes.js');
app.use('/api', userRoutes);

const CategorieRoutes = require('./src/routes/CategorieRoutes.js');
app.use('/api', CategorieRoutes);

const FormationRoutes = require('./src/routes/FormationRoutes.js');
app.use('/api', FormationRoutes);

const TagRoutes = require('./src/routes/TagRoutes.js');
app.use('/api', TagRoutes);

const SessionRoutes = require('./src/routes/SessionRoutes.js');
app.use('/api', SessionRoutes);

const InscritSessionRoutes = require('./src/routes/InscritSessionRoutes.js');
app.use('/api', InscritSessionRoutes);

const StatisticsRoutes = require('./src/routes/StatisticsRoutes.js');
app.use('/api', StatisticsRoutes);

const PublicationRoutes = require('./src/routes/PublicationRoutes.js');
app.use('/api', PublicationRoutes);

const ContratRoutes = require('./src/routes/ContratRoutes.js');
app.use('/api/contrats', ContratRoutes);

const DatabaseRoutes = require('./src/routes/DatabaseRoutes.js');
app.use('/api', DatabaseRoutes);