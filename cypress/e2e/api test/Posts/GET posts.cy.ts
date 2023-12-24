import { UserDataGenerator } from "../../../fixtures/Genertors/DataGenrator.cy";
import {
  GetPosts,
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

describe("GET / posts List", () => {
  context("Status codes check", () => {
    it("Successful request should return 200", () => {
      GetPosts().then((posts: any) => {
        const randompost = posts[Math.floor(Math.random() * posts.length)];
        expect(randompost).to.have.property("id").to.be.a("number");
        expect(randompost).to.have.property("user_id").to.be.a("number");
        expect(randompost).to.have.property("title").to.be.a("string");
        expect(randompost).to.have.property("body").to.be.a("string");
      });
    });

    ["PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"].forEach((method) => {
      it(`HTTP Method ${method}. Should return 404 error.`, () => {
        cy.request({
          method: method,
          url: Path,
          headers: headers,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(404); 
        });
      });
    });

    it("Invalid url. Should return 404 error", () => {
      cy.request({
        method: "GET",
        url: `${Base_Url}/v2/post/`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
});
