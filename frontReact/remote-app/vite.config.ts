import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    react(),
    federation({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        // Expõe o componente de entrada que contém as rotas descritas acima
        './RemoteAppEntry': './src/RemoteAppEntry.jsx', 
      },
      shared: {
        'react': { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true } // Compartilhado estritamente
      }
    }),
  ],
})
