/**
 * 装饰器模式
 *  - 为对象添加新功能
 *  - 不改变其原有的结构和功能
 * 场景(Future, 目前在 stage-2 阶段)
 *  - 类装饰器: ...
 *  - 方法装饰器: ...
 *  - code-decorators: 提供了常用的装饰器
 * 设计原则验证:
 *  - 将现有对象和装饰器进行分离, 两者独立存在, 解耦
 *  - 符合开放封闭原则
 */
class Circle {
  draw() {
    console.log("圆形");
  }
}
class Decorator {
  constructor(circle) {
    this.circle = circle;
  }
  draw() {
    this.circle.draw();
    this.set();
  }
  set(circle) {
    console.log("circle");
  }
}

// test code
let circle = new Circle();
circle.draw();

let dec = new Decorator(circle);
dec.draw();
