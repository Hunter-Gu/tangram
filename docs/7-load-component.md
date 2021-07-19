# load component

需要被加载到 Editor 的组件。

预期中可以是任何组件，并且加载进来直接可以使用，比如 ElementUI, vuetify...

但是实际存在以下问题：

- 组件的某些 required props 缺失，导致报错
- 组件会影响整个 UI，比如 modal 组件，可能会覆盖 Editor

通过以下方式解决上述问题：

- 为组件的 props 提供默认值
- 渲染为自定义组件的能力
- 一个安全的容器，组件无法影响整个页面

## render descriptor

```ts
{
	props?: {
		...
	},
	renderView?: VueComponent,
	component: original component,
	descriptor: props descriptor // detail see 6-props-editor.md
}
```

render descriptor 本质上是给当前组件，在组件列表中展示时添加一些默认属性。

当不提供 `renderView` 属性时，这个 `props` 属性，和右侧的 props descriptor 是有部分重叠的，那么当 props descriptor 未提供 `defaultValue` 时，就可以用这一份默认值。
