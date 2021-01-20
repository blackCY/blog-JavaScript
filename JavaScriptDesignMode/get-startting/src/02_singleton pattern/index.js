/**
 * 单例模式
 *  - 系统中被唯一使用
 *  - 一个类只有一个实例, 并提供一个访问它的全局访问点
 * 单例模式需要用到 private property
 * 优点:
 *  - 划分命名空间, 减少全局变量
 *  - 增强模块性, 把自己的代码组织在一个全局变量下, 放在单一位置, 便于维护
 *  - 只会实例化一次, 简化了代码的调试和维护
 * 缺点:
 *  - 由于单例模式提供的是一种单点访问, 所以他有可能增强模块间的强耦合, 从而不利于单元测试, 无法单元测试一个调用了来自单例的方法的类, 而只能把它那个单例作为一个单元一起测试
 * 使用场景:
 *  - JQuery 只有一个 $
 *  - 模拟登录框
 *  - 购物车(和登录框类似)
 *  - vuex 和 redux 的 store
 * 设计原则验证:
 *  - 符合单一职责原则, 只实例化唯一的对象
 *  - 没法具体开放封闭原则, 但是绝对不违反开放封闭原则
 */

// js 中实现单例模式的方法
class SingleObject {
  // login 每次 实例化都会在实例化对象上有 login 实例方法
  login() {
    console.log("login....");
  }
  // ...其他方法
}
// 使用 IIFE 赋值给 SingleObject 的一个静态方法, 保证了无论 new 多少次, getInstance 方法都只有一个, 从而保证了内部的 new SingleObject() 都是一个对象, 即只 new 了一次
SingleObject.getInstance = (function () {
  let instance;
  // 使用闭包
  return function () {
    if (!instance) {
      instance = new SingleObject();
    }
    return instance;
  };
})();

// javascript 里的变相实例模式有一个缺点, 这里只能靠文档来约束, 不能 new SingleObject(), 即无法完全控制, 直接 new 不会报错, 但是使用方法是错误的

let obj1 = SingleObject.getInstance();
obj1.login();
let obj2 = SingleObject.getInstance();
obj2.login();
console.log(obj1 === obj2); // true
// 有 obj1 === obj2 可得出, getInstance 实现了单例模式

// JQuery 单例模式的实现思想, 即 JQuery 只有一个 $, 防止多次初始化
// if (window.jQuery !== null) {
//   return window.jQuery;
// } else {
//   // 初始化...
// }

// 模拟登录框
class LoginForm {
  constructor() {
    this.state = "hide";
  }
  show() {
    if (this.state === "show") {
      alert("已经显示");
      return;
    }
    this.state = "show";
    console.log("登录框已经显示");
  }
  hide() {
    if (this.state === "hide") {
      alert("已经隐藏");
      return;
    }
    this.state = "hide";
    console.log("登录框已经隐藏");
  }
}
LoginForm.getInstance = (function () {
  let instance;
  return function () {
    if (!instance) {
      instance = new LoginForm();
    }
    return instance;
  };
})();

// 登录框单例测试
let loginPage1 = LoginForm.getInstance();
loginPage1.show();
let loginPage2 = LoginForm.getInstance();
loginPage2.hide();
console.log(loginPage1 === loginPage2);
