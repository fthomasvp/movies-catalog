import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { globSync } from "glob";
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    // See https://github.com/qmhc/vite-plugin-dts/issues/99
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      // See https://rollupjs.org/configuration-options/#input
      input: Object.fromEntries(
        globSync(["src/components/**/*.tsx", "src/main.ts"]).map((file) => {
          const entryName = relative(
            "src",
            file.slice(0, file.length - extname(file).length),
          );
          const entryUrl = fileURLToPath(new URL(file, import.meta.url));

          return [entryName, entryUrl];
        }),
      ),
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [
    react(),
    dts({
      exclude: ["src/stories/", "**/*.stories.ts"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
});
