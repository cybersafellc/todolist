import listService from "../services/list-service.js";

const create = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await listService.create(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await listService.update(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await listService.deletes(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id } = await req.query;
    if (id) {
      req.body.user_id = await req.id;
      req.body.id = await id;
      const responses = await listService.getById(req.body);
      res.status(responses.status).json(responses).end();
    } else {
      req.body.user_id = await req.id;
      const responses = await listService.getAll(req.body);
      res.status(responses.status).json(responses).end();
    }
  } catch (error) {
    next(error);
  }
};

export default { create, update, deletes, get };
