import { UserDataGenerator, generateRandomEmail, pickRandomGender, pickRandomStatus } from "../../../fixtures/Genertors/DataGenrator.cy";
import {
  GetUser,
  GetUsers,
  PostUser,
} from "../../../fixtures/Builders/Users/UsersBuilder.cy";
import { Chance } from "chance";
import { GetUserPost } from "../../../fixtures/Builders/Posts/PostsBuilder.cy";
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
let randomTitle: string;
let randomBody: string;
let lastCreatedUserId: number;

describe("GET / Users List", () => {
  let userId: number;

  before(() => {
    validEmail = generateRandomEmail();
    randomName = chance.name();
    randomGender = pickRandomGender();
    randomStatus = pickRandomStatus();
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
    GetUsers().then((users: any) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      userId = randomUser.id;
    });
    validEmail = generateRandomEmail();
    randomName = chance.name();
    randomTitle = chance.address();
    randomBody = chance.string();
  });

  it("Post Posts", () => {
    cy.request({
      method: "POST",
      url: `${Base_Url}/v2/users/${userId}/posts`,
      headers: headers,
      body: {
        title: randomTitle,
        body: randomBody,
      },
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        lastCreatedUserId = response.body.id;
        return GetUserPost(lastCreatedUserId, "posts");
      })
      .then((response) => {
        expect(response.id).to.be.equal(lastCreatedUserId);
        expect(response.user_id).to.be.equal(userId)
        expect(response.title).to.be.equal(randomTitle);
        expect(response.body).to.be.equal(randomBody);
      });
  });

  it("Request without body. Should return 422 error", () => {
    cy.request({
      method: "POST",
      url: `${Base_Url}/v2/users/${userId}/posts`,
      headers: headers,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(422);
    });
  });

  ["title", "body",].forEach((key) => {
    it(`Without required key ${key}. Should return 422 error`, () => {
      const myBody = {
        title: randomTitle,
        body: randomBody,
      };
      const myBodyClone = { ...myBody };
      delete myBodyClone[key as keyof typeof myBodyClone];
      cy.request({
        method: "POST",
        url: `${Base_Url}/v2/users/${userId}/posts`,
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
        url: `${Base_Url}/v2/users/${userId}/pos`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
    });
  