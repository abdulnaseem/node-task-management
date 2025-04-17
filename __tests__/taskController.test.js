const mockingoose = require('mockingoose');
const Task = require('../models/Task');
const taskController = require('../controllers/taskController');
const httpMocks = require('node-mocks-http');

const mockTask = {
    _id: '6801834b70ab3e507e9b7721',
    title: 'Test Task',
    description: 'A test task',
    status: 'pending',
    dueDateTime: new Date()
};

describe('Task Controller', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    test('getTasks should return all tasks', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        mockingoose(Task).toReturn([mockTask], 'find');

        await taskController.getTasks(req, res);

        expect(res.statusCode).toBe(200);
        const responseData = res._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.count).toBe(1);
        expect(responseData.data[0].title).toBe('Test Task');
    });

    test('getTask should return a single task by ID', async () => {
        const req = httpMocks.createRequest({ params: { id: '123' } });
        const res = httpMocks.createResponse();

        mockingoose(Task).toReturn(mockTask, 'findOne');

        await taskController.getTask(req, res);

        expect(res.statusCode).toBe(200);
        const responseData = res._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data._id).toBe(mockTask._id);
    });

    test('createTask should create a new task', async () => {
        const req = httpMocks.createRequest({
            body: mockTask
        });
        const res = httpMocks.createResponse();

        mockingoose(Task).toReturn(mockTask, 'save');

        await taskController.createTask(req, res);

        expect(res.statusCode).toBe(201);
        const responseData = res._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.title).toBe('Test Task');
    });

    test('updateTaskStatus should update status of task by task id', async () => {
        const req = httpMocks.createRequest({
            params: { id: '123' },
            body: { status: 'completed' },
        })
        const res = httpMocks.createResponse();

        mockingoose(Task).toReturn({ ...mockTask, status: 'completed' }, 'findOneAndUpdate');

        await taskController.updateTaskStatus(req, res);
        //console.log(res._getData())

        expect(res.statusCode).toBe(200);
        const responseData = res._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.status).toBe('completed');
    });
    
    test('deleteTask should delete a task by task id', async () => {
        const req = httpMocks.createRequest({ params: { id: '123' } });
        const res = httpMocks.createResponse();
    
        mockingoose(Task).toReturn(mockTask, 'findOneAndDelete'); 
    
        await taskController.deleteTask(req, res);
    
        expect(res.statusCode).toBe(200);
        const responseData = res._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data._id).toBe(mockTask._id);
    });
});