import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { globSync } from "glob";
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      // TODO: Add test files to the exclude list
      exclude: ["src/stories/", "**/*.stories.ts"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    // See https://github.com/qmhc/vite-plugin-dts/issues/99
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
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
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
  },
});
