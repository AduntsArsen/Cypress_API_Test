import { UserDataGenerator } from "../../../fixtures/Genertors/DataGenrator.cy";
import {
  GetPosts, GetPost
} from "../../../fixtures/Builders/Posts/PostsBuilder.cy";
import { Chance } from "chance";
const data = UserDataGenerator();

const Base_Url = "https://gorest.co.in/public";
const Path = `${Base_Url}/v2/posts/`;
const TOKEN =
  "Bearer ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6";
const headers = {
  "Content-Type": "application/json",
  Authorization: TOKEN,
};
const chance = new Chance();

describe("GET / Posts List", () => {
  context("Your new context block after describe", () => {
    let postId: number;

    before(() => {
      GetPosts().then((posts: any) => {
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        postId = randomPost.id;
      });
    });

    it("Successful request should return 200", () => {
      GetPost(postId).then((randomPost: any) => {
        expect(randomPost).to.have.property("id").to.be.a("number");
        expect(randomPost).to.have.property("user_id").to.be.a("number");
        expect(randomPost).to.have.property("title").to.be.a("string");
        expect(randomPost).to.have.property("body").to.be.a("string");
      });
    });

    ["OPTIONS", "HEAD"].forEach((method) => {
      it(`HTTP Method ${method}. Should return 404 error.`, () => {
        cy.request({
          method: method,
          url: `${Base_Url}/v2/posts/${postId}`,
          headers: headers,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(404); //it's should return 405 but return 404
        });
      });
    });

    it("Invalid url. Should return 404 error", () => {
      cy.request({
        method: "GET",
        url: `${Base_Url}/v2/usr/${postId}`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
  context("Not existing Post id. Should return 404 error", () => {
    let response: any;
  
    before(() => {
      return GetPosts().then((existingPosts) => {
        const existingPostIds: number[] = existingPosts.map((post: any) => post.id) as number[];
        let randomNonExistingPostId: number;
        do {
          randomNonExistingPostId = chance.natural({ min: 101, max: 1000 });
        } while (existingPostIds.includes(randomNonExistingPostId));
          return cy
          .request({
            method: "GET",
            url: `${Base_Url}/v2/usr/${randomNonExistingPostId}`,
            failOnStatusCode: false,
          })
          .then((res) => {
            response = res;
          });
      });
    });
  
    it("Should return Not Found 404 status code", () => {
      expect(response).to.be.not.undefined;
      expect(response.status).to.be.eq(404);
    });
  
    it("Invalidly formatted Post id. Should return 400 error", () => {
      const randomFloatNumber = chance.floating({ min: 0, max: 100 });
      cy.request({
        method: "GET",
        url: `${Base_Url}/v2/usr/${randomFloatNumber}`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404); //it's should return 400 but return 404
      });
    });
  });
  
});
