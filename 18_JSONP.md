# JSONP

## 什么是同源策略

在谈 JSONP 之前首先要简单说一说同源政策

## 什么是同源政策

同源政策很简单，它的含义是指两个网页：

- 协议相同
- 域名相同
- 端口相同

一旦以上三点中有任意一点不同，两个网站都不能称为同源。举例：

```bash
http://www.example.com/xxx
http://www.example.com/yyy
以上两个网站是同源的，满足协议,域名,端口都相同(http协议默认端口为80)
---------------------------
http://example.com/xxx
http://www.example.com/xxx
以上两个网站是非同源的，因为域名不同
---------------------------
http://127.0.0.1:8080/xxx
http://127.0.0.1:8888/xxx
```

以上两个网站是非同源的，因为端口号不同

## 为什么要有同源政策

同源政策的目的其实就是为了保证用户信息的安全，防止恶意的网站数据窃取。
在阮一峰的博客中，在同源政策一节中对其作用描述如下：
"设想这样一种情况：

```bash
A网站是一家银行，用户登录以后，又去浏览其他网站。
如果其他网站可以读取A网站的 Cookie，会发生什么？
很显然，如果 Cookie 包含隐私（比如存款总额），这些信息就会泄漏。
更可怕的是：
Cookie 往往用来保存用户的登录状态。
如果用户没有退出登录，其他网站就可以冒充用户，为所欲为。"
```

所以自 1995 起，"同源政策"由网景引入浏览器后，所有浏览器都开始效仿了这一政策。不过同源政策带来的安全保障的同时，也带来了一些限制，其中一个限制就是**AJAX 请求不能发送**。

## 聊一聊 XMLHttpRequest

上文说到同源政策的限制之一就是 AJAX 请求无法发送，我们知道 AJAX 的核心就是 XMLHttpRequest，所以借机我也简单谈一谈 XMLHttpRequest。先看一个示例：

在我的 hosts 文件中，我事先已经写好了 ip 与域名的映射。

![](https://user-gold-cdn.xitu.io/2019/5/19/16ad02e81133b719?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

代码如下：

```js
var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("Please appoint the port number\n Like node server.js 8888");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  var query = parsedUrl.query;
  var path = parsedUrl.pathname;
  if (path.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var method = request.method;
  console.log("HTTP Path:\n" + path);
  if (path === "/") {
    // sync是同步,async代表异步
    let string = fs.readFileSync("./index.html", "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(string);
    response.end();
  } else if (path === "/xxx") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/json;charset=utf-8");
    response.write(`
      {
        "info":{
          "name":"DobbyKim",
          "age":"25",
          "hobby":"唱跳rap篮球",
          "girlfriend":"rightHand"
        }
      } 
    `);
    response.end();
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write("wrong");
    response.end();
  }

  console.log(method + "" + request.url);
});

server.listen(port);
console.log("Listen" + port + "Success\n Please open http://localhost:" + port);
```

前端代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>你咬我啊</title>
  </head>
  <body>
    <button id="btn">你咬我啊</button>
    <script>
      btn.addEventListener("click", () => {
        // 创建XMLHttpRequest对象
        let request = new XMLHttpRequest();
        // 初始化
        request.open("POST", "http://dobby.com:8888/xxx");
        // 发送请求
        request.send();
        request.onreadystatechange = () => {
          // 请求及响应均成功
          if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300) {
              let string = request.responseText;
              let obj = window.JSON.parse(string);
              console.log(string);
              console.log(obj);
            } else {
              console.log("fail");
            }
          }
        };
      });
    </script>
  </body>
</html>
```

在前端 script 代码中，我们为按钮添加了事件，当按钮被 click，当前页面就会向服务端发起请求,我们再来回想一下 request.readyState 的五个状态值：

1. 代理被创建，但尚未调用 open()方法
2. open()方法已经被调用
3. send()方法已经被调用
4. 响应数据下载中
5. 响应数据下载已完成

首先我们开启两个 node-server，它们指定的端口号分别为：8888 和 8889。我们在浏览器分别输入 URL:dobby.com:8888 以及 frank.com:8889。当我们在 dobby.com:8888 下点击按钮时,在浏览器的控制台上打印出了我们接收到的 JSON 数据。

![](https://user-gold-cdn.xitu.io/2019/5/19/16ad05d5e8664c22?imageslim)

但是，当我们在 frank.com:8889 下点击按钮，在控制台上则会报错：

![](https://user-gold-cdn.xitu.io/2019/5/19/16ad05f257ce41fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这也就进一步验证了 AJAX 受限于"同源政策"，对于我们上述示例来说，实际上这是一次跨域请求的过程即:A 网站想要给 B 网站发送请求。由于同源政策，AJAX 只能请求于协议,域名,端口号相同的网站，而在实际开发中，又有很多跨域的需求，所以 AJAX 自然也会使用一些方法规避同源政策。其实这也很简单,我们只需在后端代码中添加一句话即可:

```js
else if(path ==='/xxx'){
  response.statusCode = 200
  response.setHeader('Content-Type','text/json;charset=utf-8')
  // 添加了这句话以后，任何网站都可以请求dobbykim.com:8888
  // response.setHeader('Access-Control-Allow-Origin','*')
  response.setHeader('Access-Control-Allow-Origin','http://frank.com:8889')
  response.write(`
    {
      "info":{
        "name":"DobbyKim",
        "age":"25",
        "hobby":"唱跳篮球rap",
        "girlfriend":"rightHand"
      }
    }
  `)
  response.end();
}
```

上面我们实际上用到了 CORS 机制，CORS 即 Cross-Origin-Resource-Sharing，翻译成跨域资源共享，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器不同的域、协议或端口请求一个资源时，资源会发起一个跨域 HTTP 请求。有了 CORS 机制，可以使 AJAX 进行跨域请求,AJAX 同时也支持多种请求方式：get,post,put,delete 等等。那么在没有 AJAX 之前，我们是怎样进行跨域请求的呢？这就要引出我们今天的主角 JSONP 了，但是在谈 JSONP 之前，我们还要再聊一聊历史~

## 不得不说的历史

假设我们有一个文件 db,这个文件 db 暂时作为我们的数据库进行数据的存储，文件存储着当前金额的数量 100。
后台程序如下：

```js
var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("Please appoint the port number\n Like node server.js 8888");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  var query = parsedUrl.query;
  var path = parsedUrl.pathname;
  if (path.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var method = request.method;

  console.log("HTTP Path:\n" + path);
  if (path == "/") {
    var string = fs.readFileSync("./index.html", "utf8");
    var amount = fs.readFileSync("./db", "utf-8");
    string = string.replace("&amount", amount);
    response.setHeader("Content-Type", "text/html;charset=utf8");
    response.write(string);
    response.end();
  } else if (path === "/pay" && method.toUpperCase() === "POST") {
    var amount = fs.readFileSync("./db", "utf8");
    var newAmount = parseInt(amount) - 1;
    fs.writeFileSync("./db", newAmount);
    response.write("success");
    response.end();
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write("找不到对应的路径");
    response.end();
  }

  console.log(method + "" + request.url);
});

server.listen(port);
console.log("Listen" + port + "Success\n Please open http://localhost:" + port);
```

前端代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>首页</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <h5>您的账余额是 <span id="amount">&amount</span></h5>
    <form action="/pay" method="post">
      <input type="submit" value="付款" />
    </form>
  </body>
</html>
```

form 表单的核心功能就是提交。如本例：当我们点击 submit 进行提交时，浏览器会跳转到 pay 这个路径下
如果 path==='/pay' && method.toUpperCase()==='POST',我们就会将 db 文件存储的金额-1，然后返回一个"success"。开启 server 后，程序运行的结果如下：

![](https://user-gold-cdn.xitu.io/2019/5/19/16acf764f08d3fcb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

当点击付款按钮时，form 表单提交，页面发生跳转。

![](https://user-gold-cdn.xitu.io/2019/5/19/16acf7787ea2d393?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我们可以看到浏览器输入框的路径已经变成了 pay，并且服务器返回了响应至浏览器即：response.write('success');，在页面上我们看到了 success 的字样，后退至 index.html 页面,并点击刷新，我们可以看到，金额减少了一元钱。

![](https://user-gold-cdn.xitu.io/2019/5/19/16acf7abf624fd1b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

其实，从功能上来讲，这是没有问题的。但是这却给用户造成了不好的体验。因为，用户每次点击付款按钮，页面都会发生跳转，而且用户需要自己点击后退按钮并刷新页面，才可以看到自己的账户余额。我们希望的是：点击付款后，浏览器会告诉我们付款成功 or 失败，在不刷新页面的情况下我们可以实时看到自己的账户余额。很显然，form 表单是做不到的。为什么呢？仔细想一想，form 表单在提交时，必定会发生页面的跳转，当然有一种方法可以做出稍稍的改进。在"远古时期"人们会使用 iframe 标签让 form 表单每次 post 都跳转到当前页面的内嵌的 iframe 中：

```html
<form action="/pay" method="post" target="result">
  <input type="submit" value="付款" />
</form>
<iframe name="result" src="about:blank" frameborder="0" height="200"></iframe>
```

![](https://user-gold-cdn.xitu.io/2019/5/19/16acf881c11f5338?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

当点击付款按钮时：

![](https://user-gold-cdn.xitu.io/2019/5/19/16acf972560bf07e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

form 表单的 post 发生在了页面内嵌的 iframe 标签中，但是金额还是没有刷新,我们仍然需要自己手动刷新页面。

## 放弃 POST,使用 GET

form 表单最大的问题就是会刷新页面或打开新的页面,不过 form 表单却有一个特性即：没有跨域的问题。在上面的程序中，我们如果将 form 标签变为<form action="http://www.baidu.com/pay" method="get">。实际上这个请求是可以发送的。在知乎上有一个问题：为什么 form 表单提交没有跨域问题，但是 ajax 提交有跨域问题?我在这里面借用下方老师的答案 :-)

![](https://user-gold-cdn.xitu.io/2019/5/19/16ad0ca138e8a5c3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

言归正传，为了优化用户的体验，我们不得不放弃使用 form 表单，而改用其他的，可以让浏览器发起请求的标签，这些标签有：

- a 标签
- img 标签
- link 标签
- script 标签
- ......

a 标签可以发起 get 请求，不过也会刷新或打开页面，img 标签会发起 get 请求，但是只能以图片形式进行展示,经过多方面考虑，于是乎，当时的前端程序员决定使用 script 标签，因为 script 标签不仅能发起请求，同时也能作为脚本执行,最重要的是，script 标签支持跨域请求。接下来，我们来看一个示例：

首先，在我的 hosts 文件中，我已经写好了 ip 与域名的映射。

![](https://user-gold-cdn.xitu.io/2019/5/19/16ad02e81133b719?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

开启两个 node-server,分别为:`http://dobby.com:8888`以及`http://frank.com:8889`,模拟 dobby.com 向 frank.com 发起跨域请求。

前端代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>首页</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h5>您的账余额是 <span id="amount">&amount</span></h5>
    <button id="btn">付款</button>
    <script>
      btn.addEventListener("click", () => {
        // 动态创建script标签
        let script = document.createElement("script");
        // 随机生成函数名
        let functionName = "dobby" + parseInt(Math.random() * 10000, 10);

        window[functionName] = (result) => {
          if (result === "success") {
            amount.innerText = amount.innerText - 1;
          } else {
            alert("fail");
          }
        };
        // 指定发起请求的地址
        script.src = "http://frank.com:8889/pay?callback=" + functionName;
        // 一定要将script加进去
        document.body.appendChild(script);
        script.onload = (e) => {
          // 每次动态创建script标签之后,都将script标签删掉
          e.currentTarget.remove();
          // 无论script标签加载成功或失败都需要将window[functionName]属性删除
          delete window[functionName];
        };
        script.onerror = () => {
          alert("fail");
          delete window[functionName];
        };
      });
    </script>
  </body>
</html>
```

对于 frank.com 的后端来讲，只需要这样做即可：

```js
else if(path==='/pay'){
  var amount = fs.readFileSync('./db','utf8')
  var newAmount = parseInt(amount) - 1;
  fs.writeFileSync('./db',newAmount);
  response.setHeader('Content-Type','application/javascript')
  response.statusCode = 200
  // query为path后面的查询参数
  response.write(`
      ${query.callback}.call(undefined,'success');
  `)
  response.end()
}
```

frank.com 的后端程序员只需要拿到查询参数中的 callback 的值，并调用此方法，而前端程序员通过后端传入的参数进行判断，这样就做到了低耦合高复用的代码。实际上，这就是 JSONP。
什么是 JSONP
JSONP 是一种动态 script 标签跨域请求技术。指的是请求方动态创建 script 标签，src 指向响应方的服务器，同时传一个参数 callback，callback 后面是一个随机生成的 functionName，当请求方向响应方发起请求时，响应方根据传过来的参数 callback,构造并调用形如：xxx.call(undefined,'你要的数据'),其中'你要的数据'的传入格式是以 JSON 格式传入的，因为传入的 JSON 数据具有左右 padding,因而得名 JSONP。后端代码构造并调用了 xxx，浏览器接收到了响应，就会执行 xxx.call(undefined,'你要的数据'),于是乎，请求方就知道了他要的数据，这就是 JSONP。在知乎上，看到了有关于 JSONP 的回答：

![](https://user-gold-cdn.xitu.io/2019/5/20/16ad118a710f9629?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

其实就是这样。

## jQuery 的 JSONP

我们首先需要引入 jQuery，然后将代码中 script 标签里面的内容变为这样即可：

```js
btn.addEventListener("click", function () {
  $.ajax({
    url: "http://jack.com:8001/pay",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: {
      q: 'select title,abstract,url from search.news where query="cat"',
      format: "json",
    },

    // Work with the response
    success: function (response) {
      if (response === "success") {
        amount.innerText = amount.innerText - 1;
      }
    },
  });
});
```

值得吐槽的一点是：调用 jQuery 的 JSONP API 里面出现了 ajax 这样的字眼，实际上 JSONP 和 Ajax 毛关系都没有。

## JSONP 为什么不支持 post

这是一道大概率会出现的面试题，回答如下：

1. JSONP 是通过动态创建 script 实现的
2. 动态创建 script 只能发起 get 请求，无法发起 post 请求

回答完毕~

## 参考

- [浅谈 JSONP](https://juejin.cn/post/6844903846989266952)
