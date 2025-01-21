const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connexion à MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/maBaseDeDonnees';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur lors de la connexion à MongoDB:', err));

// Routes
app.use('/tasks', tasksRoutes);

// Serveur
app.listen(PORT, () => {
  console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`);
});
