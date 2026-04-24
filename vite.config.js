import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/csc": {
          target: "https://api.countrystatecity.in",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/csc/, ""),
          headers: {
            "X-CSCAPI-KEY": env.CSC_API_KEY,
          },
        },
      },
    },
  };
});
