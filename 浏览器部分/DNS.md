# DNS

## WWW

- www: World Wide Web 万维网
- Internet 提供了很多服务, 其中包括 WWW(网页服务), FTP(文件传输), E-mail(电子邮件), Telnet(远程登录)等等, www 是用浏览器访问页面的服务, 所以网站的主页的域名前需要加 www, 而随着网站服务类型的增加, 不同的二级域名或三级域名对应不同的业务, 而业务的处理任务会分配到多个服务器, 所以, 不再需要使用 www 来标记主页, 很多网站都还会做 DNS 解析 www, 原因是尊重用户习惯(在国外网站基本不用 www 标记主页, 如 github)

  ![img](DNS_md_Image\2020-12-02_08-53-28.png)

## DNS 解析

DNS: Domain Name System 域名服务器

DNS 抽象点就是一个记录 ip 地址的分布式数据库

![img](DNS_md_Image\2020-12-01_16-18-14.png)

作用: 域名与对应 Ip 转换的服务器

特征: DNS 中保存有一张域名与对应 Ip 地址的表, 一个域名对应一个 Ip 地址, 一个 Ip 地址可对应多个域名

- 顶级域名: Top Level Domain(TLD)
- 二级域名: Second Level Domain(SLD)

现在顶级域名 TLD 已有 265 个, 分为三大类

1. 国家顶级域名 nTLD: 采用 ISO3166 规定, 如: cn 代表中国, us 代表美国, uk 代表英国等等, 国家域名又常记为 ccTLD(cc 代表国家代码 contry-code)
2. 通用顶级域名 gTLD: generic Top Level Domain, 最常见的通用顶级域名有 7 个, com(公司企业), net(网络服务机构), org(非营利组织), int(国际组织), gov(美国政府部门), mil(美国军事部门)
   根服务器的一种, 为所有 .com .net 后缀做域名解析的服务器, 这些后缀做域名解析的服务器, 但是他和根服务器比较像, 它仅仅是保存了一些不是特别多的 .com .net 的解析表, 他其实做的工作是来维护和管理像 .com .net 这些比较宏观的, 像国家级别的这种表的管理
3. 基础结构域名 infrastructure domain: 这种顶级域名只有一个, 即 arpa, 用于反向域名解析, 因此称为反向域名

> 顶级域名服务器主要负责管理在该顶级域名服务器注册的二级域名

如: jsplusplus.com

1. 向本地 DNS 服务器询问, 一般来说, DNS 服务器都是你的网络运营商的 DNS 本地服务器, 去查询它的表, 有就返回, 如果没有, 询问根服务器
2. 根服务器看到是 .com 后缀, 回复说你需要向 .com 域服务器去询问, 会将 .com 域服务器的 ip 给你, 然后本地 DNS 服务器将这个 ip 缓存, 下次就不会向根服务器查找, 直接向 .com 域服务器查找
3. 询问 .com 域服务器, .com 域服务器看到是 jsplplus 的二级域名后缀, 会将 jsplusplus.com 的 ip 给你, 让你去 jsplusplus.com 域服务器(例如这里就是阿里云服务器 ecs)查找, DNS 同样会先缓存该 ip
4. 询问 jsplplus.com 域服务器, jsplplus.com 域服务器将 jsplusplus.com 的 ip 给你, DNS 就会先写入缓存, 再进行返回到浏览器, 浏览器也会缓存到浏览器的缓存位置

### 完整的解析顺序

1. 浏览器缓存: 当用户通过浏览器访问某域名时, 浏览器首先会在自己的缓存中查找是否有该域名对应的 IPA
2. 系统缓存: 当浏览器缓存中没有则会自动检查用户计算机系统 Hosts 文件 DNS 缓存是否有该域名对应 ip
3. 计算机 hosts 文件: 当浏览器几系统缓存中均无域名对应 ip 则进入计算机 hosts 文件缓存中检查, 以上三步均为客户端的 DNS 缓存
4. ISP(互联网服务提供商 DNS 缓存: 当用户客户端查找不到域名对应 IPA, 则将进入 ISP DNS 缓存中进行查询, 比如你用的是电信的网络, 则会进入电信的 DNS 缓存服务器进行查找)![img](https://exp-picture.cdn.bcebos.com/5c2a1ad149299a883ff0795067eeadbcbf2f7f78.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)
5. 根域名服务器: 当以上均未完成, 则进入根服务器进行差准, 全球仅有13台根域名服务器, 1个主根域名服务器, 其余12为辅根域名服务器, 根域名收到请求后会查看区域文件记录, 若无则将其管辖范围内顶级域名(如.com)服务器 ip 告诉本地 DNS 服务器
6. 顶级域名服务器: 顶级域名服务器收到请求后查看区域文件记录, 若无则将其管辖范围内主域名服务器的 IPA 告诉本地 DNS 服务器
7. 主域名服务器接受到请求后查询自己的缓存, 如果没有则进入下一级域名服务器进行查找, 并重复该步骤直至找到正确记录
8. 保存结果至缓存: 本地域名服务器把返回的结果保存到缓存, 以备下一次使用, 同时将该结果反馈给客户端, 客户端通过这个 IPA 域名解析 Web 服务器建立连接

## 权威 DNS 和权威域名服务器

> 权威 DNS 服务器就是经过上一级授权, 对域名进行解析的服务器, 同时他也可以把解析授权给其他人

例如: 在互联网上, 谁出售的域名, 就把域名授权给谁, 比如 sunhao.win 是阿里售出的, 所以权威服务器是阿里的 DNS 解析服务器(为了保障安全一般权威 DNS 服务器都是俩

> dns9.hichina.com
>
> dns10.hichina.com

但是由于业务我从后台调整解析到 yunjiasu

```xml
;; AUTHORITY SECTION:
sunhao.win.		2992	IN	NS	n563.ns.yunjiasu.com.
sunhao.win.		2992	IN	NS	n3101.ns.yunjiasu.com.

```

其中 n563.ns.yunjiasu.com 和 n3101.ns.yunjiasu.com 是 sunhao.win 的权威服务器

当访问 sunhao.win 通过顶级域名解析后, 顶级域名 win 就给用户说, 你要访问 sunhao.win 是吧, 你得去 n563.ns.yunjiasu.com 看看, 他那里记录了 ip 地址, 不行就去 n3101.ns.yunjiasu.com

## 运营商 DNS(ISP DNS) 服务器和本地 DNS 服务器

在实际上网中, 我们不是直接连接根服务器, 而是通过本地 DNS 服务器上网

如果 DNS 设置不好, 或者不对, 会导致如我们 qq 能登陆, 而页面无法浏览网页的症状

在这, 本地 DNS 主要指各地电信运营商提供的域名解析服务器, 也就是我们在上网网卡里面你设置的 DNS 地址

当一个主机发出 DNS 查询请求时, 这个查询请求报文就发送给本地域名服务器, 本地域名服务器替我们进行 DNS 解析, 我们得到的 ip 地址就是本地服务器提供返回的

## 查询

1. 用户 -> 本地递归服务器 -> 根权威服务器 -> COM 权威服务器 -> xxx.COM 权威服务器 -> 本地递归服务器 -> 用户

在这我们要明白两点:

1. 递归查询: 主机向本地域名服务器的查询一般都是递归查询, 所谓递归查询就是: 如果主机所访问的本地服务器不知道被查询的域名的 IPA, 那么本地域名服务器就以 DNS 客户的身份, 向其他根域名服务器继续发出查询请求报文(即替主机继续查询), 而不是让主机自己进行下一步查询, 因此递归查询返回的查询结果或者是所要查询的 IPA, 或者报错, 标记无法查询到 IPA, 我们的本地服务器就是递归服务器
2. 迭代查询: 本地域名服务器向根服务器查询的迭代查询, 迭代查询的特点: 当根域名服务器收到本地域名服务器发出的迭代查询请求报文时, 要么给出所要查询的 IPA, 要么告诉本地服务器, 你下一步应当向哪一个域名服务器进行查询, 然后让本地服务器进行后续的查询, 根域名服务器通常是把自己知道的顶级域名服务器的 IPA 告诉本地域名服务器, 让本地域名服务器再向顶级域名服务器查询, 顶级域名也是同根服务器一样, 要么给出所要查询的 IPA, 要么告诉本地服务器下一步应当向哪一个权威服务器进行查询, 最后将结果返回给发起查询的主机, 要注意的是, 每一次迭代查询, DNS 本地服务器都会缓存根服务器或者顶级域名服务器返回的 ip, 这个 ip 基本上是下一级的 DNS 服务器的 ip, 例如根服务器在查询不到的情况下(基本查询不到)会将对应的域名服务器的 ip 返回, 如 .com 域服务器的 ip

实际上一般本地服务器 DNS 访问量巨大, 会有一个前置的 F5 服务器, 用于分发给后缀的服务器实现负载均衡, 同时服务器会根据设置会缓存 ip 一段时间, 所以有时候我们在服务器改完 DNS, 有时候会等待一段时间, 才能访问到新的地址

## 解析记录

## 应答

### 权威应答

由权威服务器区域直接返回的应答地址

### 非权威应答

由缓存或者其他服务器返回的

## TTL 值和缓存

假如我们每次都发送一次 DNS 请求, 那么服务器的压力会相当大, 但是服务器得 ip 地址一般不会经常变, 所以实际我们都设置 TTL 把 DNS 缓存到本地

域名的 TTL 值: Time-To-Live, 简单的说就是他返回的记录在 DSN 服务器上保留的时间, 就是 TTL 值

简单的说它表示一条域名解析记录在 DNS 服务器上缓存时间。当各地的 DNS 服务器接受到解析请求时, 就会向域名指定的 DNS 服务器发出解析请求从而获得解析记录; 在获得这个记录之后, 记录会在 DNS 服务器中保存一段时间, 这段时间内如果再接到这个域名的解析请求, DNS 服务器将不再向 DNS 服务器发出请求, 而是直接返回刚才获得的记录, 而这个记录在 DNS 服务器上保留的时间, 就是 TTL 值。

TTL时间越长, 缓存时间越长, 更新越不容易及时生效, TTL 设置的时间越小, 那么发送 DNS 请求的次数也会随着增加, 服务器的压力就会变大, 所以, 设置一个合理时间范围内的 TTL 是十分重要的, 一般域名服务器商建议 TTL 值设置在 10到15分钟合适, 如阿里的就是10分钟

![img](DNS_md_Image\1606899561050.png)

> DNS 会将最终域名解析的结果缓存至本地, 分为两种浏览器缓存和操作系统(OS)缓存

> 在浏览器中访问的时候, 会优先访问浏览器缓存, 如果访问指定域名, 没有命中返回, 则访问 OS 缓存, 然后从计算机 hosts 文件找, 最后再访问 DNS 服务器

### hosts

在 DNS 系统之前, 对应 ip 都是保存在 hosts 文件之中, 现在系统仍然保留它

实际通过浏览器访问, 会先查询浏览器 DNS 缓存, 然后是 OS 缓存, 然后再查询 hosts 里面是否有记录

一般 win 系统 Hosts 文件在 C:\WINDOWS\system32\drivers\etc 中

通过 hosts 我们可以把域名改为本地的地址, 进行调试开发

对于经常访问的网站, 也可以直接设置到 hosts 里, 加快访问速度

## DNS 预解析

- 可以通过 meta 信息来告诉浏览器, 我这页面要做 DNS 预解析

```html
 <meta http-equiv="x-dns-prefetch-control" content="on" />
```

- 可以使用 link 标签来强制对 DNS 做预解析
- ```html
   <link rel="dns-prefetch" href="http://ke.qq.com/" />
  ```

## 减少 DNS 查询次数

当客户端的 DNS 缓存为空时,  DNS 查找的数量与 Web 页面中唯一主机名的数量相等。减少唯一主机名的数量就可以减少 DNS 查找的数量。较少的域名来减少 DNS 查找(2-4个主机)

## 解析过程分析

sunhao.win解析过程分析

最后我们看下用dig +trace 跟踪的全部解析过程

```bash
[root@sunhao ~]# dig +trace www.sunhao.win
; <<>> DiG 9.8.2rc1-RedHat-9.8.2-0.37.rc1.el6 <<>> +trace www.sunhao.win
;; global options: +cmd
.			12674	IN	NS	e.root-servers.net.
.			12674	IN	NS	i.root-servers.net.
.			12674	IN	NS	h.root-servers.net.
.			12674	IN	NS	k.root-servers.net.
.			12674	IN	NS	d.root-servers.net.
.			12674	IN	NS	l.root-servers.net.
.			12674	IN	NS	a.root-servers.net.
.			12674	IN	NS	c.root-servers.net.
.			12674	IN	NS	m.root-servers.net.
.			12674	IN	NS	g.root-servers.net.
.			12674	IN	NS	b.root-servers.net.
.			12674	IN	NS	f.root-servers.net.
.			12674	IN	NS	j.root-servers.net.
;; Received 492 bytes from 211.161.46.85#53(211.161.46.85) in 42 ms
win.			172800	IN	NS	ns1.dns.nic.win.
win.			172800	IN	NS	ns6.dns.nic.win.
win.			172800	IN	NS	ns3.dns.nic.win.
win.			172800	IN	NS	ns2.dns.nic.win.
win.			172800	IN	NS	ns5.dns.nic.win.
win.			172800	IN	NS	ns4.dns.nic.win.
;; Received 412 bytes from 192.36.148.17#53(192.36.148.17) in 191 ms
sunhao.win.		3600	IN	NS	n563.ns.yunjiasu.com.
sunhao.win.		3600	IN	NS	n3101.ns.yunjiasu.com.
;; Received 86 bytes from 156.154.145.182#53(156.154.145.182) in 2415 ms
www.sunhao.win.		300	IN	A	162.159.211.33
www.sunhao.win.		300	IN	A	162.159.210.33
;; Received 92 bytes from 220.181.111.112#53(220.181.111.112) in 6 ms

```

NS 是指定该域名由哪个 DNS 服务器来进行解析

我们可以清楚的看到第一部先从 13 台 DNS 服务器, 然后是顶级域 win, 最后权威域 sunhao.win, 查到地址在 162.159.211.33 和 162.159.210.33 上, 最后的是 A 记录, 不再是 NS 了哦

## 参考(侵删)

- [【前端面试必备】DNS/IP/PORT/TCP/UDP/HTTP/HTTPS/三次握手【摘选与 JS++网络课】](https://www.bilibili.com/video/BV1bk4y1m7zC)
- [写给前端工程师的 DNS 基础知识](http://www.sunhao.win/articles/netwrok-dns.html)
- []()
