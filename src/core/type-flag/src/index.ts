import { parse } from "./parse";
import { TYPE_TRANSFORMER } from "./types";

export function typeFlag(str: string) {
  const parsedTypeFlags = parse(str);

  return parsedTypeFlags.map((parsedTypeFlag) => {
    const { type, value } = parsedTypeFlag;

    if (!(type in TYPE_TRANSFORMER)) {
      throw new Error(`No Provider for this type: ${type}`);
    }

    type Transformer = typeof TYPE_TRANSFORMER;

    const transformer = TYPE_TRANSFORMER[type as keyof Transformer];

    return transformer(value);
  });
}
