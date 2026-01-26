import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: "/typing-speed",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      immediateActivation: false,
      checkUpdateInterval: 1000 * 60 * 60 * 24,

      manifest: {
        name: 'Typing Speed',
        short_name: 'Typ1Sp3',
        theme_color: '#ffffff',
      }
    }),
  ],
})
