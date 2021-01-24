# HTTP_HTTPS

HTTP: Hyper Text Transfer Protocol 超文本传输协议

HTTPS: Hyper Text Transfer Secure 超文本传输安全协议: 本质上和 HTTP 是一样的, 只是 HTTPS 在 HTTP 的基础上加了一层安全层

HTML: Hyper Text Markup Language 超文本标记语言

**超文本(Html)传输的规则是由 HTTP 协议制定的**

- 定义: **客户端和服务器请求和应答的标准, 用于从 WEB 服务器传输超文本到本地浏览器的传输协议**
- HTTP 请求: **协议按照规则先向 WEB 服务器发送的将超文本传输到本地浏览器的请求**
- HTTPS:
  - HTTP 的安全版(安全基础是 SSL/TLS)
  - HTTP 不安全: HTTP 在请求的过程中是明文的过程
  - SSL: Secure Sockets Layer 安全套阶层
  - TLS: Transport Layer Security 传输层安全
  - **为网络通信提供安全及数据完整性的一种安全协议, 对网络进行加密传输, 在传输过程中, 进行了 TCP 连接了以后, 进行了一层加密, 你的 HTTP 请求是一种安全的, 不透明的状态下的请求**
  - HTTPS 需要去申请证书

## HTTP 与 HTTPS 的区别

1. HTTP 是不安全的(监听和中间人攻击等手段, 获取网站账户信息和敏感信息, HTTPS 可防止被攻击
2. HTTP 的传输内容是明文的, 直接在 TCP 连接上运行, 客户端和服务器都无法验证对方身份(只能靠标志位, 但是标志位可能被篡改)
3. HTTPS 协议的传输内容都被 SSL/TLS 加密, HTTP 请求在 HTTPS 的协议上, 在请求的过程中先运行在 SSL/TLS 的基础上, 然后被加密保存好了以后, 再由 SSL/TLS 运行在 TCP 连接上, 所以数据传输是安全的
