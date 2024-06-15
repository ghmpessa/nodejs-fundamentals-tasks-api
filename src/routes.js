import { Database } from "./database.js";

const db = new Database();

export const routes = [
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
