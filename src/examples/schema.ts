import { SchemaData } from "@/core/parser/src/types/schema";
import Elm1 from "./elm-1.vue";

// div
//   Elm1(div)
//     - Text
//     span
//       div
//         ...
//   Elm1(div)
//     - Text
//   div
//     Elm1(div)

export default <SchemaData>{
  name: "div",
  __uuid: 0,
  children: [
    {
      name: Elm1,
      __uuid: 1,
      props: {
        name: "First wrapper element",
      },
      events: {
        onClick: [
          { ref: "1", name: "logger" },
          { ref: "4", name: "logger" },
        ],
      },
      slots: {
        default: {
          name: "span",
          children: [
            {
              name: "div",
              attrs: {
                style: "font-weight: bold; color: green;",
              },
              children: ["child"],
            },
            {
              name: Elm1,
            },
          ],
        },
      },
    },
    {
      name: Elm1,
      props: {
        name: "Second wrapper element",
      },
      __uuid: 2,
    },
    {
      name: "div",
      __uuid: 3,
      children: [
        {
          name: Elm1,
          __uuid: 4,
          props: {
            name: "Child of thrid",
          },
          attrs: {
            style: "color: red",
          },
          events: {
            onClick: [{ ref: "4", name: "logger" }],
          },
        },
      ],
    },
  ],
};
