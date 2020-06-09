export default {
  functional: true,
  render(h, { parent }){
    const { $router: { pathMap }, $route: { path } } = parent;
    // 直接查询渲染对应组件
    return h(pathMap[path]);
  }
}