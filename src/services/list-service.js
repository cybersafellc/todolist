import { database } from "../app/database.js";
import { createID } from "../app/generateID.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/responses-error.js";
import listValidation from "../validations/list-validation.js";
import validate from "../validations/validate.js";

const create = async (request) => {
  const result = await validate(listValidation.create, request);
  const count = await database.list.count({
    where: {
      user_id: result.user_id,
      description: result.description,
    },
  });
  if (count) throw new ResponseError(400, "this list already exist");
  result.id = createID.other();
  result.date = new Date();
  const created = await database.list.create({
    data: result,
    select: {
      description: true,
    },
  });
  return new Response(200, "successfully created", created, null, false);
};

const update = async (request) => {
  const result = await validate(listValidation.update, request);
  const count = await database.list.count({
    where: {
      id: result.id,
      user_id: result.user_id,
    },
  });
  if (!count) throw new ResponseError(400, "this list does not exist");
  const isALreadyExist = await database.list.count({
    where: {
      user_id: result.user_id,
      description: result.description,
    },
  });
  if (isALreadyExist) throw new ResponseError(400, "this list already exist");
  const updated = await database.list.update({
    data: {
      description: result.description,
    },
    where: {
      id: result.id,
      user_id: result.user_id,
    },
    select: {
      description: true,
    },
  });

  return new Response(200, "successfully updated", updated, null, false);
};

const deletes = async (request) => {
  const result = await validate(listValidation.deletes, request);
  const count = await database.list.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "this list does not exist");
  const deleted = await database.list.delete({
    where: result,
    select: {
      description: true,
    },
  });

  return new Response(200, "successfully deleted", deleted, null, false);
};

const getAll = async (request) => {
  const result = await validate(listValidation.getAll, request);
  const get = await database.list.findMany({
    where: result,
    select: {
      id: true,
      description: true,
      date: true,
    },
  });
  return new Response(200, "responses completed", get, null, false);
};

const getById = async (request) => {
  const result = await validate(listValidation.getById, request);
  const list = await database.list.findFirst({
    where: result,
    select: {
      id: true,
      description: true,
      date: true,
    },
  });
  if (!list) throw new ResponseError(400, "this list id does not exist");
  return new Response(200, "responses completed", list, null, false);
};

export default { create, update, deletes, getAll, getById };
