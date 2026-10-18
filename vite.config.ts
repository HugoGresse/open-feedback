import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            // @mui/icons-material v5 icon paths (`@mui/icons-material/Error`)
            // are CommonJS. In this ESM package, Vite 8 interops them like
            // Node does: the default import is the module object, not the
            // icon. Resolve them to the ESM build of the same icon instead.
            {
                find: /^@mui\/icons-material\/(?!esm\/)(.+)$/,
                replacement: '@mui/icons-material/esm/$1',
            },
        ],
    },
    server: {
        port: 3000,
    },
})
