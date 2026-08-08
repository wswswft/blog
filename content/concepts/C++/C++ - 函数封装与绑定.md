---
title: "C++ - 函数封装与绑定"
description: "C++ 学习笔记：函数封装与绑定"
tags:
  - "concept"
  - "C++"
---
# C++ - 函数封装与绑定

## STL标准模板库：函数封装与绑定 

### std::fuction

`std::function`是一个**普通的类模板对象**，满足 C\+\+ 的「值语义」，可以：

1. 直接**存储**在任意 STL 容器中（比如`vector<std::function<...>>`）；

2. 直接作为**函数的参数**传递（实现「回调函数」的核心方式）；

3. 直接作为**函数的返回值**返回；

4. 作为类的成员变量，存储「回调逻辑」。

示例 1：把`std::function`存入 vector 容器

```C++
#include <functional>
#include <vector>
#include <iostream>
using namespace std;

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main() {
    // 容器存储多个同签名的可调用对象
    vector<function<int(int, int)>> func_vec;
    func_vec.push_back(add);
    func_vec.push_back(sub);
    func_vec.push_back([](int a, int b){ return a*b; }); // 直接存lambda

    // 遍历调用所有函数
    for(auto& f : func_vec) {
        cout << f(5,2) << " "; // 输出：7 3 10
    }
    return 0;
}
```

### std::bind \& std::cref
