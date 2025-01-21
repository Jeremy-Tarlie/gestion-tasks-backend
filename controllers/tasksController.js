const Joi = require('joi');
const Task = require('../models/task');

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  completed: Joi.boolean(),
});

// Obtenir toutes les tâches
exports.getTasks = async (req, res) => {
  try {
    const { completed, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    const query = search ? { ...filter, title: { $regex: search, $options: 'i' } } : filter;

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter une tâche
exports.createTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const { id } = req.params;

  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée.' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée.' });
    }
    res.json(deletedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
