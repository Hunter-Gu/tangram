# Options

Schmea 的每一项都称为 Options，分别为：

- `name` 一个组件组件，或一个 HTML 标签名
- `props` 组件的 Input
- `attrs` HTML attributes
- `events` 事件名及其对应的处理函数名。事件名应为 `onXxx`
- `slots` 组件的 slots。一个对象 key 是 slot 的名，对应的值仍旧为 schema
- `children` name 为 HTML 元素时的子元素。一个数组，值为 schema

## TODO

- support pass parameters to call function
- support call other refs' function
- refactor render
