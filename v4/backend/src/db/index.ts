import db from "./db";
import { setup } from "./setup";

(async () => {
  await setup(db);
})();
