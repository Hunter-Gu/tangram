# CHANGELOG

## 0.0.0 - 2021.02.10

Redesign type flag parser for better code reuse.

### SAX-style parser

The new parser is a SAX-style parser, inspired by [Pure JavaScript HTML Parser](https://johnresig.com/blog/pure-javascript-html-parser/).

e.g:

```js
const str = `--object --string "key1.key11" --number 12 --string "key1.key12" --string "hello world"`;

parse(str, {
  char(char) {},
  type(type) {},
  value(value) {
    // every chunk which is not type flag. Such as key of object, e.g [key1][key2]:
  },
});
```

## 0.0.0 - 2021.02.02

### Refactor type-flags parser

Type-flags are parsed in loop, and transforming value also. This design is not good for code reuse, and hard to reserve info in parsing. The most important is this design is not pure.

**New Parser**

Split parser into 2 part:

- pure parser: parse type-flags into structural data, not value
- transformer: transform parsed value into expect value

e.g:

```
--string "hello world" --number 12 --object [key1][key11]: --string "hello world --string \"hello world\"" [key1][key12]: --number 12 --array [0]: --object [key1][key11]: --string "hello world" [key1][key12]: --number 12 [1]: --number 12 [2]: --string "hello world"
```

- after parsing

```js
[
  {
    raw: '--string "hello world"',
    type: "string";
    value: '"hello world"'
  },
  {
    raw: '--number 12',
    type: "number",
    value: "12"
  },
  {
    raw: `--object
            [key1][key11]:
              --string "hello world --string \"hello world\""
            [key1][key12]:
              --number 12`,
    type: "object",
    value: {
      [key1][key11]: {
        raw: '--string "hello world --string \"hello world\""',
        type: "string",
        value: '"hello world --string \"hello world\""'
      },
      [key1][key12]: {
        raw: '--number 12',
        type: "number",
        value: "12"
      }
    }
  },
  {
    raw: `--array
            [0]:
              --object
                [key1][key11]:
                  --string "hello world"
                [key1][key12]:
                  --number 12
            [1]:
              --number 12
            [2]:
              --string "hello world"`,
    type: "array",
    value: [
      {
        raw: `--object
                [key1][key11]:
                  --string "hello world"
                [key1][key12]:
                  --number 12`,
        type: "object",
        value: {
          [key1][key11]: {
            raw: '--string "hello world"',
            type: "string",
            value: '"hello world"'
          },
          [key1][key12]: {
            raw: '--number 12',
            type: "number",
            value: "12"
          }
        }
      },
      {
        raw: '--number 12',
        type: "number",
        value: "12"
      },
      {
        raw: '--string "hello world"',
        type: "string";
        value: '"hello world"'
      },
    ]
  }
]
```

- after transforming

```js
[
  "hello world",
  12,
  {
    key1: {
      key11: 'hello world --string "hello world"',
      key12: 12,
    },
  },
  [
    {
      key1: {
        key11: "hello world",
        key12: 12,
      },
    },
    12,
    "hello world",
  ],
];
```
