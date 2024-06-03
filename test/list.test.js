import supertest from "supertest";
import {
  createTestUser,
  getTestList,
  removeTestLists,
  removeTestUser,
} from "./test-utils.js";
import { web } from "../src/app/web.js";
import Jwt from "jsonwebtoken";
import { logger } from "../src/app/logging.js";

describe("POST:/lists", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("should be successfully created", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responses = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "pagi pagi kuterus mandi",
      });

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);

    await removeTestLists(userId);
  });

  it("should be list already exist", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responses = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "pagi pagi kuterus mandi",
      });

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);

    const responses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "pagi pagi kuterus mandi",
      });

    logger.info(responses1.body);
    expect(responses1.status).toBe(400);
    expect(responses1.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("should be invalid input", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responses = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "",
      });

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should be provided invalid access_token", async () => {
    const responses = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer tokenPalsi`)
      .send({
        description: "mau mandi",
      });

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should be not provided access_token", async () => {
    const responses = await supertest(web).post("/lists").send({
      description: "baca buku",
    });

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("PUT:/lists", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  beforeEach(async () => {
    await createTestUser();
  });

  it("successfully update", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: listId.id,
        description: "update testing berhasil",
      });

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);

    await removeTestLists(userId);
  });

  it("update denied if already exist", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses2 = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: listId.id,
        description: "update testing berhasil",
      });

    expect(responses2.status).toBe(200);
    expect(responses2.body.error).toBe(false);

    const responses = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: listId.id,
        description: "update testing berhasil",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("update denied if invalid input", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: listId.id,
        description: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("update denied if invalid provided invalaid where id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "idPalsu",
        description: "test Update",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("update denied if provided invalid acccess_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .put("/lists")
      .set("Authorization", `Bearer tokenPalsu`)
      .send({
        id: listId.id,
        description: "test Update",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("update denied if not provided acccess_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web).put("/lists").send({
      id: listId.id,
      description: "test Update",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });
});

describe("DELETE:/lists", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("successfully deleted", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .delete("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: listId.id,
      });

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("can't deleted if invalid where id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .delete("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "wrongListId",
      });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("can't deleted if invalid input", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .delete("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "",
      });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("can't deleted if not provided access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web).delete("/lists").send({
      id: listId.id,
    });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("cant't deleted if provided invalid access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .delete("/lists")
      .set("Authorization", `Bearer invalidAccessToken`)
      .send({
        id: listId.id,
      });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });
});

describe("GET:/lists?id=<id_list>", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("successfully request", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists?id=${listId.id}`)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.id).toBeDefined();
    expect(responses.body.data.description).toBeDefined();
    expect(responses.body.data.date).toBeDefined();

    await removeTestLists(userId);
  });

  it("request not provided id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists?id=`)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeDefined();

    await removeTestLists(userId);
  });

  it("request provided invalid id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists?id=invalidId`)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("request not provided access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web).get(`/lists?id=${listId.id}`);

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("request provided invalid access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists?id=${listId.id}`)
      .set("Authorization", `Bearer invalidAccessToken`);

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });
});

describe("GET:/lists", () => {
  afterEach(async () => {
    await removeTestUser();
  });
  beforeEach(async () => {
    await createTestUser();
  });

  it("successfully get", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists`)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeDefined();

    await removeTestLists(userId);
  });

  it("if dont have any lists", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists`)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeUndefined();
  });

  it("provided invalid access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web)
      .get(`/lists`)
      .set("Authorization", `Bearer invalidAccessToken`);

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });

  it("not provided access_token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const userId = Jwt.verify(
      login.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const respponses1 = await supertest(web)
      .post("/lists")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        description: "first list",
      });

    expect(respponses1.status).toBe(200);
    expect(respponses1.body.error).toBe(false);

    const listId = await getTestList(userId);
    expect(listId).toBeDefined();

    const responses = await supertest(web).get(`/lists`);

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);

    await removeTestLists(userId);
  });
});
