---
title: "C++ - 函数指针"
description: "C++ 学习笔记：函数指针"
tags:
  - "concept"
  - "C++"
---
# C++ - 函数指针

## 函数指针

函数指针是**C 语言特性在 C\+\+ 中的完美兼容**，C\+\+ 在其基础上还扩展了「函数对象 / 仿函数」

### 函数指针的概念

#### 普通指针的本质

我们熟悉的普通指针（`int*`/`char*`/`类名*`）：**是一个变量，存储的是「内存中数据的地址」**。

```C++
int a = 10;
int* p = &a; // p存储的是 变量a 的内存地址
```

#### 函数指针的本质

函数指针：**也是一个变量，存储的是「内存中函数的入口地址」。**

C\+\+ 中，**每一个函数在编译后，都会被加载到内存的代码区，拥有一个唯一的入口地址。**这个入口地址，就是函数指针要存储的值。通过函数指针，我们可以**间接调用**这个函数，效果和直接写函数名调用完全一致。

函数指针 = 指向「函数」的指针，变量存的是函数的内存地址，作用是**间接调用函数**。

### 函数指针的语法

#### 基础语法

```C++
// 函数指针的定义语法：返回值类型 (*指针变量名)(函数的形参列表);
返回值类型 (*fp) (形参类型1, 形参类型2, ...);
/*
(*fp) 必须带**圆括号**：* 表示是指针，fp 是函数指针的变量名，括号不能省略，否则变成「返回值为指针的函数」；
括号左侧：写**函数的返回值类型**，和目标函数一致；
括号右侧：写**函数的形参类型列表**，和目标函数完全一致（个数、类型、顺序）；
赋值：函数指针变量 = 目标函数名 即可（函数名本身就是函数的入口地址，**不用加 &**，加了也不报错）。
*/
```

#### 指向无参、无返回值的函数指针

```C++
#include <iostream>
using namespace std;

// 目标函数：无参、无返回值
void func() {
    cout << "调用了无参无返回值的func函数" << endl;
}

int main() {
    // 1. 定义函数指针：返回值void，无参数
    void (*fp)();
    // 2. 赋值：函数名就是函数地址，赋值给函数指针
    fp = func; 
    // 3. 调用方式1：解引用调用（推荐，语义清晰）
    (*fp)();
    // 4. 调用方式2：直接调用（语法允许，等价解引用，偷懒写法）
    fp();
    
    return 0;
}
//运行结果：
//调用了无参无返回值的func函数
//调用了无参无返回值的func函数
```

#### 指向有参、有返回值的函数指针

```C++
#include <iostream>
using namespace std;

// 目标函数：有参(int, int)、有返回值(int)
int add(int a, int b) {
    return a + b;
}
int sub(int a, int b) {
    return a - b;
}

int main() {
    // 1. 定义函数指针：返回值int，形参(int,int)
    int (*fp)(int, int);
    
    // 2. 指向add函数，调用
    fp = add;
    cout << "加法：" << (*fp)(10,5) << endl; // 输出 15
    
    // 3. 指向sub函数，调用（同一个函数指针可以指向不同的「同类型函数」）
    fp = sub;
    cout << "减法：" << (*fp)(10,5) << endl; // 输出 5
    
    return 0;
}
```

**同一个函数指针，可以指向「返回值 \+ 形参列表完全相同」的任意函数** → 这是函数指针的核心价值！

#### 用`typedef`简化函数指针

上面的函数指针语法 `int (*fp)(int,int)` 有个致命问题：**写法臃肿、可读性差**，尤其是在传参 / 作为函数返回值时，代码会变得极其丑陋。

C\+\+ 提供了 **`typedef`**** 类型别名** 来简化函数指针，这是**开发中的标准写法。**

```C++
// 为「函数指针类型」起一个别名
typedef 返回值类型 (*别名)(形参列表);
```

用 typedef 改写上面的案例

```C++
#include <iostream>
using namespace std;

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

// 核心：为「int(*)(int,int)」这个函数指针类型，起别名 CalcFunc
typedef int (*CalcFunc)(int, int);

int main() {
    // 直接用别名定义函数指针，语法清爽！
    CalcFunc fp;
    
    fp = add;
    cout << (*fp)(10,5) << endl; //15
    
    fp = sub;
    cout << (*fp)(10,5) << endl; //5
    
    return 0;
}
```

### 深入理解函数指针

#### 函数指针 指向「类的普通成员函数」

**重要结论**：**普通的函数指针，不能指向「类的成员函数」**！

原因：类的成员函数，编译后会被编译器**隐式添加一个参数 ****`this`**** 指针**，导致成员函数的「实际形参列表」和「普通函数」不一致，比如：

```Java
class Test {
public:
    int add(int a, int b) { return a+b; } // 实际形参：(Test* this, int a, int b)
};
int add(int a, int b) { return a+b; } // 实际形参：(int a, int b)
```

解决方案：需要用 **「类的成员函数指针」**，语法是：

```C++
// 成员函数指针语法：类名::*指针名
typedef int (Test::*MemFunc)(int, int);//不能指向静态成员函数！！！
```

#### 函数指针 指向「类的静态成员函数」

**重要结论**：**普通函数指针，可以直接指向类的静态成员函数**！

原因：类的`static`静态成员函数，**没有 this 指针**，本质上和「全局普通函数」完全一致，符合函数指针的匹配规则：

```C++
#include <iostream>
using namespace std;

class Calc {
public:
    static int add(int a, int b) { return a+b; }
    static int sub(int a, int b) { return a-b; }
};
typedef int (*CalcFunc)(int, int);

int main() {
    CalcFunc fp = Calc::add;
    cout << (*fp)(10,5) << endl; //15
    return 0;
}
```

#### 函数指针 指向「const 修饰的函数」

只要函数指针的返回值 \+ 形参列表，和`const`成员函数（普通 const 函数）完全一致，就可以正常指向，无任何限制：

```TypeScript
void print(const string& msg) { cout << msg << endl; }
typedef void (*PrintFunc)(const string&);

int main() {
    PrintFunc fp = print;
    (*fp)("const 参数的函数");
    return 0;
}
```

#### C\+\+ 对函数指针的「升级方案」：函数对象（仿函数）

函数对象：重载了 `()` 运算符的类 / 结构体，实例化后的对象可以像「函数」一样被调用，比如：

```SQL
struct Add {
    int operator()(int a, int b) { return a+b; }
};
Add add;
cout << add(10,5) << endl; // 像调用函数一样调用对象，输出15
```

> 结论：**C\+\+ 开发中，能用函数对象就不用函数指针**，函数指针更多是兼容 C 语言的场景，以及底层开发
> 
>
