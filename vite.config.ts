import {defineConfig} from 'vite';
import dts from "vite-plugin-dts";
// import ts from '@vitejs/plugin'
import path, { dirname, format } from 'path';
const outDir = path.resolve(__dirname, 'dist');
const entryDir = path.resolve(__dirname, 'src/index.ts');
export default defineConfig({
    plugins:[dts({
        outputDir: outDir,
    })],
    build: {
        outDir,
        lib: {
            entry: entryDir,
            fileName: (format) => {
                if(format === 'es') {
                    return `${format}/[name].js`
                }
                return `index.js`
            },
            formats: ['cjs', 'es']
        },
        manifest: false,
        emptyOutDir: true,
        chunkSizeWarningLimit: 500,
        minify: false,
        rollupOptions: {
            // output: {
            //     globals: {
            //         fs: 'fs'
            //     }
            // },
            external: ['fs', 'path', 'readline']
        }
    },
})