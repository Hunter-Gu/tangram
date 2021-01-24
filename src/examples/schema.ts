import Elm1 from './elm-1.vue';
import { Schema } from '../components/schema-render/core/render';

export default {
  name: 'div',
  children: [
    {
      name: Elm1,
      props: {
        name: 'Elm',
      },
      events: {
        onClick: ['logger hello world', 'logger']
      },
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
          name: Elm1,
          props: {
            name: 'what'
          },
          attrs: {
            style: 'color: red'
          },
          events: {
            onClick: 'logger'
          }
        }
      ]
    }
  ]
} as Schema;
