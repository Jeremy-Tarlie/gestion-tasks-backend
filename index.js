const express = require('express');
const bodyParser = require('body-parser');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/tasks', tasksRoutes);

// Serveur
app.listen(PORT, () => {
    console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`);
});