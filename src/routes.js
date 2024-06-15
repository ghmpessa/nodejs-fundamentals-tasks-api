import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const db = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const data = db.find();

      res.writeHead(200).end(JSON.stringify({ data }));
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const { title, description } = req.body;

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

      const response = db.insert(task);

      if (response) res.writeHead(201).end();
      else res.writeHead(400).end({ error: "Title already exists" });
    },
  },
];
