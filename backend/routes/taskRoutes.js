const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');

const DATA_DIR = path.join(__dirname, '../data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory and file exist for mock DB
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
};

// @route   GET api/tasks
// @desc    Get all tasks
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(TASKS_FILE, 'utf8');
      const tasks = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: tasks });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const tasks = await Task.find().populate('contactId', 'firstName lastName eventDate').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/tasks
// @desc    Create a task
router.post('/', async (req, res) => {
  const { title, description, contactId, status, assignee } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(TASKS_FILE, 'utf8');
      const tasks = JSON.parse(fileData);
      
      const newTask = {
        _id: 'mock_task_' + Date.now().toString(),
        title,
        description: description || '',
        contactId: contactId || null,
        status: status || 'Todo',
        assignee: assignee || '',
        createdAt: new Date().toISOString()
      };

      tasks.push(newTask);
      fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
      return res.status(201).json({ success: true, data: newTask });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const task = await Task.create({
      title, description, contactId, status, assignee
    });
    // Populate contact info if linked
    if (contactId) {
      await task.populate('contactId', 'name eventType eventDate');
    }

    // Auto-create notification for new assigned tasks
    if (assignee) {
      const Notification = require('../models/Notification');
      await Notification.create({
        title: 'New Task Assigned',
        message: `A new task "${task.title}" has been assigned to ${assignee}.`,
        type: 'info',
        targetRole: 'all' // Sends to everyone (workers and admins will see it)
      });
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PATCH api/tasks/:id
// @desc    Update a task (status, assignee, description)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(TASKS_FILE, 'utf8');
      const tasks = JSON.parse(fileData);
      const task = tasks.find(t => t._id === id);

      if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

      Object.keys(req.body).forEach(key => {
        task[key] = req.body[key];
      });

      fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
      return res.status(200).json({ success: true, data: task });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const oldTask = await Task.findById(id);
    if (!oldTask) return res.status(404).json({ success: false, error: 'Task not found' });

    const task = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('contactId', 'name eventType eventDate');
    
    // Auto-create notification if status changed to Done
    if (req.body.status === 'Done' && oldTask.status !== 'Done') {
      const Notification = require('../models/Notification');
      await Notification.create({
        title: 'Task Completed',
        message: `Task "${task.title}" has been completed by ${task.assignee || 'staff'}.`,
        type: 'success',
        targetRole: 'all' // Sends to everyone (admins will see it)
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(TASKS_FILE, 'utf8');
      let tasks = JSON.parse(fileData);
      
      const initialLength = tasks.length;
      tasks = tasks.filter(t => t._id !== id);
      
      if (tasks.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    
    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
