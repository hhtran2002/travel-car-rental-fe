// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://10.128.81.115:8080',
//         changeOrigin: true
//       }
//     }
//   }
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // cho phép máy C truy cập
    port: 5173,
    proxy: {
      "/api": {
        target: "http://10.128.81.115:8080", // IP MÁY B (BE)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
