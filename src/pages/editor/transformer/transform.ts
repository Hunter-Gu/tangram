import { SchemaData } from "@/core/parser/src/types/schema";
import { Descriptor } from "../types/descriptor";
import { transformer } from "./transformer";

export function descritpor2Schema(descriptor: Descriptor): SchemaData {
  const schema: SchemaData = {
    name: transformer.root,
    props: {
      name: descriptor.name,
    },
    __uuid: new Date().getTime(),
    children: [],
  };

  descriptor.props.forEach((prop) => {
    schema.children?.push({
      ...transformer.transform(descriptor.name, prop),
      __uuid: new Date().getTime(),
    });
  });

  return schema;
}
