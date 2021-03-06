/**
 * 工厂模式
 * 工厂模式定义一个用于创建对象的接口, 这个接口由子类决定实例化哪一个类, 该模式使一个类的实例化延迟到了子类, 而子类可以重写接口方法以便创建的时候指定自己的对象类型
 * 将 new 操作单独封装
 * 遇到 new 时, 就要考虑是否该用工厂模式
 * 适用场景:
 *  - 如果你不想让某个子系统与较大的那个对象之间形成强耦合, 而是想运行时从许多子系统中进行挑选的话, 那么工厂模式是一个理想的选择
 *  - 将 new 操作简单封装, 遇到 new 的时候就应该考虑是否使用工厂模式
 * 需要依赖具体环境创建不同实例, 这些实例都有相同的行为, 这时我们可以使用工厂模式, 简化实现的过程, 同时也可以减少对每种对象所需的代码量, 有利于消除对象间的耦合, 提供更大的灵活性
 * 优点:
 *  - 创建对象的过程可能很复杂, 但我们只需要关心创建结果
 *  - 构造函数和创建者分离, 符合开闭原则
 *  - 一个调用者想创建一个对象, 只要知道其名称就可以了
 *  - 拓展性高, 如果想增加一个产品, 只要拓展一个工厂类就可以
 * 缺点:
 *  - 添加新产品时, 需要编写新的具体产品类, 一定程度上增加了系统的复杂度
 *  - 考虑到系统的可拓展性, 需要引入抽象层, 在客户端代码中均使用抽象层进行定义, 增加了系统的抽象性和理解难度
 * 什么时候不用:
 *  - 当被引用到错误的问题类型上时, 这一模式会给应用程序引入大量不必要的复杂性, 除非为创建对象提供一个接口使我们编写的库或者框架的一个设计上目标
 *  - 由于对象的创建过程被高效的抽象在一个接口后面的事实, 这也会给依赖于这个过程可能会有恨到复杂的单元测试带来问题
 * 例子:
 *  - JQuery: $("div") 和 new $("div") 有何区别?
 *  - - $("div") 其实是一个工厂函数(可以理解为 Creator, new $("div") 是 Product), 即 new $("div") 是他原本的样子
 *  - - 1.: 书写麻烦, JQuery 的链式操作将成为噩梦
 *  - - 2.: 一旦 JQuery 名字发生变化, 将是灾难性的
 *  - vue 的异步组件
 * 设计原则设计:
 *  - 构造函数和创建者分离
 *  - 符合开放封闭原则
 */

class Product {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log("init");
  }
  fn1() {
    console.log("fn1");
  }
  fn2() {
    console.log("fn2");
  }
}

class Creator {
  create(name) {
    return new Product(name);
  }
}

let creator = new Creator();
let p = creator.create("creator_fun");
p.init();
p.fn1();
p.fn2();

// JQuery, new $("div") 工厂模式
class Jquery {
  constructor(selector) {
    let _selector = document.querySelectorAll("selector"),
      _node = Array.prototype.slice.call(_selector),
      len = _node.length;
    for (let i = 0; i < len; i++) {
      this[i] = _node[i];
    }
    this.length = len;
    this.selector = selector || "";
  }
  append(node) {}
  addClass(name) {}
  html(data) {}
  // ...其他 API
}
window.$ = function (selector) {
  return new JQuery(selector);
};

// vue 的异步组件
// 在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。例如:
Vue.component("async-example", function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: "<div>I am async!</div>",
    });
  }, 1000);
});
