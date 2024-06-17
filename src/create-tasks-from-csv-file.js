import parse from "csv-parser";
import fs from "node:fs";

const path = new URL("../tasks.csv", import.meta.url);

async function createTasksFromCSVFile() {
  const stream = fs.createReadStream(path).pipe(parse());

  for await (const chunk of stream) {
    const { title, description } = chunk;

    const task = { title, description };

    fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(task),
    });
  }
}

createTasksFromCSVFile();
