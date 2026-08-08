---
title: "HITCRT 代码规范"
description: "HITCRT C++ 团队代码规范"
tags:
  - "project"
  - "HITCRT2026"
  - "coding-standard"
---
# HITCRT 代码规范

## 引言

### 目的

本规范旨在通过建立一套统一的 C\+\+ 编程标准，提升团队的代码质量、可维护性和协作效率。我们致力于编写“不仅能工作，而且易于理解、易于修改、易于测试”的代码。

### 强制性规定

为了明确规则的约束力，文档采用 RFC 2119 标准中定义的关键词：

- **强制（Must）：**表示这是绝对强制的要求。任何违反此规则的代码都禁止合入；

- **推荐（Should）：**表示这是强烈推荐的最佳实践。在大多数情况下都应遵守；

- **可选（May）：**表示这是可选的建议。团队成员可以自行决定是否采用；

### 参考文档

- [C\+\+ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

- [Google C\+\+ Style Guide](https://google.github.io/styleguide/cppguide.html)

- [HITCRT视觉代码规范V2\.0\.pdf](assets/HITCRT视觉代码规范V2.0.pdf)

## 更新日志

## 内容

### 工具与自动化

1. **\[强制\]** 使用 GCC 11 以上版本

2. **\[强制\]**** **使用 C\+\+ 17

3. **\[强制\]** 使用 clang\-format 格式化代码

4. **\[可选\]**** **使用 clang\-tidy 进行静态分析

5. CMake：

    1. **\[强制\] **使用 CMake 进行构建，版本不低于 3\.15；

    2. **\[推荐\] **CMake 优先使用 `target_include_directories`、`target_compile_definitions`、`target_link_libraries`，避免使用 `include_directories`、`link_libraries` 全局命令；

### 命名规范

6. **\[强制\] **格式：

    1. 文件：snake\_case，如 `my_class.cpp`, `my_class.h`；

    2. 类/结构体/枚举：CamelCase，如 `MyClass`, `Options`；

    3. 常量/枚举值：UPPER\_SNAKE\_CASE, 如 `MY_CONSTANT`；

    4. 变量：

        1. 成员变量：

            1. `class`：带有 m\_ 前缀的 snake\_case，如 `m_class_member_variable`；

            2. `struct`：snake\_case，如 `struct_member_variable`；

        2. 局部变量：snake\_case，如 `local_variable`；

        3. 全局变量：带有 g\_ 前缀的 snake\_case，如 `g_global_variable`；

    5. 函数：snake\_case，如 `my_functions()`；

    6. 命名空间：snake\_case，如 `my_project::my_namespace`；

    7. 宏：UPPER\_SNAKE\_CASE，如 `MY_MACRO`；

7. **\[强制\] **禁止使用单个字符作为变量名（循环内索引除外）；

8. **\[强制\] **禁止使用中文拼音作为变量名；

9. **\[强制\]**** **RoboMaster 相关名词参考[RoboMaster 规则/资料中心 Rules/Resources Hub](https://bbs.robomaster.com/wiki/20204847)，或见附录表。

### 格式与排版

10. **\[强制\] **使用附录中的 \.clang\-format 模板；

### 注释

11. **\[强制\] **使用 Doxygen 进行文档注释；

12. **\[强制\] **对函数或方法进行注释时，必须标明可能抛出的异常；

13. **\[强制\] **使用 `//` 而不是 `/* ... */` 进行实现注释，写在代码块上方；在声明时初始化所有变量

14. **\[强制\] **实现注释只解释代码内部的复杂逻辑，如算法的步骤、魔法数字的含义、非显而易见的设计决策。不要忽略实现注释，也不要写成流水账；

15. **\[强制\] **使用 TODO/FIXME 进行标记注释；

### C\+\+ 特性使用

#### RAII 与资源管理

16. **\[强制\] **使用 `std::unique_ptr` 管理独占资源，仅在需要共享所有权时使用 `std::shared_ptr`，禁止裸 new 和 delete；

17. **\[强制\] **裸指针仅用于非所有权的观察；

#### `const` 与 `constexpr`

18. **\[推荐\] **尽可能使用 `const` 以便编译器优化，优先使用 `constexpr` 代替宏定义和部分 `const`；

19. **\[强制\] 在声明时初始化所有变量**；

#### 变量与初始化

20. **\[推荐\] **在迭代器和复杂类型使用 `auto`，在数值或可能类型不明确的场景下避免使用 `auto`；

21. **\[强制\] **禁止非 `const` 或 once 类型的全局变量；

#### 函数与参数

22. **\[强制\] **参数传递：

    1. 小型、可拷贝对象：按值传递；

    2. 只读的大型对象：按 `const&` 传递；

    3. 需要修改的 "Out" 参数：使用非 `const` 引用传递；

    4. 可选参数：使用 `std::optional`；

23. **\[推荐\] **对不会抛出异常的函数（特别是析构函数、Move构造函数）标记 `noexcept`。

#### 类与结构体

24. **\[强制\] **`struct`仅用于纯数据集合（POD），`class` 用于有不变量和私有成员的对象；

25. **\[强制\] **构造函数标记为 `explicit`，防止隐式转换；

26. **\[强制\] **遵循“五/六法则”：如果定义了析构、拷贝构造、拷贝赋值、移动构造、移动赋值的任何一个或多个，需要明确处理其他几个（或使用 `= default` 或 `= delete`）；

27. 继承：

    1. **\[推荐\] **使用组合而非继承；

    2. **\[强制\] **公共继承必须用于“is\-a”关系；

    3. **\[强制\] **如果基类有虚函数，析构函数必须是 `virtual`；

    4. **\[强制\] **使用 `override` 标记重写函数；

    5. **\[推荐\] **使用 `final` 标记重写且不可被重写的函数；

#### 错误处理

28. **\[强制\] **异常与错误码

    1. 构造函数失败、以及意外的、系统级错误（内存耗尽、系统调用失败）时，使用异常；

    2. 错误是业务逻辑内部时（输入格式错误，文件未找到）时，使用 `tl::expected`；

    3. 禁止使用 `int`, `bool` 原始类型作为错误码返回；

29. **\[强制\] **禁止在析构函数中抛出异常；

30. **\[强制\] **禁止使用异常进行程序流控制；

#### 并发

31. 线程管理：

    1. **\[强制\] **使用 `std::thread` 创建线程，确保在 `std::thread` 对象析构前，对其调用了 `join()` 或 `detach()`；

    2. **\[推荐\] **优先使用 `join()`，因为它能保证线程在程序退出前完成其工作。`detach()` 应仅在明确知道不需要等待线程结果的场景下使用；

    3. **\[推荐\] **优先使用更高级的抽象，如 `std::async` 或线程池；

    4. **\[强制\]**** **使用 `std::async` 时，返回的 `std::future` 必须被接收并管理，否则会变为同步调用；

32. 锁与原子：

    1. **\[推荐\] **优先使用 `std::scoped_lock`，它提供了自动化的、防止死锁的多锁获取机制；

    2. **\[强制\]**** **当只需单个互斥锁时，使用 `std::lock_guard`；

    3. **\[强制\] **禁止直接调用 `m.lock()` 和 `m.unlock()`；

    4. **\[推荐\] **对简单类型执行原子操作时，使用 `std::atomic`；

    5. **\[推荐\] **数据满足“读多写少”的特性时，使用 `std::shared_mutex` 替代 `std::mutex`；

33. 条件变量：

    1. **\[强制\] **当使用 `std::condition_variable` 时，其 `wait()` 调用必须被包裹在 `while` 循环中，防止虚假唤醒；

    2. **\[强制\]** `wait()` 必须使用 `std::unique_lock`，而不是 `std::lock_guard`；

34. **\[强制\] **禁止使用 `volatile` 进行线程同步；

35. **\[强制\] **禁止假定 `const` 成员函数是线程安全的；

#### 其他

36. **\[推荐\] **使用 `#pragma once` 方式保护头文件而不是 `#ifndef ... #define ... #endif`；

37. **\[强制\] **禁止在头文件中使用 `using namespace`；

38. **\[强制\] **禁止在 \.cpp 文件顶层使用 `using namespace std`；

39. **\[推荐\] **允许在 \.cpp 文件函数体内部使用 `using namespace` 减少冗余；

40. **\[推荐\] **使用 using 声明 `using std::vector` 而不是 using 指令 `using namespace`；

41. **\[推荐\] **当代码只需要一个类型的指针或引用时，在头文件中使用前向声明，而不是 `#include` 头文件；

42. **\[推荐\] **不使用宏定义函数和常量（使用 `inline`/`constexpr`）；

43. **\[推荐\]**** **避免使用 `dynamic_cast` 和 `typeid`，优先使用虚函数和设计模式；

44. **\[推荐\]**** **不使用 C 风格转换，使用 `static_cast`, `const_cast`, `reinterpret_cast`；

45. **\[强制\] **使用 `std::vector` 代替数组，避免缓冲区溢出；

46. **\[强制\] **使用 `std::array` 代替栈上数组；

47. **\[强制\] **使用 `std::string` 代替 `char*`；

48. **\[推荐\] **优先使用 `std::string_view` 代替 `const std::string&` 作为函数参数；

49. **\[强制\] **禁止使用 `std::cout`, `fmt::print` 进行日志输出，必须使用 spdlog 库；

## 附录

### \.clang\-format 模板

```YAML
# .clang-format

BasedOnStyle: Google
UseTab: Never
IndentWidth: 4
ColumnLimit: 100
SortIncludes: true
IncludeBlocks: Regroup
IncludeCategories:
  - Regex: '^<(c[a-z]+)>$'
    Priority: 1
  - Regex: '^<[a-z_]+>$'
    Priority: 2
  - Regex: '^<.*>$'
    Priority: 3
  - Regex: '^".*"$'
    Priority: 4
```

### RoboMaster 常见名词表

|中文|英文|
|---|---|
|机甲大师|RoboMaster|
|英雄机器人|Hero Robot|
|工程机器人|Engineer Robot|
|步兵机器人|Standard Robot|
|平衡步兵机器人|Balancing Standard Robot|
|空中机器人|Aerial Robot|
|哨兵机器人|Sentry Robot|
|飞镖系统|Dart System|
|雷达|Radar|
|比赛场地|Battlefield|
|环形高地|Ring\-Shaped Elevated Ground|
|梯形高地|Trapezoid\-Shaped Elevated Ground|
|隧道|Tunnel|
|公路区|Road Zone|
|哨兵巡逻区|Sentry Patrol Zone|
|启动区|Starting Zone|
|资源岛|Resource Island|
|起伏路段|Bumpy Roads|
|补给区|Supplier Zone|
|飞坡|Launch Ramp|
|前哨站|Outpost|
|基地|Base|
|兑换站|Exchange Station|
|能量机关|Power Rune|
|装甲模块|Armor Module|
|侧灯|Side Light Indicator|
|矿石|Nugget|
|弹丸|Projectile|
|定位标签|Localization Marker|
|飞镖引导灯|Dart Guiding Light|
|血量|HP|
|战亡|Defeated|
|复活|Respawn|
|增益|Buff|
|经验|Experience|
|性能|Performance|
