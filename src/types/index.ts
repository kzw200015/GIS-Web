export interface Location {
    id: number
    x: number
    y: number
}

export enum Role {
    ADMIN, REPORTER, POLICE
}

export enum Gender {
    MALE, FEMALE
}

export interface Point {
    x: number
    y: number
}

interface BaseEntity {
    id: number
}

export interface Page<T extends BaseEntity> {
    total: number
    page: number
    size: number
    values: T[]
}

export interface User extends BaseEntity {
    username: string
    role: Role
}

export interface Police extends BaseEntity {
    phone: string
    isWorking: boolean
    name: string
    gender: Gender
    userId: number
}

export interface Accident extends BaseEntity {
    coordinate: Point
    description: string
    time: number
    isResolved: boolean
    image: string
}

export interface Route {
    cost: { duration: string }
    steps: { tmcs: { tmc_polyline: string }[] }[]
}