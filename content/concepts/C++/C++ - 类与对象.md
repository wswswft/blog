---
title: "C++ - 类与对象"
description: "C++ 学习笔记：类与对象"
tags:
  - "concept"
  - "C++"
---
# C++ - 类与对象

## 类和对象

### 类

- 包含数据和函数，声明方式使用`class`关键字

- C\+\+ 提供了三个关键字，称为**访问修饰符**：

    - **`public`** \(公有\)，对外提供的接口函数（API）。

    - **`private`** \(私有\)，仅限家族内部（继承体系）使用的数据。

    - **`protected`** \(受保护\)，核心数据、不想被随意修改的变量。

```C++
class 类名称{
        成员变量0；//默认为private
    public：
        成员变量1；
        成员函数2();
    private:
        成员变量3；
        成员函数4();
    protected:
        成员变量5；
        成员函数6();

};
```

- 成员函数的类内和类外定义

- 封装：通过类的定义，隐藏类内部数据的细节

#### 构造函数

- 无参数的构造函数是类的默认构造函数

- 自定义有参数的构造函数之后，编译器不会自动生成默认构造函数

- 拷贝构造参数，参数是一个const类型的同类对象（如果是不同类对象，就叫转换构造函数）

    ```C++
    Shape shape1；
    Shape shape2 = shape1;
    Shape shape3(shape1);
    Shape shape4 = Shape(shape1);
    Shape *pShape = new Shape(shape1);
    ```

- 未定义拷贝构造函数时，编译器会自动生成拷贝构造函数

- 类中有指针时，默认的拷贝构造函数会将新类的指针指向同一块内存区域

    ```C++
    class Shape{
    private:
        int* m_pValue;
    pubilc:
        Shape(const Shape& shape){
            m_pValue = new int(*shape.m_pValue);
            //默认生成的是以下内容，这明显是不符合需求的
            /*
            m_pValue = shape.m_pValue; 
            */
        }
    }
    ```

#### 析构函数

- 类名前加一个`～`

- 只有一个，不能带参数

- 编译器默认生成的析构函数是空函数

#### 类的继承

- 基类$\to$派生类，派生类拥有基类中的所有成员

```C++
class 派生类名称： pubilc 基类名称{ //此处的访问控制符表示继承的成员的最大访问权限，缺省为私有继承
}; 
```

- 不能继承的成员

    - 构造/析构函数

    - 运算符=\(\)成员

    - 类的友元

- 如果基类有默认构造函数，派生类在创建时会自动调用基类的默认构造函数

- 派生类被销毁时，也会自动调用基类的析构函数

- 基类构造函数$\to$派生类构造函数$\to$派生类析构函数$\to$基类析构函数

```C++
class BaseClass{
pubilc:
    BaseClass(int a){
        std::cout<<"基类的有参数构造函数被调用"<<endl;
    }
}

class SubClass:public BaseClass{
pubilc:
    SubClass():BaseClass(0){//在构造函数后面使用冒号，在冒号之后调用基类的构造函数并传递必要的参数
        std::cout<<"派生类构造函数被调用"<<endl;
    }
}
```

- 构造函数冒号后面还可以用来初始化私有变量

```C++
class SubClass:public BaseClass{
private:
    std::string m_className;
pubilc:
    SubClass():BaseClass(0),m_className("subClass"){
        std::cout<<"派生类构造函数被调用"<<endl;
    }
}
```

#### `const`成员函数

- 不能修改成员变量

- 不能调用非`const`成员函数

- 常量对象的调用，只能调用常量方法

### 重载运算符和重载函数

#### 重载运算符

- 重载的运算符是带有特殊名称的函数，函数名是由关键字 operator 和其后要重载的运算符符号构成的。与其他函数一样，重载运算符有一个返回类型和一个参数列表。

- 大多数的重载运算符可被定义为普通的非成员函数或者被定义为类成员函数，如

`Box operator+(const Box&);`

- 如果我们定义上面的函数为类的非成员函数，那么我们需要为每次操作传递两个参数，如下所示：

`Box operator+(const Box&, const Box&);`

```Java
class Box {
    public:
        double getVolume(void){          
            return length * breadth * height;
        }       
        void setLength( double len ){
            length = len;
        }         
        void setBreadth( double bre ){
            breadth = bre;
        }         
        void setHeight( double hei ){
            height = hei;
        }       
        // 重载 + 运算符，用于把两个 Box 对象相加
        Box operator+(const Box& b){
            Box box;
            box.length = this->length + b.length;
            box.breadth = this->breadth + b.breadth;
            box.height = this->height + b.height;
            return box;
        }
    private:
        double length;       
        double breadth;         
        double height;      
        };
/*
可以直接使用 Box3 = Box1 + Box2;
*/        
```

- 下面是可重载的运算符列表：

- 两种自增/减的重载

```C++
#include <iostream>
using namespace std;

class ExampleClass
{
private:
    int m_a;
public:
    // 构造函数初始化m_a
    ExampleClass(int a = 0) : m_a(a) {}

    // 获取m_a的值
    int getA() const { return m_a; }

    // 前级增量运算符
    ExampleClass& operator++()
    {
        m_a++;
        return *this;
    }

    // 后级增量运算符，因为这里要先返回后自加，所以要在自加前先存返回值
    ExampleClass operator++(int)
    {
        ExampleClass temp = *this; // 保存原始状态
        operator++(); // 调用前级自增修改原对象
        return temp;   // 返回原始值
    }
};

// 测试代码
int main()
{
    ExampleClass obj(5);
    cout << "初始值: " << obj.getA() << endl; // 输出5

    ExampleClass obj2 = obj++; // 后级自增，obj2是原始值5，obj变为6
    cout << "后级自增后obj: " << obj.getA() << endl;   // 输出6
    cout << "后级自增返回值: " << obj2.getA() << endl; // 输出5

    ExampleClass obj3 = ++obj; // 前级自增，obj变为7，obj3是7
    cout << "前级自增后obj: " << obj.getA() << endl;   // 输出7
    cout << "前级自增返回值: " << obj3.getA() << endl; // 输出7

    return 0;
}
```

- 详见[C\+\+ 中的运算符重载](https://www.runoob.com/cplusplus/cpp-overloading.html)

#### 函数重载

- 在同一个作用域内，可以声明几个功能类似的同名函数，但是这些同名函数的形式参数（指参数的个数、类型或者顺序）必须不同。

- 不能仅通过返回类型的不同来重载函数。

### 多态

#### 虚函数

```C++
#include <iostream>

class BaseClass
{
public:
    void greet()
    {
        std::cout << "这是基类\n";
    }
};

class SubClass : public BaseClass
{
public:
    void greet()
    {
        std::cout << "这是子类\n";
    }
};

int main(void)
{
    SubClass obj;             // 子类对象
    BaseClass *pBase = &obj;  // 基类指针pBase指向这个对象
    BaseClass &refBase = obj; // 子类对象的引用

    obj.greet();
    pBase->greet();
    refBase.greet();

    return 0;
}
```

```C++
这是子类      ← obj.greet()
这是基类      ← pBase->greet()
这是基类      ← refBase.greet()
```

- 没有 virtual 的时候，调用哪个版本的成员函数，完全只看「调用时用的变量/指针/引用的声明类型」，完全不管它实际上指向的是哪个真实对象。

只要在基类把 `greet()` 加上 `virtual`：

```C++
class BaseClass
{
public:
    virtual void greet()   // 只加这一个virtual
    {
        std::cout << "这是基类\n";
    }
};

class SubClass : public BaseClass
{
public:
    void greet() override
    {
        std::cout << "这是子类\n";
    }
};
```

同样的三行调用，输出就变成：

```C++
这是子类    ← obj.greet()
这是子类    ← pBase->greet()   ← 发生动态绑定！
这是子类    ← refBase.greet()  ← 也发生动态绑定！
```

没有 virtual 时：**「看表面类型」**（看指针/引用的声明类型）

有 virtual 时：**「看实际类型」**（看指针/引用真正指向的对象类型）

- 多态的条件

- 使用基类指针指向派生类对象时，`delete`这个基类指针时，如果基类的析构函数不是虚函数，那么就不会调用派生类的析构函数，需要将基类的析构函数定义为虚函数

#### 纯虚函数和抽象类

- 抽象类：不能实例化，必须派生一个类并重写纯虚函数

```C++
class Shape{    //抽象类
pubilc:
    virtual void draw()=0;    //纯虚函数
}
```

- **纯虚析构函数是一个非常特殊的情况**，它有以下两条铁律：

1. **纯虚析构函数必须提供定义（实现）**

2. **即使是纯虚的，也必须有定义**

```C++
class Base {
public:
    virtual ~Base() = 0;     // 声明为纯虚析构函数
};

// 这行是必须的！！
Base::~Base() { }           // 必须提供定义，即使函数体是空的
```

```C++
// 写法1（最推荐）
virtual ~Base() {}

// 写法2（禁止，不允许）
virtual ~Base() = 0;          // 只有声明，没有定义 → 链接错误

// 写法3（经典且仍然常用）
virtual ~Base() = 0;
Base::~Base() {}              // 在 .cpp 文件里定义（或 inline）

// 写法4（C++11 之后现代推荐）
virtual ~Base() = default;
```
