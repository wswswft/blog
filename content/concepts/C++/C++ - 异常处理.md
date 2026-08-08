---
title: "C++ - 异常处理"
description: "C++ 学习笔记：异常处理"
tags:
  - "concept"
  - "C++"
---
# C++ - 异常处理

## 异常

异常是程序在执行期间产生的问题。C\+\+ 异常是指在程序运行时发生的特殊情况，比如尝试除以零的操作。

异常提供了一种转移程序控制权的方式。C\+\+ 异常处理涉及到三个关键字：**try、catch、throw**。

- **throw:** 当问题出现时，程序会抛出一个异常。这是通过使用 **throw** 关键字来完成的。

- **catch:** 在您想要处理问题的地方，通过异常处理程序捕获异常。**catch** 关键字用于捕获异常。

- **try:** **try** 块中的代码标识将被激活的特定异常。它后面通常跟着一个或多个 catch 块。

如果有一个块抛出一个异常，捕获异常的方法会使用 **try** 和 **catch** 关键字。try 块中放置可能抛出异常的代码，try 块中的代码被称为保护代码。使用 try/catch 语句的语法如下所示：

```C++
try {    
// 保护代码 
}catch( ExceptionName e1 ) 
{    
// catch 块 
}catch( ExceptionName e2 ) 
{    
// catch 块 
}catch( ExceptionName eN ) 
{    
// catch 块 
}
```

### 抛出异常

可以使用 **throw** 语句在代码块中的任何地方抛出异常。throw 语句的操作数可以是任意的表达式，表达式的结果的类型决定了抛出的异常的类型，可以throw一个类，甚至是函数指针。

以下是尝试除以零时抛出异常的实例：

```Java
double division(int a, int b)
{
   if( b == 0 )
   {
      throw "Division by zero condition!";
   }
   return (a/b);
}
```

### 捕获异常

**catch** 块跟在 **try** 块后面，用于捕获异常。您可以指定想要捕捉的异常类型，这是由 catch 关键字后的括号内的异常声明决定的，如果捕获的是类对象，则它的继承类对象也可以被捕获。

```C++
try
{
   // 保护代码
}catch( ExceptionName e )
{
  // 处理 ExceptionName 异常的代码
}
```

上面的代码会捕获一个类型为 **ExceptionName** 的异常。如果您想让 catch 块能够处理 try 块抛出的任何类型的异常，则必须在异常声明的括号内使用省略号 \.\.\.，如下所示：

```C++
try
{
   // 保护代码
}catch(...)
{
  // 能处理任何异常的代码
  throw；//可以再抛出去
}
```

下面是一个实例，抛出一个除以零的异常，并在 catch 块中捕获该异常。

- 一般情况下是用runtime\_error类来定义异常

```C++
#include <iostream>
using namespace std;
 
double division(int a, int b)
{
   if( b == 0 )
   {
      throw "Division by zero condition!";
   }
   return (a/b);
}
 
int main ()
{
   int x = 50;
   int y = 0;
   double z = 0;
 
   try {
     z = division(x, y);
     cout << z << endl;
   }catch (const char* msg) {
     cerr << msg << endl;
   }
 
   return 0;
}
```

由于我们抛出了一个类型为 **const char\*** 的异常，因此，当捕获该异常时，我们必须在 catch 块中使用 const char\*。当上面的代码被编译和执行时，它会产生下列结果：

```C++
Division by zero condition!
```



### C\+\+ 标准的异常

C\+\+ 提供了一系列标准的异常，定义在 **\<exception\>** 中，我们可以在程序中使用这些标准的异常。它们是以父子类层次结构组织起来的，如下所示：

```Plain Text
std::exception  <--- 所有标准异常的基类
    ├─ std::bad_alloc             内存分配失败异常（new 申请内存失败时抛出）
    ├─ std::bad_cast              动态类型转换失败异常（dynamic_cast 失败时抛出）
    ├─ std::bad_typeid            获取类型信息失败异常（typeid 操作空指针时抛出）
    ├─ std::bad_exception         异常处理机制内部错误（极少出现）
    └─ std::logic_error           逻辑错误（编译/编码阶段本可避免的错误）
         ├─ std::domain_error     参数定义域错误（参数不在合法范围内）
         ├─ std::invalid_argument 非法参数错误（传入无效的函数参数）
         ├─ std::length_error     长度错误（容器/字符串长度超出最大限制）
         ├─ std::out_of_range     越界访问（数组/容器的下标越界、at() 越界）
    └─ std::runtime_error         运行时错误（编译阶段无法预知，运行时才发生的错误）
         ├─ std::range_error      数值范围错误（计算结果超出类型表示范围）
         ├─ std::overflow_error   算术上溢错误（数值太大，超出类型上限）
         ├─ std::underflow_error  算术下溢错误（数值太小，超出类型下限）
```

- 您可以通过继承和重载 **exception** 类来定义新的异常

```Java
float divide(float a, float b){
    if(b==0)
        throw runtime_error(" Divided by zero! ");
    return a/b;
}

int main(void){
    try{
        int c =divide(3.1,0);
        cout<<"c=."<<c<<endl;
    }
    catch(runtime_error& e){
        cout<<"excepion:"<<e.what()<<endl;
    }
    return 0;
}
//**what()** 是异常类提供的一个公共方法，它已被所有子异常类重载。这将返回异常产生的原因
```

### 总结

1. C\+\+ 标准异常的根类是 `std::exception`，所有标准异常都继承于它，头文件 `<exception>`。

2. 核心方法 `virtual const char* what() const noexcept;`，返回异常描述，子类重写实现多态。

3. 两大核心分支：`logic_error`（逻辑错误，可避免）、`runtime_error`（运行时错误，不可预见）。

4. 捕获异常的最优写法：`catch(const exception& e)`，兜底必加 `catch(...)`。

5. 捕获顺序：**子类异常在前，基类异常在后**，否则子类异常无法被捕获。

6. 手动抛异常用 `throw` 关键字，自定义异常必须继承标准异常类。

7. C\+\+11 `noexcept`：声明函数无异常，提高效率，抛异常则直接终止程序。

### 异常处理过程中的资源释放问题

C\+\+ 中，当代码执行到 `throw` 抛出异常的那一刻，**程序的正常执行流程会被立刻中断**：

从 `throw` 所在的行开始，不会执行当前函数后续的任何代码 → 直接跳转到匹配的 `catch` 块执行。

这种「执行流强行跳转」，会导致一个致命问题：**在 ****`try{}`**** 块中，****`throw`**** 之前申请的资源（堆内存、打开的文件、网络连接、锁、句柄等），对应的****`释放代码`****根本没机会执行！**

> ### 场景 1：堆内存资源泄漏
> 
> `new / new[]` 申请的堆内存，`throw` 导致 `delete / delete[]` 未执行 → 内存泄漏。
> 
> ### 场景 2：文件 / 设备句柄泄漏
> 
> `fopen()`/`open()` 打开的文件、串口、管道，`throw` 导致 `fclose()`/`close()` 未执行 → 句柄泄漏，严重时会导致程序无法再打开新文件。
> 
> ### 场景 3：锁资源泄漏
> 
> 加锁 `mutex.lock()` 后，执行代码抛出异常 → 解锁 `mutex.unlock()` 未执行 → 锁永远锁住，其他线程死等，程序死锁。
> 
> 

### 只 `throw`不`catch`

如果在 C\+\+ 中只 `throw` 异常但**不写任何 ****`catch`**** 块捕获**，程序会触发 **「未捕获异常（uncaught exception）」** 机制，最终**强制终止运行**。这个过程的底层逻辑和行为可以分为三步，我们一步步拆解：

#### 一、第一步：触发栈展开（Stack Unwinding），但找不到匹配的 `catch`

当代码执行到 `throw`时，C\+\+ 会启动**栈展开**流程：

1\.  从抛出异常的函数开始，**逐层销毁当前栈帧中的局部对象**（包括 RAII 对象、智能指针等，析构函数会正常执行，资源会被释放）；

2\.  每销毁一层栈帧，就检查当前层是否有匹配的 `catch` 块；

3\.  如果一直展开到**主函数 ****`main()`** 都没有找到任何 `catch` 块，就会进入下一步。

> 注意：栈展开时，**局部对象的析构函数一定会执行**，这是 RAII 机制能保证资源不泄漏的关键——哪怕没有 `catch`，资源也会被释放。
> 
> 

#### 二、第二步：调用标准库函数 `std::terminate()`

当栈展开到 `main()`仍无匹配的 `catch`，C\+\+ 会自动调用 **`std::terminate()`**** 函数**（定义在 `<exception>` 头文件中）。

`std::terminate()` 的默认行为是：

1\.  调用 `std::abort()` 函数

2\.  `std::abort()` 会直接**终止程序进程**，并且**不会执行后续的代码**（比如 `main()`的 `return`、全局对象的析构等）。

#### 三、第三步：程序强制终止，返回错误码

`std::abort()` 终止程序时，会向操作系统返回一个**非 0 的错误码**（表示程序异常退出），同时：

- 控制台可能会输出**异常终止的提示信息**（具体内容取决于编译器和操作系统，比如 GCC 会提示 `terminate called after throwing an instance of ...`）

- 程序不会执行 `atexit()` 注册的清理函数，也不会调用全局/静态对象的析构函数

- 这种退出属于**异常退出**，区别于 `return 0` 的正常退出。

要不要我帮你写一个**带全局对象\+RAII的完整测试代码**，直观展示「哪些对象会析构，哪些不会」？
