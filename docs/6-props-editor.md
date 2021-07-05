# Props Editor

右侧的属性编辑器，根据 description 的描述进行渲染。

而 descriptor 的渲染是可以基于 tangram 的 json render 功能的。

## description

description 是对组件的描述，包含以下部分：

- 名字
- 属性
  - 属性名
  - 属性的类型
  - 默认值
  - validator
- 方法
  - 方法名
  - 方法类型？
  - 参数列表？
  - 返回值类型？

```js
{
	name: 'Component Name',
	props: [
		{
			name: 'Prop1 Name',
			type: 'string', // 可以直接是一个组件，但是需要定好接口，所有组件需要实现该接口
			defaultValue: '', // 其实也可以通过组件提供
			validator: () => boolean, // 输入值的验证函数
			normalize: () => unknown, // 将输入的值进行转换
		}
	],
	methods: {
		[Method Name]: {
			name: '',
			args: [
				{
					name: '',
					type: '',
					value: ''
				}
			],
			return: {
				name: '',
				type: '',
			}
		}
	},
	// 支持扩展
	others: ...
}
```

## Forender

通过 json 描述表单。上一部分的 description 渲染功能其实就是 Forender 的子集，之后可以完善这一部分。
