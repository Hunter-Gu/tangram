import { Handler } from "./schema";

export type Data = Pick<Handler, "name" | "ref"> & {
  async?: boolean;
};

export type Chainable = {
  data?: Data;
  next: Partial<Chainable>;
};
