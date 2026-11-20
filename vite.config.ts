import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => ({
  server: { host: true, port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    manifest: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
              motion: ["framer-motion"],
            },
          },
        },
  },
  ssr: { noExternal: ["@fontsource-variable/oswald", "@fontsource-variable/inter"] },
}));
