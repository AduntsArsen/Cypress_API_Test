import {UserDataPost, UserDataResponsePost } from "../../Models/Posts/PostsResponse.cy"

const Base_Url = "https://gorest.co.in/public"
const Path = `${Base_Url}/v2/posts/`
const PathForComment = `${Base_Url}/v2/posts/`
const TOKENparam = "?access-token=ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const TOKEN = "Bearer ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6"
const headers = {
    "Content-Type": "application/json",
    Authorization: TOKEN
}

export function GetPosts(): Cypress.Chainable<UserDataResponsePost> {
    return cy
        .request<UserDataResponsePost>({
            method: "GET",
            url: Path,
            headers
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}

export function GetPost(postId: number): Cypress.Chainable<UserDataResponsePost> {
    return cy
        .request<UserDataResponsePost>({
            method: "GET",
            url: Path + postId,
            headers
        }).then(res => { expect(res.status).to.eq(200) })
        .its("body");
}

export function GetUserPost(userID: number, posts: string): Cypress.Chainable<UserDataResponsePost> {
    return cy
      .request<UserDataResponsePost>({
        method: "GET",
        url: Path + userID + posts,
        headers,
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        return res.body as UserDataResponsePost;
      });
  }
  
  export function PostUserPost(
    userDataPost: UserDataPost,
    userID: number,
    additionalPath: string
  ): Cypress.Chainable<UserDataResponsePost> {
    return cy
      .request<UserDataResponsePost>({
        method: "POST",
        url: Path + userID + additionalPath,
        headers,
        body: userDataPost,
      })
      .then((res) => {
        expect(res.status).to.eq(201);
        return res.body as UserDataResponsePost;
      });
  }
  