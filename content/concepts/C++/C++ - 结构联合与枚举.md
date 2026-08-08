---
title: "C++ - 结构联合与枚举"
description: "C++ 学习笔记：结构联合与枚举"
tags:
  - "concept"
  - "C++"
---
# C++ - 结构联合与枚举

## 结构、联合、枚举

### 结构`struct`

```C++
struct 结构名称{
    变量类型 成员变量；
}
```

```C++
struct Student student={"A",b,c}; //C语言风格
Student student{"A",b,c}; //C++语言风格
Student student{"A",b,c}; //C++语言风格
```

- 结构中成员默认公有，类中成员默认私有

- 结构中可以定义成员函数，不过一般不用

### 联合`union`

```C++
union MyUnionType{
    unsigned long i;
    unsighed char c[8];
    struct{
        unsighed char i;
        unsighed char o;
        unsighed char v;
        
    }
}
```

- 一个联合体在某一时刻只能使用其中的一种类型

```C++
MyUnionTybe data{};
data.l = 0X3FFF;
data.s = {'f','s',12}; //会覆盖前一条
```

### 枚举`enum`

```C++
enum ColorType{
    Red,    //0
    Blue,   //1
    Yellow, //2
    Green   //3 也能自定义 Green = 5;
};

ColorType = color;
color = Red;
```

有类的作用域的枚举避免冲突

```C++
enum class ColorType{
    Red,    //0
    Blue,   //1
    Yellow, //2
    Green   //3 也能自定义 Green = 5;
};

enum class ColorType2{
    Red,    //0
    Blue,   //1
    Yellow, //2
    Green   //3 也能自定义 Green = 5;
};

ColorType = color;
color = ColorType::Red;
```
