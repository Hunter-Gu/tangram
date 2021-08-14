# Schema

Schmea 的每一项都称为 Options，分别为：

- `name` 一个组件组件，或一个 HTML 标签名
- `url` 一个动态加载的组件？
- `__uuid` 元素实例的唯一 id
- `props` 组件的 Input
- `attrs` HTML attributes
- `events` 事件名及其对应的处理函数名。事件名应为 `onXxx`
- `slots` 组件的 slots。一个对象 key 是 slot 的名，对应的值仍旧为 schema
- `children` name 为 HTML 元素时的子元素。一个数组，值为 schema
- `extra` 额外信息，运行时无关，方便 debug

Schema 的结构大致如下：

```js
{
  // html 原生标签
  name: 'div',
  // 唯一标识
  __uuid: 1,
  extra: {
    // 用户对其自定义的名字
    alias: '',
  },
  events: {
    onclick: [
      {
        ref: 1,
        name: 'restart',
      },
      {
        ref: 1,
        name: 'hide'
      }
    ],
  },
  children: [
    {
      // 一个组件
      name: 'ProgressBar'
      // 唯一标识
      __uuid: 2,
      attrs: {
        style: 'color: "red", border: "1px solid red"',
      },
      props: {
        value: 0.3
      },
      extra: {
        alias: '',
      },
      events: {
        onchange: [
          // 数组项数等于 1 表示前面添加 `await`
          [
            {
              ref: 1,
              name: 'shake'
            },
            {
              ref: 1,
              name: 'move'
            }
          ],
        ]
      }
    },
    {
      name: 'Editor',
      // 一个动态加载的组件？
      url: 'https://...',
      __uuid: 3,
    }
  ]
}
```

## event design

忽略最外层的数组块，一个长度为 1 的数组块表示一个需要被 `await` 的异步操作：

```js
// 最外层数组块忽略
[
  "a",
  "b",
  "c"
];

a();
b();
c();

// 数组块，表示需要被 `await`：
[
  ["a"],
  ["b"],
  ["c"]
];

await a();
await b();
await c();

// 串行 + 并行
[
  ["a", "A"],
  ["b"],
  ["c"]
];

await (async () => {
  a();
  A();
})();
await b();
await c();

// 更复杂一点的
[
  ["a"],
  [
    "b",
      ["B"],
    "bb"
  ],
  ["c"],
  "d",
  "e"
];

await a();
await (async () => {
  b();
  await B();
  bb();
})();
await c();
d();
e();
```

### Chain mechanism

```js
class Chain {

  createAsyncBlock() {}

  addSync() {}

  addAsync() {}

  invoke() {}
}

const chain = new Chain()

["a", "b", "c"];

chain.addSync("a").addSync("b").addSync("c");

[
  ["a"],
  ["b"],
  ["c"]
];

chain.addAsync("a").addAsync("b").addAsync("c");

[
  ["a", "A"],
  ["b"],
  ["c"]
];

// equals

[
  "a", "A"
  ["b"]
  ["c"]
]

chain.addSync("a")
     .addSync("A")
     .addAsync("b")
     .addAsync("c");

[
  ["a"],
  [
    "b",
      ["B"],
    "bb"
  ],
  ["c"],
  "d",
  "e"
];

// equals
[
  ["a"],
  "b",
  ["B"],
  "bb"
  ["c"],
  "d",
  "e"
];


chain
  .addAsync("a")
  .addSync("b")
  .addAsync("B")
  .addSync("bb")
  .addAsync("c")
  .addSync("d")
  .addSync("e");
```
