---
title: "HITCRT C++ 代码风格规范"
description: "HITCRT C++ 命名、注释和格式规范"
tags:
  - "project"
  - "HITCRT2026"
  - "coding-standard"
---
# HITCRT C++ 代码风格规范

## 命名规范

- **局部变量**：使用小写字母和下划线分隔（snake\_case）。

```C++
int max_size = 100;
```

- **成员变量**：使用小写字母和下划线分隔，并以下划线结尾。

```C++
class MyClass {
    int count_;
};
```

- **全局变量**：使用全大写字母和下划线分隔（UPPER\_SNAKE\_CASE）。

```C++
const int MAX_BUFFER_SIZE = 1024;
```

- **函数**：使用小写字母和驼峰命名法（camelCase）。

```C++
int calculateTotalCost();
void processOrder();
```

- **类、结构体、枚举类型**：使用大写字母开头的驼峰命名法（PascalCase）。

```C++
class NetworkManager;
struct DataPack;
enum class Color;
```

- **枚举值**：根据 C\+\+11 标准，枚举分为两种类型：**传统枚举**（unscoped enum）和 **强类型枚举**（scoped enum，也叫 `enum class`）。

- 在传统枚举中，枚举值是直接暴露在枚举外部的命名空间中的，因此需要格外小心使用名称，避免与其他命名发生冲突。为了与其他普通变量区分，枚举值使用全大写字母和下划线分隔。此外，为了避免污染全局命名空间，需要为每个枚举值添加与枚举类型相关的前缀。

```C++
enum Color {
    COLOR_RED,
    COLOR_GREEN,
    COLOR_BLUE,
};
```

- C\+\+11 引入了 **`enum class`**，它解决了传统枚举的一些问题，最重要的是：枚举值不再污染枚举外部的作用域。因此，强类型枚举的命名方式可以更加简洁，与枚举类型的命名风格保持一致，使用**首字母大写的驼峰命名法**（PascalCase）。

```C++
enum class Color {
    Red,
    Green,
    Blue
};
```

- **常量**：使用全大写字母和下划线分隔（UPPER\_SNAKE\_CASE）。

```C++
const int MAX_CONNECTIONS = 100;
constexpr double PI = 3.14159;
```

- **宏**：使用全大写字母和下划线分隔（UPPER\_SNAKE\_CASE）。

```C++
#define MAX_BUFFER_SIZE 1024
```

## 变量命名规范

### 通用

- **避免使用中文拼音**：变量名应使用英语，而不是中文拼音。

```C++
// 不推荐
int yonghuMing;
// 推荐
int userName;
```

- **避免使用缩写**：除非是广为人知的缩写（如 HTML、URL 等），否则应使用完整的单词。

```C++
// 不推荐
int numOfElems;
// 推荐
int numberOfElements;
```

- **使用有意义的名称**：变量名应该清晰地表达其用途或含义，避免使用无意义的名称如 a、b、foo 等。

```C++
// 不推荐
int x;
// 推荐
int itemCount;
```

- **布尔变量命名**：布尔变量或返回布尔值的函数应使用 is、has、can 等前缀，使其含义更加明确。

```C++
bool isReady;
bool hasPermission;
bool canProceed();
```

### RoboMaster 相关

对于 RoboMaster 相关的变量命名，你需要参考：

- 中文版规则手册：[RoboMaster 2024 机甲大师超级对抗赛比赛规则手册V2\.1（20240722）\.pdf \(](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E8%B6%85%E7%BA%A7%E5%AF%B9%E6%8A%97%E8%B5%9B%E6%AF%94%E8%B5%9B%E8%A7%84%E5%88%99%E6%89%8B%E5%86%8CV2.1%EF%BC%8820240722%EF%BC%89.pdf)[djicdn\.com](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E8%B6%85%E7%BA%A7%E5%AF%B9%E6%8A%97%E8%B5%9B%E6%AF%94%E8%B5%9B%E8%A7%84%E5%88%99%E6%89%8B%E5%86%8CV2.1%EF%BC%8820240722%EF%BC%89.pdf)[\)](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E8%B6%85%E7%BA%A7%E5%AF%B9%E6%8A%97%E8%B5%9B%E6%AF%94%E8%B5%9B%E8%A7%84%E5%88%99%E6%89%8B%E5%86%8CV2.1%EF%BC%8820240722%EF%BC%89.pdf)

- 英文版规则手册：[https://terra\-1\-g\.djicdn\.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster) 2024 University Championship Rules Manual V2\.1 \(20240722\)\.pdf

- 中文版机器人制作规范手册：[RoboMaster 2024 机甲大师高校系列赛机器人制作规范手册V2\.0（20240704）\.pdf \(](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E9%AB%98%E6%A0%A1%E7%B3%BB%E5%88%97%E8%B5%9B%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%88%B6%E4%BD%9C%E8%A7%84%E8%8C%83%E6%89%8B%E5%86%8CV2.0%EF%BC%8820240704%EF%BC%89.pdf)[djicdn\.com](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E9%AB%98%E6%A0%A1%E7%B3%BB%E5%88%97%E8%B5%9B%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%88%B6%E4%BD%9C%E8%A7%84%E8%8C%83%E6%89%8B%E5%86%8CV2.0%EF%BC%8820240704%EF%BC%89.pdf)[\)](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20%E6%9C%BA%E7%94%B2%E5%A4%A7%E5%B8%88%E9%AB%98%E6%A0%A1%E7%B3%BB%E5%88%97%E8%B5%9B%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%88%B6%E4%BD%9C%E8%A7%84%E8%8C%83%E6%89%8B%E5%86%8CV2.0%EF%BC%8820240704%EF%BC%89.pdf)

- 英文版机器人制作规范手册：[RoboMaster 2024 University Series Robot Building Specifications Manual V2\.0 \(20240712\)\.pdf \(djicdn\.com\)](https://terra-1-g.djicdn.com/b2a076471c6c4b72b574a977334d3e05/RM2024/RoboMaster%202024%20University%20Series%20Robot%20Building%20Specifications%20Manual%20V2.0%20(20240712).pdf)

下面给出其中几个常用的单词中英文对照：

\<aside\> 💡

如果不清楚或纠结变量或函数命名，可以询问 ChatGPT，给出变量或函数的用途、类型（返回值）、作用域、命名风格。例如：

你：

“我有一个变量，它保存用户的年龄，类型是 `int`，它是一个局部变量。我希望使用驼峰命名法。”

建议：

可以将变量命名为 `userAge` 或者更具体的 `currentUserAge`，如果你有多个用户或上下文需要区分。

\</aside\>

## 注释规范

- **解释代码的意图而不是做了什么**：注释需要解释代码的动机、目的和上下文，帮助读者理解为什么选择这种实现方式，或者代码的设计背后有什么考虑。如果注释仅仅是重复代码的功能，那注释就没有太大意义。

```C++
// 错误：解释代码做了什么
// 将 a 和 b 相加
int sum = a + b;

// 正确：解释代码的意图
// 在这里计算总费用，因为需要在下一个步骤应用折扣
int totalCost = price + tax;
```

- **简洁明了**：过多的注释不仅不必要，还可能让代码显得混乱。

```C++
// 错误：过度的注释
// 这个函数的作用是遍历所有的元素，并且检查每个元素是否
// 满足某个条件。如果找到某个满足条件的元素，它将返回 true，
// 否则返回 false。如果没有满足条件的元素，则返回 false。
// 它使用了一个 for 循环来遍历这些元素。
bool containsElement(const std::vector<int>& vec, int value) {
    for (const auto& elem : vec) {
        if (elem == value) {
            return true;
        }
    }
    return false;
}

// 正确：简洁明了
// 检查向量中是否包含给定值
bool containsElement(const std::vector<int>& vec, int value) {
    for (const auto& elem : vec) {
        if (elem == value) {
            return true;
        }
    }
    return false;
}
```

### **何时需要注释？**

虽然注释是有益的，但注释并不是越多越好。以下情况是常见的需要注释的时机：

- **复杂的业务逻辑或算法**：如果代码实现了一个复杂的算法或业务逻辑，注释可以解释为什么这样实现，以帮助理解。

```C++
// 使用二分查找来提高性能，因为输入数据已排序
int index = binarySearch(sortedArray, target);
```

- **特殊的设计选择**：如果你选择了一个特定的实现方式而不是其他的方式，注释可以解释背后的原因。

```C++
// 使用原子操作而不是锁来避免死锁问题
std::atomic<int> counter = 0;
```

- **代码约束或限制**：某些代码可能有特定的约束条件或限制，使用注释来说明这些限制。

```C++
// 这个函数只能在主线程中调用，因为它依赖于 UI 组件
void updateUI();
```

- **临时解决方案或技术债**：如果某些代码是临时或折中的解决方案，可以在注释中记录需要修复的事项。

```C++
// TODO: 这里需要优化，当前实现的时间复杂度是 O(n^2)
```

### 使用 Doxygen

Doxygen 是一个文档生成工具，可以从源代码中提取注释生成文档。使用 Doxygen 可以帮助我们创建更加规范和易于维护的代码注释。

- **基本语法**：Doxygen 使用特殊的注释格式来识别需要生成文档的部分。

```C++
/**
 * @brief 简短的函数描述
 * 
 * 详细的函数描述，可以包含多行
 * 
 * @param param1 参数1的描述
 * @param param2 参数2的描述
 * @return 返回值的描述
 */
int myFunction(int param1, double param2) {
    // 函数实现
}
```

- **常用命令**：

    - @brief：简短描述

    - @param：参数描述

    - @return：返回值描述

    - @todo：待办事项

    - @note：注意事项

    - @see：参见其他相关内容

- **类和成员函数的文档**：

```C++
/**
 * @class MyClass
 * @brief 简短的类描述
 * 
 * 详细的类描述
 */
class MyClass {
public:
    /**
     * @brief 构造函数
     * @param initialValue 初始值
     */
    MyClass(int initialValue);

    /**
     * @brief 获取当前值
     * @return 当前值
     */
    int getValue() const;
};
```

- **使用 Doxygen 生成文档**：

    - 安装 Doxygen

    - 在项目根目录创建 Doxyfile 配置文件

    - 运行 Doxygen 命令生成文档

- **集成 Doxygen 到 IDE**：许多现代 IDE 都支持 Doxygen 集成，可以提高文档编写的效率和便利性。

在 [https://github\.com/zmsbruce/rm\_radar](https://github.com/zmsbruce/rm_radar) 中，使用 Visual Studio Code [Doxygen Documentation Generator](https://marketplace.visualstudio.com/items?itemName=cschlosser.doxdocgen) 插件生成 doxygen 注释，配置文件如下：

```JSON
"C_Cpp.doxygen.generatedStyle": "/**",
  "doxdocgen.generic.returnTemplate": "@return ",
  "doxdocgen.generic.authorEmail": "zmsbruce@163.com",
  "doxdocgen.file.fileOrder": [
    "file",
    "author",
    "brief",
    "date",
    "empty",
    "copyright",
    "empty"
  ],
  "doxdocgen.generic.authorName": "zmsbruce",
  "doxdocgen.file.copyrightTag": [
    "@copyright (c) {year} HITCRT\\nAll rights reserved."
  ],
```

## 格式规范

- **缩进**：使用4个空格作为缩进，不要使用制表符（Tab）。

```C++
void function() {
    if (condition) {
        // 代码块
    }
}
```

- **行长度**：每行代码不应超过80个字符。如果超过，应该适当换行。

```C++
// 长函数调用
void veryLongFunctionCall(
    parameter1,
    parameter2,
    parameter3
);
```

- **花括号位置**：左花括号应该和语句在同一行，右花括号单独占一行。

```C++
if (condition) {
    // 代码块
} else {
    // 代码块
}
```

- **空格使用**：

    - 在二元运算符前后各加一个空格。

    - 在逗号后面加一个空格。

    - 在关键字和左括号之间加一个空格。

```C++
int sum = a + b;
function(arg1, arg2);
if (condition) {
    // 代码块
}
```

- **类和结构体的格式**：成员访问说明符（public、protected、private）应该缩进3个空格，成员应该缩进4个空格。

```C++
class MyClass {
   public:
    MyClass();
    void publicMethod();

   private:
    int privateVariable_;
};
```

- **指针和引用**：星号或者和号应该和类型紧挨，而不是变量名。

```C++
int* pointer;
int& reference = someInt;
```

- **命名空间**：命名空间的内容不应该缩进。

```C++
namespace MyNamespace {

class MyClass {
    // ...
};

void myFunction() {
    // ...
}

} // namespace MyNamespace
```

### 使用 clang\-format

clang\-format 是一个强大的代码格式化工具，可以自动格式化 C\+\+ 代码，使其符合指定的代码风格。使用 clang\-format 可以确保团队中的所有成员遵循相同的代码格式规范，提高代码的一致性和可读性。

- **安装 clang\-format**：可以通过包管理器或者从 LLVM 官网下载安装。

- **配置 \.clang\-format 文件**：在项目根目录创建 \.clang\-format 文件，定义自定义的格式化规则。例如 [https://github\.com/zmsbruce/rm\_radar](https://github.com/zmsbruce/rm_radar) 中使用的  \.clang\-format 文件如下：

```YAML
BasedOnStyle: Google
UseTab: Never
IndentWidth: 4
```

- **使用 clang\-format 格式化代码**：

```Bash
clang-format -i file.cpp  # 格式化单个文件
clang-format -i -style=file *.cpp  # 格式化所有 .cpp 文件
```

- **集成到 IDE**：许多 IDE（如 Visual Studio Code、CLion）都支持 clang\-format 集成，可以在保存文件时自动格式化代码。

## 其它规范

### 不使用 Pimpl

Pimpl 模式将类的实现隐藏起来，避免在头文件中暴露实现细节。这样可以减少因为头文件中的实现细节变化而导致的重复编译问题。但项目规模较小，接口相对稳定的情况下，直接将实现写在头文件中不会带来太多的编译时间问题，代码也会更加清晰易维护，更有利于提高开发效率和可维护性。

### 使用组合优先于继承

滥用继承会导致代码难以维护和扩展。如果两个类之间没有明确的“**is\-a**”关系，但你需要复用某些功能，组合是更好的选择。例如，如果你需要复用某些算法或数据结构，但不希望类之间有紧密的继承关系，组合可以让你复用这些功能而不引入不必要的耦合。
