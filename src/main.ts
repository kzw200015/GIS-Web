import { initAMapApiLoader } from "@vuemap/vue-amap"
import "@vuemap/vue-amap/dist/style.css"
import "element-plus/es/components/message/style/css"
import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router"

initAMapApiLoader({
    key: "c45744fa705107dc91637ea1a80a50c2",
    securityJsCode: "b04a11ffa0460e15d96fb7668839cb6a"
})

const app = createApp(App)
app.use(router)
app.mount("#app")