# Task Management API

A simple RESTful API for managing tasks. Built with Node.js, Express.js and MongoDB - service enables clients to add, update (status), and delete tasks.

# set up instructions 

1. git clone https://github.com/abdulnaseem/node-task-management
2. npm install
3. Add your environmental variables on a .env file at root directory
  - MONGO_URI=your_mongodb_connection_string
  - PORT=5000
4. npm run dev

Task API Endpoints
  - /api/tasks

Get all tasks
  - Endpoint: GET /api/tasks
  - Description: fetches all tasks sorted by most recent
  - Access: public

Get single task
  - Endpoint: Get /api/tasks/:id
  - Description: get a single task by id
  - Access: public

Create a task
  - Endpoint: POST /api/tasks
  - Description: create a new task
  - Access: public

Update task status
  - Endpoint: PUT /api/tasks/:id
  - Description: update a task status by id (e.g. 'pending', 'in-progress', 'complete')
  - Access: public

Delete a task
  - Endpoint: DELETE /api/tasks/:id
  - Description: delete a task by id
  - Access: public