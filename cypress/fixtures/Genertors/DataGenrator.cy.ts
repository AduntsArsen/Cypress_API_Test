import { UserDataPost } from "../Models/Posts/PostsResponse.cy";
import { UserData } from "../Models/Users/UsersResponse.cy";
import { UserDataToDo } from "../Models/ToDos/ToDosResponse.cy";
import { UserDataPostComment,  } from "../Models/Comments/CommentsResponse.cy";




import Chance from "chance"
const chance = new Chance()
export function UserDataGenerator(userData: Partial<UserData> = {}): UserData {
    const statuses = ["active", "inactive"]
    return {
        name: userData.name ?? chance.name(),
        gender: userData.gender ?? chance.gender().toLocaleLowerCase(),
        email: userData.email ??
            `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}@test.com`,
        status: userData.status ?? chance.pickone(statuses)
    }
}

export function UserDataGeneratorForPost(userDataPost: UserDataPost = {}): UserDataPost{
    return {
        "title": userDataPost.title ?? `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}`,
        "body": userDataPost.body ?? `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}`,
    }
}

export function UserDataGeneratorForPostComment(userDataPostComment: UserDataPostComment = {}): UserDataPostComment{
    return {
        "name": userDataPostComment.name ?? chance.name(),
        "email": userDataPostComment.email ?? `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}@test.com`,
        "body": userDataPostComment.body ?? `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}`,
    }
}

export function UserDataGeneratorForToDo(userDataToDo: UserDataToDo = {}): UserDataToDo{
    const statuses2 = ["pending", "completed"]
    return {
        "title": userDataToDo.title ?? `${chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })}${chance.integer({ min: 1000, max: 10000000000000 })}`,
        "status": userDataToDo.status ?? chance.pickone(statuses2),
    }
}

export function generateRandomEmail(): string {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const emailLength = 5;
    const domain = "gmail.com";
    let email = "";
    for (let i = 0; i < emailLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      email += characters[randomIndex];
    }
    email += "@" + domain;
    return email;
  }

  export function pickRandomStatus(): string {
    const status: string[] = ["active", "inactive"];
    const randomIndex: number = Math.floor(Math.random() * status.length);
    return status[randomIndex];
  }

  export function pickRandomGender(): string {
    const status: string[] = ["male", "female"];
    const randomIndex: number = Math.floor(Math.random() * status.length);
    return status[randomIndex];
  }

  export function chooseRandomStatus(): string {
    const status: string[] = ["pending", "completed"];
    const randomIndex: number = Math.floor(Math.random() * status.length);
    return status[randomIndex];
  }