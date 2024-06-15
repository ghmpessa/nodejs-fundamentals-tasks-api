import { buildRoutePath } from "../utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const db = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const data = db.find("tasks");

      res.writeHead(200).end(JSON.stringify({ data }));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description)
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ error: "Title and description are mandatory" })
          );

      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();

      const task = {
        id: randomUUID(),
        title,
        description,
        createdAt,
        updatedAt,
        completedAt: null,
      };

      const response = db.insert("tasks", task);

      if (response) res.writeHead(201).end();
      else res.writeHead(400).end({ error: "Title already exists" });
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "Title or description are necessary to update",
          })
        );
      }

      const task = db.findByID("tasks", id);

      if (!task)
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "ID provided not founded" }));

      const updatedAt = new Date().toISOString();

      const data = {
        updatedAt,
      };

      if (title) data["title"] = title;
      if (description) data["description"] = description;

      const updatedTask = db.update("tasks", id, data);

      res.writeHead(200).end(JSON.stringify(updatedTask));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = db.findByID("tasks", id);

      if (!task)
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "ID provided not founded" }));

      db.delete("tasks", id);

      res.writeHead(200).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = db.findByID("tasks", id);

      if (!task)
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "ID provided not founded" }));

      const now = new Date().toISOString();

      const data = { updatedAt: now };

      data["completedAt"] = task.completedAt ? null : now;

      const updatedTask = db.update("tasks", id, data);

      res.writeHead(200).end(JSON.stringify(updatedTask));
    },
  },
];
