import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base './' — satu build jalan di semua hosting:
//   - GitHub Pages subpath  tutugsvy.github.io/MAALEO/   ✅
//   - Custom domain         ponsminer.fun (root)          ✅
//   - Vercel                mainaneka.vercel.app          ✅
// Override via VITE_BASE bila perlu (mis. /MAALEO/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
  server: { host: '0.0.0.0', port: 5173 },
})
