import axios from "axios"
import { Location, Route } from "../types"

const getRoutes = async (origin: Location, destination: Location) => {
    return (await axios.get("https://restapi.amap.com/v5/direction/driving", {
        params: {
            key: "6d084c69c69f8cfa004b37ddd565c850",
            origin: `${origin.x.toFixed(6)},${origin.y.toFixed(6)}`,
            destination: `${destination.x.toFixed(6)},${destination.y.toFixed(6)}`,
            show_fields: "cost,tmcs"
        }
    })).data.route.paths[0]
}

export const searchNearestPolice = async (locs: Location[], target: Location) => {
    const deferredRoutes = new Map<number, Promise<Route>>()
    locs.forEach(loc => {
        deferredRoutes.set(loc.id, getRoutes(loc, target))
    })

    let locId = 0
    let minDuration = Number.MAX_SAFE_INTEGER

    for (const [id, route] of deferredRoutes) {
        const duration = parseInt((await route).cost.duration)
        if (duration < minDuration) {
            minDuration = duration
            locId = id
        }
    }

    const steps = (await deferredRoutes.get(locId))?.steps.map(step => {
        return step.tmcs.map(tmc => {
            return tmc.tmc_polyline.split(";")
        })
    }).flat(2).map(co => [...(co.split(",").map(it => parseFloat(it)))])

    return { locId, steps }
}

