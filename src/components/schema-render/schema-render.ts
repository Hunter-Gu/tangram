import { defineComponent, PropType } from "vue";
import render from "../../core/parser/src/render";
import { Schema } from "../../core/parser/src/types/schema";

export default defineComponent({
  name: "SchemaRender",
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
  },
  setup: (props) => {
    // @ts-ignore
    return () => (window.schema = render(props.schema));
  },
});
