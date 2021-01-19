import { defineComponent, h, PropType } from 'vue'
import render, { Schema } from './render';

export default defineComponent({
  name: 'SchemaRender',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    }
  },
  setup: (props) => {

    return () => render(props.schema);
  }
})
