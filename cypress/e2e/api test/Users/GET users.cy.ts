import { UserDataGenerator } from "../../../fixtures/Genertors/DataGenrator.cy";
import {
  GetUser,
  GetUsers,
} from "../../../fixtures/Builders/Users/UsersBuilder.cy";
import { Chance } from "chance";
const data = UserDataGenerator();

const Base_Url = "https://gorest.co.in/public";
const Path = `${Base_Url}/v2/users/`;
const TOKEN =
  "Bearer ff55ef95f081f19ca268899ec947d7f2de1429c3db21e3f51bf7851d5e4ff6d6";
const headers = {
  "Content-Type": "application/json",
  Authorization: TOKEN,
};
const chance = new Chance();

describe("GET / Users List", () => {
  context("Status codes check", () => {
    it("Successful request should return 200", () => {
      GetUsers().then((users: any) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        expect(randomUser).to.have.property("id").to.be.a("number");
        expect(randomUser).to.have.property("name").to.be.a("string");
        expect(randomUser).to.have.property("email").to.be.a("string");
        expect(randomUser).to.have.property("gender").to.be.a("string");
        expect(randomUser).to.have.property("status").to.be.a("string");
        expect(
          (randomUser.email?.includes("@") ?? false) ||
          randomUser.email === null ||
          randomUser.email === undefined
        ).to.be.true;
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
        url: `${Base_Url}/v2/user/`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
});
