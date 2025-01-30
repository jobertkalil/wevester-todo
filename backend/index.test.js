const request = require("supertest");
const app = require("./server.js");

const apiVersion = process.env.API_VERSION || "v1";
let taskId = 1;

describe("Tasks API", () => {
  it(`GET /api/${apiVersion}/tasks should return all tasks`, async () => {
    const response = await request(app).get(`/api/${apiVersion}/tasks`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it(`POST /api/${apiVersion}/tasks should create a new task`, async () => {
    const newTask = {
      title: "Test Task",
      description: "Test Description",
      completed: false,
    };
    const response = await request(app)
      .post(`/api/${apiVersion}/tasks`)
      .send(newTask);

    taskId = response.body.id;
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(newTask);
  });

  it(`PUT /api/${apiVersion}/tasks/:id should update a task`, async () => {
    const updatedTask = {
      title: "Updated Task",
      description: "Updated Description",
      completed: true,
    };
    const response = await request(app)
      .put(`/api/${apiVersion}/tasks/${taskId}`)
      .send(updatedTask);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(updatedTask);
  });

  it(`DELETE /api/${apiVersion}/tasks/:id should delete a task`, async () => {
    const response = await request(app).delete(
      `/api/${apiVersion}/tasks/${taskId}`
    );
    expect(response.statusCode).toBe(200);
  });
});
