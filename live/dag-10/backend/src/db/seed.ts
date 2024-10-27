import { tasks, users } from "./data";
import type { DB } from "./db";

export const seed = async (db: DB) => {
  const insertUser = db.prepare(`
  INSERT INTO users (name) VALUES (?)
`);
  const insertTask = db.prepare(`
  INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)
`);

  db.transaction(() => {
    for (const user of users) {
      insertUser.run(user.name);
    }
    for (const task of tasks) {
      insertTask.run(task.title, task.status, task.user_id);
    }
  })();
};
