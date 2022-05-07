import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Admin from "../views/Admin.vue"
import Accident from "../views/admin/Accident.vue"
import Map from "../views/admin/Map.vue"
import User from "../views/admin/User.vue"
import Login from "../views/Login.vue"

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        component: Login,
        props: route => ({ redirect: route.query.redirect ?? "/admin" })
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
                component: Map
            },
            {
                path: "accident",
                component: Accident
            },
            {
                path: "user",
                component: User
            }
        ]
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
