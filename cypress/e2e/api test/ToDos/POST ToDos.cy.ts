import {
  UserDataGenerator,
  generateRandomEmail,
  pickRandomStatus,
  pickRandomGender,
  chooseRandomStatus,
} from "../../../fixtures/Genertors/DataGenrator.cy";
import {
  GetUsers,
} from "../../../fixtures/Builders/Users/UsersBuilder.cy";
import { Chance } from "chance";
import { GetUserToDo } from "../../../fixtures/Builders/ToDos/ToDosBuilder.cy";
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
let lastCreatedToDosId: number;
let statusForToDos: string

describe("GET / posts List", () => {
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
    randomTitle = chance.address();
    statusForToDos = chooseRandomStatus();
  });

  it("Post ToDos", () => {
    cy.request({
      method: "POST",
      url: `${Base_Url}/v2/users/${userId}/todos`,
      headers: headers,
      body: {
        title: randomTitle,
        status: statusForToDos,
      },
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        lastCreatedToDosId = response.body.id;
        console.log(lastCreatedToDosId);
        return GetUserToDo(userId, "/todos");
      })
      .then((response) => {
        const randomToDo = response.find((todo: { id: number; }) => todo.id === lastCreatedToDosId);
        expect(randomToDo).to.exist;
        expect(randomToDo!.id).to.be.equal(lastCreatedToDosId);
        expect(randomToDo!.user_id).to.be.equal(userId);
        expect(randomToDo!.title).to.be.equal(randomTitle);
        expect(randomToDo!.status).to.be.equal(statusForToDos);
      });
  });
  it("Request without body. Should return 422 error", () => {
    cy.request({
      method: "POST",
      url: `${Base_Url}/v2/users/${userId}/todos`,
      headers: headers,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(422);
    });
  });

  ["title", "status"].forEach((key) => {
    it(`Without required key ${key}. Should return 422 error`, () => {
      const myBody = {
        title: randomTitle,
        status: statusForToDos,
      };
      const myBodyClone = { ...myBody };
      delete myBodyClone[key as keyof typeof myBodyClone];
      cy.request({
        method: "POST",
        url: `${Base_Url}/v2/users/${userId}/todos`,
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
      url: `${Base_Url}/v2/users/${userId}/todo`,
      headers: headers,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
    });
  });
});
