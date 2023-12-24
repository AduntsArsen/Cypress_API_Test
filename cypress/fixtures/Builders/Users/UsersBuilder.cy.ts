import { UserData, UserDataResponse } from "../../Models/Users/UsersResponse.cy"

const Base_Url = "https://gorest.co.in/public"
const Path = `${Base_Url}/v2/users/`
const PathForComment = `${Base_Url}/v2/posts/`
const TOKENparam = "?access-token=ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const TOKEN = "Bearer ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const headers = {
    "Content-Type": "application/json",
    Authorization: TOKEN
}

export function GetUsers(): Cypress.Chainable<UserDataResponse> {
    return cy
        .request<UserDataResponse>({
            method: "GET",
            url: Path,
            headers
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}

export function GetUser(userID: number): Cypress.Chainable<UserDataResponse> {
    return cy
        .request<UserDataResponse>({
            method: "GET",
            url: Path + userID,
            headers
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}

export function PostUser(userData: UserData): Cypress.Chainable<UserDataResponse> {
    return cy
        .request<UserDataResponse>({
            method: "POST",
            url: Path,
            headers,
            body: userData
        }).then(res => { expect(res.status).to.eq(201) })
        .its("body");
}

export function DeleteUser(userID: number): Cypress.Chainable<string | {message: string}> {
    return cy
        .request<string | {message: string}>({
            method: "DELETE",
            url: Path + userID,
            headers
        }).then(res => { expect(res.status).to.eq(204) })
        .its("body");
}

export function PutUser(userID: number, userData:UserData ): Cypress.Chainable<UserDataResponse> {
    return cy
        .request<UserDataResponse>({
            method: "PUT",
            url: Path + userID,
            headers,
            body: userData
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}