import Elm1 from './elm-1.vue';
import { Schema } from './render';

export default {
  name: 'div',
  children: [
    {
      name: Elm1,
      slots: {
        default: {
          name: 'span',
          children: [
            'Hello World'
          ]
        }
      }
    },
    {
      name: Elm1
    },
    {
      name: 'div',
      children: [
        {
          name: Elm1
        }
      ]
    }
  ]
} as Schema;
