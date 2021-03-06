# CDN

## CDN 理解及工作原理

网站通常将其所有的服务器都放在同一个地方，当用户群增加时，公司就必须在多个地理位置不同的服务器上部署内容

为了缩短 http 请求的时间，我们应该把大量的静态资源放置的离用户近一点。

## 内容发布网络 CDN（Content Delivery Networks）

CDN 是一组分布在多个不同地理位置的 web 服务器，用于更加有效的向用户发布内容

基本思路： 尽可能避开互联网上有可能影响数据传输速度和稳定性的瓶颈和环节，使内容传输的更快、更稳定。

**通过在网络各处放置节点服务器所构成的在现有互联网基础之上的一层新的网络架构， CDN 系统能够实时地根据网络流量和各节点的连接、负载状况以及到用户的距离和响应时间等综合信息, 将用户的请求重新导向离用户最近的服务节点上。从技术上全面解决网络带宽小, 用户访问量大, 网点分布不均等原因, 解决用户访问网站的相应速度慢的根本原因**

## 使用 CDN 的好处

**主要记上面的概念那段话**

* 提升网页加载速度
* 减少带宽消耗
* 处理高流量负载
* 无需完成本地化覆盖
* 在多台服务器间均衡负载
* 使你的网站免于DDoS(拒绝服务)的攻击

## CNAME

域名解析记录 A, CNAME, MX, NS, TXT, AAAA, SRV, 显性 URL, 隐形 URL 含义

(记住1, 2, 3, 其他仅仅作了解)

1. A记录: 解析域名到指定 ip, 可以理解为: 最终的域名与 IP 对应关系的这条记录, 就是 A 记录

   1. 域名: xx.com -> 111.111.111.111
   2. 主机名: DD -> 222.222.222.222
2. CNAME 记录, (Canonicl Name 别名指向): 解析域名到 A 记录的域名

   为什么要区分 A 记录 和 CNAME, 我们可以把 CNAME 记录叫做别名记录, 就是小名

   比如 A 记录为: www.create.com -> 111.111.111.111
   那么可能有多个 CNAME 记录:

   www.100.com -> www.create.com

   www.200.com -> www.create.com

   所以是 CNAME 指向 A 记录, A 记录指向 IPA

   **一个网址可能有多个 CNAME, 可以理解为域名转发**
3. NS 记录: 解析服务器记录, 用来表明由哪台服务器对该域名进行解析, 这里的 NS 记录只对子域名生效, 优先级: NS 记录优先于 A 记录, 即: 如果一个主机地址同时存在 NS 记录和 A 记录, 则 A 记录不生效, 这里的 NS 记录只对子域名生效
4. MAX 记录: 指向一个邮件服务器, 用于电子邮件系统发邮件时根据收信人的地址后缀来定位邮件服务器
5. TXT 记录: 为某个主机名或域名设置联系信息, 如: admin IN TXT "管理员, 电话: 1000000000"
6. AAAA 记录(AAAA record): 是用来将域名解析到 IPv6 地址的 DNS 记录, 用户可以将一个域名解析到 IPv6 地址上, 也可以将子域名解析到 IPv6 地址上
7. SRV 记录: 一般是为 Microsoft 的活动目录设置时的应用
8. 显性 URL 记录, 访问域名时, 会自动跳转到所指的另一个网络地址(URL), 此时在浏览器地址栏中显示的是跳转的地址
9. 隐性 URL 记录, 访问域名时, 会自动跳转到所指的另一个网络地址(URL), 此时在浏览器地址栏中显示的是原域名地址

## CDN 流程

### 流程图

![img](https://user-gold-cdn.xitu.io/2020/7/20/1736be1b5d892583?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![img](https://user-gold-cdn.xitu.io/2020/7/20/1736be1d180937c8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 使用 CDN 后, DNS 解析的步骤有所变化

在之前的解析中, 是向本地域名服务器(网络运营商)中请求

那么引入了 CDN 之后, 在这一步中就发生了变化

我们把本地域名服务器当做阿里云中的域名产品, 把 www.create.com 当做我们从阿里云申请的域名

如果没有 CDN, 我们就可以直接配置 www.create.com -> 111.111.111.111, 所以一般情况下, DNS 步骤解析5的迭代查询, 其实是不需要的

如果我们想引入 CDN 的话, 在阿里云的控制台, 我们可以对 www.create.com 域名设置几个 CNAME 的配置, 比如我们配置:

- CNAME 记录: www.create.com -> cdn.create.com
- A 记录: cdn.create.com -> 222.222.222.222

## CDN 是怎么做到优化的

### 负载均衡

CDN 负载均衡设备会为用户选择一台合适的缓存服务器提供服务

选择的依据包括:

- 根据用户 IPA, 判断哪一台服务器距离用户最近
- 根据用户所请求的 URL 中携带的内容名称, 判断哪一台服务器上有用户所需内容
- 查询各个服务器的负载情况, 判断哪一台服务器的负载较小
- 基于以上这些依据综合分析后, 负载均衡设置会把缓存服务器的 IPA 返回给用户

### 缓存

缓存服务器响应用户请求, 将用户所需内容传送到用户

**如果这台服务器上并没有用户想要的内容, 而负载均衡设备依然将它分配给了用户, 那么这台服务器就要向他的上一级缓存服务器请求内容, 直至追溯到网站的源服务器将内容拉取到本地**

## DNS 和 CDN 整体流程的总结

比如我们请求 www.crete.com

1. 首先, 浏览器会从自身的 DNS 缓存中去查找(chrome://net-internals/#dns), 如果没有则进行下一步
2. 然后, 浏览器会先从操作系统里的 DNS 缓存中找, windows 系统中, 命令行 ipconfig/displaydns 查看, linux 上的 NSCD 缓存服务, 如果没有则进行下一步
3. 从计算机 hosts 文件查找, 没有则进行下一步
4. 请求本地域名服务器(可以认为是阿里云等域名供应商): 发现阿里云里面有过配置, CNAME 记录, www.create.com -> cdn.create.com, 所以此时进行域名转发, 告诉浏览器转为请求 cdn.create.com
5. 此时, 浏览器转为请求 cdn.create.com, 1-3步骤会重来一遍
6. 又请求本地域名服务器(可以认为是阿里云等域名供应商): 发现阿里云有过配置, A 记录: cdn.create.com -> 222.222.222.222, 然后就把 ip 返回给浏览器
7. 浏览器得到了 ip, 注意这个 ip 地址, 实际上他是负载均衡服务器的地址, 继续请求这个地址
8. 请求进入到了 CDN 负载均衡服务器后, 服务器会根据算法策略等, 返回一个最适合的文件缓存服务器 IPA, 至于怎么选择合适的, 看下面的优化
9. 浏览器访问文件缓存服务器 ip 地址, 最后得到文件资源

## CDN 总结

在网站和用户之间引入 CDN 之后, 用户不会有任何yu也来不同的感觉

使用 CDN 服务的网站, **只需要将其域名的解析权交给 CDN 的负载均衡设备**, CDN 负载均衡设备将为用户选择一台合适的缓存服务器, 用户通过访问这台服务器来获取自己所需的数据

**由于缓存服务器部署在网络运营商的机房, 而这些运营商又是用户的网络服务提供商, 因此用户可以以最短的路径,  最快的速度对网站进行访问, 因为, CDN 可以加速用户访问速度, 减少源站负载压力**

## 参考

- [最全DNS、CDN原理](https://juejin.cn/post/6854573212425814030)
- [web前端高级-页面结构优化/性能优化](https://www.bilibili.com/video/BV11Z4y1W7aT?p=16)
- [写给前端工程师的DNS基础知识](http://www.sunhao.win/articles/netwrok-dns.html)
