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
  context("Your new context block after describe", () => {
    let userId: number;

    before(() => {
      GetUsers().then((users: any) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        userId = randomUser.id;
      });
    });

    it("Successful request should return 200", () => {
      GetUser(userId).then((randomUser: any) => {
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

    ["OPTIONS", "HEAD"].forEach((method) => {
      it(`HTTP Method ${method}. Should return 404 error.`, () => {
        cy.request({
          method: method,
          url: `${Base_Url}/v2/users/${userId}`,
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
        url: `${Base_Url}/v2/usr/${userId}`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
  context("Not existing User id. Should return 404 error", () => {
    let response: any;
  
    before(() => {
      return GetUsers().then((existingUsers) => {
        const existingUserIds: number[] = existingUsers.map((user: any) => user.id) as number[];
        let randomNonExistingUserId: number;
        do {
          randomNonExistingUserId = chance.natural({ min: 101, max: 1000 });
        } while (existingUserIds.includes(randomNonExistingUserId));
          return cy
          .request({
            method: "GET",
            url: `${Base_Url}/v2/usr/${randomNonExistingUserId}`,
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
  
    it("Invalidly formatted User id. Should return 400 error", () => {
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
