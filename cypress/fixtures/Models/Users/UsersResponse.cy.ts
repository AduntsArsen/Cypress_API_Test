export interface UserData {
    name?: string
    gender?: string
    email?: string
    status?: string
}

export interface UserDataResponse extends UserData{
    map: any
    some: any
    length: number
    id: number
}