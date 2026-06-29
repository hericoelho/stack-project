import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    // @ts-expect-error - @originjs/vite-plugin-federation types depend on rollup Plugin (removed in rollup 4)
    federation({
      name: 'coreApp',
      remotes: { remoteApp: "http://localhost:5001/assets/remoteEntry.js" },
      shared: {
        'react': { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true } // 👈 CRITICAL: Must be a singleton
      }
    }),
  ],
})
