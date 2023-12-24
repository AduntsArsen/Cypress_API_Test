import { UserDataGenerator, generateRandomEmail, pickRandomStatus, pickRandomGender } from "../../../fixtures/Genertors/DataGenrator.cy";
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
let validEmail: string;
let randomName: string;
let randomGender: string;
let randomStatus: string;
let lastCreatedUserId: number;

describe("GET / Users List", () => {
  let userId: number;

  before(() => {
    validEmail = generateRandomEmail();
    randomName = chance.name();
    randomGender = pickRandomGender();
    randomStatus = pickRandomStatus();
  });

  it("Post User", () => {
    cy.request({
      method: "POST",
      url: `${Base_Url}/v2/users/`,
      headers: headers,
      body: {
        name: randomName,
        email: validEmail,
        gender: randomGender,
        status: randomStatus,
      },
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        lastCreatedUserId = response.body.id;
        return GetUser(lastCreatedUserId);
      })
      .then((response) => {
        expect(response.id).to.be.equal(lastCreatedUserId);
        expect(response.name).to.be.equal(randomName);
        expect(response.gender).to.be.equal(randomGender);
        expect(response.email).to.be.equal(validEmail);
        expect(response.status).to.be.equal(randomStatus);
      });
  });

  it("Request without body. Should return 422 error", () => {
    cy.request({
      method: "POST",
      url: Path,
      headers: headers,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(422);
    });
  });

  ["name", "email", "gender", "status",].forEach((key) => {
    it(`Without required key ${key}. Should return 422 error`, () => {
      const myBody = {
        name: randomName,
        email: validEmail,
        gender: randomGender,
        status: randomStatus,
      };
      const myBodyClone = { ...myBody };
      delete myBodyClone[key as keyof typeof myBodyClone];
      cy.request({
        method: "POST",
        url: Path,
        headers: headers,
        failOnStatusCode: false,
        body: myBodyClone,
      }).then((response) => {
        expect(response.status).to.equal(422);
        expect(response.body[0].field).to.include(`${key}`);
        expect(response.body[0].message).to.include("can't be blank");
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

    it("Already used email. Should return 422 error", () => {
        cy.request({
          method: "POST",
          url: Path,
          headers: headers,
          failOnStatusCode: false,
          body: {
            name: randomName,
            email: validEmail,
            gender: randomGender,
            status: randomStatus,
          },
        }).then((response) => {
          expect(response.status).to.equal(422);
          expect(response.body[0].field).to.include("email");
          expect(response.body[0].message).to.include("has already been taken");
        });
      });
    });
  