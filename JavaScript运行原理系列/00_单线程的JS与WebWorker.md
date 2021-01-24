# 单线程的 JS 与 WebWorker

## JavaScript 解释器

什么叫做 JavaScript 解释器? 简单来说, JavaScript 解释器就是能够 "读懂" JavaScript 代码, 并准确地给出代码运行结果的一段程序

**所以 JavaScript 解释器, 又称为 JavaScript 解析引擎, 又称为 JavaScript 引擎, 也可以称为 JavaScript 内核, 在线程方面又称为 JavaScript 引擎线程**, 比较有名的是 Chrome V8 引擎(用 C/C++ 编写), (除此之外还有 IE9 的 Chakra, Firefox 的 TraceMonkey), 它是基于事件驱动单线程执行的, JavaScript 引擎一直等待着任务队列中任务的到来, 然后加以处理, 浏览器无论什么时候都只有一个 JavaScript 线程在运行 JavaScript 程序

学过编译原理的人都知道, 对于静态语言来说(如 Java/C++/C), 处理上述这些事情的叫做编译器(Complier), 相应地对于 JavaScript 这样的动态语言则叫做解释器(Interpreter). 这两者的区别用一句话概括就是: 编译器是将源代码编译为另外一种代码(比如机器码, 或者字节码), 而解释器是直接解析并将代码运行结果输出. 但我们无需过多在这些点上纠结. 因为比如 V8, 他其实是为了提高 JavaScript 的运行机制, 会在运行之前将 JavaScript 编译为本地的机器码然后再去执行, 这样速度就会快很多, 相信大家对 JIT(Just In Time Complication) 一定不陌生吧.

JavaScript 解释器和我们平时讨论的 ECMAScript 有很大的关系, 标准的 JavaScript 解释器会根据 ECMAScript 标准去实现文档中对语言规定的方方面面, 但由于这不是一个强制措施, 所以也有不按标准来实现的解释器, 比如 IE6, 这也是一致困扰前端开发的一个来由--兼容问题.

## 单线程的 JavaScript

我们都知道 JS 是单线程的, 那单线程是怎么实现异步的呢? 事实上所谓的"JS 是单线程的"只是指 JS 的主运行线程只有一个, 而不是整个运行环境都是单线程。JS 的运行环境主要是浏览器, 以大家都很熟悉的 Chrome 的内核为例, 他不仅是多线程的, 而且是多进程的

JS 的单线程, 与他的用途有关. 作为浏览器脚本语言, JavaScript 的用途主要是和用户互动, 以及操作 DOM, 这决定了它只能是单线程, 否则会带来很复杂的同步问题, 比如, 假定 JavaScript 有两个线程, 一个线程在某个 DOM 节点上添加内容, 另一个删除了这个节点, 这时浏览器应该以哪个线程为准? 当然我们可以通过锁来解决上面的问题, 但是为了避免因为引入了锁而带来的更大的复杂性, 所以从一诞生, JavaScript 就是单线程

还有人说 JS 还有 Worker 线程, 对的, 为了发挥多核 CPU 的计算能力, HTML5 提出 Web Worker 标准, 允许 JavaScript 脚本创建多个线程, 并发的执行代码, 从而实现了对浏览器端多线程编程的良好支持. 但是, 子线程完全是受主线程控制的, 而且不得操作 DOM, 所以, 这个操作并没有改变 JavaScript 是单线程的本质

## 页面卡顿的真正原因

由于 JavaScript 是可操作 DOM 的, 如果在修改这些元素属性同时渲染界面(即 JavaScript 线程和 UI 线程同时运行), 那么渲染线程前后获得的元素数据就可能不一致了. 为了防止渲染出现不可预期的效果, 浏览器设置 UI 渲染线程与 JavaScript 引擎线程为互斥关系, 当 JavaScript 引擎线程执行时 UI 渲染线程会被挂起, UI 更新会被保存在一个队列中等到 JavaScript 引擎线程空闲时立即被执行

于是, 我们便明白了: 假设一个 JavaScript 代码执行的时间过长, 这样就会造成页面的渲染不连贯, 导致页面渲染出现 "加载阻塞" 的现象, 当然, 针对 DOM 的大量操作也会造成页面出现卡顿现象, 毕竟我们经常说: DOM 天生就很慢

所以, 当你需要考虑性能优化时就可以从如上原因出发, 大致有以下几个努力的方面:

1. 减少 JavaScript 加载对 DOM 渲染的影响(将 JavaScript 代码的加载逻辑放在 HTML 文件的尾部, 减少对渲染引擎呈现工作的影响)
2. 减少重排与重绘(避免白屏, 或者交互过程中的卡顿)
3. 减少 DOM 的层级(可以减少渲染引擎工作过程中的计算量)
4. 使用 requestAnimationFrame 来实现视觉变化(一般来说我们会使用 setTimeout 或 setInterval 来执行动画之类的视觉变化, 但这种做法的问题是, 回调将在帧中的某个时点运行, 可能刚好卡在末尾, 而这可能经常会使我们丢帧, 导致卡顿)

## WebWorker, JS 的多线程

JavaScript 引擎是单线程的, 而且 JavaScript 执行时间过长会阻塞页面, 那么 JavaScript 就真的对 CPU 密集型计算无能为力吗?

所以, 后来 HTML5 中支持了 Web Worker

### MDN 的官方解释是

Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法. 线程可以执行任务而不干扰页面, 一个 worker 是使用一个构造函数创建的一个对象(eg: Worker())来运行一个命名的 JavaScript 文件, 这个文件包含将在工作线程中运行的代码, workers 运行在另一个全局上下文中, 不同于当前的 window, 因此, 使用 window 快捷方式获取当前全局的范围(而不是 self)在一个 Worker 内部返回错误

这样理解下:

- 创建 Worker 时, JS 引擎向浏览器申请开一个子线程(子线程是浏览器开的, 完全受主线程控制, 而且不能操作 DOM)
- JS 引擎线程与 worker 线程间通过特定的方式通信(postMessage API, 需要通过序列化对象来与线程交互特定的数据)

所以, 如果有非常耗时的工作, 请单独开一个 Worker 线程, **这样里面不管如何翻天覆地都不会影响 JS 引擎主线程, 只待计算出结果后, 将结果通信给主线程即可**

- **而且注意下: JS 引擎是单线程的, 这一点的本质仍然未改变, Worker 可以理解是浏览器给 JS 引擎开的外挂, 专门用来解决那些大量的计算问题**

## WebWorker 与 SharedWorker

既然都到了这里, 就再提一下 SharedWorker(避免后续将这两个概念搞混)

- WebWorker 只属于某个页面, 不会和其他页面的 Render 进程(浏览器内核进程)共享
  所以 Chrome 在 Render 进程中(每一个 Tab 也就是一个 render 进程)创建一个新的线程来运行 Worker 中的 JavaScript
- SharedWorker 是浏览器所有页面共享的, 不能采用与 Worker 同样的方式实现, 因为它不隶属于某个 Render 进程, 可以为多个 Render 进程共享使用
  所以 Chrome 浏览器为 SharedWorker 单独创建一个进程来运行 JavaScript 程序, 在浏览器中每个相同的 JavaScript 只存在于一个 SharedWorker 进程, 不管他被创建多少次
- **看到这里吗应该就很容易明白了, 本质上就是进程和线程的区别, SharedWorker 由独立的进程管理, WebWorker 只是属于 Render 进程下的一个线程**
