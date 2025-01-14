import { defineConfig } from "vite";
// import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   copyPublicDir: false,
  //   lib: {
  //     // Could also be a dictionary or array of multiple entry points
  //     entry: path.resolve(__dirname, "lib/main.js"),
  //     name: "OxentechUI",
  //     // the proper extensions will be added
  //     fileName: "rewee-ui",
  //   },
  //   rollupOptions: {
  //     // make sure to externalize deps that shouldn't be bundled
  //     // into your library
  //     external: ["vue"],
  //     output: {
  //       // Provide global variables to use in the UMD build
  //       // for externalized deps
  //       globals: {
  //         vue: "Vue",
  //       },
  //     },
  //   },
  // },
});
