import { UserDataResponseToDo } from "../../Models/ToDos/ToDosResponse.cy"

const Base_Url = "https://gorest.co.in/public"
const Path = `${Base_Url}/v2/users/`
const PathForComment = `${Base_Url}/v2/posts/`
const TOKENparam = "?access-token=ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const TOKEN = "Bearer ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const headers = {
    "Content-Type": "application/json",
    Authorization: TOKEN
}

export function GetUserToDo(userID: number, additonalPath: String): Cypress.Chainable<UserDataResponseToDo> {
    return cy
        .request<UserDataResponseToDo>({
            method: "GET",
            url: Path + userID + additonalPath,
            headers
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}

export function PostUserToDo(userDataToDo: UserDataResponseToDo, userID: number, additonalPath: String): Cypress.Chainable<UserDataResponseToDo> {
    return cy
        .request<UserDataResponseToDo>({
            method: "POST",
            url: Path + userID + additonalPath,
            headers:  headers,
            body: userDataToDo
        }).then(res => { expect(res.status).to.eq(201) })
        .its("body");
}