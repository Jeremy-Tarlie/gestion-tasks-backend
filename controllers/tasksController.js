const Joi = require('joi');
const fs = require('fs');
const Task = require('../models/task');

let tasks = [];
const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync('tasks.json');
        const dataJSON = dataBuffer.toString();
        tasks = JSON.parse(dataJSON);
    } catch (e) {
        tasks = [];
    }
};

const saveTasks = () => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync('tasks.json', dataJSON);
};

loadTasks();

const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    completed: Joi.boolean()
});

// Obtenir toutes les tâches
exports.getTasks = (req, res) => {
    const { completed, search, page = 1, limit = 10 } = req.query;

    let filteredTasks = tasks;

    // Filtrer par statut (completed)
    if (completed) {
        filteredTasks = filteredTasks.filter(task => String(task.completed) === completed);
    }

    // Recherche par titre
    if (search) {
        filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    res.json(paginatedTasks);
};

// Ajouter une tâche
exports.createTask = (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { title } = req.body;
    const newTask = new Task(tasks.length + 1, title.trim(), false);
    tasks.push(newTask);
    saveTasks();
    res.status(201).json(newTask);
};

// Mettre à jour une tâche
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { title, completed } = req.body;
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée.' });

    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    saveTasks();
    res.json(task);
};

// Supprimer une tâche
exports.deleteTask = (req, res) => {
    const { id } = req.params;

    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Tâche non trouvée.' });

    const deletedTask = tasks.splice(index, 1);
    saveTasks();
    res.json(deletedTask);
};