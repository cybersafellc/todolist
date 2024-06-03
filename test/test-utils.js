import { database } from "../src/app/database.js";
import bcrypt from "bcrypt";
import { createID } from "../src/app/generateID.js";

export const removeTestUser = async () => {
  await database.user.deleteMany({
    where: {
      username: "sendersirchat@gmail.com",
    },
  });
};

export const createTestUser = async () => {
  await database.user.create({
    data: {
      id: createID.user(),
      username: "sendersirchat@gmail.com",
      password: await bcrypt.hash("rahasia", 10),
    },
  });
};

export const getTestUser = async () => {
  return await database.user.findFirst({
    where: {
      username: "sendersirchat@gmail.com",
    },
  });
};

export const getTestResetPasswordToken = async (user_id) => {
  const responses = await database.reset_password_token.findFirst({
    where: {
      user_id: user_id,
    },
  });
  return responses?.jwt_reset_pass_token;
};

export const getTestList = async (user_Id) => {
  return await database.list.findFirst({
    where: {
      user_id: user_Id,
    },
  });
};

export const removeTestLists = async (user_id) => {
  await database.list.deleteMany({
    where: {
      user_id: user_id,
    },
  });
};
