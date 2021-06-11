# Render

> 诚然，基于 Schema 实现各个框架/平台下的 Render，就可以达到框架无关，平台无关的目的。目前，先考虑在 Vue 的场景下的实现，试试水，获取一些经验。

Render 本质上就是 Schema 的 Parser(递归解析 Schema 的每个字段)，最终利用框架/平台的 `render()` 实现渲染。

既然如此，就需要考虑 Schema 的扩展，因此 Parser 需要基于一种插件机制来实现。

## pluginable

```js
handler.use(handleName);
handler.use(handleProps);
handler.use(handleEvents);
// ...

function handleName(schemaItem: ISchemaItem) {
  // 处理 name 属性，并透传其他属性
  return { ...schemaItem, name: schemaItem.toLowerCase() };
}

function handleProps(schemaItem: ISchemaItem) {
  // 处理 props 属性，并透传其他属性
}

// ...
```

### scalable

允许开发注册自定义的 handler：

- schema handler
- field handler

支持注册到 handler 的不同阶段，比如：

- before: 最先触发的 handler
- running: 处理 key 过程中的 handler, 只支持 field handler 的形式
- after: 处理完整个 schema 后触发的

## lifecycle

the component's lifecycle must be:

- create parent
- create children
- mount children
- mount parent
- unmount children
- unmount parent

- update children
- update parent
