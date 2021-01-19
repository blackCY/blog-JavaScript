# null 和 undefined 的区别

- null
  - Number(null) 等于 0
  - 作为函数的参数，表示该函数的参数不是对象
  - 作为对象原型链的重点，`Object.prototype.__proto__ = null`
- undefined
  - Number(undefined) 得到 undefined
  - 变量被声明但是没有赋值，等于 undefined
  - 调用函数时，对应的参数没有提供，也是 undefined
  - 对象没有赋值，这个属性的值为 undefined
  - 函数没有返回值，默认

## 参考

- [基础](https://github.com/LiangJunrong/document-library/blob/master/%E7%B3%BB%E5%88%97-%E9%9D%A2%E8%AF%95%E8%B5%84%E6%96%99/JavaScript/%E5%9F%BA%E7%A1%80.md#chapter-three)
