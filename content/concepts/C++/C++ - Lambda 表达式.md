---
title: "C++ - Lambda 表达式"
description: "C++ 学习笔记：Lambda 表达式"
tags:
  - "concept"
  - "C++"
---
# C++ - Lambda 表达式

## Lambda表达式

本质就是一个类

```C++
#include <vector>
#include <algorithm>
#include <iostream>

int main()
{
    std::vector<int> v = {3,1,4,1,5,9,2,6,5};

    // 1. 最简单 - 什么都不捕获
    std::sort(v.begin(), v.end(), [](int a, int b){ return a < b; });

    // 2. 按值捕获（最常用）
    int threshold = 4;
    auto it = std::remove_if(v.begin(), v.end(),
                             [threshold](int x){ return x <= threshold; });

    // 3. 按引用捕获（要修改外部变量时用）
    int count = 0;
    std::for_each(v.begin(), v.end(), [&count](int x){ if(x%2==0) ++count; });

    // 4. 混合捕获（C++14 常用写法） 加mutable之后，捕获的成员都可以修改
    int base = 100;
    std::for_each(v.begin(), v.end(), [base, &count](int x){
        if (x > 5) count += base;
    });

    // 5. 默认捕获（尽量少用，但很常见） 注意默认和显式捕获不能是同一类型
    // [ = ]   全部按值捕获
    // [ & ]   全部按引用捕获
    int sum = 0;
    std::for_each(v.begin(), v.end(), [&](int x){ sum += x; });  // 危险但简洁

    // 6. 无捕获 + 返回值类型后置（常见于复杂返回类型）
    auto safe_div = [](double a, double b) -> double {
        return b == 0 ? 0.0 : a / b;
    };

    // 7. 立即调用（IIFE - Immediately Invoked Function Expression）
    int version = []{
        #ifdef NDEBUG
            return 100;
        #else
            return 999;
        #endif
    }();
}
```

还可以捕获\[`this`\]\(按引用捕获\) / \[`*this`\]\(按值捕获\)，能调用类中的所有成员

对于两种默认捕获与\[\&,`this`\],`this`都是按引用捕获的

\[=,\*`this`\] C\+\+17 支持全部按引用捕获

\[=,`this`\] C\+\+ 20 支持

Lambda表达式中，不需要捕获就可以使用自定义变量以及外层代码中的静态变量与全局变量量



泛型Lambda：C\+\+14以后，在Lambda表达式的参数类型中使用`auto`关键字
