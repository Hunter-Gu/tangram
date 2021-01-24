import Elm1 from './elm-1.vue';
import { Schema } from '../components/schema-render/core/render';

export default {
  name: 'div',
  __uuid: 0,
  children: [
    {
      name: Elm1,
      __uuid: 1,
      props: {
        name: 'Elm',
      },
      events: {
        onClick: ['$4.logger hello world', '$.logger']
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
      name: Elm1,
      __uuid: 2
    },
    {
      name: 'div',
      __uuid: 3,
      children: [
        {
          name: Elm1,
          __uuid: 4,
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
