<template>
    <el-row :gutter="20">
        <el-col :span="18">
            <div id="map"></div>
        </el-col>
        <el-col :span="6">
            <el-card class="info-card">
                <template #header>信息面板</template>
                <div>
                    一些信息
                </div>
            </el-card>
            <el-card class="info-card">
                <template #header>信息面板</template>
                <div>
                    一些信息
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader"
import { CompatClient, Stomp } from "@stomp/stompjs"
import { onMounted } from "vue"

interface Location {
    id: number
    x: number
    y: number
}

class LocationClient {
    private client: CompatClient

    constructor(url: string, onUpdate: (location: Location) => void, onAll: (locations: Location[]) => void) {
        this.client = Stomp.client(url)
        this.client.onConnect = () => {
            this.client.subscribe("/topic/locations/update", (message) => {
                const location = JSON.parse(message.body) as Location
                console.log(location)
                onUpdate(location)
            })
            this.client.subscribe("/user/topic/locations/all", (message) => {
                const locations = JSON.parse(message.body) as Location[]
                console.log(locations)
                onAll(locations)
            })
            setTimeout(() => {
                this.client.send("/app/locations/all")
            }, 2000)
        }
    }

    activate() {
        this.client.activate()
    }
}

class Map {
    private readonly key: string
    private readonly version: string
    private aMap: any
    private map: any

    constructor(key: string, version: string) {
        this.key = key
        this.version = version
    }

    async initMap() {
        (window as any)._AMapSecurityConfig = {
            securityJsCode: "b04a11ffa0460e15d96fb7668839cb6a"
        }
        this.aMap = await AMapLoader.load({
            key: this.key,
            version: this.version
        })

        this.map = new this.aMap.Map("map", {
            center: [120.62, 31.32],
            zoom: 9
        })
    }

    removeLocations(locs: Location[]) {
        const makers = locs.map(loc => new this.aMap.Marker({
            position: [loc.x, loc.y],
            title: loc.id.toString()
        }))
        this.map.remove(makers)
    }

    addLocations(locs: Location[]) {
        const makers = locs.map(loc => new this.aMap.Marker({
            position: [loc.x, loc.y],
            title: loc.id.toString()
        }))
        console.log(makers)
        this.map.add(makers)
    }

    showRoute(start: Location, end: Location) {
        this.aMap.plugin("AMap.Driving", () => {
            const driving = new this.aMap.Driving({
                map: this.map,
                policy: this.aMap.DrivingPolicy.LEAST_TIME
            })
            driving.search([start.x, start.y], [end.x, end.y], (status: any, result: any) => {
                console.log(status)
                console.log(result)
            })
        })
    }
}

const map = new Map("c45744fa705107dc91637ea1a80a50c2", "2.0")
const policeLocations = new Array<Location>()
const locationClient = new LocationClient("ws://localhost:8080/api/ws",
    (location) => {
        map.removeLocations(policeLocations)
        const loc = policeLocations.find(loc => loc.id === location.id)
        if (loc) {
            loc.x = location.x
            loc.y = location.y
        } else {
            policeLocations.push(location)
        }
        map.addLocations(policeLocations)
    },
    (locations) => {
        policeLocations.push(...locations)
        map.addLocations(policeLocations)
        map.showRoute(policeLocations[0], policeLocations[1])
    })


onMounted(() => {
    map.initMap()
    locationClient.activate()
})
</script>
<style scoped>
#map {
    height: 500px;
}

.info-card {
    margin-bottom: 15px;
}
</style>