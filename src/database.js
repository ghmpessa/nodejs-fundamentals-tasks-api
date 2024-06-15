import fs from "node:fs/promises";

const dbPath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(dbPath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database));
  }

  find(table) {
    return this.#database[table] ?? [];
  }

  findByID(table, id) {
    return this.#database[table].find((item) => item.id === id);
  }

  insert(table, task) {
    if (Array.isArray(this.#database[table])) {
      if (this.#database[table].some((item) => item["title"] === task.title))
        return null;
      this.#database[table].push(task);
    } else {
      this.#database[table] = [task];
    }
    this.#persist();

    return task;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((item) => item.id === id);

    if (index >= 0) {
      const prev = this.#database[table][index];

      const task = {
        ...prev,
        ...data,
      };

      this.#database[table][index] = task;
      this.#persist();

      return task;
    }
  }
}
