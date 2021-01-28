import { Schema } from "../components/schema-render/core/schema";
import Elm1 from "./elm-1.vue";

export default {
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
        onClick: ["$4.logger hello world", "$1.logger"],
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
            onClick: "$4.logger",
          },
        },
      ],
    },
  ],
} as Schema;
