import Joi from "joi";

const create = Joi.object({
  user_id: Joi.string().required(),
  description: Joi.string().required(),
});

const update = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
  description: Joi.string().required(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
});

const getAll = Joi.object({
  user_id: Joi.string().required(),
});

const getById = Joi.object({
  user_id: Joi.string().required(),
  id: Joi.string().required(),
});

export default { update, create, deletes, getAll, getById };
