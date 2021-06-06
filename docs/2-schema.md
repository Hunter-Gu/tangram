# Schema

Schema 的结构大致如下：

```js
{
  // html 原生标签
  name: 'div',
  // 唯一标识
  __uuid: 1,
  // 用户对其自定义的名字
  alias: '',
  onclick: ['1.2.restart()', '1.hide()'],
  children: [
    {
      // 一个组件
      name: 'ProgressBar'
      // 唯一标识
      __uuid: 2,
      // 元素的 props 或 attrs
      style: 'color: "red", border: "1px solid red"',
      value: 0.3
      alias: '',
      onchange: [
        // 数组包裹表示并行项（相当于前面添加 `await`
        // 数组项数大于 1 表示，形成一个 async IFFI 块
        ['1.shake()', '1.move()', '1.hide'],
        '1.2.restart()'
      ]
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

事件处理的设计细节：

```js
// 串行
a()
b()
c()
['a', 'b', 'c']

// 并行
await a()
await b()
await c()
[
  ['a'],
  ['b'],
  ['c']
]

// 串行 + 并行
await (async () => { a(); A() })()
await b()
await c()
[
  ['a', 'A'],
  ['b'],
  ['c']
]

// 更复杂一点的
await a()
await (async () => {
  b()
  await B()
  bb()
})()
await c()

[
  ['a'],
  [
    'b',
    ['B'],
    'bb'
  ],
  ['c']
]
```
