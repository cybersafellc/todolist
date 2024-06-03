import crypto, { randomUUID } from "crypto";

class GenerateID {
  user() {
    const id = crypto.randomUUID();
    return id;
  }
  other() {
    const randomId = crypto.randomInt(0, 99999);
    const id = crypto.randomUUID();
    return `${id}${randomId}`;
  }
}

export const createID = new GenerateID();
