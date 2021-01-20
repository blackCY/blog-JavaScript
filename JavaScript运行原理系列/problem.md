# problem

## 一旦 setInterval 的回调函数 fn 执行时间超过了延迟时间 ms，那么就完全看不出来有时间间隔了. 那么在 fn 执行的时候, 上一个 fn 还未出栈, 下一个 fn 就入栈, 那么实际情况是怎么样的, 可以使用 定时器嵌套定时器来模拟

## 执行栈的深入理解

## 微任务是在浏览器渲染之前, 还是渲染之后

![Snipaste_2020-09-04_16-14-27](E:\Snipaste_Image\Snipaste_2020-09-04_16-14-27.png)

<https://blog.csdn.net/weixin_30612769/article/details/98299037>

## 事件循环待补充:

<https://juejin.im/post/6844903762910248968> -> 评论区

## Promise/async/await 具体的东西: 参照这里

<https://juejin.im/post/6844904019240943623#heading-20>
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction>

```javascript
console.log("script start");
async function async1() {
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2 end");
}
setTimeout(function () {
  console.log("setTimeout");
}, 0);
new Promise((resolve) => {
  console.log("Promise");
  resolve();
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });
async1();
console.log("script end");
```

```javascript
Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  });

Promise.resolve()
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(4);
  });
```

## MutationObserver 实现 microtask

<https://javascript.ruanyifeng.com/dom/mutationobserver.html>
[参考文章](https://juejin.im/post/6844903553795014663)
<https://juejin.im/post/6844904065059536909>
<https://www.jianshu.com/p/b62edf502844>
<https://github.com/qq449245884/xiaozhi/issues/10>

## unread

[【JS 口袋书】第 4 章：JS 引擎底层的工作原理](https://mp.weixin.qq.com/s/smCPs34nTI6tzC9OFQf1JA)
