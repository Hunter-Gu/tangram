# Inspiration

通过嵌套的格式数据结构描述 UI，方便对接可视化拖拽生成页面，比如：

```js
{
  name: 'XxxComponent',
  data: {

  },
  events: {

  },
  children: [
    {
      name: 'YyyComponent',
      data: {

      },
      events: {

      }
    }
  ]
}
```

通过类似 [Mermaid 的语法描述流程图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW0NocmlzdG1hc10gLS0-fEdldCBtb25leXwgQihHbyBzaG9wcGluZylcbiAgICBCIC0tPiBDe0xldCBtZSB0aGlua31cbiAgICBDIC0tPnxPbmV8IERbTGFwdG9wXVxuICAgIEMgLS0-fFR3b3wgRVtpUGhvbmVdXG4gICAgQyAtLT58VGhyZWV8IEZbZmE6ZmEtY2FyIENhcl1cbiAgICAgICAgICAgICIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)，通过流程图描述执行逻辑。比如

```Mermaid
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

开发只需要关注组件，由组件提供 UI 和功能，最终使用者将组件进行组合以及编辑流程和逻辑。
