# class

## 原文

- [你需要知道的 JavaScript 类(class)的这些知识](https://mp.weixin.qq.com/s?__biz=MzI0NDQ0ODU3MA==&mid=2247486086&idx=1&sn=14454497e94e211c4765dbea87c6a74f&chksm=e95ce6d3de2b6fc569ebb3196fb30cecec152085e4e4e646c187dc7b25a42900bc64411a51f7&token=1734057872&lang=zh_CN#rd)

**JavaScript 使用原型继承:每个对象都从原型对象继承属性和方法。**

**在 Java 或 Swift 等语言中使用的传统类作为创建对象的蓝图，在 JavaScript 中不存在，原型继承仅处理对象。**

**原型继承可以模拟经典类继承。为了将传统的类引入 JavaScript, ES2015 标准引入了 class 语法，其底层实现还是基于原型，只是原型继承的语法糖。**

## 1. 定义: 类关键字

使用关键字 class 可以在 JS 中定义了一个类：

```js
class User {
  // 类的主体
}
```

如果在定义类时没有指定类名。可以通过使用**类表达式**，将类分配给变量：

```js
const UserClass = class {
  // 类的主体
};
```

上面的代码定义了一个 User 类。大括号{}里面是类的主体。此语法称为 class 声明。

还可以轻松地将类导出为 ES6 模块的一部分，默认导出语法如下：

```js
export default class User {
  // 主体
}
```

命名导出如下：

```js
export class User {
  // 主体
}
```

当我们创建类的实例时，该类将变得非常有用。**实例是包含类所描述的数据和行为的对象。**

使用 new 运算符实例化该类，语法：`instance = new Class()`。

例如，可以使用 new 操作符实例化 User 类：

```js
const myUser = new User();
```

new User()创建 User 类的一个实例。

## 2. 初始化:constructor()

constructor(param1, param2, ...)是用于初始化实例的类主体中的一种特殊方法。在这里可以设置字段的初始值或进行任何类型的对象设置。

在下面的示例中，构造函数设置字段 name 的初始值

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

User 的构造函数有一个参数 name，用于设置字段 this.name 的初始值

**在构造函数中，this 值等于新创建的实例。用于实例化类的参数成为构造函数的参数：**

```js
class User {
  constructor(name) {
    name; // => '前端小智'
    this.name = name;
  }
}

const user = new User("前端小智");
```

**构造函数中的 name 参数的值为'前端小智'。如果没有定义该类的构造函数，则会创建一个默认的构造函数。默认的构造函数是一个空函数，它不修改实例。**

**同时，一个 JavaScript 类最多可以有一个构造函数。**

## 3.字段

类字段是保存信息的变量，字段可以附加到两个实体：

1. 类实例上的字段
2. 类本身的字段(也称为静态字段)

字段有两种级别可访问性：

1. public:该字段可以在任何地方访问
2. private:字段只能在类的主体中访问

### 3.1 公共实例字段

让我们再次看看前面的代码片段:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

表达式 this.name = name 创建一个实例字段名，并为其分配一个初始值。然后，可以使用属性访问器访问 name 字段

```js
const user = new User("前端小智");
user.name; // => '前端小智'
```

name 是一个公共字段，因为你可以在 User 类主体之外访问它。

当**字段在构造函数中隐式创建时**，就像前面的场景一样，可能获取所有字段。必须从构造函数的代码中破译它们。

class fields proposal 提案允许我们在类的主体中定义字段，并且可以立即指定初始值：

```js
class SomeClass {
  field1;
  field2 = "Initial value";

  // ...
}
```

接着我们修改 User 类并声明一个公共字段 name：

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }
}

const user = new User("前端小智");
user.name; // => '前端小智'
```

在类的主体中声明一个公共字段 name。

**以这种方式声明的公共字段具有表现力：快速查看字段声明就足以了解类的数据结构，而且，类字段可以在声明时立即初始化。**

```js
class User {
  name = "无名氏";

  constructor() {}
}

const user = new User();
user.name; // '无名氏'
```

类体内的 `name ='无名氏'`声明一个字段名称，并使用值'无名氏'对其进行初始化。

**对公共字段的访问或更新没有限制。可以读取构造函数、方法和类外部的公共字段并将其赋值。**

### 3.2 私有实例字段

**封装是一个重要的概念，它允许我们隐藏类的内部细节。使用封装类只依赖类提供的公共接口，而不耦合类的实现细节。**

当实现细节改变时，考虑到封装而组织的类更容易更新。

**隐藏对象内部数据的一种好方法是使用私有字段。这些字段只能在它们所属的类中读取和更改。类的外部世界不能直接更改私有字段。**

> 私有字段只能在类的主体中访问。

**在字段名前面加上特殊的符号#使其成为私有的，例如#myField。每次处理字段时都必须保留前缀#声明它、读取它或修改它。**

确保在实例初始化时可以一次设置字段#name：

```js
class User {
  #name;

  constructor(name) {
    this.#name = name;
  }

  getName() {
    return this.#name;
  }
}

const user = new User("前端小智");
user.getName(); // => '前端小智'

user.#name; // 抛出语法错误
```

#name 是一个私有字段。可以在 User 内访问和修改#name。方法 getName()可以访问私有字段#name。

但是，如果我们试图在 User 主体之外访问私有字段#name，则会抛出一个语法错误:SyntaxError: Private field '#name' must be declared in an enclosing class。

### 3.3 公共静态字段

我们还可以在类本身上定义字段:静态字段。这有助于定义类常量或存储特定于该类的信息。

要在 JavaScript 类中创建静态字段，请使用特殊的关键字 static 后面跟字段名:static myStaticField

让我们添加一个表示用户类型的新字段 type:admin 或 regular。静态字 TYPE_ADMIN 和 TYPE_REGULAR 是区分用户类型的常量:

```js
class User {
  static TYPE_ADMIN = "admin";
  static TYPE_REGULAR = "regular";

  name;
  type;

  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

const admin = new User("前端小智", User.TYPE_ADMIN);
admin.type === User.TYPE_ADMIN; // => true
```

static TYPE_ADMIN 和 static TYPE_REGULAR 在 User 类内部定义了静态变量。要访问静态字段，必须使用后跟字段名称的类：User.TYPE_ADMIN 和 User.TYPE_REGULAR。

### 3.4 私有静态字段

有时，我们也想隐藏静态字段的实现细节，在时候，就可以将静态字段设为私有。

要使静态字段成为私有的，只要字段名前面加上#符号:static #myPrivateStaticField。

假设我们希望限制 User 类的实例数量。要隐藏实例限制的详细信息，可以创建私有静态字段：

```js
class User {
  static #MAX_INSTANCES = 2;
  static #instances = 0;

  name;

  constructor(name) {
    User.#instances++;
    if (User.#instances > User.#MAX_INSTANCES) {
      throw new Error("Unable to create User instance");
    }
    this.name = name;
  }
}

new User("张三");
new User("李四");
new User("王五"); // throws Error
```

静态字段 User.#MAX_INSTANCES 设置允许的最大实例数，而 User.#instances 静态字段则计算实际的实例数。

这些私有静态字段只能在 User 类中访问，类的外部都不会干扰限制机制：这就是封装的好处。

## 4.方法

字段保存数据，但是修改数据的能力是由属于类的一部分的特殊功能实现的：方法。

JavaScript 类同时支持实例和静态方法。

### 4.1 实例方法

实例方法可以访问和修改实例数据。实例方法可以调用其他实例方法，也可以调用任何静态方法。

例如，定义一个方法 getName()，它返回 User 类中的 name：

```js
class User {
  name = "无名氏";

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const user = new User("前端小智");
user.getName(); // => '前端小智'
```

getName() { ... }是 User 类中的一个方法，getname()是一个方法调用:它执行方法并返回计算值(如果存在的话)。

在类方法和构造函数中，this 值等于类实例。使用 this 来访问实例数据:this.field 或者调用其他方法:this.method()。

在类方法和构造函数中，this 值等于类实例。使用 this 来访问实例数据:this.field 或者调用其他方法:this.method()。

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  nameContains(str) {
    return this.getName().includes(str);
  }
}

const user = new User("前端小智");
user.nameContains("前端"); // => true
user.nameContains("大冶"); // => false
```

nameContains(str) { ... }是 User 类的一种方法，它接受一个参数 str。不仅如此，它还执行实例 this.getName()的方法来获取用户名。

**方法也可以是私有的。为了使方法私有前缀，名称以＃开头即可**，如下所示：

```js
class User {
  #name;

  constructor(name) {
    this.#name = name;
  }

  #getName() {
    return this.#name;
  }

  nameContains(str) {
    return this.#getName().includes(str);
  }
}

const user = new User("前端小智");
user.nameContains("前端"); // => true
user.nameContains("大冶"); // => false

user.#getName(); // SyntaxError is thrown
```

#getName()是一个私有方法。在方法 nameContains(str)中，可以这样调用一个私有方法:this.#getName()。

由于是私有的，#getName()不能在用 User 类主体之外调用。

### 4.2 getters 和 setters

getter 和 setter 模仿常规字段，但是对如何访问和更改字段具有更多控制。在尝试获取字段值时执行 getter，而在尝试设置值时使用 setter。

为了确保 User 的 name 属性不能为空，我们将私有字段#nameValue 封装在 getter 和 setter 中:

```js
class User {
  #nameValue;

  constructor(name) {
    this.name = name;
  }

  get name() {
    return this.#nameValue;
  }

  set name(name) {
    if (name === "") {
      throw new Error(`name field of User cannot be empty`);
    }
    this.#nameValue = name;
  }
}

const user = new User("前端小智");
user.name; // getter 被调用, => '前端小智'
user.name = "王大冶"; // setter 被调用

user.name = ""; // setter 抛出一个错误
```

get name() {...} 在访问 user.name 会被执行。而 set name(name){…}在字段更新(user.name = '前端小智')时执行。如果新值是空字符串，setter 将抛出错误。

### 4.3 静态方法

静态方法是直接附加到类的函数，它们持有与类相关的逻辑，而不是类的实例。

要创建一个静态方法，请使用特殊的关键字 static 和一个常规的方法语法:`static myStaticMethod() { ... }`。

使用静态方法时，有两个简单的规则需要记住：

1. **静态方法可以访问静态字段。**
2. **静态方法不能访问实例字段。**

例如，创建一个静态方法来检测是否已经使用了具有特定名称的用户。

```js
class User {
  static #takenNames = [];

  static isNameTaken(name) {
    return User.#takenNames.includes(name);
  }

  name = "无名氏";

  constructor(name) {
    this.name = name;
    User.#takenNames.push(name);
  }
}

const user = new User("前端小智");

User.isNameTaken("前端小智"); // => true
User.isNameTaken("王大冶"); // => false
```

isNameTaken()是一个使用静态私有字段 User 的静态方法用于检查已取的名字。

**静态方法可以是私有的:`static #staticFunction() {...}`。同样，它们遵循私有规则:只能在类主体中调用私有静态方法。**

### 5. 继承: extends

JavaScript 中的类使用 extends 关键字支持单继承。
在 class Child extends Parent { }表达式中，Child 类从 Parent 继承构造函数，字段和方法。

例如，我们创建一个新的子类 ContentWriter 来继承父类 User。

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class ContentWriter extends User {
  posts = [];
}

const writer = new ContentWriter("John Smith");

writer.name; // => 'John Smith'
writer.getName(); // => 'John Smith'
writer.posts; // => []
```

ContentWriter 继承了 User 的构造函数，方法 getName()和字段 name。同样，ContentWriter 类声明了一个新的字段 posts。

**注意，父类的私有成员不会被子类继承。**

### 5.1 父构造函数：`constructor()`中的`super()`

**如果希望在子类中调用父构造函数，则需要使用子构造函数中可用的 super() 特殊函数**

例如，让 ContentWriter 构造函数调用 User 的父构造函数，以及初始化 posts 字段

```js
class User {
  name;

  constructor(name) {
    this.name = name + 1;
  }

  getName() {
    return this.name;
  }
}

class ContentWriter extends User {
  posts = [];

  constructor(name, posts) {
    super(name);
    // super()
    // this.name = name
    this.posts = posts;
  }
}

const writer = new ContentWriter("前端小智", ["Why I like JS"]);
writer.name; // => '前端小智'
writer.posts; // => ['Why I like JS']
console.log(writer);
```

子类 `ContentWriter` 中的 `super(name)` 执行父类 `User` 的构造函数

**注意：在使用 this 关键字之前，必须在子构造函数中执行 super()。调用 super() 确保父构造函数初始化实例。**

```js
class Child extends Parent {
  constructor(value1, value2) {
    //无法工作
    this.prop2 = value2;
    super(value1);
  }
}
```

### 5.2 父实例:方法中的`super`

**如果希望在子方法中访问父方法，可以使用特殊的快捷方式 super。**

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class ContentWriter extends User {
  posts = [];

  constructor(name, posts) {
    super(name + "1");
    this.posts = posts;
  }

  getName() {
    const name = super.getName();
    console.log(name);
    if (name === "") {
      return "无名氏";
    }
    return name;
  }
}

const writer = new ContentWriter("前端小智", ["Why I like JS"]);
console.log(writer.getName()); // => '无名氏'
```

**子类 ContentWriter 的 getName()直接从父类 User 访问方法 super.getName()，这个特性称为方法重写。**

注意，也可以在静态方法中使用 super 来访问父类的静态方法。

## 6.对象类型检查：`instanceof`

`object instanceof Class` 是确定 object 是否为 Class 实例的运算符，来看看示例：

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const user = new User("前端小智");
const obj = {};

user instanceof User; // => true
obj instanceof User; // => false
```

user 是 User 类的一个实例，user instanceof User 的计算结果为 true。

空对象{}不是 User 的实例，相应地 obj instanceof User 为 false。

instanceof 是多态的:操作符检测作为父类实例的子类。

```js
class User {
  name;

  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class ContentWriter extends User {
  posts = [];

  constructor(name, posts) {
    super(name);
    this.posts = posts;
  }
}

const writer = new ContentWriter("前端小智", ["Why I like JS"]);

writer instanceof ContentWriter; // => true
writer instanceof User; // => true
```

writer 是子类 ContentWriter 的一个实例。运算符 writer instanceof ContentWriter 的计算结果为 true。

同时 ContentWriter 是 User 的子类。因此 writer instanceof User 结果也为 true。

如果想确定实例的确切类，该怎么办?可以使用构造函数属性并直接与类进行比较

```js
writer.constructor === ContentWriter; // => true
writer.constructor === User; // => false
```

## 7. 类和原型

必须说 JS 中的类语法在从原型继承中抽象方面做得很好。但是，类是在原型继承的基础上构建的。每个类都是一个函数，并在作为构造函数调用时创建一个实例。

以下两个代码段是等价的。

```js
class User {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const user = new User("前端小智");

user.getName(); // => '前端小智'
user instanceof User; // => true
```

使用原型的版本：

```js
function User(name) {
  this.name = name;
}

User.prototype.getName = function () {
  return this.name;
};

const user = new User("前端小智");

user.getName(); // => '前端小智'
user instanceof User; // => true
```

## 8. 类的可用性

这篇文章中的类的一些特性有些还在分布第三阶段的提案中。在 2019 年底，类的特性分为以下两部分：

- 公共和私有实例字段是 Class fields proposal 建议的一部分
- 私有实例方法和访问器是 Class private methods proposal 建议的一部分

其余部分为 ES6 标准的一部分。

## 9. 总结

1. JavaScript 类用构造函数初始化实例，定义字段和方法。甚至可以使用 static 关键字在类本身上附加字段和方法。
2. 继承是使用 extends 关键字实现的:可以轻松地从父类创建子类，super 关键字用于从子类访问父类。
3. 要利用封装，将字段和方法设为私有以隐藏类的内部细节，私有字段和方法名必须以#开头。

## 参考

- [你需要知道的 JavaScript 类(class)的这些知识](https://mp.weixin.qq.com/s?__biz=MzI0NDQ0ODU3MA==&mid=2247486086&idx=1&sn=14454497e94e211c4765dbea87c6a74f&chksm=e95ce6d3de2b6fc569ebb3196fb30cecec152085e4e4e646c187dc7b25a42900bc64411a51f7&token=1734057872&lang=zh_CN#rd)
