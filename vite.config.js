import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    preview: {
        allowedHosts: ["alienxip.com.br", "www.alienxip.com.br", "alienxip-landing-staging.up.railway.app", "localhost", "127.0.0.1"],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "vendor-react": ["react", "react-dom"],
                    "vendor-motion": ["framer-motion"],
                    "vendor-gsap": ["gsap", "@gsap/react"],
                    "vendor-three": ["three"],
                },
            },
        },
    },
});
