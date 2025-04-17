const Task = require('../models/Task');


// @desc Get all tasks
// @route Get /api/tasks
// @access Public
exports.getTasks = async(req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch(error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc Get single task
// @route Get /api/tasks/:id
// @access Public
exports.getTask = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task });
    } catch(error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc Create new task
// @route POST /api/tasks
// @access Public
exports.createTask = async(req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch(error) {
        if(error.name === 'ValidationError') {
            const message = Object.values(error.error).map(value => value.message);
            res.status(400).json({ success: false, error: message });
        } else {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
}

// @desc Update task status
// @route Put /api/tasks/:id
// @access Public
exports.updateTaskStatus = async(req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        )

        if(!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task });
    } catch(error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Public
exports.deleteTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if(!task) {
            return res.status(404).json({ status: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task })
    } catch(error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}