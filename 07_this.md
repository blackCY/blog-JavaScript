# this

## 前言

前面我们已经了解到执行上下文，知道每个执行上下文都有一个 this

这里在牢记三句话：

- this 永远指向最后调用它的那个对象
- 普通函数中，this 的指向，是 this 执行时的上下文，也可以说普通函数的 this 指向全局对象
- 箭头函数中，this 的指向，是 this 定义时的上下文

## 疑问

作用域链和 this 有关系吗?

## this 取值的四种情况

### 1. 构造函数

所谓构造函数就是用来 new 对象的函数。其实严格来说，所有的函数都可以 new 一个对象，但是有些函数的定义是为了 new 一个对象，而有些则不是。另外注意，构造函数的函数名第一个字母大写(约定俗成)，例如：`Object`、`Function`、`Array`

![img](https://images0.cnblogs.com/blog/138012/201409/231451530452221.png)

以上代码中，如果函数作为构造函数来使用，那么其中的 this 就代表它即将 new 出来的对象

注意，以上仅限 new Foo()的情况，即 Foo 函数作为构造函数的情况。如果直接调用 Foo 函数，而不是 new Foo()，情况就大不一样了。

![img](https://images0.cnblogs.com/blog/138012/201409/231452183579852.png)

这种情况下 this 是 window，我们后文中会说到。

### 2. 函数作为对象的一个属性

如果函数作为对象的一个属性，并且作为对象的一个属性被调用时，函数中的 this 指向该对象

![img](https://images0.cnblogs.com/blog/138012/201409/231452462177631.png)

以上代码中，fn 不仅作为一个对象的一个属性，而且的确是作为对象的一个属性被调用。结果 this 就是 obj 对象。

注意，如果 fn 不作为 obj 的一个属性被调用，会是什么结果呢?

![img](https://images0.cnblogs.com/blog/138012/201409/231453370605897.png)

如上代码，如果 fn 函数被赋值到了另一个变量中，并没有作为 obj 的一个属性被调用，那么 this 的值就是 window，this.x 为 undefined。

其实出现这种情况的原因也很简单，首先，fn 函数作为 obj 对象的一个属性被且被 obj 对象调用时，fn 的执行上下文肯定是 obj，这个在前文讲述执行上下文的时候有说过，那么对于第二种将 `obj.fn` 赋值给 `fn1` 的情况，由于此时 fn 函数没有被调用，那么将 `obj.fn` 赋值给 `fn1` 时， `fn1` 的外部作用域是全局作用域，所以 `fn1` 执行时，其内部 `fn` 的 `this` 指向全局

### 3. 函数用 call 或 apply 调用

当一个函数被 call 和 apply 调用时，this 的值就取传入的对象的值。至于 call 和 apply 如何使用，不会的朋友可以去查查其他资料，这里不做讲解。

![img](https://images0.cnblogs.com/blog/138012/201409/231454121399180.png)

### 4. 全局 & 调用普通函数

**在非严格的全局环境下，this 永远是 window**，这个应该没有非议。

普通函数在调用时，其中的 this 也都是 window。

![img](https://images0.cnblogs.com/blog/138012/201409/231454563265514.png)

不过下面的情况你需要注意一下：

```js
var obj = {
  x: 10,
  fn() {
    function f() {
      console.log(this);
      console.log(this.x); // undefined
    }
    f();
  },
};
obj.fn();
```

函数 f 虽然是在 `obj.fn` 内部定义的，但是它仍然是一个普通的函数，`f` 函数在执行的时候是在全局执行的，`this` 仍然指向 `window`。

#### 自知之明

当然，我们要有自知之明

```js
var obj = {
  name: "obj",
  fn() {
    function f() {
      console.log(this.name); // ''
    }
    f();
  },
};
obj.fn();
```

一般来说，这段代码的输出应该是 undefined

**但是，这里需要注意的是， `window.name` 是当前 `window` 的名称，它是 `window.open` 打开新网页这个方法的第二个参数值，所以这里的输出的是空字符串，或者当前存在的 `window` 名称**

一个例子带小伙伴们看看这个是怎么来的：

```html
<button class="btn">打开新网页</button>

<script>
  (function () {
    const btn = document.querySelector(".btn");
    btn.onclick = function () {
      window.open("index.html", "jsliang 的网页");
    };
  })();
</script>
```

在新打开的网页中的控制台，输入 `window.name`，获取 `jsliang 的网页`。

## this 设计缺陷和应对方案

### 嵌套函数中的 this 不会从外层函数中继承

```js
var myObj = {
  myName: "jsliang",
  showThis: function () {
    console.log(this.myName); // 输出啥？
    function bar() {
      console.log(this.myName); // 输出啥？
    }
    bar();
  },
};
myObj.showThis();
```

答案是：

1. jsliang
2. undefined

#### 解决方法一：通过 `that` 控制 `this` 指向

```js
var myObj = {
  myName: "jsliang",
  showThis: function () {
    console.log(this.myName); // 输出啥？
    let that = this;
    function bar() {
      console.log(that.myName); // 输出啥？
    }
    bar();
  },
};
myObj.showThis();
```

这样都输出 `jsliang` 了。

#### 解决方法二：通过 ES6 的箭头函数解决问题

```js
var myObj = {
  myName: "jsliang",
  showThis: function () {
    console.log(this.myName); // 输出啥？
    const bar = () => {
      console.log(this.myName); // 输出啥？
    };
    bar();
  },
};
myObj.showThis();
```

这是因为 ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 `this` 取决于它的外部函数，即谁调用它 `this` 就继承自谁。

## 题目

### 8.1 this 题目解析 5 步曲

- 第一题

```js
var name = "window name";
function a() {
  var name = "jsliang";
  console.log(this.name); // 输出啥？
  console.log("inner：" + this); // 输出啥？
}
a();
console.log("outer：" + this); // 输出啥？
```

上面代码输出啥？

---

答案：

```js
window name
inner：window name
outer：window name
```

解析：这里的 `a()` 可以看成 `window.a()`，所以是都指向 `window` 里面的。

- 第二题

```js
var name = "window name";
var a = {
  name: "jsliang",
  fn: function () {
    console.log(this.name); // 输出啥？
  },
};
a.fn();
```

上面代码输出啥？

---

答案：jsliang

解析：现在是 `a.fn()`，所以这个指向 `a`，因此输出 `jsliang`

- 第三题

```js
var name = "window name";
var a = {
  // name: 'jsliang',
  fn: function () {
    console.log(this.name); // 输出啥？
  },
};
a.fn();
```

上面代码输出啥？

---

答案：undefined

解析：很明显，`a` 里面并没有 `name` 方法了，所以 `a.fn()` 找不到 `a` 对象里面有 `name`，因此输出 `undefined`

- 第四题

```js
var name = "window name";
var a = {
  name: "jsliang",
  fn: function () {
    console.log(this.name); // 输出啥？
  },
};
var f = a.fn;
f();
```

上面代码输出啥？

---

答案：`window name`

解析：代码 `var f = a.fn` 并没有调用 `a.fn`，而是做了个定义。在 `f()` 的时候才调用了，此时的 `fn()` 是 `window.fn()`，所以指向了 `window`，因此输出 `window name`

- 第五题

```js
var name = "window name";
function fn() {
  var name = "jsliang";
  function innerFn() {
    console.log(this.name);
  }
  innerFn();
}
fn();
```

答案：`window name`

解析：小伙伴理解理解看看

### 8.2 let/const 的 this

```js
let a = 10;
const b = 20;

function foo() {
  console.log(this.a);
  console.log(this.b);
}
foo();

console.log(window.a);
```

上面代码输出啥？

---

答案：`undefined`、`undefined`、`undefined`

解析：如果把 `var` 改成了 `let` 或者 `const`，变量是不会被绑定到 `window` 上的，所以此时会打印出三个 `undefined`。

### 8.3 箭头函数的 this

```js
var name = "window name";

var a = {
  name: "jsliang",
  func1: function () {
    console.log(this.name);
  },
  func2: function () {
    setTimeout(() => {
      this.func1();
    }, 100);
  },
};

a.func1(); // 输出啥？
a.func2(); // 输出啥？
```

上面代码输出啥？

---

答案：

```
jsliang
jsliang
```

解析：箭头函数的 `this` 指向函数定义时的 `this`，而非执行时。**箭头函数中没有 `this` 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 `this` 绑定的是最近一层非箭头函数的 `this`，否则，`this` 为 `undefined`。**

### 8.4 求输出结果

function foo () {
console.log(this.a)
};
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo }

obj.foo(); // 输出啥？
foo2(); // 输出啥？
obj2.foo2(); // 输出啥？
上面代码输出啥？

---

答：

```
1
2
3
```

解析：

- `obj.foo()`：`obj` 调用 `foo()`，所以指向 `obj`，输出 `1`
- `foo2()`：实际上是 `window.foo2()`，指向 `window`，输出 `2`
- `obj2.foo2()`：`obj2` 调用 `foo2()`，指向 `obj2`，输出 `3`

### 8.5 隐式绑定丢失问题

#### 8.5.1 求输出结果

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  console.log(this);
  fn();
}
var obj = { a: 1, foo };
var a = 2;
doFoo(obj.foo); // 输出啥？
```

上面代码输出啥？

---

答案：`Window {...}`、`2`

解析：**隐式绑定丢失问题**。`deFoo` 传参 `obj.foo` 的时候，此刻 `foo` 还没被执行，所以在 `doFoo` 中 `fn()` 就相当于 `window.fn()`，所以指向到 `window` 啦！

**注意此时调用的时候，查找的 `fn` 是 `window` 上的 `fn`，而不是 `doFoo` 里的，`doFoo` 并没有设置 `fn` 这个方法。**

#### 8.5.2 求输出结果

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  console.log(this);
  fn();
}
var obj = { a: 1, foo };
var a = 2;
var obj2 = { a: 3, doFoo };

obj2.doFoo(obj.foo); // 输出啥？
```

上面代码输出啥？

---

答案：`{ a: 3, doFoo: f }`、`2`

解析：

1. 此刻的 `fn()` 调用，查找到的位置还是 `window.foo()`，所以调用的时候会指向 `window`。
2. 这里的 `fn()` 是通过传参进来的，而不是 `doFoo` 里面存在的，所以执行的时候 `this` 找到的是 `foo` 定义的位置，实际上还是 `window.fn()`
3. 如何改正这个问题？

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  console.log(this);
  fn.call(this);
}
var obj = { a: 1, foo };
var a = 2;
var obj2 = { a: 3, doFoo };

obj2.doFoo(obj.foo);
```

### 8.6 显示绑定问题

#### 8.6.1 求输出结果

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 1 };
var a = 2;

foo(); // 输出啥？
foo.call(obj); // 输出啥？
foo().call(obj); // 输出啥？
```

上面代码输出啥？

---

答案：

```
2
1
2
Uncaught TypeError: Cannot read property 'call' of undefined
```

解析：

- `foo()`：指向 `window`
- `foo.call(obj)`：将 `foo` 的 `this` 指向了 `obj`
- `foo().call(obj)`：先执行 `foo()`，输出 `2`，然后它是无返回的，相当于 `undefined.call(obj)`，直接报错

#### 8.6.2 求输出结果

```js
function foo() {
  console.log(this.a);
  return function () {
    console.log(this.a);
  };
}
var obj = { a: 1 };
var a = 2;

foo(); // 输出啥？
foo.call(obj); // 输出啥？
foo().call(obj); // 输出啥？
```

上面代码输出啥？

---

答案：

```
2
1
2
1
```

解析：前面 3 个不用说，和上面一题一样。

最后一个 `return function { this.a }`，所以变成这个方法来 `call(obj)`，因此输出 `obj` 中的 `a`，也就是 `1`。

### 8.7 求输出结果

```js
function Foo() {
  "use strict";
  console.log(this.location);
}

Foo();
```

请选择：

- A：当前窗口的 `Location` 对象
- B：`undefined`
- C：`null`
- D：`TypeError`

---

答案：D

解析：如果没有 `use strict`，那么选 A；如果是严格模式，那就是 D，严格模式下禁止 `this` 关键字指向全局对象。

### 8.8 阐述题

```js
let userInfo = {
  name: "jsliang",
  age: 25,
  sex: "male",
  updateInfo: function () {
    // 模拟 XMLHttpRequest 请求延时
    setTimeout(function () {
      this.name = "zhazhaliang";
      this.age = 30;
      this.sex = "female";
    }, 1000);
  },
};

userInfo.updateInfo();
```

解决这里的 `this` 指向问题，求得最终结果：

```js
{
  name: "zhazhaliang",
  age: 30,
  sex: "female",
  updateInfo: function(),
}
```

---

答案：`setTimeout(() => {})` 即可。

## 参考

- [ECMAScript 规范解读 this](https://www.cnblogs.com/guaidianqiao/p/7762108.html)
- [深入理解 javascript 原型和闭包（10）——this](https://www.cnblogs.com/wangfupeng1988/p/3988422.html)
- [深入理解 javascript 原型和闭包（17）——补 this](https://www.cnblogs.com/wangfupeng1988/p/3996037.html)
- [this](https://github.com/LiangJunrong/document-library/blob/master/%E7%B3%BB%E5%88%97-%E9%9D%A2%E8%AF%95%E8%B5%84%E6%96%99/JavaScript/this.md)
