import { defineConfig } from 'vite'
import ghPages from 'vite-plugin-gh-pages'

export default defineConfig({
    plugins: [ghPages()],
    base: '/celvaprod-three-js/' // Reemplaza "tu-repositorio" por el nombre de tu repo
})
