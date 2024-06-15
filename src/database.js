import fs from "node:fs/promises";

const dbPath = new URL("../db.json", import.meta.url);

export class Database {
  #database = [];

  constructor() {
    fs.readFile(dbPath, "utf-8")
      .then((data) => (this.#database = data))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database));
  }

  find() {
    return this.#database ?? [];
  }

  insert(task) {
    if (Array.isArray(this.#database)) {
      if (this.#database.some((item) => item["title"] === task.title))
        return null;
      this.#database.push(task);
    } else {
      this.#database = [task];
    }
    this.#persist();

    return task;
  }
}
