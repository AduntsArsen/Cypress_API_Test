export interface UserDataToDo {
    title?: string
    status?: string
}


export interface UserDataResponseToDo extends UserDataToDo{
    find: any
    id?: number
    user_id?: number
    title?: string
    status?: string
}