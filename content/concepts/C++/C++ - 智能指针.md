---
title: "C++ - 智能指针"
description: "C++ 学习笔记：智能指针"
tags:
  - "concept"
  - "C++"
---
# C++ - 智能指针

## 智能指针

### unique\_ptr

核心特点

1. **独占所有权**：同一时间只能有一个 `unique_ptr` 指向一个对象，禁止拷贝，只能移动（`std::move`）

2. **自动释放**：离开作用域时自动调用 `delete` 释放对象，无需手动管理内存；同一时间只能有一个 `unique_ptr` 指向对象，禁止拷贝和赋值，只能通过 `std::move` 转移所有权，从根源上避免了野指针和重复释放问题。

3. **零开销**：编译期实现，无运行时性能损失，效率和原生指针几乎一致

```C++
unique_ptr<A> ptr1(new A(参数))
unique_ptr<A> ptr1 = make_unique<A>(参数)
```

- 智能指针删除当前所管理的对象的情况：

```C++
unique_ptr<Rectangle> p1(new Rectangle(3.5,4.1));
p1 = nullptr;
```

1. **初始化**：`p1` 指向一个新建的 `Rectangle` 对象（宽 3\.5，高 4\.1）。

2. **赋值 ****`nullptr`**：

    - `unique_ptr` 被赋值为 `nullptr` 时，会先**自动释放当前指向的对象**（调用 `Rectangle` 的析构函数，输出 `对象被释放`）。

    - 然后 `p1` 变为空指针，不再指向任何对象。

3. **效果**：原 `Rectangle` 对象被安全销毁，无内存泄漏。

```C++
unique_ptr<Rectangle> p1(new Rectangle(3.5,4.1));
unique_ptr<Rectangle> p2(new Rectangle(3.5,4.1));
p1 = move(p2);
```

1. **初始化**：`p1` 和 `p2` 分别指向两个独立的 `Rectangle` 对象。

2. **移动赋值**：

    - `std::move(p2)` 将 `p2` 的所有权**转移**给 `p1`。

    - 首先，`p1` 会释放自己原来指向的对象（输出 `对象被释放`）。

    - 然后 `p1` 接管 `p2` 原来指向的对象。

    - 最后，`p2` 变为空指针（不再拥有任何对象）。

3. **效果**：

    - `p1` 原来的对象被销毁。

    - `p1` 现在指向 `p2` 原来的对象。

    - `p2` 变为空，避免了两个指针指向同一对象的问题。

```C++
unique_ptr<Rectangle> p1(new Rectangle(3.5,4.1));
p1.reset(new Rectangle(5.5,4.1));
```

1. **初始化**：`p1` 指向一个 `Rectangle` 对象（宽 3\.5，高 4\.1）。

2. **调用 ****`reset`**：

    - `reset` 方法会先**释放当前指向的对象**（输出 `对象被释放`）。

    - 然后让 `p1` 指向新创建的 `Rectangle` 对象（宽 5\.5，高 4\.1）。

    - 如果 `reset` 不带参数（`p1.reset()`），则仅释放当前对象，`p1` 变为空指针。

3. **效果**：原对象被销毁，`p1` 指向新对象，全程自动管理内存。

核心要点总结

|操作|行为描述|
|---|---|
|`p = nullptr`|释放当前对象，指针置空|
|`p1 = std::move(p2)`|转移所有权，`p1` 先释放自己的对象，再接管 `p2` 的对象，`p2` 置空|
|`p.reset(new T)`|释放当前对象，指向新对象|
|`p.reset()`|释放当前对象，指针置空|

这些操作都遵循 `unique_ptr` 的核心原则：**始终保证对象有且仅有一个拥有者**，并在拥有者消失时自动释放对象，彻底避免内存泄漏。



### shared\_ptr

`std::shared_ptr` 是 C\+\+11 的**共享所有权智能指针**，核心机制是：

1. 内部维护一个**引用计数器（引用计数）**，记录当前有多少个`shared_ptr`对象**共同指向同一个堆内存对象**；

2. 当**新增一个****`shared_ptr`****指向该对象** → 引用计数 **\+1**；

3. 当**某个****`shared_ptr`****生命周期结束 / 指向其他对象** → 引用计数 **\-1**；

4. 当**引用计数变为 0** → 说明**没有任何指针再指向该对象**，此时自动调用`delete`释放堆内存，完成内存管理。



优点：支持**多个指针共享同一个对象**，解决了`unique_ptr`独占所有权的局限性，使用场景更广泛；

缺陷：**当两个 / 多个****`shared_ptr`****互相指向对方时，会产生「循环引用」，导致内存泄漏**。



循环引用的「通俗定义」

**两个（或多个）****`shared_ptr`**** 管理的对象，内部又持有指向彼此的 ****`shared_ptr`**** 成员变量，形成一个「闭环」**，这种情况就叫做 `shared_ptr` 的循环引用。

```C++
#include <iostream>
#include <memory> // shared_ptr/weak_ptr 都在这个头文件
using namespace std;

// 两个互相引用的类，先声明
class B; 

class A {
public:
    // A类内部持有 指向B的shared_ptr成员
    shared_ptr<B> b_ptr;
    A() { cout << "A 构造" << endl; }
    ~A() { cout << "A 析构" << endl; } // 析构函数验证是否释放
};

class B {
public:
    // B类内部持有 指向A的shared_ptr成员
    shared_ptr<A> a_ptr;
    B() { cout << "B 构造" << endl; }
    ~B() { cout << "B 析构" << endl; }
};

int main() {
    // 创建两个共享指针，指向堆上的A和B对象
    shared_ptr<A> pa(new A);
    shared_ptr<B> pb(new B);

    // 互相指向，形成循环引用
    pa->b_ptr = pb;
    pb->a_ptr = pa;

    return 0;
}
```

上述代码运行后，会发现控制台只输出：

```Plain Text
A 构造
B 构造
```

**问题出现**：程序运行结束，`A`和`B`的**析构函数完全没有执行**！堆上的`A`和`B`对象永远不会被释放 → **内存泄漏**！

1. 执行 `shared_ptr<A> pa(new A)` → 堆 A 的引用计数 = **1**（只有 pa 指向它）；

2. 执行 `shared_ptr<B> pb(new B)` → 堆 B 的引用计数 = **1**（只有 pb 指向它）；

3. 执行 `pa->b_ptr = pb` → 堆 B 的引用计数 = **2**（pb \+ A 的 b\_ptr 共同指向）；

4. 执行 `pb->a_ptr = pa` → 堆 A 的引用计数 = **2**（pa \+ B 的 a\_ptr 共同指向）；

此时，**循环引用闭环形成**，接下来程序执行到`main`函数结束，局部变量`pa`和`pb`开始销毁：5\. 销毁`pb` → 堆 B 的引用计数 **\-1** → 堆 B 计数变为 **1**；6\. 销毁`pa` → 堆 A 的引用计数 **\-1** → 堆 A 计数变为 **1**；



堆 A 的引用计数`1`，来自于 **B 对象内部的 a\_ptr**；堆 B 的引用计数`1`，来自于 **A 对象内部的 b\_ptr**；

想要释放堆 A → 必须让 B 的 a\_ptr 销毁 → 想要销毁 B 的 a\_ptr → 必须释放堆 B；想要释放堆 B → 必须让 A 的 b\_ptr 销毁 → 想要销毁 A 的 b\_ptr → 必须释放堆 A；



- `shared_ptr`没有`release`函数

- `use_count()`可以知道有多少个`shared_ptr`在管理同一对象，返回`long`值

- `unique`返回`use_count`是否为1（`bool`值）



#### 循环引用的「3 种解决方案」

针对`shared_ptr`的循环引用，有**3 种成熟的解决方案**，优先级从高到低，**最优解只有一个**（开发中 99% 的场景用它），我们从「最优→次优→兜底」的顺序讲解，全部配可运行代码。



**方案一：使用 ****`std::weak_ptr`**** 打破循环引用**

这是**C\+\+ 标准库专门为解决 shared\_ptr 循环引用问题设计的方案**，也是最完美、最优雅的解决方案，没有任何副作用，是开发和面试的「标准答案」。



`std::weak_ptr` 是 C\+\+11 和`shared_ptr`配套推出的**弱引用智能指针**，同样定义在`<memory>`头文件，核心特性（必须记牢）：

- **弱引用**：`weak_ptr` 也能指向`shared_ptr`管理的对象，但**不会增加该对象的引用计数**；

- **不拥有所有权**：`weak_ptr` 只是一个「旁观者」，它不管理对象的生命周期，对象的释放完全由`shared_ptr`决定；

- **安全访问**：`weak_ptr` 不能直接通过`->`调用对象的成员，需要先通过`.lock()`方法升级为`shared_ptr`，再访问；

- **核心价值**：**专门用来打破 shared\_ptr 的循环引用**。



**解决方案核心思路**

把循环引用的两个`shared_ptr`成员变量中，**任意一个改成 ****`weak_ptr`** 即可！

> 原理：因为`weak_ptr`指向对象时「不增加引用计数」，闭环就会被打破，引用计数可以正常归 0。
> 
> 

**修复后的代码**

```C++
#include <iostream>
#include <memory>
using namespace std;
class B; 
class A {public:
    shared_ptr<B> b_ptr; // 不变，还是shared_ptr
    A() { cout << "A 构造" << endl; }~A() { cout << "A 析构" << endl; }};class B {public:
    weak_ptr<A> a_ptr;   // 关键修改：把shared_ptr改成weak_ptr
    B() { cout << "B 构造" << endl; }~B() { cout << "B 析构" << endl; }};
int main() {
    shared_ptr<A> pa(new A);
    shared_ptr<B> pb(new B);

    pa->b_ptr = pb;
    pb->a_ptr = pa; // weak_ptr接收shared_ptr，不会增加pa的引用计数
    return 0;
}
```

**修复后的引用计数变化**

1. `pa(new A)` → A 计数 = 1；`pb(new B)` → B 计数 = 1；

2. `pa->b_ptr = pb` → B 计数 = 2；

3. `pb->a_ptr = pa` → **A 计数依然 = 1**（weak\_ptr 不增加计数）；

main 函数结束销毁 pa/pb 时：

- 销毁 pb → B 计数 \- 1 → B 计数 = 1；

- 销毁 pa → A 计数 \- 1 → A 计数 = 0 → **触发 A 的析构**；

- A 析构时，内部的 b\_ptr 也会销毁 → B 计数 \- 1 → B 计数 = 0 → **触发 B 的析构**；

闭环被打破，所有内存正常释放！



**weak\_ptr 如何访问对象？（补充：lock \(\) 方法）**

`weak_ptr`不能直接调用对象成员，需要通过`.lock()`方法**安全升级为 shared\_ptr**，`.lock()`的特性：

- 如果原对象**还存在** → 返回一个指向该对象的`shared_ptr`（此时计数 \+ 1）；

- 如果原对象**已被释放** → 返回一个**空的 shared\_ptr**（不会野指针，非常安全）；

```C++
// 在上述修复后的代码中，新增访问逻辑
if(shared_ptr<A> p = pb->a_ptr.lock()) {
// 对象存在，安全访问
    cout << "成功访问A对象" << endl;
} else {
// 对象已释放，避免野指针
    cout << "A对象已被销毁" << endl;
}
```



**方案二：手动断开循环引用 【次优解，应急使用】**

这是一种「手动处理」的方案，原理非常简单：**在****`main`****函数结束前，手动将互相引用的****`shared_ptr`****成员置空，主动打破闭环**。



**核心思路**

循环引用的闭环是 `pa->b_ptr = pb` \+ `pb->a_ptr = pa`，我们只需要在销毁 pa/pb 之前，手动把其中一个指针置空，闭环就会被打破。

**修复代码**

```C++
#include <iostream>
#include <memory>
using namespace std;
class B; 
class A { public: shared_ptr<B> b_ptr; A(){cout<<"A构造"<<endl;} ~A(){cout<<"A析构"<<endl;} };
class B { public: shared_ptr<A> a_ptr; B(){cout<<"B构造"<<endl;} ~B(){cout<<"B析构"<<endl;} };int main() {
    shared_ptr<A> pa(new A);
    shared_ptr<B> pb(new B);

    pa->b_ptr = pb;
    pb->a_ptr = pa;    // 手动断开循环引用：任意置空一个即可
    pa->b_ptr = nullptr;
    return 0;
}
```

**优缺点**

优点：简单粗暴，无需修改类的成员变量类型，应急场景可用；

缺点：**侵入性强、极易遗漏**，开发中如果忘记手动置空，就会内存泄漏；而且如果是多层循环引用（比如 A→B→C→A），手动置空的逻辑会非常繁琐，不推荐在正式开发中使用。



方案三：改用 `std::unique_ptr` 避免循环引用 【兜底方案，场景适配】

这个方案的核心是「**从根源上避免循环引用的产生**」，原理是：

> `shared_ptr`的循环引用，本质是「共享所有权」导致的互相牵制；而`unique_ptr`是「独占所有权」，**两个 unique\_ptr 无法互相指向对方形成闭环**，自然不会有循环引用问题。
> 
> 

**适用场景**

如果你的业务逻辑中，**两个对象的引用关系是「单向」的**，而不是「双向」的，那么可以直接用`unique_ptr`替代`shared_ptr`，彻底规避循环引用。

**示例代码**

```C++
#include <iostream>
#include <memory>
using namespace std;
class B; 
class A {
public:
    unique_ptr<B> b_ptr; // 独占指向B
    A(){cout<<"A构造"<<endl;}~A(){cout<<"A析构"<<endl;}
};
class B {
public:
    A* a_ptr; // B只是用裸指针指向A，不管理所有权
    B(){cout<<"B构造"<<endl;}~B(){cout<<"B析构"<<endl;}
};
int main() {
    unique_ptr<A> pa(new A);
    pa->b_ptr = make_unique<B>();
    pa->b_ptr->a_ptr = pa.get(); // get()获取裸指针，不转移所有权
    return 0;
}
```

**优缺点**

优点：从根源解决问题，无循环引用风险，效率比 shared\_ptr 更高（无引用计数开销）；

缺点：**适用场景有限**，只适合「单向依赖」的业务逻辑；如果是「双向依赖」，用 unique\_ptr 会导致代码繁琐，而且需要手动管理裸指针的生命周期，有一定风险。
