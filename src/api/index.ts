import { Stomp } from "@stomp/stompjs"
import axios from "axios"
import { reactive, ref, watch } from "vue"
import { Accident, Location, Page } from "../types"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
})

export default api

export const usePoliceLocations = () => {
    const policeLocations: Location[] = reactive([])
    const stompClient = Stomp.client("ws://localhost:8080/api/ws")
    stompClient.onConnect = () => {
        stompClient.subscribe("/topic/locations/update", (message) => {
            const location = JSON.parse(message.body) as Location
            const existLocation = policeLocations.find(loc => loc.id === location.id)
            if (existLocation) {
                existLocation.x = location.x
                existLocation.y = location.y
            } else {
                policeLocations.push(location)
            }
        })
        stompClient.subscribe("/user/topic/locations/all", (message) => {
            const locations = JSON.parse(message.body) as Location[]
            policeLocations.push(...locations)
        })
        setTimeout(() => {
            stompClient.send("/app/locations/all")
        }, 1000)
    }

    stompClient.activate()
    return policeLocations
}

export const useAccident = async () => {
    const accidentId = ref(0)
    const accident = ref<Accident>()
    watch(accidentId, async (id) => {
        accident.value = (await api.get("/accidents/" + accidentId.value)).data.data
    })

    return { accidentId, accident }
}

export const useAccidentPage = () => {
    const page = ref(0)
    const size = ref(10)
    const accidents = ref<Page<Accident>>()
    watch(page, async () => {
        accidents.value = (await api.get("/accidents", {
            params: {
                page: page.value,
                size: size.value
            }
        })).data.data
    })
    return { page, size, accidents }
}