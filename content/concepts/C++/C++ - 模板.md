---
title: "C++ - 模板"
description: "C++ 学习笔记：模板"
tags:
  - "concept"
  - "C++"
---
# C++ - 模板

## 函数模板

- 模板函数定义的一般形式如下所示：

```C++
template <typename 标识符1,typename 标识符2, ...> 函数声明;
template <class 标识符1,class 标识符2, ...> 函数声明;//作用完全相同
```

```C++
template<class T>
void swap(T& a,T& b)
{
    T temp = a;
    a = b;
    b = temp;
}

int main(void)
{
    int a = 10,b = 13;
    swap(a,b);
}
```

```C++
template <typename T>
inline T const& Max (T const& a, T const& b) 
{ 
    return a < b ? b:a; 
} 
int main ()
{
 
    int i = 39;
    int j = 20;
    cout << "Max(i, j): " << Max(i, j) << endl; 
 
    int a = 13.5; 
    double b = 20.7;
    //用尖括号标明类型，否则会报错 
    cout << "Max(a, b): " << Max<float>(a, b) << endl; 
    return 0;
}
```

- 模板函数在被调用时会隐式实例化成对应类型

- 显式实例化：`template float Max<float>(float a, float b);`

- 函数模板也可以重载

- 模板函数特化\(显式特化\)

    ```C++
    template <typename T>
    inline T const& Max (T const& a, T const& b) 
    { 
        return a < b ? b:a; 
    } 
    
    template<>//double类型特化
    inline double const& Max(double const& a, double const& b) {
        return a < b ? b : a;
    }
    ```

    - 显式实例化也是特化的一种，所以二者不能同时出现\(对于相同参数来说\)

## 类模板

### 类模板与类模板的特化

- 类模板的特化不能够继承类模板的成员

- 只有类模板支持部分特化，函数模板不支持部分特化

```C++
template<typename T1, typename T2>
class MyPair{
private:
    T1 first;
    T2 second;
public:
    /* ..... */
    MyPair(T1 a, T2 b): first(a), second(b){};
    void print(){
        cout<<"通用类模板" <<endl;
    }
};
```

```C++
template<typename T2> //括号里面是部分特化时未特化的参数
class MyPair<int, T2>{
private:
    int first;
    T2 second;
public:
    MyPair(int a, T2 b): first(a), second(b){};
    void print(){cout << "部分特化: MyPair<int,T2>" << endl;}
};
```

- 二义性导致的特殊情况：

```C++
template<typename T2>
class MyPair<int,T2>{...

template<typename T1>
class MyPair<T1,float>{...

MyPair<int,float> partial3(1.2,1);
partial3.print(); //这里由于编译器无法确定应该使用哪个模板而报错
//解决方法是再定义一个<int,float>类型的特化模板
```

- 针对指针类型的特化：

```C++
template<typename T1,typename T2>
class MyPair<T1*,T2*>{
private:
    T1* first;
    T2* second;
    /*......*/
public:
    MyPair(T1* a, T2* b):first(a),second(b){};
    void print(){
        cout<<"部分特化：MyPair<T1*,T2*>"<<endl;
    }
};


MyPair<float*,float*> partial3(pA,pB);
partial3.print();
```

### 使用非类型参数的模板

非类型常量包括整形常量、枚举以及指针，浮点数、变量以及用户定义的其他类型不能作为非类型参数使用

```C++
template<typename T, int N>
class Vector{
private:
    T m_values[N];
public:
    Vector(T values[N]){
        for(int i=0; i<N; i++){
            m_values[i] = values[i];
        }
    }

    T getMax(){
        T maxValue = m_values[0];
        for(T v : m_values){
            maxValue = maxValue > v ? maxValue : v;
        }
        return maxValue;
    }
};
```

在上面的 C\+\+ 模板类 Vector 中，int N 是一个**非类型模板参数（non\-type template parameter）**。它用于指定数组 m\_values 的固定大小，这个大小必须在编译时已知（compile\-time constant）。这使得 Vector 成为一个固定尺寸的容器模板，类似于 std::array\<T, N\>，其中：

- N 表示数组的元素数量（维度或长度）。

- 在构造函数中，它用于循环复制传入的数组 values\[N\] 中的元素。

- 在 getMax 方法中，它隐式用于范围\-based for 循环遍历数组。

- 使用示例：Vector\<int, 5\> vec\(\{1,2,3,4,5\}\); 这里 N=5，创建一个大小为 5 的 int 向量。

    - `int n`传入时会报错，必须是`const int n` 

这种设计允许编译器在编译期优化内存和性能，但 N 必须是常量表达式，不能是运行时变量。



- 可以给模板参数加默认值

```C++
template<typename T=float, int N=5>
class Vector{
private:
    T m_values[N];
public:
    Vector(T values[N]){
        for(int i=0;i<N;i++){
            m_values[i] = values[i];
            ......
        }
    }
};


float values[5] = {1.0f,-0.3f,0.7f,0.8f,1.2f};
Vector<> vector5(values);//全部省略


double values[5] = {1.0,-0.3,0.7,0.8,1.2};
Vector<double> vector5(values);//定义T为double，N默认为5

```



- 模板套模版

```C++
template< template <typename> typename Container, typename T >
class Wrapper
{
private:
    Container<T> m_values;
public:
    Wrapper(const Container<T>& o) : m_values(o) {}
    void print() {
        for(auto v : m_values) cout << v << endl;
    }
};

int main() {
    vector<int> ls = {1,5,3,2,4,3,4,5};
    Wrapper<vector, int> example(ls);
    example.print();
}
```
