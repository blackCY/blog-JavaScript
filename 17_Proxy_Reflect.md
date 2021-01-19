# Proxy_Reflect

## Proxy

**Proxy 功能强大得多，因为它将所有东西转发到目标对象。**

**一个 Proxy 对象包装另一个对象并拦截诸如读取/写入属性和其他操作，可以选择自行处理它们，或者透明地允许该对象处理他们(即 Proxy 没有 handler，对该对象的操作如同在原生操作该对象一样)**

> let proxy = new Proxy(target, handler)

- target：是要包装的对象，可以是任何东西，包括函数
- handler：代理配置：带有"钩子"("traps"，即拦截操作的方法)的对象。比如 get 钩子用于读取 target 属性，set 钩子写入 target 属性等等。

**对 proxy 进行操作，如果在 handler 中存在相应的钩子，则将它运行，并且 Proxy 有机会对其进行处理，否则将直接对 target 进行处理**

首先，让我们创建一个没有任何钩子的代理：

```js
let target = {};
let proxy = new Proxy(target, {}); // 空的handler对象

proxy.test = 5; // 写入 Proxy 对象 (1)
alert(target.test); // 返回 5，test属性出现在了 target 上!

alert(proxy.test); // 还是 5，我们也可以从 proxy 对象读取它 (2)

for (let key in proxy) alert(key); // 返回 test，迭代也正常工作! (3)
```

由于没有钩子，所有对 proxy 的操作都直接转发给 target。

1. 写入操作 proxy.test= 会将值写入 target。
2. 读取操作 proxy.test 会从 target 返回相应的值。
3. 迭代 proxy 会从 target 返回相应的值。

我们可以看到，没有任何钩子，proxy 是一个对 target 的透明包装。

![](https://user-gold-cdn.xitu.io/2020/3/14/170d948bfea2c89e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**Proxy 是一种特殊的"奇异对象"。它没有自己的属性。如果 handler 为空，则透明地将操作转发给 target。**

要激活更多功能，让我们添加钩子。

我们可以用它们拦截什么?

对于对象的大多数操作，JavaScript 规范中都有一个所谓的 "内部方法"，它描述了最底层的工作方式。例如，[[Get]]，用于读取属性的内部方法，[[Set]]，用于写入属性的内部方法，等等。这些方法仅在规范中使用，我们不能直接通过方法名调用他们

**Proxy 钩子会拦截这些方法的调用。**它们在[代理规范](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)和下表中列出。

对于每个内部方法，此表中都有一个钩子：可用于添加到 new Proxy 时的 handler 参数中以拦截操作的方法名称：

| 内部方法              | Handler 方法             | 何时触发                                                                                                                                                                                                                                                                                                                      |
| :-------------------- | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [[Get]]               | get                      | 读取属性                                                                                                                                                                                                                                                                                                                      |
| [[Set]]               | set                      | 写入属性                                                                                                                                                                                                                                                                                                                      |
| [[HasProperty]]       | has                      | in 运算符                                                                                                                                                                                                                                                                                                                     |
| [[Delete]]            | deleteProperty           | delete 操作                                                                                                                                                                                                                                                                                                                   |
| [[Call]]              | apply                    | proxy 对象作为函数时被调用                                                                                                                                                                                                                                                                                                    |
| [[Construct]]         | construct                | new 操作                                                                                                                                                                                                                                                                                                                      |
| [[GetPrototypeOf      | getPrototypeOf           | [Object.getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)                                                                                                                                                                                               |
| [[SetPrototypeOf]]    | setPrototypeOf           | [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)                                                                                                                                                                                               |
| [[IsExtensible]]      | isExtensible             | [Object.isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)                                                                                                                                                                                                   |
| [[PreventExtensions]] | preventExtensions        | [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)                                                                                                                                                                                         |
| [[DefineOwnProperty]] | defineProperty           | [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)，[Object.defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)                                                          |
| [[GetOwnProperty]]    | getOwnPropertyDescriptor | [Object.getOwnPropertyDesciptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)，for..in，Object.keys/value/entries                                                                                                                                        |
| [[OwnPropertyKeys]]   | ownKeys                  | [Object.getownPropertyNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)，[Object.getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)，for..in，Object.keys/values/entries |

### Invariants

**JavaScript 强制执行某些不变式------当必须由内部方法和钩子来完成操作时。**

其中大多数用于返回值:

- [[Set]] 如果值已经成功写入，则必须返回 true，否则返回 false。
- [[Delete]] 如果已成功删除该值，则必须返回 true，否则返回 false
- 依次类推，我们将在下面的示例中看到更多内容。

还有其他一些不变量，例如：

- **[[GetPropertyOf]]，应用于代理对象的，必须返回与 [[GetPrototypeOf]] 应用于被代理对象相同的值。换句话说，读取代理对象的原型必须始终返回被代理对象的原型**

钩子可以拦截这些操作，但是必须遵循这些规则。
不变量确保语言功能的正确和一致的行为。完整的不变量列表在[规范](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)。如果您不做奇怪的事情，就不会违反它们。

让我们看看实际示例中的工作原理。

### 带 "get" 钩子的默认值

最常见的钩子是用于读取/写入属性。

要拦截读取操作，handler 应该有 get(target, property, receiver)方法。

读取属性时触发该方法，参数如下：target —— 是目标对象，该对象作为第一个参数传递给 new Proxy，property —— 目标属性名,receiver —— 如果目标属性是一个 getter 访问器属性，则 receiver 就是本次读取属性所在的 this 对象。通常，这就是 proxy 对象本身（或者，如果我们从代理继承，则是从该代理继承的对象）。现在我们不需要此参数，因此稍后将对其进行详细说明。

让我们用 get 实现对象的默认值。

我们将创建一个对不存在的数组项返回 0 的数组。

通常，当人们尝试获取不存在的数组项时，他们会得到 undefined, 但是我们会将常规数组包装到代理中，以捕获读取操作并在没有此类属性的情况下返回 0：

```js
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, property) {
    if (property in target) {
      return target[property];
    } else {
      return 0; //默认值
    }
  },
});

alert(numbers[1]); // 1
alert(numbers[123]); // 0 (没有这样的元素)
```

如我们所见，使用 get 钩子非常容易。
我们可以用 Proxy 来实现任何读取默认值的逻辑。
想象一下，我们有一本词典，上面有短语及其翻译：

```js
let dictionary = {
  Hello: "Hola",
  Bye: "Adiós",
};

alert(dictionary["Hello"]); // Hola
alert(dictionary["Welcome"]); // undefined
```

现在，如果没有短语，从 dictionary 读取将返回 undefined。但实际上，返回一个未翻译短语通常比 undefined 要好。因此，让我们在这种情况下返回一个未翻译的短语，而不是 undefined。

为此，我们将包装 dictionary 进一个拦截读取操作的代理：

```js
let dictionary = {
  Hello: "Hola",
  Bye: "Adiós",
};

dictionary = new Proxy(dictionary, {
  get(target, phrase) {
    // 拦截读取属性操作
    if (phrase in target) {
      //如果字典包含该短语
      return target[phrase]; // 返回译文
    } else {
      // 否则返回未翻译的短语
      return phrase;
    }
  },
});

// 在字典中查找任意短语！
// 最坏的情况也只是它们没有被翻译。
alert(dictionary["Hello"]); // Hola
alert(dictionary["Welcome to Proxy"]); // Welcome to Proxy
```

**请注意代理如何覆盖对象**

```js
dictionary = new Proxy(dictionary, {});
```

**代理应该在所有地方都完全替代了目标对象。目标对象被代理后，任何人都不应该再引用目标对象。否则很容易搞砸。**

### 使用 "set" 钩子进行验证

假设我们想要一个专门用于数字的数组。如果添加了其他类型的值，则应该抛出一个错误。

当写入属性时 set 钩子触发。

> set(target, property, value, receiver)

- target —— 是目标对象，该对象作为第一个参数传递给 new Proxy，
- property —— 目标属性名称，
- value —— 目标属性要设置的值，
- receiver —— 与 get 钩子类似，仅与 setter 访问器相关。

如果写入操作成功，set 钩子应该返回 true，否则返回 false（触发 TypeError）。

让我们用它来验证新值：

```js
let numbers = [];

numbers = new Proxy(numbers, {
  // (*)
  set(target, prop, val) {
    // 拦截写入操作
    if (typeof val == "number") {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  },
});

numbers.push(1); // 添加成功
numbers.push(2); // 添加成功
alert("Length is: " + numbers.length); // 2

numbers.push("test"); // TypeError （proxy 的 `set` 操作返回 false）

alert("This line is never reached (error in the line above)");
```

**请注意：Array 的内建方法依然生效!值使用 push 方法添加入数组。添加值时，length 属性会自动增加。我们的代理对象 Proxy 不会破坏任何东西**

我们不必重写诸如 push 和 unshift 等添加元素的数组方法，就可以在其中添加检查，因为在内部它们使用代理所拦截的 [[Set]] 操作。

因此，代码简洁明了。

**别忘了返回 true。如上所述，要保持不变式。**

**对于 set 操作, 它必须在成功写入时返回 true。**

**如果我们忘记这样做或返回任何 falsy 值，则该操作将触发 TypeError。**

### 使用 "ownKeys" 和 "getOwnPropertyDescriptor" 进行迭代

Object.keys，for..in 循环和大多数其他遍历对象属性的方法都使用 [[OwnPropertyKeys]]内部方法（由 ownKeys 钩子拦截) 来获取属性列表。

这些方法在细节上有所不同：

- Object.getOwnPropertyNames(obj) 返回非 Symbol 键。
- Object.getOwnPropertySymbols(obj) 返回 symbol 键。
- Object.keys/values() 返回带有 enumerable 标记的非 Symbol 键值对（属性标记在章节 属性标志和属性描述符 有详细描述).
- for..in 循环遍历所有带有 enumerable 标记的非 Symbol 键，以及原型对象的键。

但是所有这些都从该列表开始。

在下面的示例中，我们使用 ownKeys 钩子拦截 for...in 对 user 的遍历，还使用 Object.keys 和 Object.values 来跳过下划线 \_ 开头的属性：

```js
let user = {
  name: "John",
  age: 30,
  _password: "***",
};

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
});

// "ownKeys" 过滤掉 _password
for (let key in user) alter(key); // name，然后是 age

// 对这些方法同样有效：
alert(Object.keys(user)); // name,age
alert(Object.values(user)); // John,30
```

到目前为止，它仍然有效。

**虽然，如果我们返回对象中不存在的键，Object.keys 并不会列出该键：**

```js
let user = {};

user = new Proxy(user, {
  ownKeys(target) {
    return ["a", "b", "c"];
  },
});

alert(Object.keys(user)); // <empty>

为什么? 原因很简单，Object.keys 仅仅返回带有 enumerable 标记的属性。为了检查它，该方法会对每个属性调用 [[GetOwnProperty]] 来获得属性描述符。在这里，由于没有属性，其描述符为空，没有 enumerable 标记，因此它将被略过。
```

为了让 Object.keys 返回一个属性，我们要么需要将该属性及 enumerable 标记存入对象，或者我们可以拦截对它的调用[[GetOwnProperty]](钩子 getOwnPropertyDescriptor 会执行此操作)，并返回描述符 `enumerable: true`

这是一个例子：

```js
let user = {};

user = new Proxy(user, {
  ownKeys(target) {
    return ["a", "b", "c"];
  },

  getOwnPropertyDescriptor(target, property) {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

alert(Object.keys(user)); // a, b, c
```

让我们再次注意：如果该属性在对象中不存在，则我们只需要拦截 [[GetOwnProperty]]。

### 具有 "deleteProperty" 和其他钩子的受保护属性

有一个普遍的约定，即下划线 \_ 前缀的属性和方法是内部的。不应从对象外部访问它们

从技术上讲，这是可能的：

```js
let user = {
  name: "John",
  _password: "secret",
};

alert(user._password); // secret
```

让我们使用代理来防止对以 \_ 开头的属性的任何访问。

我们需要以下钩子：

- get 读取此类属性时抛出错误，
- set 写入属性时抛出错误，
- deleteProperty 删除属性时抛出错误，
- ownKeys 在使用 for..in 和类似 Object.keys 的方法时排除以 \_ 开头的属性。

代码如下：

```js
let user = {
  name: "John",
  _password: "***",
};

user = new Proxy(user, {
  get(target, prop) {
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    }
    let value = target[prop];
    return typeof value === "function" ? value.bind(target) : value; // (*)
  },
  set(target, prop, val) {
    // 拦截写入操作
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    } else {
      target[prop] = val;
      return true;
    }
  },
  deleteProperty(target, prop) {
    // 拦截属性删除
    if (prop.startsWith("_")) {
      throw new Error("Access denied");
    } else {
      delete target[prop];
      return true;
    }
  },
  ownKeys(target) {
    // 拦截读取属性列表
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
});

// "get" 不允许读取 _password
try {
  alert(user._password); // Error: Access denied
} catch (e) {
  alert(e.message);
}

//  "set" 不允许写入 _password
try {
  user._password = "test"; // Error: Access denied
} catch (e) {
  alert(e.message);
}

// "deleteProperty" 不允许删除 _password 属性
try {
  delete user._password; // Error: Access denied
} catch (e) {
  alert(e.message);
}

// "ownKeys" 过滤排除 _password
for (let key in user) alert(key); // name
```

请注意在行 (\*) 中 get 钩子的重要细节：

```js
get(target, prop) {
  // ...
  let value = target[prop];
  return (typeof value === 'function') ? value.bind(target) : value; // (*)
}
```

为什么我们需要一个函数调用 value.bind(target)?

原因是对象方法（例如 user.checkPassword()）必须能够访问 \_password：

```js
user = {
  // ...
  checkPassword(value) {
    //对象方法必须能读取 _password
    return value === this._password;
  },
};
```

对 user.checkPassword() 的一个调用会调用代理对象 user 作为 this（点运算符之前的对象会成为 this），因此，当它尝试访问 this.\_password 时 get 钩子将激活（它在读取任何属性时触发）并抛出错误。

因此，我们在行 (\*) 中将对象方法的上下文绑定到原始对象，target。然后，它们将来的调用将使用 target 作为 this，不触发任何钩子。

**该解决方案通常可行，但并不理想，因为一种方法可能会将未代理的对象传递到其他地方，然后我们会陷入困境：原始对象在哪里，代理的对象在哪里?**

**此外，一个对象可能会被代理多次（多个代理可能会对该对象添加不同的"调整"），并且如果我们将未包装的对象传递给方法，则可能会产生意想不到的后果。**

**因此，在任何地方都不应使用这种代理。**

### 类的私有属性

现代 Javascript 引擎原生支持私有属性，其以 # 作为前缀。这在章节 私有的和受保护的属性和方法 中有详细描述。Proxy 并不是必需的。

但是，此类属性有其自身的问题。特别是，它们是不可继承的。

### "In range" 及 "has" 钩子

让我们来看更多示例。

我们有一个 range 对象：

```js
let range = {
  start: 1,
  end: 10,
};
```

我们想使用 in 运算符来检查数字是否在 range 范围内

> has(target, property)

- target：是目标对象，作为第一个参数传递给 new Proxy
- property：属性名称

示例如下

```js
let range = {
  start: 1,
  end: 10,
};

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end;
  },
});

alert(5 in range); // true
alert(50 in range); // false
```

漂亮的语法糖，不是吗？而且实现起来非常简单。

### 包装函数："apply"

我们也可以将代理包装在函数周围

`apply(target, thisArg, args)` 钩子能使代理以函数的方式被调用

- target 是目标对象（函数是 JavaScript 中的对象）
- thisArg 是 this 的值
- args 是参数列表

例如，让我们回想一下 delay(f, ms) 装饰器，它是我们在 [装饰者模式，call/apply](https://juejin.im/post/6844904089680084999) 一章中完成的。

在该章中，我们没有用 proxy 来实现它。调用 delay(f, ms) 返回一个函数，该函数会将在 ms 毫秒后把所有调用转发到 f。

这是以前的基于函数的实现：

```js
function delay(f, ms) {
  // 返回一个超时后调用 f 函数的包装器
  return function () {
    // (*)
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 这次包装后，sayHi 在3秒后被调用
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! （3秒后）
```

正如我们已经看到的那样，大多数情况下都是可行的。包装函数 (\*) 在超时后执行调用。

但是包装函数不会转发属性读/写操作或其他任何操作。包装后，无法访问原有函数的属性，比如 name，length 和其他：

```js
function delay(f, ms) {
  return function () {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

alert(sayHi.length); // 1 （函数的 length 是其声明中的参数个数）

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 0 （在包装器声明中，参数个数为0)
```

**Proxy 功能强大得多，因为它将所有东西转发到目标对象。**

让我们使用 Proxy 而不是包装函数：

```js
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    },
  });
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 1 (*) proxy 转发“获取 length” 操作到目标对象

sayHi("John"); // Hello, John! （3秒后）
```

结果是相同的，但现在不仅调用，而且代理上的所有操作都转发到原始函数。所以 sayHi.length 在 (_) 行包装后正确返回结果(_)。

我们有一个"更丰富"的包装器。

还存在其他钩子：完整列表在本章的开头。它们的使用模式与上述类似。

## Reflect

**Reflect 是一个内置对象，可简化的创建 Proxy**

**以前的内部方法，比如[[Get]]，[[Set]] 等等都只是规范，不能直接调用**

**Reflect 对象使调用这些内部方法称为可能。它的方法是内部方法的最小包装。**

这是 Reflect 执行相同操作和调用的示例：

| 操作              | Reflect 调用                     | 内部方法      |
| :---------------- | :------------------------------- | :------------ |
| obj[prop]         | Reflect.get(obj,prop)            | [[Get]]       |
| obj[prop] = value | Reflect.set(obj, prop, value)    | [[Set]]]      |
| delete obj[prop]  | Reflect.deleteProperty(obj,prop) | [[Delete]]    |
| new F(value)      | Reflect.construct(F,value)       | [[Construct]] |
| ...               | ...                              | ...           |

例如：

```js
let user = {};

Reflect.set(user, "name", "John");

alert(user.name); // John
```

尤其是，Reflect 允许我们使用函数(Reflect.construct，Reflect.deleteProperty，...)执行操作(new，delete，...)。这是一个有趣的功能，但是这里还有一点很重要。

**对于每个可被 Proxy 捕获的内部方法，Reflect 都有一个对应的方法 Reflect，其名称和参数与 Proxy 钩子相同**

**因此，我们可以用 Reflect 来将操作转发到原始对象**

在此示例中，钩子 get 和 set 透明地(好像它们都不存在)将读/写操作转发到对象，并显示一条消息：

```js
let user = {
  name: "John",
};
user = new Proxy(user, {
  get(target, prop, receiver) {
    alert(`Get${prop}`);
    return Reflect.get(target, prop, receiver); // (1)
  },
  set(target, prop, val, receiver) {
    alert(`SET ${prop}=${val}`);
    return Reflect.set(target, prop, val, receiver);
  },
});
```

这里：

- Reflect.get：读取一个对象属性
- Reflect.set：写入对象属性，成功返回 true，否则返回 false

**就是说，一切都很简单：如果钩子想要将调用转发给对象，则只需要使用相同的参数调用 Reflect.<method> 就足够了**

**在大多数情况下，我们可以不使用 Reflect 完成相同的事情，例如，使用 Reflect.get(target, prop, receiver) 读取属性可以替换为 target[prop]。尽管有一些细微的差别。**

### 代理一个 getter

让我们看一个示例，说明为什么 Reflect.get 更好。我们还将看到为什么 get/set 有第四个参数 receiver，而我们以前没有使用过它。

我们有一个带有一个 \_name 属性和一个 getter 的对象 user。

这是一个 Proxy：

```js
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop];
  },
});

alert(userProxy.name); // Guest
```

该 get 钩子在这里是"透明的"，它返回原来的属性，不会做别的事情。对于我们的示例而言，这就足够了。

一切似乎都很好。但是让我们将示例变得更加复杂。

另一个对象 admin 从 user 继承后，我们可以观察到错误的行为：

```js
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  },
});

let admin = {
  __proto__: userProxy,
  _name: "Admin",
};

// Exprcted: Admin
alert(admin.name); // 输出：Guest(?!?)
```

读取 admin.name 应该返回 "Admin"，而不是 "Guest"!

怎么了?也许我们在继承方面做错了什么?

但是，如果我们删除代理，那么一切都会按预期进行。

问题实际上出在代理中，在 (\*)行。

1. 当我们读取 admin.name，由于 admin 对象自身没有对应的属性，搜索将转到原型

2. 原型是 userProxy

3. 当代理读取 name 属性时，**get 钩子会触发并从原始对象返回 target[prop]属性**，在(\*)行当调用 target[prop] 时，若 prop 是一个 getter，它将在 this=target 上下文中运行其代码。因此，结果是来自原始对象 target 的 this.\_name 即来自 user。

**为了解这种情况，我们需要 get 钩子的第三个参数 receiver。它保证传递正确的 this 给 getter。在我们的情况下是 admin。**

**如何为 getter 传递上下文? 对于常规函数，我们可以使用 call/apply，但这是一个 getter，它不是"被调用"的，只是被访问的**

**Reflect.get 可以做到的。如果我们使用它，一切都会正常运行。**

这是更正后的变体：

```js
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  },
});

let admin = {
  __proto__: userProxy,
  _name: "Admin",
};

alert(admin.name); // Admin
```

现在 receiver，保留了对正确 this 的引用(即 admin) 的引用，该引用将在(\*)行中使用 Reflect.get 传递给 getter

```js
get(target, prop, receiver) {
  return Reflect.get(...arguments);
}
```

Reflect 调用的命名方式与钩子完全相同，并且接受相同的参数。它们是通过这种方式专门设计的。

因此， return Reflect... 会提供一个安全的提示程序来转发操作，并确保我们不会忘记与此相关的任何内容。

## Proxy 的局限性

代理提供了一种独特的方法，可以在最底层更改或调整现有对象的行为。但是，它并不完美。有局限性。

### 内置对象：内部插槽（Internal slots）

许多内置对象，例如 Map, Set, Date, Promise 等等都使用了所谓的 “内部插槽”。

**它们类似于属性，但仅限于内部使用，仅用于规范目的。例如， Map 将项目存储在 [[MapData]]中。内置方法直接访问它们，而不通过 [[Get]]/[[Set]] 内部方法。所以 Proxy 不能拦截。**

为什么要在意呢？他们是内部的！好吧，这就是问题。在像这样的内置对象被代理后，代理对象没有这些内部插槽，因此内置方法将失败。

例如：

```js
let map = new Map();

let proxy = new Proxy(map, {});

proxy.set("test", 1); // Error
```

在内部，一个 Map 将所有数据存储在其 [[MapData]] 内部插槽中。代理对象没有这样的插槽。[内建方法](https://tc39.es/ecma262/#sec-map.prototype.set)Map.prototype.set方法视图访问内部属性this.[[MapData]]，但由于 this=proxy在proxy中不能找到它，只能失败。

幸运的是，有一种解决办法：

```js

```



## 参考

- [Proxy 和 Reflect](https://js.yanceyleo.com/docs/Proxy/proxy/)
- [Proxy 和 Reflect](https://juejin.cn/post/6844904090116292616)
