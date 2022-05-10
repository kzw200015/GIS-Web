import vue from "@vitejs/plugin-vue"
import { VueAmapResolver } from "@vuemap/unplugin-resolver"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                ws: true
            }
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver({
                    exclude: /^ElAmap[A-Z]*/
                }),
                VueAmapResolver()
            ]
        }),
        Components({
            resolvers: [
                ElementPlusResolver({
                    exclude: /^ElAmap[A-Z]*/
                }),
                VueAmapResolver()
            ]
        })]
})
