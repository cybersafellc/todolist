import supertest from "supertest";
import {
  createTestUser,
  getTestResetPasswordToken,
  removeTestUser,
} from "./test-utils.js";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";
import Jwt, { verify } from "jsonwebtoken";

describe("POST:/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const responses = await supertest(web).post("/users").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    logger.info(responses.body);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("should be username already exist", async () => {
    const result = await supertest(web).post("/users").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);

    const response = await supertest(web).post("/users").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    logger.info(response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should reject if request invalid", async () => {
    const response = await supertest(web).post("/users").send({
      username: "",
      password: "",
    });

    logger.info(response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("POST:users/login", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should login successfully", async () => {
    const result = await supertest(web).post("/users").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);

    const responses = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    logger.info(responses.body);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("should username doesnt exist", async () => {
    const responses = await supertest(web).post("/users/login").send({
      username: "aowkoakwoakwok@akwokaw.aowkoakw",
      password: "rahasia",
    });

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should password incorect", async () => {
    const result = await supertest(web).post("/users").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);

    const responses = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia123",
    });

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("POST:/users/verify-token", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  beforeEach(async () => {
    await createTestUser();
  });

  it("provided valid token", async () => {
    const result = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);
    expect(result.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .get("/users/verify-token")
      .set("Authorization", `Bearer ${result.body.data.access_token}`);

    logger.info(responses.body);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("should not provided the token", async () => {
    const responses = await supertest(web).get("/users/verify-token");

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should provided invalid token", async () => {
    const responses = await supertest(web)
      .get("/users/verify-token")
      .set("Authorization", `Bearer tokenPalsuHewHew`);

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("POST:/users/refresh-token", () => {
  afterEach(async () => {
    await removeTestUser();
  });
  beforeEach(async () => {
    await createTestUser();
  });

  it("should successfully refresh_token", async () => {
    const result = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);
    expect(result.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .post("/users/refresh-token")
      .set("Authorization", `Bearer ${result.body.data.refresh_token}`);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.access_token).toBeDefined();
  });

  it("should be not provided refresh_token", async () => {
    const responses = await supertest(web).post("/users/refresh-token");

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should be provided invalid refresh_token", async () => {
    const responses = await supertest(web)
      .post("/users/refresh-token")
      .set("Authorization", `Bearer tokenPalsu`);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("POST:/users/reset-password", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should be successfuly request reset password", async () => {
    const response = await supertest(web).post("/users/reset-password").send({
      username: "sendersirchat@gmail.com",
    });

    logger.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("should be not provided username", async () => {
    const response = await supertest(web).post("/users/reset-password").send({
      username: "",
    });

    logger.info(response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("should be provided username incorect or hasnt register", async () => {
    const response = await supertest(web).post("/users/reset-password").send({
      username: "undifined@undifined.id",
    });

    logger.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

describe("GET:/users/reset-password/verify-token", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should be provided valid reset_password_token", async () => {
    const result = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);
    expect(result.body.data.access_token).toBeDefined();
    const userId = Jwt.verify(
      result.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responseResetPass = await supertest(web)
      .post("/users/reset-password")
      .send({
        username: "sendersirchat@gmail.com",
      });

    expect(responseResetPass.status).toBe(200);
    expect(responseResetPass.body.error).toBe(false);

    const resetPasswordToken = await getTestResetPasswordToken(userId);
    // execution
    const responses = await supertest(web)
      .get("/users/reset-password/verify-token")
      .set("Authorization", `Bearer ${resetPasswordToken}`);

    logger.info(responses.body);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("should be not provided reset_password_token", async () => {
    const responses = await supertest(web).get(
      "/users/reset-password/verify-token"
    );

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should be provided invalid reset_password_token", async () => {
    const responses = await supertest(web)
      .get("/users/reset-password/verify-token")
      .set("Authorization", `Bearer tokenPalsu`);

    logger.info(responses.body);

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("PUT:/users/reset-password/update-password", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should be successfully update password", async () => {
    const result = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);
    expect(result.body.data.access_token).toBeDefined();
    const userId = Jwt.verify(
      result.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responseResetPass = await supertest(web)
      .post("/users/reset-password")
      .send({
        username: "sendersirchat@gmail.com",
      });

    expect(responseResetPass.status).toBe(200);
    expect(responseResetPass.body.error).toBe(false);

    const resetPasswordToken = await getTestResetPasswordToken(userId);
    // execution
    const responses = await supertest(web)
      .put("/users/reset-password/update-password")
      .set("Authorization", `Bearer ${resetPasswordToken}`)
      .send({
        password: "rahasia123",
      });

    logger.info(responses.body);

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
  });

  it("should be reset_password_token has been used to update password and successfuly changed", async () => {
    const result = await supertest(web).post("/users/login").send({
      username: "sendersirchat@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBe(false);
    expect(result.body.data.access_token).toBeDefined();
    const userId = Jwt.verify(
      result.body.data.access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode.id;
      }
    );
    expect(userId).toBeDefined();

    const responseResetPass = await supertest(web)
      .post("/users/reset-password")
      .send({
        username: "sendersirchat@gmail.com",
      });

    expect(responseResetPass.status).toBe(200);
    expect(responseResetPass.body.error).toBe(false);

    const resetPasswordToken = await getTestResetPasswordToken(userId);
    // execution
    const responses = await supertest(web)
      .put("/users/reset-password/update-password")
      .set("Authorization", `Bearer ${resetPasswordToken}`)
      .send({
        password: "rahasia123",
      });

    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    // and try execution again used same resetPassword token before
    const responses1 = await supertest(web)
      .put("/users/reset-password/update-password")
      .set("Authorization", `Bearer ${resetPasswordToken}`)
      .send({
        password: "rahasia123",
      });

    expect(responses1.status).toBe(400);
    expect(responses1.body.error).toBe(true);
  });

  it("should be not provided reset password token", async () => {
    const responses = await supertest(web)
      .put("/users/reset-password/update-password")
      .send({
        password: "rahasia123",
      });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });

  it("should be provided invalid reset_password_token", async () => {
    const responses = await supertest(web)
      .put("/users/reset-password/update-password")
      .set("Authorization", `Bearer tokenPalsu`)
      .send({
        password: "rahasia123",
      });

    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});
