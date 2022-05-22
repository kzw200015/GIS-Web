import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Admin from "../views/Admin.vue"
import AdminAccident from "../views/admin/Accident.vue"
import AdminMap from "../views/admin/Map.vue"
import AdminUser from "../views/admin/User.vue"
import Login from "../views/Login.vue"
import Police from "../views/Police.vue"
import Reporter from "../views/Reporter.vue"

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        component: Login,
        props: route => ({ redirect: route.query.redirect ?? "/admin" })
    },
    {
        path: "/police",
        component: Police
    },
    {
        path: "/reporter",
        component: Reporter
    },
    {
        path: "/admin",
        component: Admin,
        children: [
            {
                path: "",
                redirect: "/admin/map"
            },
            {
                path: "map",
                component: AdminMap
            },
            {
                path: "accident",
                component: AdminAccident
            },
            {
                path: "user",
                component: AdminUser
            }
        ]
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
