# Iterator 与 Generator

## Iterator - 迭代器

### 主要概念

Iterator(迭代器)是一种接口，为各种不同的数据结构提供一种统一的访问机制，任何数据结构只要部署 Iterator 接口，就可以完成对数据结构的遍历操作，依次遍历该数据结构的所有成员

### Iterator 的作用

Iterator 的作用有三个

- 为各种数据结构提供一种统一的、简便的访问接口
- 使得数据结构的成员能够按照某种次序依次排列
- ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费

### Iterator 的遍历过程

1. 创建一个指针对象，指向当前数据结构的起始位置，也就是说，遍历对象本质上，就是一个指针对象
2. 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法，直到它指向数据结构的起始位置

**每一次调用 next 方法，都会返回数据结构当前的成员信息，具体来说，就是一个包含 value 和 done 两个属性的对象，其中，value 是当前成员的值，done 是一个布尔值，表示遍历是否结束**

### 标准的迭代器生成函数

```js
function* Iterator(array) {
  let index = 0,
    len = array.length;
  return {
    next() {
      return index < len
        ? {
            done: false,
            value: array[index++],
          }
        : {
            done: true,
            value: undefined,
          };
    },
  };
}
```

由于 Iterator 只是把接口规格加到数组结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说只是用遍历器对象模拟出数据结构。下面是一个无限运行的遍历器对象的例子：

```js
function idMaker() {
  let index = 0;
  return {
    next() {
      return { value: index++, done: false };
    },
  };
}

let itMaker = idMaker();
itMaker.next(); // 0
itMaker.next(); // 1
itMaker.next(); // 2
```

### 数据结构默认的 Iterator 接口

**Iterator 的目的，就是为所有的数据结构，提供一种统一的、便利的访问机制，供 ES6 的 for...of 消费，当使用了 for...of 循环来遍历某种数据结构，该循环会自动去找 Iterator 接口**

**ES6 规定，默认的 Iterator 接口部署在数据结构的 [Symbol.iterator] 属性，也就是说，一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是可遍历的(iterable)**

**Iterator 本身是一个函数，就是当前数据结构默认的遍历器生成函数，执行这个函数，就会返回一个遍历器**

**在 ES6 中，有三类数据结构原生具有 Iterator 接口：数组或类数组对象，Map，Set，另外字符串上也有 [Symbol.iterator] 接口**

**对象默认没有部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map，而 ES 6 原生提供了**

**一个对象如果要有可被 for...of 循环调用的 Iterator 接口，就必须在 [Symbol.iterator] 属性部署遍历器生成方法**

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.value < this.stop) {
      return {
        done: false,
        value: this.value++,
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}

for (value of new RangeIterator(0, 3)) {
  console.log(value);
}
```

利用 for...of 循环，可以写出遍历任意对象(object)的方法。原生的 JavaScript 对象没有遍历接口，无法使用 for...of 循环，通过 Generator 函数为它加上这个接口，就可以用了

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}
let jane = { first: "Jane", last: "Doe" };
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

#### 类数组对象

**对于类数组对象，可以将 [Symbol.iterator] 直接饮用数组的 Iterator 接口**

```js
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
```

##### 栗子

```js
const iterable = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: [][Symbol.iterator],
};

for (const item of iterable) {
  console.log(item);
}
```

**注意：普通对象部署对象的 [Symbol.iterator] 接口，并无作用**

```js
let iterable1 = {
  a: "a",
  b: "b",
  c: "c",
  length: 3,
  [Symbol.iterator]: [][Symbol.iterator],
};
for (let item of iterable1) {
  console.log(item); // undefined, undefined, undefined
}
```

### 调用 Iterator 接口的场合

**有一些场合会默认调用 Iterator 接口(即 [Symbol.iterator])**

#### 解构赋值

对数组和 Set 解构赋值时，会默认调用 [Symbol.iterator]

```js
let set = new Set().add("a").add("b").add("c");
let [x, y] = set;
// x='a'; y='b'
let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

#### 扩展运算符

```js
var str = "hello";
[...str]; //  ['h','e','l','l','o']
// 例二
let arr = ["b", "c"];
["a", ...arr, "d"];
// ['a', 'b', 'c', 'd']
```

**上面代码的扩展运算符内部就调用 Iterator 接口。实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组**

#### yield\*

yield\* 后面跟着一个可遍历的结构，它会调用该结构的遍历器接口，下文会讲到

```js
let generator = function* () {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
};
var iterator2 = generator();
iterator2.next(); // { value: 1, done: false }
iterator2.next(); // { value: 2, done: false }
iterator2.next(); // { value: 3, done: false }
iterator2.next(); // { value: 4, done: false }
iterator2.next(); // { value: 5, done: false }
iterator2.next(); // { value: undefined, done: true }
```

#### 字符串的 Iterator 接口

可以覆盖原生的遍历器接口，达到修改遍历器行为的目的

```js
var str = new String("hi");
[...str]; // ["h", "i"]
str[Symbol.iterator] = function () {
  return {
    next: function () {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true,
  };
};
[...str]; // ["bye"]
str; // "hi"
```

### 遍历器对象的 return() 和 throw()

**遍历器对象除了具有 next 方法，还可以具有 return 方法和 throw 方法。如果你自己写遍历器对象生成函数，那么 next 方法是必须部署的，return 方法和 throw 方法是否部署是可选的。**

**return 方法的使用场合是，如果 for...of 循环提前退出(通常是因为出错，或者有 break 语句或 continue 语句)，就会调用 return 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 return 方法**

```js
function readLinesSync(file) {
  return {
    next() {
      if (file.isAtEndOfFile()) {
        file.close();
        return { done: true };
      }
    },
    return() {
      file.close();
      return { done: true };
    },
  };
}
```

上面代码中，函数 readLinesSync 接受一个文件对象作为参数，返回一个遍历器对象，其中除了 next 方法，还部署了 return 方法。下面，我们让文件的遍历提前返回，这样就会触发执行 return 方法。

```js
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}
```

**注意，return 方法必须返回一个对象，这是 Generator 规格决定的。**
throw 方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。请参阅下文的 Generator

## Generator 迭代器生成器

### 主要概念

**Generator 是 ES6 提出的一种异步编程解决方案，语法与传统函数完全不同**

**Generator 函数有多种理解角度。从语法上，首先可以将它理解成：Generator 函数是一种状态机，封装了多个内部状态**

**执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态**

**形式上，Generator 是一个普通函数，但是有两个特征，一个是 function 关键字与函数名之间有一个 \*，二是函数体内部使用 yield 语句，定义不同的内部状态(yield 英文意思是"产出")**

```js
function* helloWorldGenerator() {
  yield "hello";
  yield "world";
  return "ending";
}
var hw = helloWorldGenerator();
```

上面代码定义了一个 Generator 函数 helloWorldGenerator，它内部有两个 yield 语句“hello”和“world”，即该函数有三个状态：hello，world 和 return 语句(结束执行)

然后，Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。**不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象(Iterator Object)。**

**下一步，必须调用遍历器对象的 next 方法，使得指针指向下一个状态。也就是说，每一次调用 next，内部指针就会从函数头部或者上一次停下来的地方继续执行，知道遇到下一个 yield 语句或者 resutn 语句，遇到 return 语句直接结束执行。也就是说，Generator 是分段执行的，yield 语句是暂停执行的标记，而 next 方法可以恢复执行**

```js
hw.next();
// { value: 'hello', done: false }
hw.next();
// { value: 'world', done: false }
hw.next();
// { value: 'ending', done: true }
hw.next();
// { value: undefined, done: true }
```

### yield 语句

**注意，yield 不能在普通函数使用**

由于 Generator 函数返回的遍历器对象，只有调用 next 才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数，yield 语句就是暂停标志

遍历器对象的 next 方法运行逻辑如下：

1. 遇到 yield 语句，就暂停执行后面的操作，并将紧跟在 yield 后面的表达式的结果，作为返回的对象的 value
2. 下一次调用 next 时，再继续往下执行，直到遇到下一个 yield 语句
3. 如果没有再遇到新的 yield 语句，执行到函数结束，直到 return，并将 rerutn 语句后面的表达式的结果，作为对象的 value
4. 如果没有 return 语句，则将函数默认返回的 undefined 作为 value

**需要注意的是，yield 后面的表达式的值，只有当调用 next，内部指针指向该语句时才会执行，因为等于为 JS 提供了手动执行的惰性求值(Lazy Evaluation)**

> yield 语句与 return 语句既有相似之处，也有区别。相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到 yield，函数暂停执行，下一次再从该位置继续向后执行，而 return 语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）return 语句，但是可以执行多次(或者说多个)yield 语句。正常函数只能返回一个值，因为只能执行一次 return；Generator 函数可以返回一系列的值，因为可以有任意多个 yield。从另一个角度看，也可以说 Generator 生成了一系列的值，这也就是它的名称的来历(在英语中，generator 这个词是"生成器"的意思

**Generator 可以不使用 yield，这时他就是单纯的暂缓执行函数**

另外，yield 语句如果用在表达式里面，必须将其放在圆括号中

```js
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError
console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK
// yield 语句用作函数参数或赋值表达式的右边，可以不加括号
foo(yield 'a', yield 'b'); // OK
let input = yield; // OK
```

### yield\* 语句

在实际场景中, 异步任务可能并没有像 demo 中那么简单的关系, 可能会有 A-B-C 的异步任务, 而 B 中又包含 B-1,
B-2, B-3 这样的异步任务, 按照逻辑是需要完成 A 后再逐个完成 B-i 再执行 C.
问题在于不可能在一个函数内完成全部逻辑, 我们会需要在多个函数中编写逻辑, 这个时候 yield 后面可能需要加上
一个包裹型的函数:

```js
function *doTask() {
    var a = yield A();
    var b = yield run(B);
    var c = yeld C();
}

function *B() {
    var b1 = yield B1();
    var b2 = yield B2();
    var b3 = yield B3();
}

run(doTask);
```

我们可以使用上面编写的 run 函数来做管理, 但是存在更好的方式就是使用 yield _, 注意这里和常规的 yield 多了
一个 _ 符号.其实 yield \* 的"学名"叫做 yield 委托, 看下面的例子:

```js
function* foo() {
  console.log("start *foo");
  yield 3;
  yield 4;
  console.log("end *foo");
}

function* bar() {
  yield 1;
  yield 2;
  yield* foo();
  yield 5;
}

var g = bar();
console.log(g.next().value); // 1
console.log(g.next().value); // 2
// start *foo
console.log(g.next().value); // 3
console.log(g.next().value); // 4
// end *foo
console.log(g.next().value); // 5
```

我们可以看到, 使用 yield _ 可以让函数先进入另外一个生成器函数内部执行完内部的步骤之后, 再返回上一层继续
执行上一层剩下的步骤.
简单地来说, yield _ 提供了调用生成器函数的方法, 由于生成器方法的特殊, 所以 generator 提供了一个特殊的方式
调用生成器函数.好处在于你可以简单地执行嵌套的 yield, 而无需自己编写像 run 函数这样的工具.
yield \* 除了后面加我们自己编写的生成器函数, 还可以加非一般的生成器函数, 比如数组的迭代器:

```js
yield * [1, 2, 3];

it.next().value; // 1
it.next().value; // 2
it.next().value; // 3
// 但是注意这里这样的 yield \* 语句是始终没有返回值的, 或者说是 undefined.
```

**yield\*后面的 Generator 函数（没有 return 语句时），等同于在 Generator 函数内部，部署一个 for...of 循环**

```js
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}
// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

上面代码说明，yield*后面的 Generator 函数（没有 return 语句时），不过是 for...of 的一种简写形式，完全可以用后者替代前者。反之，则需要用 var value = yield* iterator 的形式获取 return 语句的值。

**如果被代理的 Generator 函数有 return 语句，那么就可以向代理它的 Generator 函数返回数据。**

```js
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}
function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}
var it = bar();
it.next();
// {value: 1, done: false}
it.next();
// {value: 2, done: false}
it.next();
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next();
// {value: undefined, done: true}
```

再看一个例子。

```js
function* genFuncWithReturn() {
  yield "a";
  yield "b";
  return "The result";
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}
[...logReturned(genFuncWithReturn())];
// The result
// [ 'a', 'b' ]
```

上面代码中，存在两次遍历。第一次是扩展运算符遍历函数 logReturned 返回的遍历器对象，第二次是 yield\*语句遍历函数 genFuncWithReturn 返回的遍历器对象。这两次遍历的效果是叠加的，最终表现为扩展运算符遍历函数 genFuncWithReturn 返回的遍历器对象。所以，最后的数据表达式得到的值等于[ 'a', 'b' ]。但是，函数 genFuncWithReturn 的 return 语句的返回值 The result，会返回给函数 logReturned 内部的 result 变量，因此会有终端输出

**yield\*命令可以很方便地取出嵌套数组的所有成员。**

```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}
const tree = ["a", ["b", "c"], ["d", "e"]];
for (let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
```

### 与 Iterator 的关系

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的 [Symbol.iterator] 属性，从而使得该对象具有 Iterator 接口

```js
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable]; // [1, 2, 3]
```

上面代码中，Generator 函数赋值给 Symbol.iterator 属性，从而使得 myIterable 对象具有了 Iterator 接口，可以被...运算符遍历了。

**Generator 函数执行后，返回一个遍历器对象。该对象本身也具有 Symbol.iterator 属性，执行后返回自身。**

```js
function* gen() {
  // something code
}
var g = gen();
g[Symbol.iterator]() === g; // true
```

### 生成器的类型判断

#### 如何判断生成器对象

```js
function isGenerator(obj) {
  return (
    obj && typeof obj.next === "function" && typeof obj.throw === "function"
  );
}
```

与 Promise 对象类似，这里运用鸭子模型进行判断，如果对象中有 next 和 throw 方法，那么就认为该对象是一个生成器对象

#### 如何判断生成器函数

```js
function isGeneratorFunction(obj) {
  const constructor = obj.constructor;
  if (!constructor) return false;

  if (
    constructor.name === "GeneratorFunction" ||
    constructor.displayName === "GeneratorFunction"
  )
    return true;

  return isGenerator(constructor.prototype);
}
```

**利用函数的 constructor 构造器的名字来判断，为了兼容性使用 name 与 displayName 两个属性来进行判断. 这里递归调用 isGenerator 判断 constructor 的原型是因为有自定义迭代器的存在。**

### yield 与 next 传值问题

**这个问题的答案需要清楚，因为单独的 generator 是没有办法做异步任务流程化的**

```js
function* gen() {
  var re = yield 1;
  return re + 2;
}

gen = gen();
var g = gen.next();
console.log("1: ", g.value);
g = gen.next();
console.log("2: ", g.value);
g = gen.next();
console.log("3: ", g.value);
```

猜一下以上代码的 value 值分别为多少? 答案是 1, NaN, undefined. 为什么会出现这样的结果呢? gen 生成器函数本意是想做一个 1 + 2 简单的加法运算, 但是最后得到的结果是 NaN. 其实 generator 函数内部的 yield 是需要我们一个一个
使用 next 函数去调用一步一步得到的. 而 next 函数调用之后, 返回一个对象, 对象中有两个属性值:

```js
{
  value: val,  // 任意值
  done: true // 或者 false
}
```

而其中的 value 的值就是 yield 语句后面的 "值", 注意这里的值不一定是 javascript 中的基本数据类型，yield 后面可以是函数，表达式(运算结果)，对象等等的值。可以查看下面的例子:

```js
function* gen() {
  yield 1;
  yield { who: "me" };
  yield function () {
    console.log("hello");
  };
  yield 1 + 2;
}

gen = gen();
var g1 = gen.next();
console.log(g1.value); // 1
var g2 = gen.next();
console.log(g2.value); // { who: 'me' }
var g3 = gen.next();
console.log(g3.value); // function(){ console.log('hello'); }
var g4 = gen.next();
console.log(g4.value); // 3
```

那么问题出现了，既然 yield 后面的值可以通过 next 方法得到，那 yield 语句本身有没有返回值或者 yield 语句的返回值如何得到呢?

这个问题是 Generator 异步流程的第一个问题，上面说到 yield 后面是可以接函数或者或者表达式或者基本值等，但是，如果想 `var tmp = yield 1` 这样的语句，tmp 变量没有取到 1 的话，流程控制就无从谈起，甚至 yield 生成器与 Generator 本身的作用也不太大，所以这里就需要一个**数据双向传值通道**

**所谓消息双向通道就是我们从 next 函数中拿到 yield 语句后面的值，然后可以通过 next 函数传值把传进去的值变为 yield 语句的返回值。**所以这就解释了为什么第一段代码是 `NaN` 了，因为在处理的时候，我们没有给 next 函数传值，导致 yield 返回 undefined，再加 2 就变成了 `NaN`

这里还要解释一下第一段函数最后没有 yield 语句，但是 value 还有有值， 而且得到最后的结果 NaN，因为 value 的值是如果存在 yield 那么, 它的值就是 yield 后面接着的值, 如果没有 yield 那么就取 return 后面的值, 若都没有则返回 undefined(其实是相当于有个默认的 return undefined).
所以为了实现第一段代码的功能，我们需要：

```js
function* gen() {
  var re = yield 1;
  return re + 2;
}

gen = gen();
var g = gen.next();
console.log("1: ", g.value); // 1
g = gen.next(g.value);
console.log("2: ", g.value); // 3
g = gen.next();
console.log("3: ", g.value); // undefined
```

最后一个是 undefined 是因为 yield 语句数量只有一个，在调用两个 next 函数之后已经结束( done === true )了， 所以 value 为 undefined。

#### 栗子

```js
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i;
    console.log(reset);
    if (reset) {
      i = -1;
    }
  }
}
var g = f();
console.log(g.next()); // { value: 0, done: false }
console.log(g.next()); // { value: 1, done: false }
console.log(g.next(true)); // { value: 0, done: false }
console.log(g.next(true)); // { value: 0, done: false }
```

上面代码先定义了一个可以无限运行的 Generator 函数 f，如果 next 方法没有参数，每次运行到 yield 语句，变量 reset 的值总是 undefined。当 next 方法带一个参数 true 时，当前的变量 reset 就被重置为这个参数(即 true)，因此 i 会等于-1，下一轮循环就会从-1 开始递增
这个功能有很重要的语法意义。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过 next 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}
var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}
var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

上面代码中，第二次运行 next 方法的时候不带参数，导致 y 的值等于 2 \* undefined(即 NaN)，除以 3 以后还是 NaN，因此返回对象的 value 属性也等于 NaN。第三次运行 Next 方法的时候不带参数，所以 z 等于 undefined，返回对象的 value 属性等于 5 + NaN + undefined，即 NaN

如果向 next 方法提供参数，返回结果就完全不一样了。上面代码第一次调用 b 的 next 方法时，返回 x+1 的值 6；第二次调用 next 方法，将上一次 yield 语句的值设为 12，因此 y 等于 24，返回 y / 3 的值 8；第三次调用 next 方法，将上一次 yield 语句的值设为 13，因此 z 等于 13，这时 x 等于 5，y 等于 24，所以 return 语句的值等于 42

**注意，由于 next 方法的参数表示上一个 yield 语句的返回值，所以第一次使用 next 方法时，不能带有参数。V8 引擎直接忽略第一次使用 next 方法时的参数，只有从第二次使用 next 方法开始，参数才是有效的。从语义上讲，第一个 next 方法用来启动遍历器对象，所以不用带有参数**

下面是一个利用 Generator 函数与 for...of 循环实现斐波那契数列的例子

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}
for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

### next 函数和 yield 个数不对等?

先看一个例子:

```js
function* gen() {
  var ret = yield 1 + 2;
  var num = yield 43;
  ret = yield ret + num;
  console.log(ret);
}
```

我们怎么实现 1 + 2 + 4 这个功能呢? 来看以下代码:

```js
gen = gen(); // 转换为 generator 对象
var g = gen.next(); // 第一步启动
var firstStep = g.value; // 取得第一个 yield 后面的表达式，即 1 + 2 为 3
g = gen.next(firstStep); // 从 next 函数传入第一步的值，则 ret 值为 3
var secondStep = g.value; // 取得第二步 yield 的值，即 4
g = gen.next(secondStep); // 从 next 函数传入第二步的值， 即 num 为 4
// 由于下面没有了 yield 语句，所以直接执行完函数，ret 为 { value: 7, done: false }
g = gen.next(g.value);
console.log(g.done); // true
```

可以看到， **其实第一个 next 函数是为了启动 generator，因为在还没有启动的时候，前面还没有 yield 语句，所以即使你往第一个 next 函数中传值也没有用，它不会替代任何一个 yield 语句的值，所以我们会倾向于不向第一个 next 函数中传值(undefined)。**

然后接下来你可以看到，**第一个 next 函数之后每个 next 函数对应着一个 yield 语句, 其实 next 函数通俗来讲就是运行上一个 yield 语句与当前 yield 语句之间的代码, 而 next 函数传进去的值会变成上一个 yield 语句的返回值.由此可知, next 函数调用次数与 yield 语句个数总是不对等, next 函数调用次数总是比 yield 语句多 1, 因为需要第一个进行启动.**

### 异步流程控制

**单独的生成器作用不大，特别是在异步流程控制中，即使 yield 语句后面可以添加异步任务，但是我们仍然需要一个一个的调用 next，如果需要流程化控制，就需要自动执行 next 函数，而对于 yield + promise 结合的异步流程控制，核心思想就是通过 next 取得 yield 后面的值，然后将这个值转化为 Promise，通过 Promise 来控制异步任务，异步任务完成后递归重新调用 next 函数重复上面的操作，这里推荐阅读 co 类库的源码, 它的思想与上面一致, 是 yield + promise 的精妙实现**

```js
function run(gen) {
  var args = [].slice.call(arguments, 1);
  if (typeof gen === "function") gen = gen.apply(this, args);

  return new Promise(function (resolve, reject) {
    onFulfilled();

    function onFulfilled(res) {
      var it = gen.next(res);
      next(it);
    }

    function next(res) {
      if (res.done) return resolve(res.value);
      return Promise.resolve(res.value).then(onFulfilled);
    }
  });
}
```

**注意此时 yield 后面的东西需要是一个 Promise 对象**

### 作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，可以简写成下面的形式：

```js
let obj = {
  *myGeneratorMethod() {
    // ···
  },
};
// 上面代码中，myGeneratorMethod属性前面有一个星号，表示这个属性是一个Generator函数。
// 它的完整形式如下，与上面的写法是等价的。
let obj2 = {
  myGeneratorMethod: function* () {
    // ···
  },
};
```

### Generator 的 this

**Generator 总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 prototype 上的方法**

```js
function* g() {}
g.prototype.hello = function () {
  return "hi";
};
let obj = g();
obj instanceof g; // true
obj.hello(); // "hi"
```

上面代码表明，Generator 函数 g 返回的对象 obj，是 g 的实例，而且继承了 g.prototype。但是，**如果把 g 当作普通的构造函数，并不会生效，因为 g 返回的总是遍历器对象，而不是 this 对象**

```js
function* g() {
  this.a = 11;
}
let obj = new g();
obj.a; // undefined
```

上面代码中，Generator 函数也不能跟 new 命令一起用，会报错

```js
function* F() {
  yield (this.x = 2);
  yield (this.y = 3);
}
new F(); // TypeError: F is not a constructor
```

那么，有没有办法让 Generator 函数返回一个正常的实例对象，既可以用 next，又可以获得正常的 this 呢?
下面是一个变通方法。**首先，生成一个空对象，使用 call 方法绑定 Generator 函数内部的 this。这样，构造函数调用以后，这个空对象就是 Generator 函数的实例了**

```js
let obj = {};

function* F() {
  this.a = 1;
  yield (this.b = 2);
  yield (this.c = 3);
}
const f = F.call(obj);
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}
obj.a; // 1
obj.b; // 2
obj.c; // 3
```

上面代码中，首先是 F 内部的对象绑定 obj 对象，然后调用它，返回一个 Iterator 对象。这个对象执行三次 next 方法(因为内部有两个 yield 语句)，完成 F 内部所有代码的运行。这时，所有内部属性都绑定在 obj 对象上了，因此 obj 对象也就成了 F 的实例

上面代码中，执行的是遍历器对象 f，但是生成的对象实例是 obj，有没有办法将这两个对象统一呢?

一个办法是将 obj 换成 F.prototype

```js
function* F() {
  this.a = 1;
  yield (this.b = 2);
  yield (this.c = 3);
}
let f = F.call(F.prototype);
f.next(); // Object {value: 2, done: false}
f.next(); // Object {value: 3, done: false}
f.next(); // Object {value: undefined, done: true}
f.a; // 1
f.b; // 2
f.c; // 3
```

再将 F 改造成构造函数，就可以对它执行 new 命令了

```js
function* gen() {
  this.a = 1;
  yield (this.b = 2);
  yield (this.c = 3);
}
function F() {
  return gen.call(gen.prototype);
}
var f = new F();
f.next(); // Object {value: 2, done: false}
f.next(); // Object {value: 3, done: false}
f.next(); // Object {value: undefined, done: true}
f.a; // 1
f.b; // 2
f.c; // 3
```

### Generator 与状态机

**Generator 是实现状态机的最佳架构**

比如，下面的 clock 就是一个状态机

```js
var ticking = true;
function clock() {
  if (ticking) console.log("Tick");
  else console.log("Tock");
  ticking = !ticking;
}
```

上面的 clock 函数一共有两种状态(Tick 和 Tock)，每运行一次，都改变一次状态。这个函数如果用 generator 实现，会是下面这样：

```js
var ticking = true;
function* f() {
  while (true) {
    yield;
    console.log("Tick");

    yield;
    console.log("Tock");
  }
}
```

### Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log("内部捕获", e);
  }
};

var i = g();
i.next();

try {
  i.throw("a");
  i.throw("b");
} catch (e) {
  console.log("外部捕获", e);
}
// 内部捕获 a
// 外部捕获 b
```

上面代码中，遍历器对象 i 连续抛出两个错误。第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数内部的 catch 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 catch 语句捕获。
throw 方法可以接受一个参数，该参数会被 catch 语句接收，建议抛出 Error 对象的实例

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error("出错了！"));
// Error: 出错了！(…)
```

**注意，不要混淆遍历器对象的 throw 方法和全局的 throw 命令。上面代码的错误，是用遍历器对象的 throw 方法抛出的，而不是用 throw 命令抛出的。后者只能被函数体外的 catch 语句捕获**

```js
var g = function* () {
  while (true) {
    try {
      yield;
    } catch (e) {
      if (e != "a") throw e;
      console.log("内部捕获", e);
    }
  }
};
var i = g();
i.next();
try {
  throw new Error("a");
  throw new Error("b");
} catch (e) {
  console.log("外部捕获", e);
}
// 外部捕获 [Error: a]
```

上面代码之所以只捕获了 a，是因为函数体外的 catch 语句块，捕获了抛出的 a 错误以后，就不会再继续 try 代码块里面剩余的语句了
如果 Generator 函数内部没有部署 try...catch 代码块，那么 throw 方法抛出的错误，将被外部 try...catch 代码块捕获

```js
var g = function* () {
  while (true) {
    yield;
    console.log("内部捕获", e);
  }
};
var i = g();
i.next();
try {
  i.throw("a");
  i.throw("b");
} catch (e) {
  console.log("外部捕获", e);
}
// 外部捕获 a
```

如果 Generator 函数内部和外部，都没有部署 try...catch 代码块，那么程序将报错，直接中断执行。

```js
var gen = function* gen() {
  yield console.log("hello");
  yield console.log("world");
};
var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```

上面代码中，g.throw 抛出错误以后，没有任何 try...catch 代码块可以捕获这个错误，导致程序报错，中断执行。

**throw 方法被捕获以后，会附带执行下一条 yield 语句。也就是说，会附带执行一次 next 方法。**

```js
var gen = function* gen() {
  try {
    yield console.log("a");
  } catch (e) {
    // ...
  }
  yield console.log("b");
  yield console.log("c");
};
var g = gen();
g.next(); // a
g.throw(); // b
g.next(); // c
```

**上面代码中，g.throw 方法被捕获以后，自动执行了一次 next 方法，所以会打印 b。另外，也可以看到，只要 Generator 函数内部部署了 try...catch 代码块，那么遍历器的 throw 方法抛出的错误，不影响下一次遍历。**

另外，throw 命令与 g.throw 方法是无关的，两者互不影响。

```js
var gen = function* gen() {
  yield console.log("hello");
  yield console.log("world");
};
var g = gen();
g.next();
try {
  throw new Error();
} catch (e) {
  g.next();
}
// hello
// world
```

### Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next(); // { value: 1, done: false }
g.return("foo"); // { value: "foo", done: true }
g.next(); // { value: undefined, done: true }
```

上面代码中，遍历器对象 g 调用 return 方法后，返回值的 value 属性就是 return 方法的参数 foo。并且，Generator 函数的遍历就终止了，返回值的 done 属性为 true，以后再调用 next 方法，done 属性总是返回 true。

如果 return 方法调用时，不提供参数，则返回值的 value 属性为 undefined。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next(); // { value: 1, done: false }
g.return(); // { value: undefined, done: true }

// 如果Generator函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行。
function* numbers() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next(); // { done: false, value: 1 }
g.next(); // { done: false, value: 2 }
g.return(7); // { done: false, value: 4 }
g.next(); // { done: false, value: 5 }
g.next(); // { done: true, value: 7 }
// 上面代码中，调用return方法后，就开始执行finally代码块，然后等到finally代码块执行完，再执行return方法。
```

### 应用

Generator 可以暂停函数执行，返回任意表达式的值。这种特点使得 Generator 有多种应用场景

#### 1. 异步操作的同步表达式

Generator 函数的暂停执行的效果，意味着可以把异步操作写在 yield 语句里面，等到调用 next 方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在 yield 语句下面，反正要等到调用 next 方法时再执行。所以，Generator 函数的一个重要实际意义就是用来处理异步操作，改写回调函数

```js
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next();
// 卸载UI
loader.next();
```

上面代码表示，第一次调用 loadUI 函数时，该函数不会执行，仅返回一个遍历器。下一次对该遍历器调用 next 方法，则会显示 Loading 界面，并且异步加载数据。等到数据加载完成，再一次使用 next 方法，则会隐藏 Loading 界面。可以看到，这种写法的好处是所有 Loading 界面的逻辑，都被封装在一个函数，按部就班非常清晰

#### 2. 控制流管理

```js
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(
    function (value4) {
      // Do something with value4
    },
    function (error) {
      // Handle any error from step1 through step4
    }
  )
  .done();
```

上面代码已经把回调函数，改成了直线执行的形式，但是加入了大量 Promise 的语法。Generator 函数可以进一步改善代码运行流程

```js
function* longRunningTask(value1) {
  try {
    const value 2 = yield step(value1);
    const value 3 = yield step(value2);
    const value 4 = yield step(value3);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

然后，使用一个函数，按次序自动执行所有步骤

```js
function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果 Generator 函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value;
    scheduler(task);
  }
}
scheduler(longRunningTask(initialValue));
```

下面，利用 for...of 循环会自动依次执行 yield 命令的特性，提供一种更一般的控制流管理的方法。

```js
let steps = [step1Func, step2Func, step3Func];
function* iterateSteps(steps) {
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    yield step();
  }
}
```

上面代码中，数组 steps 封装了一个任务的多个步骤，Generator 函数 iterateSteps 则是依次为这些步骤加上 yield 命令。
将任务分解成步骤之后，还可以将项目分解成多个依次执行的任务。

```js
let jobs = [job1, job2, job3];
function* iterateJobs(jobs) {
  for (const i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    yield* iterateSteps(job.steps);
  }
}
```

上面代码中，数组 jobs 封装了一个项目的多个任务，Generator 函数 iterateJobs 则是依次为这些任务加上`yield*`命令。
最后，就可以用 for...of 循环一次性依次执行所有任务的所有步骤。

```js
for (var step of iterateJobs(jobs)) {
  console.log(step.id);
}
```

**再次提醒，上面的做法只能用于所有步骤都是同步操作的情况，不能有异步操作的步骤**

#### 3. 部署 Iterator 接口

**利用 Generator 函数，可以在任意对象上部署 Iterator 接口。**

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, keys[i]];
  }
}

let myObj = { foo: 3, bar: 7 };
for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}
// foo 3
// bar 7
```

#### 4. 作为数据结构

Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```js
function* doStuff() {
  yield fs.readFile.bind(null, "hello.txt");
  yield fs.readFile.bind(null, "world.txt");
  yield fs.readFile.bind(null, "and-such.txt");
}
```

上面代码就是依次返回三个函数，但是由于使用了 Generator 函数，导致可以像处理数组那样，处理这三个返回的函数。

```js
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}
```

实际上，如果用 ES5 表达，完全可以用数组模拟 Generator 的这种用法。

```js
function doStuff() {
  return [
    fs.readFile.bind(null, "hello.txt"),
    fs.readFile.bind(null, "world.txt"),
    fs.readFile.bind(null, "and-such.txt"),
  ];
}
```

### ES5 中的生成器

生成器是 ES6 中的语法, 但是 ES6 的语法都是可以通过工具来转化为 ES5 的语法的, 为了更全面地认识生成器, 我们
来自己转化一下, 先假定有一个生成器函数:

```js
function bar() {
  return new Promise(function (resolve, reject) {
    request("www.test.com/api", function (res) {
      resolve(res);
    });
  });
}

function* foo() {
  try {
    console.log("start yield");
    var tmp = yield bar();
    console.log(tmp);
  } catch (err) {
    console.log(err);
    return false;
  }
}

var it = foo();
```

既然是转化为 ES5 的语法, 那么变量 it, 也就是 foo 函数的返回值就应该是:

```js
function foo() {
  ...
  return {
    next: function(){
      ...
    },
    throw: function(){
      ...
    }
  }
}
```

我们知道 yield 可以"暂停"函数运行, 那么换言之, 在内部就应该有一个对应的状态变量来标记函数运行到哪一步, 而
对于控制来说, switch 语句很合适, 根据变量采取对应的操作: 看一下完整代码

```js
function foo() {
  var state;  // 全局状态, 一开始值并不是 1, 因为需要一个 next 函数来启动
  var val; // val 代表的是 yield 语句的返回值
  function progress(v) {
    swtich(state){
      case 1:
        console.log('start yield');
        return bar();
      case 2:
        val = v;
        console.log(v);
        // yield 之后没有 return, 默认提供一个 return;
        return;
      case 3:
        // catch 中的逻辑
        var err = v;
        console.log(err);
        return false;
    }
  }
  // 生成器返回值
  return {
    next: function(v){
      if(!state) {
        state = 1;
        return {
          done: false,
          value: progress()
        }
      } else if(state == 1){
        state = 2;
        return {
          done: true,
          value: progress(v)
        }
      } else {
        return {
          done: true,
          value: undefined
        }
      }
    },
    throw: function(e){
      if(state == 1) {
        state = 3;
        return {
          done: true,
          value: progress(e)
        }
      } else {
        throw e;
      }
    }
  }
}
```

也就是说在转化为 ES5 的语法的时候, 生成器函数中的代码逻辑被分段, 上一个 yield 与下一个 yield 之间的代码被放到 switch 语句的中一个 case 中去, 然后根据一个闭包中的状态变量 state 执行一个个 case.然后 switch 包含在一个类似 progress 可供重复执行的函数中. progress 可以传入值, 值记录在一个闭包变量 val 中, 会使用在需要 yield 语句返回值的地方( var v = yield fn(), v 的值就是闭包变量 val 的值), progress 函数是一个私有方法.然后原生成器函数变为一个函数, 包含以上的逻辑, 返回值是一个对象, 其中包含 next 函数与 throw 函数的实现.
next 函数通过判断 state 的值, 不断将 state 值改变, 比如当 state 为 1 时, 执行 progress case 为 1 的逻辑,
然后修改 state 为 2(下一个状态), 当然 next 函数也可以直接传值, 传入值直接传到 progress 中, 然后执行刚说的 val 的逻辑.
throw 函数就是传入一个错误, 将初始状态(1)转为错误状态, 执行错误时的逻辑( progress ), 其他的状态直接抛出错误 throw.

## 参考

- [理解 ES6 generator](https://github.com/zhangxiang958/Blog/issues/32)
- [Generator 由浅入深(一)](https://juejin.cn/post/6844903641858457608)
