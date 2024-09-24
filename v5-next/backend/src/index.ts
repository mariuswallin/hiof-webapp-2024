import app from "./app";
import { port } from "./config";

import { serve } from "@hono/node-server";

console.log("Starting server on port", port);

serve({
  fetch: app.fetch,
  port,
});
