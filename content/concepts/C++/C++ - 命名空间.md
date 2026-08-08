---
title: "C++ - 命名空间"
description: "C++ 学习笔记：命名空间"
tags:
  - "concept"
  - "C++"
---
# C++ - 命名空间

## 命名空间

### 常用的三种使用方式

```C++
#include <iostream>
using namespace std;    //引入std的所有标识符
// ....
cout << "Hello\n";

using std::cout;        //引入std::cout标识符
// ....
cout << " Hello\n";

// ....
std::cout << "Hello\n";  //直接使用限定名std::cout
```

```C++
void foo(int a, int b){
    cout << "Global Foo" << endl;
}

namespace MyNamespace
{
    void foo(int a, int b){
        cout << "MyNamespace::Foo" << endl;
    }
}

using MyNamespace::foo;
int main(void)
{
    foo(0,1);//报错‘void MyNamespace::foo(int, int)’ conflicts with a previous declaration
    ::foo(0,1);//把前面的using注释掉之后可以编译通过，调用全局命名空间中的foo
}


```
