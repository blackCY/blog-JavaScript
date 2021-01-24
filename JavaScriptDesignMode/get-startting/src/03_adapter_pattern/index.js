/**
 * 适配器模式
 *  - 旧接口格式和使用者不兼容(即旧接口不能再使用了)
 *  - 中间加一个适配器转换接口
 * 优点:
 *  - 可以让任何两个没有关联的类一起运行
 *  - 提高了类的复用
 *  - 适配对象, 适配库, 适配数据
 * 缺点:
 *  - 额外对象的创建, 非直接调用, 存在一定的开销(且不像代理模式在某些功能电商可实现性能优化)
 *  - 如果没有必要使用适配器模式的话, 可以考虑重构, 如果使用的话, 尽量吧文档完善
 * 场景:
 *  - 封装旧接口, 如 $.ajax 经典场景
 *  - vue computed(即使用 computed 来更改 data 里的数据形式)
 * 设计原则验证:
 *  - 将旧接口和使用者进行分离(所有的分离和解耦都是符合开放封闭原则)
 *  - 符合开放封闭原则
 * 适配器模式与代理模式相似:
 *  - 适配器模式: 提供一个不同的接口
 *  - 代理模式: 提供一模一样的接口
 */
class Adaptee {
  specificRequest() {
    return "德国标准插头";
  }
}
class Target {
  constructor() {
    this.adaptee = new Adaptee();
  }
  request() {
    let info = this.adaptee.specificRequest();
    return `${info} - 转换器 - 中国标准插头`;
  }
}
// 测试
let target = new Target();
console.log(target.request());

// 封装旧接口
// 自己封装的 ajax
asax({
  url: "",
  type: "",
  dataType: "",
  data: {},
}).done(function () {});

// 但因为历史原因, 代码中全是
// $.ajax({/* ... */})

// 适配器
var $ = {
  ajax(options) {
    return ajax(options);
  },
};
