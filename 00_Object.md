# Object

## Object.defineProperty

**IE8 不兼容**

**通过对象字面量定义的对象的属性描述符默认是 true**

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

备注：应当直接在 Object 构造器对象上调用此方法，而不是在任意一个 Object 类型的实例上调用。

**在 ES6 中，由于 Symbol 类型的特殊性，用 Symbol 类型的值来做对象的 key 与常规的定义或修改不同，而 Object.defineProperty 是定义 key 为 Symbol 的属性的方法之一。**

该方法允许精确地添加或修改对象的属性。通过赋值操作添加的普通属性是可枚举的，在枚举对象属性时会被枚举到（for...in 或 Object.keys 方法），可以改变这些属性的值，也可以删除这些属性。这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改（immutable）的。

对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。**一个描述符只能是这两者其中之一；不能同时是两者。**

这两种描述符都是对象。它们共享以下可选键值（默认值是指在使用 Object.defineProperty() 定义属性时的默认值）：

- configurable
  当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
  默认为 false。

  1. 属性是否可以被删除
  2. 属性的特性在第一次设置之后可否被重新定义特性

- enumerable
  当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
  默认为 false。

数据描述符还具有以下可选键值：

- value
  该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
  默认为 undefined。
- writable
  当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
  默认为 false。

存取描述符还具有以下可选键值：

- get
  属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
  默认为 undefined。
- set
  属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。
  默认为 undefined。

描述符默认值汇总：

- 拥有布尔值的键 configurable、enumerable 和 writable 的默认值都是 false。
- 属性值和函数的键 value、get 和 set 字段的默认值为 undefined。

**如果一个描述符不具有 value、writable、get 和 set 中的任意一个键，那么它将被认为是一个数据描述符。**
如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常。

记住，这些选项不一定是自身属性，也要考虑继承来的属性。为了确认保留这些默认值，在设置之前，可能要冻结 [Object.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)，明确指定所有的选项，或者通过 [Object.create(null)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 将 [**proto**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/__proto__) 属性指向 [null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)

```js
// 使用 __proto__
var obj = {}
var descriptor = Object.create(null) // 没有继承的属性
// 默认没有 enumerable，没有 configurable，没有 writable
descriptor.value = 'static'
Object.defineProperty(obj, 'key', descriptor)

// 显式
Object.defineProperty(obj, 'key', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'static'
})

// 循环使用同一对象
function withValue(value) {
  var d =
    withValue.d ||
    (withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    })
  d.value = value
  return d
}
// ... 并且 ...
Object.defineProperty(obj, 'key', withValue('static'))

// 如果 freeze 可用, 防止后续代码添加或删除对象原型的属性
// （value, get, set, enumerable, writable, configurable）
;(Object.freeze || Object)(Object.prototype)
```

如果你想了解如何使用 Object.defineProperty 方法和类二进制标记语法，可以看看这些[额外示例](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty/Additional_examples)。

- 修改属性

如果属性已经存在，Object.defineProperty()将尝试根据描述符中的值以及对象当前的配置来修改这个属性。如果旧描述符将其 configurable 属性设置为 false，则该属性被认为是"不可配置的"，并且没有属性可以被改变（除了单向改变 writable 为 false）。当属性不可配置时，不能在数据和访问器属性类型之间切换。

如果属性已经存在，Object.defineProperty()将尝试根据描述符中的值以及对象当前的配置来修改这个属性。如果旧描述符将其 configurable 属性设置为 false，则该属性被认为是"不可配置的"，并且没有属性可以被改变（除了单向改变 writable 为 false）。当属性不可配置时，不能在数据和访问器属性类型之间切换。

当试图改变不可配置属性（除了 value 和 writable 属性之外）的值时，会抛出 TypeError，除非当前值和新值相同。

- Writable 属性

当 writable 属性设置为 false 时，该属性被称为“不可写的”。它不能被重新赋值。

```js
var o = {} // 创建一个新对象

Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
})

console.log(o.a) // logs 37
o.a = 25 // No error thrown
// (it would throw in strict mode,
// even if the value had been the same)
console.log(o.a) // logs 37. The assignment didn't work.

// strict mode
;(function () {
  'use strict'
  var o = {}
  Object.defineProperty(o, 'b', {
    value: 2,
    writable: false
  })
  o.b = 3 // throws TypeError: "b" is read-only
  return o.b // returns 2 without the line above
})()
```

如示例所示，试图写入非可写属性不会改变它，也不会引发错误。

- Enumerable 属性

enumerable 定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举。

```js
var o = {}
Object.defineProperty(o, 'a', { value: 1, enumerable: true })
Object.defineProperty(o, 'b', { value: 2, enumerable: false })
Object.defineProperty(o, 'c', { value: 3 }) // enumerable 默认为 false
o.d = 4 // 如果使用直接赋值的方式创建对象的属性，则 enumerable 为 true
Object.defineProperty(o, Symbol.for('e'), {
  value: 5,
  enumerable: true
})
Object.defineProperty(o, Symbol.for('f'), {
  value: 6,
  enumerable: false
})

for (var i in o) {
  console.log(i)
}
// logs 'a' and 'd' (in undefined order)

Object.keys(o) // ['a', 'd']

o.propertyIsEnumerable('a') // true
o.propertyIsEnumerable('b') // false
o.propertyIsEnumerable('c') // false
o.propertyIsEnumerable('d') // true
o.propertyIsEnumerable(Symbol.for('e')) // true
o.propertyIsEnumerable(Symbol.for('f')) // false

var p = { ...o }
p.a // 1
p.b // undefined
p.c // undefined
p.d // 4
p[Symbol.for('e')] // 5
p[Symbol.for('f')] // undefined
```

- Configurable 属性

configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。

属性的特性在第一次设置之后可否被重新定义特性

```js
var o = {}
Object.defineProperty(o, 'a', {
  get() {
    return 1
  },
  configurable: false
})

Object.defineProperty(o, 'a', {
  configurable: true
}) // throws a TypeError
Object.defineProperty(o, 'a', {
  enumerable: true
}) // throws a TypeError
Object.defineProperty(o, 'a', {
  set() {}
}) // throws a TypeError (set was undefined previously)
Object.defineProperty(o, 'a', {
  get() {
    return 1
  }
}) // throws a TypeError
// (even though the new get does exactly the same thing)
Object.defineProperty(o, 'a', {
  value: 12
}) // throws a TypeError // ('value' can be changed when 'configurable' is false but not in this case due to 'get' accessor)

console.log(o.a) // logs 1
delete o.a // Nothing happens
console.log(o.a) // logs 1
```

如果 o.a 的 configurable 属性为 true，则不会抛出任何错误，并且，最后，该属性会被删除。

- 添加多个属性和默认值

考虑特性被赋予的默认特性值非常重要，通常，使用点运算符和 Object.defineProperty() 为对象的属性赋值时，数据描述符中的属性默认值是不同的，如下例所示。

```js
var o = {}

o.a = 1
// 等同于：
Object.defineProperty(o, 'a', {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
})

// 另一方面，
Object.defineProperty(o, 'a', { value: 1 })
// 等同于：
Object.defineProperty(o, 'a', {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
})
```

- 自定义 Setters 和 Getters

下面的例子展示了如何实现一个自存档对象。当设置 temperature 属性时，archive 数组会收到日志条目。

```js
function Archiver() {
  var temperature = null
  var archive = []

  Object.defineProperty(this, 'temperature', {
    get: function () {
      console.log('get!')
      return temperature
    },
    set: function (value) {
      temperature = value
      archive.push({ val: temperature })
    }
  })

  this.getArchive = function () {
    return archive
  }
}

var arc = new Archiver()
arc.temperature // 'get!'
arc.temperature = 11
arc.temperature = 13
arc.getArchive() // [{ val: 11 }, { val: 13 }]
```

- 下面这个例子中，getter 总是会返回一个相同的值。

```js
var pattern = {
  get: function () {
    return 'I alway return this string,whatever you have assigned'
  },
  set: function () {
    this.myname = 'this is my name string'
  }
}

function TestDefineSetAndGet() {
  Object.defineProperty(this, 'myproperty', pattern)
}

var instance = new TestDefineSetAndGet()
instance.myproperty = 'test'

// 'I alway return this string,whatever you have assigned'
console.log(instance.myproperty)
// 'this is my name string'
console.log(instance.myname)
```

- 继承属性

如果访问者的属性是被继承的，它的 get 和 set 方法会在子对象的属性被访问或者修改时被调用。如果这些方法用一个变量存值，该值会被所有对象共享。

```js
function myclass() {}

var value
Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return value
  },
  set(x) {
    value = x
  }
})

var a = new myclass()
var b = new myclass()
a.x = 1
console.log(b.x) // 1
```

这可以通过将值存储在另一个属性中解决。在 get 和 set 方法中，this 指向某个被访问和修改属性的对象。

```js
function myclass() {}

Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return this.stored_x
  },
  set(x) {
    this.stored_x = x
  }
})

var a = new myclass()
var b = new myclass()
a.x = 1
console.log(b.x) // undefined
```

不像访问者属性，值属性始终在对象自身上设置，而不是一个原型。然而，如果一个不可写的属性被继承，它仍然可以防止修改对象的属性。

```js
function myclass() {}

myclass.prototype.x = 1
Object.defineProperty(myclass.prototype, 'y', {
  writable: false,
  value: 1
})

var a = new myclass()
a.x = 2
console.log(a.x) // 2
console.log(myclass.prototype.x) // 1
a.y = 2 // Ignored, throws in strict mode
console.log(a.y) // 1
console.log(myclass.prototype.y) // 1
```

**这里值得注意的是，使用 vite 搭建的服务器下由于使用的是 ES Module，而该模块中默认使用严格模式，所以 this 是 undefined**

### 一些例子

```js
var o = {}
Object.defineProperty(o, 'a', {
  get() {
    return 1
  },
  configurable: false
})

Object.defineProperty(o, 'a', {
  configurable: true
}) // throws a TypeError
Object.defineProperty(o, 'a', {
  enumerable: true
}) // throws a TypeError
Object.defineProperty(o, 'a', {
  set() {}
}) // throws a TypeError (set was undefined previously)
Object.defineProperty(o, 'a', {
  get() {
    return 1
  }
}) // throws a TypeError
// (even though the new get does exactly the same thing) // 尽管重新定义的 get 结果和上面一样，但还是会报错
Object.defineProperty(o, 'a', {
  value: 12
}) // throws a TypeError // ('value' can be changed when 'configurable' is false but not in this case due to 'get' accessor)

console.log(o.a) // logs 1
delete o.a // Nothing happens
console.log(o.a) // logs 1
```

### 一个例子

```js
const target = Object.defineProperty({}, 'a', {
  value: 1
})
console.log(target)
const res = Object.assign(target, { b: 2 }, { b: 3, a: 100 }, { c: 4 })
```

结果如下:

![](image/00_Object/1607948751896.png)

原因是在 a 通过 get 给 target, target 准备通过 set 赋值的时候，才报错，所以能拿到 b

## Object.assign

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

> The Object.assign() method copies all enumerable own properties from one or more source objects to a target object. It returns the target object.

> The Object.assign() method only copies enumerable and own properties from a source object to a target object. It uses [[Get]] on the source and [[Set]] on the target, so it will invoke getters and setters. Therefore it assigns properties, versus copying or defining new properties. This may make it unsuitable for merging new properties into a prototype if the merge sources contain getters.

> For copying property definitions (including their enumerability) into prototypes, use Object.getOwnPropertyDescriptor() and Object.defineProperty() instead.

```js
const test1 = {
  a: 1,
  b: 2
}
const test2 = {
  b: 3,
  c: 4
}
const test3 = {
  c: 5,
  d: 6
}

const test4 = Object.assign(test1, test2, test3)

console.log(test1)
console.log(test2)
console.log(test3)
console.log(test4)
console.log(test1 === test4)
```

```js
Object.assign = function (target /* 目标对象 */, ...sources /* 源对象 */) {
  // 可枚举的源对象 sources 将自身的属性分配给 target， 即 target 和 接收对象是同一个引用， 即 console.log(test1 === test4);
  // 分配操作是: sources getter -> target setter
  return target
}
```

```js
let obj = Object.create(
  { a: 1 },
  {
    b: {
      value: 2
    },
    c: {
      value: 3,
      enumerable: true,
      writable: true
    }
  }
)
const newObj = Object.assign({}, obj)
console.log(newObj)
// 结果如下图，如 MDN 所说，assign 只会将源对象自己的和可枚举的属性分配给目标对象，是不会将源对象的属性描述符给 target 的，因此 newObj 只有 c
```

```js
let obj = Object.create(
  { a: 1 },
  {
    b: {
      value: 2,
      enumerable: true
    },
    c: {
      value: 3,
      enumerable: true,
      writable: true
    }
  }
)
const newObj = Object.assign({}, obj)
// 现在 newObj 有 {b: 2, c:3}
// 然后我们删除 b
delete newObj.b // {c: 3}
// 发现能够删的掉，说明，目标对象知识源对象将自己的键值对分配了过去，不管描述符，目标对象只接收源对象的键值对
for (let k in newObj) {
  console.log(k, newObj[k])
}
```

![](image/00_Object/1607935136037.png)

###

```js
const source = {
  a: 1,
  get b() {
    return 2
  }
}
const res = Object.assign({}, source)
console.log(res)
```

![](image/00_Object/1607964571763.png)

打印 res 发现 get 并没有分配过去，而是结果被分配了，那我们来手动实现一下：

```js
const source = {
  a: 1,
  get b() {
    return 2
  }
}

Object.myAssign = function (target, ...sources) {
  sources.forEach((source) => {
    const desciptors = Object.keys(source).reduce((desciptors, key) => {
      desciptors[key] = Object.getOwnPropertyDescriptor(source, key)

      return desciptors
    }, {})
    Object.defineProperties(target, desciptors)
  })

  return target
}

const res = Object.myAssign({}, source)
console.log(res)
```

![](image/00_Object/1607965316112.png)

当点击 b 将其展开，即调用了 `getter`:

![](image/00_Object/1607965369277.png)

## Object.create

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

> The Object.create() method creates a new object, using an existing object as the prototype of the newly created object.

第二个参数:

> propertiesObject Optional
> propertiesObject Optional
> If specified and not undefined, an object whose enumerable own properties (that is, those properties defined upon itself and not enumerable properties along its prototype chain) specify property descriptors to be added to the newly-created object, with the corresponding property names. These properties correspond to the second argument of Object.defineProperties().

```js
let obj = Object.create(
  { a: 1 },
  {
    b: {
      // descriptor
      value: 2,
      configurable: false,
      enumerable: false,
      writable: false
    },
    c: {
      value: 3
    }
  }
)

for (var k in obj) {
  console.log(k, obj[k])
}
```

## 一个面试题

```js
const v1 = 123
const v2 = '123'
const v3 = true
const v4 = function test() {}
const v5 = [4, 5, 6]

const v6 = Object.assign({}, v1, v2, v3, v4, v5)

console.log(v6)
```

结果如下图:

![](image/00_Object/1607936486529.png)

`Object.assign` 里的源都是对象，所以在源不是对象的情况下，会将源包装成对象，即包装对象，然后在将可枚举的属性交给 target，并将 target 返回给 v6
将源包装成对象后，由 4 个包装后的源对象(v5 本来就是对象)可知，只有 `String(v2)` 和 v5 是 `enumerable`, 即可枚举的，而 assign 的源对象必须是 target own properties 和 可枚举的属性，所以 v6 是上图结果(v5 是 {0: 4, 1: 5, 2: 6}, 将 String(v2) 覆盖了)

## Object.freeze 对象冻结

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

> The Object.freeze() method freezes an object. A frozen object can no longer be changed; freezing an object prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed. In addition, freezing an object also prevents its prototype from being changed. freeze() returns the same object that was passed in.

> Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

> Nothing can be added to or removed from the properties set of a frozen object. Any attempt to do so will fail, either silently or by throwing a TypeError exception (most commonly, but not exclusively, when in strict mode).

> 不能向被冻结对象的属性集添加任何内容，也不能从该属性集中删除任何内容。任何这样做的尝试都将失败，要么以静默方式失败，要么抛出类型错误异常(大多数情况下，但不排除在严格模式下)。

> For data properties of a frozen object, values cannot be changed, the writable and configurable attributes are set to false. Accessor properties (getters and setters) work the same (and still give the illusion that you are changing the value). Note that values that are objects can still be modified, unless they are also frozen. As an object, an array can be frozen; after doing so, its elements cannot be altered and no elements can be added to or removed from the array.

> 对于冻结对象的数据属性，值不能更改，可写和可配置属性设置为 false。访问器属性(getter 和 setter)的工作原理是一样的(仍然给人一种您正在更改值的错觉)。注意，对象的值仍然可以修改，除非它们也被冻结。作为对象，数组可以被冻结;这样做之后，就不能修改它的元素，也不能向数组中添加或删除任何元素。

> freeze() returns the same object that was passed into the function. It does not create a frozen copy.

> freeze()返回传入函数的相同对象。它不会创建冻结副本。

> In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES2015, a non-object argument will be treated as if it were a frozen ordinary object, and be simply returned.

> 在 ES5 中，如果这个方法的参数不是一个对象(一个原语)，那么它将导致类型错误。在 ES2015 中，一个非对象参数将被当作一个冻结的普通对象来处理，并简单地返回。

```js
> Object.freeze(1)
TypeError: 1 is not an object // ES5 code

> Object.freeze(1)
1                             // ES2015 code
```

> An ArrayBufferView with elements will cause a TypeError, as they are views over memory and will definitely cause other possible issues:

> 带有元素的 ArrayBufferView 会导致类型错误，因为它们是内存视图，肯定会导致其他可能的问题:

```js
> Object.freeze(new Uint8Array(0)) // No elements
Uint8Array []

> Object.freeze(new Uint8Array(1)) // Has elements
TypeError: Cannot freeze array buffer views with elements

> Object.freeze(new DataView(new ArrayBuffer(32))) // No elements
DataView {}

> Object.freeze(new Float64Array(new ArrayBuffer(64), 63, 0)) // No elements
Float64Array []

> Object.freeze(new Float64Array(new ArrayBuffer(64), 32, 2)) // Has elements
TypeError: Cannot freeze array buffer views with elements
```

> To be a constant object, the entire reference graph (direct and indirect references to other objects) must reference only immutable frozen objects. The object being frozen is said to be immutable because the entire object state (values and references to other objects) within the whole object is fixed. Note that strings, numbers, and booleans are always immutable and that Functions and Arrays are objects.

> 要成为常量对象，整个引用图(对其他对象的直接和间接引用)必须只引用不可变的冻结对象。被冻结的对象被称为不可变的，因为整个对象内的整个对象状态(值和对其他对象的引用)是固定的。注意，字符串、数字和布尔值始终是不可变的，函数和数组都是对象。

> What is "shallow freeze"?
> The result of calling Object.freeze(object) only applies to the immediate properties of object itself and will prevent future property addition, removal or value re-assignment operations only on object. If the value of those properties are objects themselves, those objects are not frozen and may be the target of property addition, removal or value re-assignment operations.

> 什么是"浅冻结"?
> 调用 object. freeze(object)的结果仅适用于对象本身的当前属性，并将防止未来仅对对象进行属性添加、移除或值重新赋值操作。如果这些属性的值是对象本身，那么这些对象不会被冻结，并且可能是属性添加、删除或值重新分配操作的目标。

```js
function Test() {
  this.a = 1
  this.b = 2
}

Test.prototype.c = 3
Test.prototype.d = 4

const test = new Test()

// 冻结之前修改是可行的
const newTest = Object.freeze(test)
// console.log(newTest === test);

console.log(test.a) // find

test.d = 4 // add
console.log(test) // 不可增加

test.a = 111 // update
console.log(test) // 不可修改

delete test.a // delete
console.log(test) // 不可删除

Test.prototype.c = 333 // 通过构造函数原型属性更改其属性是可以的
console.log(test)

test.__proto__.d = 444 // 通过对象的 proto 更改原型上的属性是可以的
console.log(test)

// 报错， test is not extensible，原型对象是不可重写的，但是原型上的属性是可以更改的， 因为这是浅冻结
test.__proto__ = {
  a: 1,
  b: 2,
  c: 3
}
console.log(test)
```

```js
'use strict'
function Test() {
  this.a = 1
  this.b = 2
}

Test.prototype.c = 3
Test.prototype.d = 4

const test = new Test()

const newObj = Object.seal(test)
console.log(newObj)
// newObj.__proto__ = {}; // 报错
// Test.prototype.c = 123; // 可行
Test.prototype = {} // 不行，因为已经实例化了
console.log(newObj)

const frObj = Object.freeze(test)
Test.prototype.c = 234 // 可行
// frObj.__proto__ = {} // 报错
Test.prototype = {} // 不行，因为已经实例化了
console.log(frObj)
```

```js
'use strict'

const obj = {
  _a: 1,
  b: 2,
  c: {
    d: 4
  },
  get() {
    return this.a
  },
  set a(newValue) {
    // this._a = newValue; 报错，不能通过 accessor property 修改
  }
}
Object.freeze(obj)
const is = Object.isFrozen(obj) // 对象是否冻结

// console.log(is); // true

obj.a = 1 // 严格模式下会报错
obj.c.d = 4 // Object.freeze 是浅冻结
console.log(obj.a) // 不能通过 accessor property 修改
```

```js
// ES5 环境里，... is not an object
// ES6 环境里，返回参数本身
const res = Object.freeze(true)
const arr = [1, 2, 3]
Object.freeze(arr)
arr.push(4) // 报错，原因如下截图(不能增加下标 3, 因为 Array 底层是一个对象)
arr[0] = 111 // 严格模式下会报错
```

![](image/00_Object/1607924583220.png)

### 深度冻结封装

```js
Object.deepFreeze = function (o) {
  const _keys = Object.getOwnPropertyNames(o) // 这里没有使用 Object.keys, 因为 Object. 是业务逻辑上的语法糖，它不能够取到那些不可枚举的属性，而 Object.getOwnPropertyNames 可以，它是底层的方法

  _keys.length > 0 &&
    _keys.forEach((key) => {
      if (typeof o[key] === 'object' && o[key] !== null) {
        Object.deepFreeze(o[key])
      }
    })

  return Object.freeze(o)
}

let obj = {
  a: 1,
  b: 2,
  c: {
    d: 3
  }
}

Object.deepFreeze(obj)

obj.c.d = 4
console.log(obj)
```

## Object.seal 密封对象

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

> The Object.seal() method seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable.

seal()方法密封对象，防止向其添加新属性，并将所有现有属性标记为不可配置。当前属性的值仍然可以更改，只要它们是可写的。

> By default, objects are extensible (new properties can be added to them). Sealing an object prevents new properties from being added and marks all existing properties as non-configurable. This has the effect of making the set of properties on the object fixed. Making all properties non-configurable also prevents them from being converted from data properties to accessor properties and vice versa, but it does not prevent the values of data properties from being changed. Attempting to delete or add properties to a sealed object, or to convert a data property to accessor or vice versa, will fail, either silently or by throwing a TypeError (most commonly, although not exclusively, when in strict mode code).

> 默认情况下，对象是可扩展的(可以向其添加新属性)。密封对象可以防止添加新属性，并将所有现有属性标记为不可配置。这样做的效果是固定对象上的属性集。**使所有属性不可配置还可以防止它们从数据属性转换为访问器属性，反之亦然**，但不能阻止数据属性的值被更改。**试图删除或向密封对象添加属性，或将数据属性转换为访问器或反之，将会失败**，要么以静默方式进行，要么抛出类型错误(最常见的情况是，尽管不是唯一的情况是，在严格模式代码中)。

> The prototype chain remains untouched. However, the **proto** property is sealed as well.

> 原型链保持不变。然而，\_\_proto\_\_ 的性质也是密封的。

### Comparison to Object.freeze()

> Existing properties in objects frozen with Object.freeze() are made immutable. Objects sealed with Object.seal() can have their existing properties changed.

> In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES2015, a non-object argument will be treated as if it was a sealed ordinary object by simply returning it.

> **在 ES5 中，和 Object.freeze 传入的参数一样，如果他不是一个对象，将会报错，在 ES6 中则会返回原参数，一个非对象参数将会被视为一个密封的普通对象而被直接返回**

**和 Object.freeze 一样，返回的对象都是对原对象的一个引用**

```js
Object.seal(1)
// TypeError: 1 is not an object (ES5 code)

Object.seal(1)
// 1                             (ES2015 code)
```

```js
var obj = {
  prop: function () {},
  foo: 'bar'
}

// 可以添加新的属性
// 可以更改或删除现有的属性
obj.foo = 'baz'
obj.lumpy = 'woof'
delete obj.prop

var o = Object.seal(obj)

o === obj // true
Object.isSealed(obj) // === true

// 仍然可以修改密封对象的属性值
obj.foo = 'quux'

// 但是你不能将属性重新定义成为访问器属性
// 反之亦然
Object.defineProperty(obj, 'foo', {
  get: function () {
    return 'g'
  }
}) // throws a TypeError

// 除了属性值以外的任何变化，都会失败.
obj.quaxxor = 'the friendly duck'
// 添加属性将会失败
delete obj.foo
// 删除属性将会失败

// 在严格模式下，这样的尝试将会抛出错误
function fail() {
  'use strict'
  delete obj.foo // throws a TypeError
  obj.sparky = 'arf' // throws a TypeError
}
fail()

// 通过Object.defineProperty添加属性将会报错
Object.defineProperty(obj, 'ohai', {
  value: 17
}) // throws a TypeError
Object.defineProperty(obj, 'foo', {
  value: 'eit'
}) // 通过Object.defineProperty修改属性值
```

```js
'use strict'
function Test() {
  this.a = 1
  this.b = 2
}

Test.prototype.c = 3
Test.prototype.d = 4

const test = new Test()

const newObj = Object.seal(test)
console.log(newObj)
// newObj.__proto__ = {}; // 报错
// Test.prototype.c = 123; // 可行
Test.prototype = {} // 不行，因为已经实例化了
console.log(newObj)

const frObj = Object.freeze(test)
Test.prototype.c = 234 // 可行
// frObj.__proto__ = {} // 报错
Test.prototype = {} // 不行，因为已经实例化了
console.log(frObj)
```

### 深度密封对象封装

**和 Object.freeze 一样，他们对对象的操作都是浅操作**

```js
const obj = { a: 1, b: 2, c: { d: 3, e: { f: 4 } } }
Object.deepSeal = function (o) {
  const _keys = Object.getOwnPropertyNames(o)

  _keys.length &&
    _keys.forEach((_k) => {
      if (typeof o[_k] === 'object' && o[_k] !== null) {
        Object.deepSeal(o[_k])
      }
    })

  return Object.seal(o)
}
Object.deepSeal(obj)
obj.x = 'xxx'
obj.y = 'yyy'
obj.c.x = 'ddd'
delete obj.c.e
console.log(obj)
```

## Object.preventExtensions

**Object.preventExtensions()仅阻止添加自身的属性。但其对象类型的原型依然可以添加新的属性。**

**该方法使得目标对象的 [[prototype]] 不可变；任何重新赋值 [[prototype]] 操作都会抛出 TypeError 。这种行为只针对内部的 [[prototype]] 属性， 目标对象的其它属性将保持可变。**

**可修改/删除原对象的现有属性，但是不可拓展**

```js
const obj = { b: 2, c: 3 }
const newObj = Object.preventExtensions(obj)
// console.log(obj === newObj); // true 对原对象的同一个引用
// console.log(Object.isExtensible(obj)); // false 不可扩展

obj.a = 1 // 不可扩展，严格模式下报错
obj.b = 'b' // 可修改
delete obj.c // 可删除
console.log(obj) // {b: 'b'}

// Object.defineProperty(obj, "a", {
//   value: 1,
// }); // 非严格模式下报错
```

```js
'use strict'
const obj = { a: 1, b: 2 }

Object.prototype.c = 3

Object.preventExtensions(obj)

obj.__proto__.c = 333 // 原型属性可以修改
Object.prototype.c = 444

delete obj.__proto__.c // 原型上的属性可以删除

obj.__proto__.x = 'xxx' // 原型上的属性可扩展
Object.prototype.y = 'yyy' // 原型上的属性可扩展

// obj.__proto = {}; // 非严格模式下就会报错

Object.prototype = {} // 严格模式下报错

console.log(obj)
```

**在 ES5 中，如果参数不是一个对象类型（而是原始类型），将抛出一个 TypeError 异常。在 ES2015 中，非对象参数将被视为一个不可扩展的普通对象，因此会被直接返回。**

```js
Object.preventExtensions(1)
// TypeError: 1 is not an object (ES5 code)

Object.preventExtensions(1)
// 1  (ES2015 code)
```

### 深扩展

```js
Object.deepPreventExtensions = function (o) {
  let _keys = Object.getOwnPropertyNames(o)

  _keys.length &&
    _keys.forEach((_k) => {
      if (typeof _k === 'object' && _k !== null) {
        Object.deepPreventExtensions(o[_k])
      }
    })

  return Object.preventExtensions(o)
}
```

## freeze, seal, preventExtensions 的综合场景

```js
var obj = {}

Object.preventExtensions(obj) // 不可拓展

console.log(Object.isFrozen(obj) === true) // 因为该对象为空，所以该对象在不可扩展的前提下不存在修改和删除属性，所以 obj 现在是冻结的

console.log(Object.isSealed(obj) === true) // seal 同理，该对象的删除操作也是不可行的

// 当对象上有属性时，那么久不符合 freeze 和 seal
```

```js
const obj = { a: 1 }

Object.preventExtensions(obj)

Object.defineProperty(obj, 'a', {
  writable: false
})

console.log(Object.isFrozen(obj) === false) // 不满足可删除
console.log(Object.isSealed(obj) === false) // 不满足可删除
```

```js
const obj = { a: 1 }

Object.preventExtensions(obj)

Object.defineProperty(obj, 'a', {
  configurable: false
})

console.log(Object.isFrozen(obj) === false) // 不满足可修改
console.log(Object.isSealed(obj) === true)
```

**是冻结对象就一定是密封对象**

```js
const o = { a: 1 }
Object.freeze(o)
console.log(Object.isSealed(o)) // true
```

```js
const obj = {
  get a() {
    return 1
  }
}

obj.a = 2 // 不可修改，因为没有 setter

delete obj.a

console.log(obj) // {}

Object.preventExtensions(obj)
console.log(Object.isFrozen(obj) === true)
console.log(Object.isSealed(obj) === true)
console.log(Object.isExtensible(obj) === false)
```

## Object.entries

**`Object.entries` 只会找对象的 own properties, 并且是可枚举的 own properties, 不会找 prototype's property**

```js
const Foo = function () {
  this.a = 'a'
  this.b = 'b'
}
Foo.prototype.c = 'c'

const obj = Object.entries(new Foo())
console.log(obj)
```

![](image/00_Object/1607966583572.png)

```js
const obj = {}

Object.defineProperty(obj, 'a', {
  value: 'a',
  enumerable: true
})

Object.defineProperty(obj, 'b', {
  value: 'b',
  enumerable: true
})

Object.defineProperty(obj, 'c', {
  value: 'c'
})

const val = Object.entries(obj)
console.log(val)
```

![](image/00_Object/1607966772509.png)

### 重写 Object.entries

```js
Object.myEntries = function (o) {
  let _pool = []

  if (Object.prototype.toString.call(o) === '[object Object]') {
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        _pool.push([k, o[k]])
      }
    }
  }

  return _pool
}
```

## Object.fromEntries

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)

Object.fromEntries 是与 Object.entries() 相反的方法，Object.fromEntries 将键值对列表转换为一个对象

```js
const obj = { a: 1, b: 2 }

const r = Object.entries(obj)

const nObj = Object.fromEntries(r)

console.log(nObj === obj) // false, 说明反悔了一个新对象
console.log(nObj)
```

**Object.fromEntries 接收的参数是一个类似 Array, Map 或者其他实现了可迭代协议的可迭代对象**

一个由该迭代对象条目提供对应属性的新对象

```js
const map = new Map([
  ['foo', 'bar'],
  ['baz', 42]
])
const obj = Object.fromEntries(map)
console.log(obj) // { foo: "bar", baz: 42 }
```

```js
const arr = [
  ['0', 'a'],
  ['1', 'b'],
  ['2', 'c']
]
const obj = Object.fromEntries(arr)
console.log(obj) // { 0: "a", 1: "b", 2: "c" }
```

### 重写 Object.fromEntries

```js
Object.myFronEntries = function (iterator) {
  let _obj = {}

  for (let item of iterator) {
    _obj[item[0]] = item[1]
  }

  return _obj
}
```

## 参考

- [Object](https://js.yanceyleo.com/docs/Object/hasOwnProperty/)
