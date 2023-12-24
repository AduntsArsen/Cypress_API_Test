import {
    UserDataGenerator,
    generateRandomEmail,
    pickRandomStatus,
    pickRandomGender,
  } from "../../../fixtures/Genertors/DataGenrator.cy";
  import {
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
  let existingAndUsedEmails: string;
  let userId: number;
  
  describe("PATCH / User", () => {
    before(() => {
      GetUsers().then((users: any) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        userId = randomUser.id;
        existingAndUsedEmails = randomUser.email;
      });
      validEmail = generateRandomEmail();
      randomName = chance.name();
      randomGender = pickRandomGender();
      randomStatus = pickRandomStatus();
    });
  
    it("DELETE User", () => {
      cy.request({
        method: "DELETE",
        url: `${Base_Url}/v2/users/${userId}`,
        headers: headers,
      })
        .then((response) => {
          expect(response.status).to.equal(204);
          return GetUsers();
        })
        .then((response) => {
          const deletedUserStillExists = response.some((user: any) => user.id === userId);
          expect(deletedUserStillExists).to.be.false;
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
  