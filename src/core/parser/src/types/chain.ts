export type Data = {
  ref: string;
  name: string;
  async?: boolean;
}

export type Chainable = {
  data?: Data;
  next: Partial<Chainable>;
}
