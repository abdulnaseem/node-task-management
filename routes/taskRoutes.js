const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTaskStatus,
    deleteTask
} = require('../controllers/taskController');

const router = express.Router();

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTaskStatus)
    .delete(deleteTask);

module.exports = router;