---
title: "C++ - 宏"
description: "C++ 学习笔记：宏"
tags:
  - "concept"
  - "C++"
---
# C++ - 宏

## 宏

- 格式为`#define 标识符 替换表达式`

### 空宏与宏有关语句

```C++
#define LARGE_ARRAY //本身没意义，与ifdef等结合起来有意义

#ifdef LARGE_ARRAY
    #define MAX_SIZE 60
#else
     #define MAX_SIZE 20   
#endif

#if MAX_SIZE>50
    #undef MAX_SIZE //取消宏定义
    #define MAX_SIZE 100
#endif     
```

- `#ifdef identifier` 等价于 `#if defined identifier`

- `#ifndef identifier` 等价于 `#if !defined identifier`

```C++
#if !defined(_WIN32) && !defined(__APPLE__) && defined(__linux__)
// 只在纯 Linux 上启用某些代码
#endif

// 或者更复杂的：
#if defined(DEBUG) || !defined(NDEBUG) || (defined(VERSION) && VERSION >= 3)
// ...
#endif
```

### 宏函数

```C++
#define 标识符(参数列表) 替换表达式

#define MUL(a,b) a*b
MUL(3,2);     //替换为 3*2；
MUL(3,1+1);   //替换为 3*1 + 1； 需要注意

#define MUL(a,b) (a)*(b)
MUL(3,2);     //替换为 3*2；
MUL(3,1+1);   //替换为 3*(1+1)； 现在没问题了

inline int mul(int a,int b){return a*b} //上述可以被内联函数取代
```

### 宏定义常用操作符

- `#`号：将符号转为字符串

```C++
#define PRINT(a) cout<<#a<< " = " << (a) << "";
//预处理器会将#a替换为以字符串表示的参数a
float a= 3.0;
PRINT(a*2+3);
//输出> a*2+3 = 9
```

- `##`号：连接符

```C++
#define MEMBER(type,a) type m_##a
struct demo{
    MEMBER(int,a);
    MEMBER(float,b);
}
//会被翻译为
struct demo{
    int m_a;
    float m_b;
}
```

- `\`号：连接多行宏定义

### 预定义宏

C\+\+ 中的**预定义宏**（predefined macros）是由编译器自动提供的宏，它们不需要你自己 `#define`，直接就可以在代码中使用（包括 `#if`、`#ifdef` 等条件编译）。



这些宏主要用于：



- 识别编译器支持的 C\+\+ 标准版本

- 获取当前文件/行号/编译时间（调试、日志、版本信息）

- 条件编译（针对不同平台、编译器、标准）

- 检测语言特性（C\+\+20 起大量 feature\-test 宏）

    

#### 1\. C\+\+ 标准强制要求的预定义宏



|宏名|类型|示例值（取决于编译选项）|含义 / 用途|引入标准|备注|
|---|---|---|---|---|---|
|`__cplusplus`|整数常量|202302L \(C\+\+23\)<br>202002L \(C\+\+20\)<br>201703L \(C\+\+17\)<br>201402L \(C\+\+14\)<br>201103L \(C\+\+11\)<br>199711L \(C\+\+98\)|当前编译的 C\+\+ 标准版本（yyyymmL 格式）|C\+\+98|最重要、最常用的一个|
|`__FILE__`|字符串字面量|"main\.cpp" 或完整路径|当前源文件名|C\+\+98|常用于日志、断言|
|`__LINE__`|整数常量|42|当前行号（每行都会变）|C\+\+98|同上|
|`__DATE__`|字符串字面量|"Jan 14 2026"|编译日期（Mmm dd yyyy 格式）|C\+\+98|嵌入版本信息|
|`__TIME__`|字符串字面量|"14:29:01"|编译时间（hh:mm:ss 格式）|C\+\+98|同上|
|`__STDC_HOSTED__`|整数常量|1（hosted）或 0（freestanding）|是否是 hosted 实现（有完整标准库）|C99 / C\+\+11|嵌入式系统常用 0|
|`__func__`|const char\[\]|"main" 或函数名|当前函数名（**不是宏**，是预定义的标识符）|C99 / C\+\+11|常用于日志|



#### 2\. C\+\+20 以后新增的预定义宏



从 C\+\+20 开始，标准引入了大量的 `__cpp_xxx` 宏，用于**精确检测某个语言/库特性是否被支持**，而不再只依赖 `__cplusplus`。

这些宏定义在 `<version>` 头文件中，但很多编译器会预定义它们（值是引入年月）。

完整列表可参考 cppreference 的 [feature test macros](https://en.cppreference.com/w/cpp/feature_test) 页面（2026 年时 C\+\+26 实验特性也会继续增加）。

#### 3\. 常用但**非标准**（编译器特定）的预定义宏



这些在实际项目中非常常见，用于跨编译器/平台条件编译：

- GCC/Clang：`__GNUC__`, `__GNUC_MINOR__`, `__GNUC_PATCHLEVEL__`, `__clang__`

- MSVC：`_MSC_VER`, `_MSVC_LANG`

- 平台：`__linux__`, `_WIN32`, `_WIN64`, `__APPLE__`, `__FreeBSD__` 等

- 架构：`__x86_64__`, `__arm__`, `__aarch64__` 等

示例（条件编译经典写法）：

```C++
#if __cplusplus >= 202002L
    // 用 C++20 的 concepts / ranges / format
#elif __cplusplus >= 201703L
    // C++17 代码
#else
    // 老代码
#endif

#if defined(__GNUC__) && __GNUC__ >= 12
    // GCC 12+ 专用优化
#endif

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
#endif
```



```C++
#include <iostream>
#include <version>   // 很多 __cpp_ 宏在这里

int main()
{
    std::cout << "C++ standard: " << __cplusplus << "\n";
    std::cout << "File: " << __FILE__ << "\n";
    std::cout << "Line: " << __LINE__ << "\n";
    std::cout << "Compiled: " << __DATE__ << " " << __TIME__ << "\n";
    std::cout << "Function: " << __func__ << "\n";

#ifdef __cpp_lib_concepts
    std::cout << "concepts supported (value=" << __cpp_lib_concepts << ")\n";
#else
    std::cout << "no concepts\n";
#endif
}
```

- 日常最常用：`__cplusplus`、`__FILE__`、`__LINE__`、`__func__`

- 写库/跨平台代码：优先用 `__cplusplus` \+ feature\-test 宏（如 `__cpp_lib_ranges`）

- 永远不要 `#define` 或 `#undef` 标准预定义宏（未定义行为）

### 可变参的宏函数

```C++
#include <cstdio>

// 最常用、最安全的写法
#define LOG_INFO(fmt, ...)      \
    printf("[INFO] " fmt "\n", ##__VA_ARGS__)

// 支持零参数（空 ...）
#define LOG_WARN(fmt, ...)      \
    printf("[WARN] " fmt "\n", ##__VA_ARGS__)

// 带文件/行号/函数名（非常常见）
#define LOG_ERROR(fmt, ...)     \
    fprintf(stderr, "[ERROR] %s:%d %s(): " fmt "\n", \
            __FILE__, __LINE__, __func__, ##__VA_ARGS__)

// 使用示例
int main()
{
    int x = 42;
    const char* name = "Alice";

    LOG_INFO("Starting program");                    // 零参数
    LOG_INFO("Value = %d", x);                       // 一个参数
    LOG_INFO("User: %s, score: %d", name, 100);      // 多个参数
    LOG_ERROR("Failed to open file '%s'", "config.ini");

    return 0;
}
```

**关键点解释：**

- \.\.\. 表示可变参数（就像函数的 \.\.\.）

- VA\_ARGS 是预处理器内置的，代表所有传入的可变参数

- \#\# 是“吃掉逗号”的操作符：

    - 当 \_\_VA\_ARGS\_\_ 为空时，\#\#\_\_VA\_ARGS\_\_ 会自动删除前面的逗号

    - 避免了 printf\("msg", \) 这样的语法错误
