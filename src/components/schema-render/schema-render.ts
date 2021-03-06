import { SchemaData } from "../../core/parser/src/types/schema";
import { render } from "../../core/render/src/vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SchemaRender",
  props: {
    schema: {
      type: Object as PropType<SchemaData>,
      required: true,
    },
  },
  setup: (props) => {
    return () => render(props.schema);
  },
});
