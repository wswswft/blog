---
title: "C++ - 工程实践"
description: "C++ 类设计、性能与常见编译问题经验"
tags:
  - "concept"
  - "C++"
  - "engineering"
---
# C++ - 工程实践

## 代码规范化

### 1\.类

#### "五/六法则"

- 如果定义了析构、拷贝构造、拷贝赋值、移动构造、移动赋值的任何一个或多个，需要明确处理其他几个（或使用 `= default` 或 `= delete`）；

- 例如`RobotDetector() = delete;`显式地删除了RobotDetector类的默认构造函数。

    - 使用`= delete`表示该构造函数被禁用，不允许通过无参方式创建RobotDetector对象。

    - 这意味着**必须使用带参数的构造函数来初始化对象**，确保在创建RobotDetector实例时必须提供必要的配置和依赖项。

#### `explicit` 与隐式转换

- **\[强制\]** 构造函数标记为 `explicit`，防止隐式转换；

- 隐式转换（Implicit Conversion）是指C\+\+编译器自动进行的类型转换，不需要程序员显式指定。

在C\+\+中，如果一个构造函数只有一个参数，编译器可能会在某些情况下自动调用这个构造函数来进行类型转换。

- `explicit RobotDetector(RobotDetectConfig config, YOLO& car, YOLO& armor);`

    - 在这个特定例子中，由于构造函数接受多个参数（RobotDetectConfig、YOLO引用等），实际上不太可能发生隐式转换，因为**C\+\+标准规定单参数构造函数才容易产生隐式转换**。但加上 `explicit` 是一种良好的编程习惯，可以明确表达设计意图，并防止未来修改代码时可能出现的问题。

#### `noexcept`

- **\[推荐\] **对不会抛出异常的函数（特别是析构函数、Move构造函数）标记 `noexcept`。

- `noexcept` 是 C\+\+11 引入的关键字，用作函数的异常说明符。它表示该函数不会抛出异常。

#### 类与结构体

- 具体来说：

    1. `noexcept` 告诉编译器和程序员，这个函数在任何情况下都不会抛出异常

    2. 如果标记为 `noexcept` 的函数实际抛出了异常，程序会调用 `std::terminate` 直接终止，而不是进行栈展开

    3. 这有助于编译器进行优化，并且在使用 STL 容器等标准库时，可以启用某些优化策略

    4. 对于确实不会抛出异常的函数（如简单的数据处理、数学计算等），建议加上 `noexcept` 标记

- `RobotDetection match(const Detection& car, conststd::vector<Detection>& armors) noexcept;`

    - 在这个函数中，`noexcept` 表示`match`函数是一个不会抛出异常的操作。

#### `inline`

- **\[推荐\] **不使用宏定义函数和常量（使用 `inline`/`constexpr`）；

- `inline int label() const { return static_cast<int>(car.label); }`

    - 这段代码是一个内联函数，功能是返回`car.label`转换为整型后的值。具体来说：

    1. `inline`表示这是一个**内联函数**，**编译时会将函数体直接插入调用处以提高性能**

    2. 函数无参数，返回`int`类型

    3. 通过`static_cast<int>`将成员变量`car.label`强制转换为整型后返回

    - `const`关键字在这里的作用是：

    1. 保证函数不修改对象状态：标记该成员函数为常量函数，确保函数体内不会修改类的任何成员变量

    2. 允许常量对象调用：使得即使是对`const`对象也可以调用这个函数

    3. 接口安全性：向使用者表明这个函数只是读取数据，不会改变对象的状态

#### C\+\+风格的显式类型转换

- **\[推荐\]**** **不使用 C 风格转换，使用 `static_cast`, `const_cast`, `reinterpret_cast`；

- C\+\+提供了四种显式类型转换操作符，用来替代不安全的C风格转换：

1. **static\_cast『最常用』**

    - 用于相关类型之间的安全转换

    - 在你的代码中，`static_cast<int>(car.label)`将float类型的`car.label`转换为int类型

    - 这种转换在编译时检查类型兼容性，比C风格转换更安全

2. **const\_cast**

    - 用于添加或移除const/volatile属性

    - 示例：`const_cast<int*>(ptr)`可以移除指针的const属性

3. **reinterpret\_cast**

    - 用于低级别的位转换，比如指针和整数之间转换

    - 示例：`reinterpret_cast<uintptr_t>(ptr)`将指针转换为整数

4. **dynamic\_cast**

    - 主要用于继承层次中的安全向下转型，运行时检查类型

- 这些C\+\+风格的转换更加明确、安全，并且能帮助编译器进行更好的类型检查。

#### `std:move`

- `std::move` 是 C\+\+11 引入的一个函数模板，它的作用是：

1. **实现移动语义**：将左值转换为右值引用，启用移动构造/赋值而不是拷贝构造/赋值

2. **避免不必要的拷贝**：在你的代码中，`std::move(config)` 将传入的 `config` 参数转换为右值引用，使`m_config` 可以直接"接管"资源而不是复制一份

3. **提高性能**：对于大型对象（如容器），移动操作比拷贝操作效率更高，因为它只是转移资源所有权而非复制所有数据

- `RobotDetector::RobotDetector(RobotDetectConfig config, YOLO& car, YOLO& armor): m_config(std::move(config)), m_car_detector(car), m_armor_detector(armor) {}`

    - 例子中，使用 `std::move(config)` 可以避免 `config` 对象的深拷贝，直接将其内容转移到 `m_config`成员变量中，提升初始化性能。

#### `reserve`函数

- reserve 是 STL 容器（特别是 std::vector、std::string、std::deque）的成员函数，用于预分配内存空间，但不改变容器的大小。

- `detections.reserve(m_car_detections.size());`

    - 这段代码是C\+\+中的一个语句，功能是为`detections`容器预先分配至少能容纳`m_car_detections.size()`个元素的空间。这样做的好处是可以避免在后续添加元素时因空间不足而频繁重新分配内存，提高程序运行效率。这是**性能优化的一种常见做法**。

## 编译错误解决

### fmt与spdlog的兼容性问题

1. 查看spdlog版本

```Bash
# 在文件系统中查找spdlog文件
sudo find /usr -name "*spdlog*" 2>/dev/null
sudo find /usr/local -name "*spdlog*" 2>/dev/null
sudo find /opt -name "*spdlog*" 2>/dev/null
```
