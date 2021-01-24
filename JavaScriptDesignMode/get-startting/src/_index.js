/*
 * @Description: 设计原则
 * @param: 何为设计
 * @param: 五大原则
 * @param: Promise 演示 S.O
 * @param: 23种设计模式
 */

/**
 * 何为设计?
 * 按照一种思路或者标准来实现功能
 * 功能相同, 可以有不同设计方案来实现
 * 伴随着需求增加, 设计的作用才能体现出来
 * <<UNIX/LINUX设计哲学>>
 *   准则1: 小即是美
 *   准则2: 让每个程序只做好一件事
 *   准则3: 快速建立原型
 *   准则4: 舍弃高效率而取可移植性
 *   准则5: 采用纯文本来存储数据
 *   准则6: 充分利用软件的杠杆效应(软件复用)
 *   准则7: 使用 shell 脚本来提高杠杆效应和可移植性
 *   准则8: 避免强制性的用户界面(即图形界面)
 *   准则9: 让每个程序都成为过滤器(如管道符, 即前一个命令输出的结果作为后一个命令的输入: ls | grep *.json)
 */

/**
 * 五大原则(Bob大叔)
 * S.O.L.I.D(S.O 体现较多)
 * The Single Responsibility Principle(单一职责原则SRP)
 *  - 一个程序只做好一件事
 *  - 如果功能过于复杂就拆分开, 每个部分保持独立
 * The Open/Closed Principle(开放封闭原则OCP)
 *  - 软件实体应对拓展开放, 对修改关闭, 软件实体应在不修改的前提下拓展
 *  - 增加需求时, 拓展新代码, 而非修改已有代码
 *  - 这是软件设计的终极目标
 * The Liskov Substitution Principle(里氏替换原则LSP)
 *  - 子类能够覆盖父类, 即派生类型必须可以替换它的基类型
 *  - 父类能出现的地方子类就能出现
 *  - JS 中使用较少(弱类型 & 继承使用较少)
 * The Interface Segregation Principle(接口分离原则ISP)
 *  - 保持接口的单一独立, 避免出现 "胖接口"(即一个接口的业务逻辑很多)(当其他用户修改该接口时, 依赖该接口的所有用户都将受到影响)
 *  - 类似于单一职责原则, 这里更关注接口(接口隔离原则ISP和单一职责有点类似, 都是用于聚集功能职责的, 实际上ISP可以被理解才具有单一职责的程序转化到一个具有公共接口的对象)
 *  - JS 中没有接口(TS 例外), 使用较少
 * The Dependency Inversion Principle(依赖反转原则DIP)
 *  - 面向接口编程, 依赖于抽象而不依赖于具体(高层模块不应该依赖于低层模块, 二者都应该依赖于抽象)(抽象不应该依赖于细节, 细节应该依赖于抽象)
 *  - 使用方只关注接口而不关注具体类的实现
 *  - JS 中使用较少(没有接口 & 弱类型)
 */

/**
 * Promise 演示 S.O
 */
function loadImg(src) {
  let promise = new Promise((resolve, reject) => {
    let img = document.createElement("img");
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject("图片加载失败11111");
    };
    img.src = src;
  });
  return promise;
}
let src =
    "https://user-gold-cdn.xitu.io/2017/11/27/15ffbb05174a57f8?w=650&h=910&f=png&s=212544",
  result = loadImg(src);

// S 部分: 每一个 then 只做一件事, 符合 S 原则
// O 部分: 当我们需要其他的业务, 我们可以以添加 then 的方式来实现, 可以避免在某个 then 里的修改影响该 then 的其他逻辑代码, 这就做到了对拓展开放, 对修改关闭
result
  .then((img) => {
    console.log(`width:${img.width}`);
    return img;
  })
  .then((img) => {
    console.log(`height: ${img.height}`);
  })
  .catch((err) => {
    console.log(err);
  });

if (module && module.hot) {
  module.hot.accept();
}

/**
 * 23种设计模式
 *  - 创建型
 *    - 工厂模式(工厂方法模式, 抽象工厂模式, 建造者模式)
 *    - 单例模式
 *    - 原型模式
 *  - 结构型
 *    - 适配器模式
 *    - 装饰器模式
 *    - 代理模式
 *    - 外观模式
 *    - 桥接模式
 *    - 组合模式
 *    - 享元模式
 *  - 行为型
 *    - 策略模式
 *    - 模板方法模式
 *    - 观察者模式
 *    - 迭代器模式
 *    - 职责链模式
 *    - 命令模式
 *    - 备忘录模式
 *    - 状态模式
 *    - 访问者模式
 *    - 中介者模式
 *    - 解释器模式
 */
