## 并发(concurrency) 和 并行(parallel)

1. 单 CPU 中进程只能是并发, 多 CPU 计算机中进程可以并行
2. 单 CPU 单核中线程只能并发, 单 CPU 多核中线程可以并行
3. 无论是并发还是并行, 使用者来看, 看到的都是多进程, 多线程

- **其实决定并行的因素不是 CPU 的数量，而是 CPU 的核心数量，比如一个 CPU 多个核也可以并行**

- **在某个时间段内, 并发是多任务交替处理, 并行是多任务同时执行**

- **一个指令 和 另一个指令交错执行，操作系统实现这种交错执行的机制称为: 上下文切换**

- **如果程序能够并行执行, 那么就一定是运行在多核处理器上, 此时, 程序中的每个线程都将分配到一个独立的处理器核上, 因此可以同时运行**

#### 并行(parallel)

并行指的是在一个时间段内, 有几个程序都在几个 CPU 上运行, 任意一个时刻点上, 有多个程序同时运行, 并且多道程序之间互不影响

- **单核 CPU 多个进程或多个线程内能实现并发(微观上的串行, 宏观上的并行); 多核 CPU 线程间可以实现微观上并行**

指在同一时刻, 有多条指令在多个处理器上同时执行, 所以无论是从宏观上还是微观上来看, 这些指令都是一起执行的

![img](https://upload-images.jianshu.io/upload_images/7557373-72912ea8e89c4007.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/313/format/webp)

![img](https://img-blog.csdn.net/20161223093608338?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc2luYXRfMzU1MTIyNDU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#### 并发(concurrency)

并发是指在一个时间段内, 有几个程序都在同一个 CPU 上运行, 但任意一个时刻点上只有一个程序在处理器上运行

并发是多个程序在一个 CPU 上运行, CPU 在多个程序之间快速切换, 但微观上不是同时运行, 任意一个时刻只有一个程序在运行, 但宏观上看起来就像多个程序同时运行一样, 因为 CPU 切换速度非常快, 人类的反应速度小于时间片

![img](https://upload-images.jianshu.io/upload_images/7557373-da64ffd6d1effaac.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/295/format/webp)

![img](https://img-blog.csdn.net/20161223093549526?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc2luYXRfMzU1MTIyNDU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#### 区别

并行在多处理器系统中存在, 而并发可以在单处理器和多处理器系统中都存在, 并发能够在单处理器系统中存在是因为并发是并行的假象, 并行要求程序能够同时执行多个任务, 而并发只是要求程序假装同时执行多个任务(每个小时间片执行一个操作, 多个操作快速切换执行)

当有多个线程在操作时, 如果系统中只有一个 CPU, 则它根本不可能真正同时进行一个以上的线程, 它只能把 CPU 运行时间划分成若干个时间段, 再将时间段分配给各个线程执行, 在一个时间段的线程代码运行时, 其他线程处于挂起状态, 这种方式我们称之为并发(Concurrent)

当系统有一个以上 CPU 时, 则线程的操作有可能非并发, 当一个 CPU 执行一个线程时, 另一个 CPU 可以执行另一个线程, 两个线程互不抢占 CPU 资源, 可以同时进行, 这种方式我们称之为并行(Parallel)

#### CPU 调度策略

在并发运行中, CPU 需要在多个程序之间来回切换, 那么如何切换就有一些策略

1. 先来先服务 - 时间片轮转
   这个很简单, 就是谁先来, 就给谁分配时间片运行, 缺点是有些紧急的任务需要很久才能得到运行

2. 优先级调度
   每个线程有一个优先级, CPU 每次去拿优先级高的运行, 优先级低的先等等, 为了避免等太久, 每等一定时间, 就给线程提高一个优先级

3. 最短作业优先
   把线程任务量排序, 每次拿处理时间短的运行, 就像我去银行办业务一样, 我的事情很快就办完了, 所以让我插队先办完, 后面时间长的人先等等, 时间长的人就很难得到响应了

4. 最高响应比优先
   用线程的等待时间除以服务时间, 得到响应比, 响应比小的优先运行, 这样不会造成某些任务一直得不到响应

5. 多级反馈队列优先
   有多个优先级不同的队列, 每个队列里面有多个等待线程
   CPU 每次从优先级高的遍历到低的, 去队首的线程运行, 运行完了放回队尾, 优先级越高, 时间片越短, 即响应越快, 时间片就不是固定的了

- **队列内部还是用先来先服务的策略**

#### 通过多线程实现并发和并行

1. 在 CPU 比较繁忙, 资源不足的时候(开启了很多进程), 操作系统只为一个含有多线程的进程分配仅有的 CPU 资源, 这些线程就会为自己尽量多抢时间片, 这就是通过多线程实现并发, 线程之间会竞争 CPU 资源争取执行机会
2. 在 CPU 资源比较充足的时候, 一个进程内的多线程, 可以被分配到不同的 CPU 资源, 这就是通过多线程实现并行
3. 至于多线程实现的是并发还是并行? 上面所说, 所有多线程可能被分配到一个 CPU 内核中执行, 也可能被分配到不同 CPU 执行, 分配过程是操作系统所为, 不可人为控制, 所以, 如果有人问我多线程是并发还是并行, 我会说都有可能
4. 不管是并发还是并行, 都提高了程序对 CPU 资源的利用率, 最大限度地利用 CPU 资源

#### CPU 处理程序

1. 单核 CPU 处理程序

- **在单 CPU 计算机中, 有一个资源是无法被多个程序并行使用的: CPU**

- 单进程多线程处理
  有一个程序, 有两个功能: 听歌, 发消息, 这就是单进程 2 线程, 如果听歌线程获取了锁, 那么这个线程将获取 CPU 的运行时间, 其他线程将被阻塞, 但 CPU 始终处于运行状态, 影响计算时间的其实只是开锁和解锁的事件, 并不会发生 CPU 空闲的现象, CPU 利用 100%
  线程阻塞: 一般是被动的, 在抢占资源中得不到资源, 被动的挂起在内存, 等待某个资源或信号将它唤醒(释放 CPU, 不释放内存)

- 多进程处理: 将听歌, 发消息分别写出两个独立的程序独立运行, 与上面不同的是, 如果进程间需要通信, 比如交换数据, 则会需要很多步骤, 效率低

2. 多核 CPU 处理程序

- 单进程多线程处理
  线程可以跨核处理, 进程之间则不能, 如果支付宝访问 `QQ` 一样(安全性)
  跟单核相比, 如果 A 核处理听歌线程阻塞, B 核空闲, 则 CPU 工作效率下降一半, 没有阻塞时, `QQ` 的 A 线程听歌, B 线程发消息, 多核 CPU 效率比单核快很多

- 多进程多线程处理: 不同的程序, 不可能一个进程融合 `QQ`, 支付宝, 浏览器等

3. 多核下线程数量选择

- 计算密集型
  程序主要为复杂的逻辑判断和复杂的运算
  CPU 的利用率高, 不用开太多的线程, 开太多线程反而会因为线程切换时切换上下文而浪费资源

- I/O 密集型
  程序主要为 I/O 操作, 比如磁盘 I/O(读取文件)和网络 I/O(网络请求)
  因为 I/O 操作会阻塞线程, CPU 利用率不高, 可以多开点线程, 阻塞时可以切换到其他就绪线程, 提高 CPU 利用率

- **根据实际场景, 合理设置线程数**
