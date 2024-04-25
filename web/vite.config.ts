import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// To resolve tsconfig paths
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(),],
})
