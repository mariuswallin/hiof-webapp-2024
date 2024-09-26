import { defineConfig } from "vite";

import devServer from "@hono/vite-dev-server";
export default defineConfig({
  server: {
    port: 3999,
  },
  // build: {
  //   outDir: "build",
  // },
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, "main.ts"),
  //     name: "Main",
  //     fileName: () => "main.js",
  //     formats: ["es"],
  //   },
  //   outDir: "statics",
  // },
  plugins: [
    devServer({
      entry: "./server/index.ts",
      exclude: [
        // We need to override this option since the default setting doesn't fit
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
  ],
});
