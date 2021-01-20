## 前言

#### 如何在浏览器中查看页面渲染时间

1. 打开开发者工具: 点击 Performance 左侧有个小圆点 点击刷新页面会录制整个页面加载出来 时间的分配情况。如下图
   ![img](https://user-gold-cdn.xitu.io/2020/3/6/170af50e460d9a23?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

   - 蓝色: 网络通信和 HTML 解析
   - 黄色: JavaScript 执行
   - 紫色: 样式计算和布局, 即重排
   - 绿色: 重绘

   哪种色块比较多, 就说明性能耗费在那里。色块越长, 问题越大

2. 点击 Event Log: 单独勾选 Loading 项会显示 html 和 css 加载时间。如下图
   ![img](https://user-gold-cdn.xitu.io/2020/3/6/170af5139b7ba71b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

3. 解析完 DOM + CSSOM 之后会生成一个渲染树 Render Tree, 就是 DOM 和 CSSOM 的一一对应关系

4. 通过渲染树中在屏幕上"画"出的所有节点, 称为渲染

## CSS 重排和重绘

#### 慎重选择高消耗的样式

什么 CSS 属性是高消耗的? 就是那些绘制前需要浏览器进行大量计算的属性

- box-shadows
- border-raidus
- transparency
- transforms
- CSS filters(性能杀手)

#### 什么是 reflow?

浏览器为了重新渲染部分或整个页面, 重新计算页面元素位置和几何结构的进程叫做 reflow

通俗点来说就是当开发人员定义好了样式后(也包括浏览器默认样式), 浏览器根据这些来计算并根据结果将元素放到他应该出现的位置上, 这个过程叫做 reflow

由于 reflow 是一种浏览器中的用户拦截操作, 所以我们将了解如何减少 reflow 次数, 及 DOM 的层级, css 效率对 reflow 次数的影响是十分有必要的

reflow(回流)是导致 DOM 脚本执行效率低的关键因素之一, **页面上任何一个节点触发了 reflow, 会导致它的子节点及祖先节点重新渲染**

简单解释一下 Reflow: **当元素改变的时候, 将会影响文档内容或结构, 或者元素位置, 此过程成为 Reflow**

###### 全局范围重排

下面是一个全局范围重排的栗子:

```html
<body>
  <div class="hello">
    <h4>hello</h4>
    <p><strong>Name:</strong>BDing</p>
    <h5>male</h5>
    <ol>
      <li>coding</li>
      <li>loving</li>
    </ol>
  </div>
</body>
```

当 p 节点上 reflow 时, hello 和 body 也会重新渲染, 甚至 h5 和 ol 都会受到影响

###### 局部范围重排

> 用局部布局来解释这种现象: 把一个 dom 的宽高之类的几何信息定死, 然后在 dom 内部触发重排, 就只会渲染 dom 内部的元素, 而不会影响到外界

###### 什么时候会导致 reflow 发生呢?

1. 改变窗口大小
2. 改变元素尺寸, 边距, 填充, 边框, 高度, 宽度
3. 添加/删除可见的 DOM 元素
4. 内容的改变(用户在输入框中写入内容也会)
5. 激活伪类, 如 :hover
6. 操作 class 属性
7. 脚本操作 DOM
8. 计算 (offsetLeft/Top/Height/Width, cliendTop/Left/Width/Height, scrollTop/Left/Height/Width, width/height, getComputedStyle(), currentStyle(IE)), 我们在开发中, 应该谨慎地使用这些 style 请求, 注意上下文关系, 避免一行代码一个重排, 这对性能是个巨大的消耗
9. 设置 style 属性

| 常见的重排元素 |              |             |               |
| :------------- | :----------- | :---------- | :------------ |
| width          | height       | padding     | margin        |
| display        | border-width | border      | top           |
| position       | font-size    | float       | text-align    |
| overflow-y     | font-weight  | overflow    | left          |
| font-family    | right        | line-height | verticl-align |
| clear          | white-space  | bottom      | min-height    |

###### 减少 reflow 对性能的影响的建议

1. 不要一条一条地修改 DOM 样式, 预先定义好 class, 然后修改 DOM 的 className
2. 避免设置大量的 style 属性, 因为通过设置 style 属性改变节点样式的话, 每一次设置都会触发一次 reflow, 可以集中设置样式, 即利用浏览器的 flush 队列, 最好是使用 class 属性
3. 把 DOM 离线后修改, 比如: 先把 DOM 给 display:none(有一次 Reflow), 然后你修改 100 次, 然后在把它显示出来
4. 分离读写操作
5. 不要经常访问浏览器的 flush 队列属性, 如果一定要访问, 可以利用缓存, 将访问的值存储起来, 接下来使用就不会再引发回流
6. 不要把 DOM 节点的属性值放在一个循环里当成循环里的变量
7. 为动画的元素使用绝对定位 absolute / fixed, 元素脱离了文档流, 他的变化不会影响到其他元素
8. 动画使用 GPU 加速
9. 如果需要创建多个 DOM 节点, 可以使用 DocumentFragment 创建完成后一次性的加入 document
10. 动画实现的速度的选择, 比如实现一个动画, 以 1 个像素为单位移动这样最平滑, 但是 reflow 就会过于频繁, 大量消耗 CPU 资源, 如果以 3 个像素为单位移动则会好很多
11. 不要使用 table 布局, 因为 table 中某个元素一旦触发了 reflow, 那么整个 table 的元素都会触发 reflow, 那么在不得已使用的 table 的场合, 可以设置 table-layout: fixed 或者 auto 这样可以让 table 一行一行的渲染, 这种做法也是为了限制 reflow 的影响范围
12. 尽可能限制 reflow 的影响范围, 尽可能在低层级的 DOM 节点上, 上述例子中, 如果你要改变 p 的样式, class 就不要加在 div 上, 通过父元素去影响子元素不好
13. 如果 CSS 里面有计算表达式, 每次都会重新计算一遍, 触发一次 reflow
14. 使用 cloneNode(true or false) 和 replaceChild 技术, 引发一次回流和重绘

**table 及其内部元素可能需要多次计算才能确定好其在渲染树中节点的属性值, 比同等元素要多花两倍时间, 这就是我们尽量避免使用 table 布局页面的原因之一**

###### 一些操作栗子

<!-- 使用 DocumentFragment -->

```javascript
var fragment = document.createDocumentFragment();

var li = document.createElement("li");
li.innerHTML = "apple";
fragment.appendChild(li);

var li = document.createElement("li");
li.innerHTML = "watermelon";
fragment.appendChild(li);

document.getElementById("fruit").appendChild(fragment);
```

```javascript
div.style.left = "10px";
div.style.top = "10px";
div.style.width = "20px";
div.style.height = "20px";
```

> 根据重绘的触发条件, 上面这段代码理论上会触发 4 次重排+重绘, 因为每一次都改变了元素的集合属性, 实际上只触发了最后一次重排, 这得益于浏览器自己的渲染队列优化机制

强制刷新队列:

```javascript
div.style.left = "10px";
console.log(div.offsetLeft);
div.style.top = "10px";
console.log(div.offsetTop);
div.style.width = "20px";
console.log(div.offsetWidth);
div.style.height = "20px";
console.log(div.offsetHeight);
```

上面专断代码会触发 4 此重排+重绘, 因为在 console 中请求的这几个样式信息, 无论何时浏览器都会立即执行渲染队列的任务, 即使该值与操作中修改的值没有关联

> 因为队列中, 可能会有影响到这些值的操作, 为了给我们最精确的值, 浏览器会立即重排+重绘

###### 重排优化建议

1. 分离读写操作

```javascript
div.style.left = "10px";
div.style.top = "10px";
div.style.width = "20px";
div.style.height = "20px";
console.log(div.offsetLeft);
console.log(div.offsetTop);
console.log(div.offsetWidth);
console.log(div.offsetHeight);
```

> 还是上面的触发 4 次重排+重绘的代码, 这次只触发了一次重排
> 在第一个 console 的时候, 浏览器把之前上面的四个写操作的渲染队列都给清空了, 剩下的 console, 因为渲染队列本来就是空的, 所以并没有触发重排, 仅仅拿值而已

2. 样式集中改变

```javascript
div.style.left = "10px";
div.style.top = "10px";
div.style.width = "20px";
div.style.height = "20px";
```

虽然现在大部分浏览器有渲染队列优化, 不排除有些浏览器以及老版本的浏览器效率仍然低下

建议通过改变 class 或者 cssText 属性集中改变样式

```javascript
// bad
var left = 10;
var top = 10;
el.style.left = left + "px";
el.style.top = top + "px";
// good
el.className += " theclassname";
// good
el.style.cssText += `; left: ${left}px; top: ${top}px;`;
```

3. 缓存布局信息

```javascript
// bad 强制刷新, 触发两次重排
div.style.left = div.offsetLeft + 1 + "px";
div.style.top = div.offsetTop + 1 + "px";

// good 缓存布局信息, 相当于读写分离
var curLeft = div.offsetLeft;
var curTop = div.offsetTop;
div.style.left = curLeft + 1 + "px";
div.style.top = curTop + 1 + "px";
```

4. 离线改变 DOM

- 隐藏要操作的 dom
  在要操作 dom 之前, 通过 display 隐藏 dom, 当操作完成后, 才将元素的 display 属性为可见, 因为不可见的元素不会触发重排和重绘

  ```javascript
  dom.display = "none";
  // ...
  // 修改 dom 样式
  // ...
  dom.display = "block";
  ```

- 通过使用 DocumentFragment 创建一个 dom 碎片, 在它上面批量操作 dom, 操作完成后, 再添加到文档中, 这样只会触发一次重排

- 复制节点, 在副本上工作, 然后替换他

5. position 属性为 absolute 或 fixed
   position 属性为 absolute 或 fixed 的元素, 重排开销比较小, 因为 position 的元素脱离了文档流, 不用考虑它对其他元素的影响

6. 优化动画

- 可以把动画效果应用到 position 属性为 absolute 或 fixed 的元素上, 这样对其他元素的影响较小
  动画效果还应牺牲一些平滑性, 来换取速度, 这中间的度自己衡量
  比如实现一个动画, 以 1 个像素为单位移动这样是最平滑的, 但是 reflow 就会过于频繁, 大量消耗 CPU 资源, 如果以 3 个像素为单位移动则会好很多
- 启用 GPU 加速
  **GPU(图像加速器)**
  GPU 硬件加速是指应用 GPU 的图形性能将浏览器对图形的一些操作交由 GPU 来完成, 因为 GPU 是专门为处理图形而设计, 所以他在速度和能耗上更有效率

  ```javascript
  /**
   * 根据上面的结论
   * 将 2d transform 换成 3d
   * 就可以强制开启 GPU 加速
   * 提高动画性能
   */
  div {
    transform: translate3d(10px, 10px, 0);
  }
  ```

#### 重绘(redraw 或 repaint)

repaint 是在一个元素的外观被改变, 但没有改变布局的情况下发生的, 如改变了 visibility, outline, background 等, 当 repaint 发生时, 浏览器会验证 DOM 树上所有其他节点的 visibility 属性

重绘是指一个元素外观的改变所触发的浏览器行为, 浏览器会根据元素的新属性重新绘制, 使元素呈现新的外观

通俗来说, 就是当各种盒子的位置, 大小, 以及其他属性, 例如颜色, 字体都确定下来后, 浏览器便把这些元素都按照各自的特性绘制一遍, 于是页面的内容出现了, 这个过程叫做 Repaint

**重绘触发的条件: 改变元素外观属性, 如 color, background-color 等**

###### 避免过分重绘(Repaints)

当元素改变的时候, 将不会影响元素在页面当中的位置(比如 background-color, border-color, visibility), 浏览器仅仅会应用新的样式重绘此元素, 此过程成为 Repaint

| 常见的重绘元素  |                  |                     |                   |
| :-------------- | :--------------- | :------------------ | :---------------- |
| color           | border-style     | visibility          | background        |
| text-decoration | background-image | background-position | background-repeat |
| outline-color   | outline-style    | outline             | outline-width     |
| border-radius   | box-shadow       | background-size     |                   |

###### 优化动画

CSS3 动画是优化中的重中之重, 除了做到上面两点, 减少 Reflow 和 Repaints 之外, 还需要注意一下方面

###### 启用 GPU 硬件加速

GPU(Graphics Procession Unit) 是图像处理器, GPU 硬件加速是指利用 GPU 的图形性能对浏览器中的一些图形操作交给 GPU 来完成, 因为 GPU 是专门处理图形而设计, 所以他在速度和能耗上更有效率
GPU 加速不仅可以应用 3D, 而且也可以应用于 2D, 这里, GPU 加速通常包括以下几个部分:

- Canvas2D
- 布局合成(Layout Compositing)
- CSS3 转换(transitions)
- CSS3 3D 变换(transform)
- WebGL
- 视频(video)

```css
/**
 * 根据上面的结论
 * 将 2d transform 换成 3d
 * 就可以强制开启 GPU 加速
 * 提高动画性能
 */
div {
  transform: translate(10px, 10px);
}
div {
  transform: translate3d(10px, 10px, 0);
}
```

###### 重绘(redraw 或 repaint) 与 重排(reflow)

当渲染树中的一部分或者全部因为元素的规模尺寸, 布局, 隐藏等改变而需要重新构建, 这就称为回流(reflow), 每个页面至少需要一次回流, 就是页面第一次加载的时候

- 重绘和重排的关系
  **在回流的时候, 浏览器会使渲染树中受到影响的部分失效, 并重新构造这部分渲染树, 完成回流后, 浏览器会重新绘制受影响的部分到屏幕中, 该过程称为重绘**

**所以, 重排必定会引发重绘, 重绘不一定会引发重排**

#### 浏览器的渲染机制

浏览器渲染展示网页的过程, 大致分为以下几个步骤:

1. 解析 HTML(HTML Parser)
2. 构建 DOM 树(DOM Tree)
3. 渲染树构建(Render Tree)
4. 绘制渲染树(Painting)

![img](https://img-blog.csdnimg.cn/20190812185555585.png)

WebKit 工作原理(Chrome、Safari、Opera)

![img](https://img-blog.csdnimg.cn/20190809142251282.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3Njc0NDM5,size_16,color_FFFFFF,t_70)

Gecko 工作原理(FireFox)

![img](https://img-blog.csdnimg.cn/20190812185411949.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3Njc0NDM5,size_16,color_FFFFFF,t_70)

#### DOM Tree 和 CSSOM Tree 的区别

- DOM 树
  - 浏览器把获取到的 html 代码解析成一个 DOM 树, html 中的每个标签都是 DOM 树中的一个节点, 根节点就是我们常用的 document 对象
  - DOM 树里面包含了所有的 html 标签, 包括 display:none 隐藏, 还有用 JS 动态添加的元素等
- CSSOM 树
  - CSS 下载完成之后对 CSS 进行解析, 解析成 CSS 对象, 然后把 CSS 对象组装起来, 构建 CSSOM 树
- Render Tree
  - CSSOM 树 和 DOM 树连接在一起(一一对应)形成一个 Render Tree, 渲染树用来计算可见元素的布局并且作为将像素渲染到屏幕上的过程的输入
- 渲染树会忽略 display:none 的元素

#### 浏览器运行机制图

![img](https://img-blog.csdnimg.cn/20190810220138145.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3Njc0NDM5,size_16,color_FFFFFF,t_70)

###### 浏览器的运行机制:

1. 构建 DOM 树(parse): 渲染引擎解析 HTML 文档, 首先将标签转换成 DOM 树中的 DOM 节点序列化, 即 token(包括 js 生成的标签和 display: none 的标签) 生成内容树(Content Tree/DOM Tree)
2. 构建 CSSOM 树(parse): 解析对应的 CSS 样式文件信息(包括 js 生成的样式和外部 css 文件), 生成 CSSOM 树
3. 构建渲染树(construct Render Tree): 将生成的 DOM 树 以及 CSSOM 树 连接在一起, 他们之间的连接是一一对应的, 会形成一个 Render Tree, 即构建渲染树(Render Tree/Frame Tree), Render Tree 能识别 style, Render Tree 中的每个节点都有自己的 style, 且 Render Tree 不包含隐藏的节点(如 display: none 以及 head 节点), visibility: hidden 会包含到 Render Tree 中, 因为 vibisility 会影响到布局, 会占有空间
4. 布局渲染树(reflow/layout): 从根节点递归调用, 计算每一个元素的大小, 位置等, 给出每个节点所应该在屏幕上出现的精确坐标
5. 绘制渲染树(paint/repaint): 遍历渲染树, 使用 UI 后端层来绘制每个节点到浏览器

**第 4 步和第 5 步是最耗时的部分, 这两步合起来, 就是我们通常所说的渲染**

###### 渲染的三个阶段

- Layout: 重排, 又叫回流
- Paint: 重绘(重排, 重绘这些步骤都是在 CPU 中发生的)
- Composite Layers: CPU 把生成的 BitMap(位图) 传输到 GPU, 渲染到屏幕

###### 渲染顺序

![img](https://user-gold-cdn.xitu.io/2019/1/10/16836f8fa40fd40d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 当浏览器拿到一个网页后, 首先浏览器会解析 HTML, 如果遇到了外链 css, 会一边下载 css, 一边解析 HTML
2. 当 css 下载完成后, 会继续解析 css, 生成 css Rules tree(即 CSSOM Tree), 不会影响到 HTML 的解析
3. 当遇到 `<script>` 标签时, 一旦发现 有对 javascript 的引用, 就会立即下载脚本, 同时阻断文档的解析, 等脚本执行完成后, 再开始文档的解析

![img](https://user-gold-cdn.xitu.io/2019/1/10/16837049dfc8bf00?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

4. 当 DOM 树和 CSS 规则树生成之后, 构造 Rendering Tree
5. 调用系统渲染页面

#### 浏览器的优化

浏览器会维护 1 个队列, 把所有会引起回流, 重绘的操作放入这个队列, 等队列中的操作到了一定的数量或者到了一定的时间间隔, 浏览器就会 flush 队列, 进行下一个批处理, 这样就会让多次回流以及重绘变成一次回流重绘

#### 性能优化之合成层

提升为合成层简单说来有以下几点好处:

1. 合成层的位图, 会交由 GPU 合成, 比 CPU 处理要快
2. 当需要 repaint 时, 只需要 repaint 本身, 不会影响到其他的层
3. 对于 transform 和 opacity 效果, 不会触发 layout 和 paint

###### 1. 提升动画效果的元素

合成层的好处是不会影响到其他元素的绘制, 因此, 为了减少动画元素对其他元素的影响, 从而减少 paint, 我们需要把动画效果中的元素提升为合成层

提升合成层的最好方式是使用 CSS 的 will-change 属性。从上一节合成层产生原因中, 可以知道 will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层

```css
#target {
  will-change: transform; // 兼容性除了 IE
}
/* 对于那些目前还不支持 will-change 属性的浏览器 */
/* 目前常用的是使用一个 3D transform 属性来强制提升为合成层 */
#target {
  transform: translateZ(0);
}
```

**但需要注意的是，不要创建太多的渲染层。因为每创建一个新的渲染层，就意味着新的内存分配和更复杂的层的管理**
如果你已经把一个元素放到一个新的合成层里，那么可以使用 Timeline 来确认这么做是否真的改进了渲染性能。别盲目提升合成层，一定要分析其实际性能表现

###### 2. 使用 transform 或者 opacity 来实现动画效果

其实从性能方面考虑，最理想的渲染流水线是没有布局和绘制环节的，只需要做合成层的合并即可

![img](https://user-gold-cdn.xitu.io/2019/6/4/16b217cd86562f97?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 为了实现上述效果, 就需要只使用那些仅触发 Composite 的属性。目前, 只有两个属性是满足这个条件的: transforms 和 opacity

###### 3. 减少绘制区域

对于不需要重新绘制的区域应尽量避免绘制，以减少绘制区域，比如一个 fix 在页面顶部的固定不变的导航 header，在页面内容某个区域 repaint 时，整个屏幕包括 fix 的 header 也会被重绘。
而对于固定不变的区域，我们期望其并不会被重绘，因此可以通过之前的方法，将其提升为独立的合成层。

###### 4. 合理管理合成层: 创建一个新的合成层并不是免费的，它得消耗额外的内存和管理资源。实际上，在内存资源有限的设备上，合成层带来的性能改善，可能远远赶不上过多合成层开销给页面性能带来的负面影响

> 在做 css 动画的时候减少使用 width, margin, padding 等影响 CSS 布局的规则, 可以使用 CSS3 的 transform 代替, 另外值得注意的是, 在加载大量的图片元素时, 尽量预先限定图片的尺寸大小, 否则在图片加载过程中会更新图片的排版信息, 产生大量的重排
