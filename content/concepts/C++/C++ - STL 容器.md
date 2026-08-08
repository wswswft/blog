---
title: "C++ - STL 容器"
description: "C++ 学习笔记：STL 容器"
tags:
  - "concept"
  - "C++"
---
# C++ - STL 容器

## STL标准模板库：容器

序列容器：`array`,`vector`,`deque`,`list`

关联容器：`map`,`set`

### array

与C风格的数组基本相同，新增迭代器、复制等功能，使得array可以用于所有使用迭代器的标准库函数

### vector

`vector`可以作为动态数组来使用，可以像C语言风格的数组那样使用它

```C++
/*
vector类模板有两个参数，第一个参数T是数组元素的类型，第二个参数Alloc是用于动态分配内存的类
*/
template <class T, class Alloc = allocator<T> > class vector;
//包含vector头文件
#include <vector>
```

#### **列表初始化**

- C\+\+11 及以后支持，主要用于便捷地初始化容器（如`vector`），核心内容及解析如下：

##### 列表初始化的常用写法

图片中展示了`vector<int>`的3种列表初始化方式：

```C++
// 写法1：等号+花括号
vector<int> numbers = {1,2,3,4,5};

// 写法2：直接花括号（C++11推荐）
vector<int> numbers{1,2,3,4,5};

// 写法3：显式调用initializer_list构造函数,写法2与3是等价的
vector<int> numbers({1,2,3,4,5});
```

##### 底层原理：`std::initializer_list`

列表初始化的本质是：**编译器将****`{}`****中的元素包装为****`std::initializer_list<T>`****类型的临时对象**，再调用容器（如`vector`）的`initializer_list`构造函数完成初始化。

图片中展示的`vector`构造函数原型，正是支持列表初始化的核心：

```C++
vector(
    std::initializer_list<int> __l,
    const std::allocator<int> &__a = std::vector<int>::allocator_type()
)
```

##### 列表初始化的特点

- **通用性**：不仅适用于`vector`，还适用于`array`、`map`等STL容器，以及普通数组、类对象的初始化；

- **简洁性**：相比传统的`push_back`逐个添加元素，列表初始化更直观高效；

- **类型安全**：编译器会检查`{}`中元素的类型是否与容器元素类型匹配，避免类型错误。



#### 使用一个值初始化

这是C\+\+中`vector`的**「单个值批量初始化」**方式，核心是通过指定「元素数量\+初始值」快速创建容器。

##### 两种初始化方式的对比

图片展示了`vector<float>`的两种初始化逻辑（目标是创建多个相同值的元素）：

```C++
// 方式1：指定「数量+初始值」（高效写法）
const int size = 5;
float value = 3.0;
vector<float> values(size, value); // 创建5个元素，每个元素值为3.0

// 方式2：列表初始化逐个写值（低效写法）
vector<float> values{3.0,3.0,3.0,3.0,3.0}; // 效果同上，但需手动重复写值
```

##### 核心特点

- **高效性**：方式1（`(size, value)`）是`vector`的专用构造函数，直接分配对应大小的内存并批量初始化，性能远高于「先创建空容器再逐个`push_back`」；

- **简洁性**：当需要大量相同值的元素时，方式1无需重复写值，代码更简洁易维护；

- **适用场景**：常用于需要初始化「固定数量、统一初始值」的容器（如数组、矩阵的初始填充）。

##### 注意点

- 方式1的构造函数仅适用于「所有元素初始值相同」的场景；

- 若元素初始值不同，需使用列表初始化（`{值1, 值2,...}`）。

#### 使用下标访问

没有有效性检查，需要注意下标越界的问题

#### 使用\.at\(\)访问

有有效性检查，越界会抛出`out_of_range`异常

#### `insert`函数

`vector::insert` 是**在 vector 容器的【指定位置】插入一个 / 多个元素**的成员函数

插入后，原位置及之后的所有元素会**向后顺延**

函数返回值：**指向【第一个被插入元素】的迭代器**



##### `insert` 函数的重载

- 重载 1：单个元素插入（最常用）

    ```C++
    iterator insert(iterator pos, const T& val);
    
    vector<int> vec = {1,3,4,5};
    // 在索引1的位置（元素3前面）插入数字2
    auto it = vec.insert(vec.begin()+1, 2);
    // 输出：1 2 3 4 5
    ```

    - 功能：在迭代器`pos`指向的位置，插入**1 个**值为`val`的元素

    建议用`emplace` 函数代替，返回值相同

- 重载 2：插入 n 个相同元素

    ```C++
    iterator insert(iterator pos, size_t n, const T& val);
    
    vector<int> vec = {1,5};
    // 在末尾前插入3个数字3 
    vec.insert(vec.end()-1, 3, 3);
    // 输出：1 3 3 3 5
    ```

- 重载 3：插入一段区间的元素（左闭右开）

    ```C++
    template <class InputIt>
    iterator insert(iterator pos, InputIt first, InputIt last);//三个迭代器
    
    vector<int> vec1 = {1,6}; 
    vector<int> vec2 = {2,3,4,5};
    // 在vec1的中间插入vec2的全部元素（vec2.begin()~vec2.end()） 
    vec1.insert(vec1.begin()+1, vec2.begin(), vec2.end());
    // 输出：1 2 3 4 5 6
    ```

    - 核心规则：插入的是 `[first, last)` 区间的元素 —— **包含 first 指向的元素，不包含 last 指向的元素**

    - 适用场景：把另一个容器（vector、数组、list 等）的一段元素插入当前 vector

- 重载 4：右值引用插入（C\+\+11，高效插入临时元素）

    ```C++
    iterator insert(iterator pos, T&& val);
    
    vector<string> vec = {"a", "c"};
    // 插入临时字符串对象，移动语义，无拷贝开销 
    vec.insert(vec.begin()+1, string("b"));
    // 输出：a b c
    vec.emplace(vec.begin()+1, "b"); 
    ```

    - 功能：在`pos`位置插入**1 个**临时元素（右值），利用移动语义，效率更高

    - 区别于重载 1：重载 1 是「拷贝元素」，重载 4 是「移动元素」，适合插入临时对象、匿名对象

    - 建议用`emplace` 函数代替，返回值相同

    - 对于 `string/自定义类/结构体` 这类**复杂对象**：`emplace` 的效率 **远高于** `insert`，因为省去了「拷贝 / 移动」的开销，这也是 C\+\+11 引入 emplace 的核心目的。

- 重载 5：初始化列表插入（C\+\+11，最灵活）

    ```C++
    iterator insert(iterator pos, initializer_list<T> il);
    
    vector<int> vec = {1,6};
    // 插入列表{2,3,4,5}，一行完成多元素插入 
    vec.insert(vec1.begin()+1, {2,3,4,5});
    // 输出：1 2 3 4 5 6
    ```

    - 功能：在`pos`位置插入一个「初始化列表」的所有元素

    - 优势：无需创建临时容器，直接写`{元素1,元素2,...}`即可，一行搞定

##### 潜在问题

- vector 的 insert 操作**大概率会导致迭代器、指针、引用失效**

- **C\+\+ 标准明确规定** → 哪怕没扩容，vector 的`insert`也会让「插入位置及之后的所有迭代器全部失效」，**这个失效是语法层面的硬性规则**，和内存地址存的元素是谁无关。

1. **插入后触发扩容 → 全部迭代器失效**

vector 是连续内存容器，当插入元素后，如果`size() > capacity()`（当前元素个数超过容量），会触发**扩容**：

- 容器会在内存中开辟一块更大的新空间；

- 把原内存的所有元素拷贝到新空间；

- 释放原内存空间。

此时，**所有指向原 vector 的迭代器、指针、引用全部失效**，访问这些失效的迭代器会导致程序崩溃（未定义行为）。

2. **插入后未触发扩容 → 部分迭代器失效**

如果插入元素后`size() ≤ capacity()`，容器不需要扩容，内存地址不变：

- **插入位置及之后的迭代器**：全部失效；

- **插入位置之前的迭代器**：依然有效。

#### `push_back`函数

**C\+\+11 及以后的开发中，能用 emplace\_back 就用 emplace\_back，替代 push\_back**

向 `vector` 容器的 **尾部末尾** 追加插入一个元素，插入后原最后一个元素的**下一位**就是新元素，容器的 `size()` 元素个数**加 1**，容器的`end()`迭代器指向新的末尾。

```C++
// 重载1：拷贝版 - 传入左值，拷贝元素到容器尾部
void push_back( const T& value ); //void !!!

// 重载2：移动版 - 传入右值，移动元素到容器尾部（C++11新增，效率更高）
void push_back( T&& value );
```

##### `push_back` 插入的核心规则

插入位置固定：**只能在容器尾部插入**，是「追加」不是「插入到中间 / 头部」；

元素移动规则：因为是尾部插入，**容器中原有所有元素的位置都不会改变**，不会有任何元素向后移动；

返回值：`push_back` 的返回值是 `void` 空类型，**无返回值**（和`insert`不同，insert 会返回有效迭代器）；

元素顺序：插入的元素会按调用顺序，依次排在 vector 的末尾，顺序完全可控。

`push_back`的速度比`insert`插入尾部的速度快

#### `emplace_back` 函数

C\+\+11 给 vector 新增了一个尾部插入函数 `emplace_back`，和`push_back`功能完全一样（尾部追加元素），但**底层实现和效率不同**

- `push_back `：先「创建元素」，再把元素「拷贝/移动」到vector的尾部内存；

- `emplace_back`：直接在vector的尾部内存「原地构造元素」，没有拷贝/移动的开销。

```C++
vector<string> vec;
vec.push_back(string("hello"));  // 先创建临时string对象，再移动到容器
vec.emplace_back("hello");       // 直接在容器尾部构造string对象，一步到位
```

效率：`emplace_back` ≥ `push_back`，永远不会更低，对于自定义类对象，效率提升非常明显；

语法：`emplace_back` 的调用语法和`push_back`完全一致；

兼容性：C\+\+11 及以上支持；

> 💡 补充：对于`int/double`这类基础数据类型，两者效率几乎无差异，用哪个都可以。
> 
> 

#### `erase` 函数

`vector::erase` 是 **删除 vector 容器中【指定位置 / 指定区间】的元素** 的成员函数，是 vector 最核心的删除方法

核心特点：

- 删除后，**被删除位置后面的所有元素会自动向前移动补位**；

- 删除后容器的 `size()` 减少（删除几个元素就减几），`capacity()` 容量**不会改变**（erase 永远不会触发 vector 扩容 / 缩容）；

- 和 `insert` 一样，`erase` 是针对**连续内存**的操作，元素移动是必然的。

##### `erase` 函数的重载

1. 删除「单个元素」

    ```C++
    iterator erase( iterator pos );
    ```

参数：`pos` 是一个迭代器，指向**要被删除的那个元素**

返回值：指向「**被删除元素的下一个有效元素**」的迭代器

功能：删除迭代器指向的这 1 个元素。

2. 删除「一段区间」的元素

    ```C++
    iterator erase( iterator first, iterator last );
    ```

参数：`first` 是区间起点，`last` 是区间终点，遵循 C\+\+ 容器通用的 **`[first, last)`**** 左闭右开规则**；

规则：删除**包含 ****`first`**** 指向的元素，不包含 ****`last`**** 指向的元素**的所有元素；

返回值：指向「**被删除区间的下一个有效元素**」的迭代器；

功能：批量删除连续的一段元素。

#### `pop_back`函数

```C++
void pop_back();
```

功能：删除 `vector`**最后一个元素**，和 `push_back` 完全对应；

特性：无参数、无返回值；`size()-1`，`capacity()` 不变；

效率：**O\(1\)** 常数级，无需移动任何元素，是 vector 最高效的删除方式；

优先级：**只要是删除尾部元素，一律用 ****`pop_back ()`****，不用 ****`erase (vec.end ()-1)`**，写法更简洁，效率相同。

#### `clear`函数

```C++
void clear();
```

功能：删除` vector `中**全部元素**，容器变为空；

特性：`size()` 变为 0，`capacity()` 依然不变（不释放内存）；

区别于 `erase`：`erase` 是删指定元素 / 区间，`clear` 是删全部，等价于 `vec.erase(vec.begin(), vec.end())`。

#### 其他常用函数

1. `.size()`函数：`vector`当前实际存储的元素数量，未超容量前插入时间是O\(1\)

2. `.capacity()`函数：`vector`在内存中已分配的空间能容纳的最大元素数量（容量≥大小）；

    - **扩容规则**：当`push_back`导致`size`超过当前`capacity`时，`vector`会自动扩容（通常是**将容量翻倍**，具体规则由编译器实现决定）。

    - 循环向`vector<int>`中`push_back`10 个元素时，`size`与`capacity`的变化如下：

    |    属性|    插入0|    插入1|    插入2|    插入3|    插入4|    插入5|    插入6|    插入7|    插入8|    插入9|
    |---|---|---|---|---|---|---|---|---|---|---|
    |    size\(\)|    1|    2|    3|    4|    5|    6|    7|    8|    9|    10|
    |    capacity\(\)|    1|    2|    4|    4|    8|    8|    8|    8|    16|    16|

3. `swap`函数：释放 vector 多余的内存（让 `capacity()` = `size()`）

    ```C++
    vector<int>(vec).swap(vec); // 收缩内存，释放冗余空间
    ```

4. 迭代器

    ```C++
    // 1. 定义迭代器变量
    vector<int>::iterator it;
    // 2. 遍历容器
    for(it = numbers.begin(); it != numbers.end(); ++it) //auto it = numbers.begin()也行
    {
        // 3. 解引用迭代器，获取指向的元素
        cout << *it << " ";
    }
    
    //反向迭代器,注意是rbegin和rend
    for(vector<int>::reverse_iterator it = numbers.rbegin(); it != numbers.rend(); ++it)
    {
        //解引用迭代器，获取指向的元素
        cout << *it << " ";
    }
    ```

    - `numbers.begin()`：返回指向容器**第一个元素**的迭代器

    - `numbers.end()`：返回指向容器**最后一个元素的下一个位置**的迭代器（不指向任何有效元素，作为遍历结束的标志）

    - `++it`：让迭代器指向下一个元素

    - `*it`：解引用迭代器，获取当前指向的元素的值

5. 支持使用指针访问，意义是可以在不支持标准库的C风格函数中使用

### deque

#### `deque`概念

`std::deque` = **double\-ended queue**，翻译为：**双端队列**

- 是 C\+\+ STL 的序列式容器，和`vector`同属「线性容器」；

- 核心特性：**可以在容器的「头部」和「尾部」，都实现高效的插入 / 删除操作**，这是它和`vector`最核心的区别。

#### `deque` 与 `vector` 核心区别

**区别 1：底层内存存储结构**

这是两者所有差异的**根本原因**：

1. **`vector`**：**连续的整块内存空间**，内存地址是完全连续的；

    - 优点：随机访问速度极快（`[]`下标访问）、缓存命中率高；

    - 缺点：头部 / 中间插入删除效率低（元素移动）、扩容开销大。

2. **`deque`**：**分段的连续内存空间 \+ 中控数组**，是「伪连续」的内存结构；

    - 本质上是双向链表

    - deque 会在内存中开辟**多个小块的连续内存段**，再用一个「中控数组」存储每块内存的地址；

    - 对使用者来说，感知不到分段，依然可以像 vector 一样用下标随机访问；

    - 优点：头尾增删无元素移动、扩容成本极低；

    - 缺点：随机访问效率略低于 vector、缓存命中率稍差。

**区别 2：首尾增删的效率**

1. **`vector`**：尾部增删 \(`push_back/pop_back`\) → **O\(1\)** 高效；

头部增删 \(`insert(begin(), val)/erase(begin())`\) → **O\(n\)** 极低效（所有元素都要移动）；

2. **`deque`**：尾部增删 \(`push_back/pop_back`\) → **O\(1\)** 高效；

头部增删 \(`push_front/pop_front`\) → **O\(1\)** 高效；

**区别 3：扩容机制与开销**

1. **`vector`**：扩容是「**整体搬迁**」→ 容量不足时，开辟**更大的整块内存**，把原所有元素拷贝到新内存，释放原内存；扩容开销大，且扩容后所有迭代器失效。

2. **`deque`**：扩容是「**分段追加**」→ 容量不足时，只需要在头部 / 尾部**新增一小块连续内存段**，挂载到中控数组即可；**无元素拷贝、无内存搬迁**，扩容开销极小，且迭代器失效范围极小。

#### `deque` 与 `vector`相同点

1. 都是序列式容器，元素按插入顺序存储，支持**下标随机访问**（`[]`运算符）；

2. 都支持迭代器遍历（`begin()/end()`）；

3. 都支持动态扩容，无需手动指定容量；

4. 增删改查的**核心 API 名称完全一致**（`push_back/erase/clear/empty/size`等）；

5. 都属于「动态数组」，`size()`随元素增删动态变化，`capacity()`对 deque 意义不大。

#### 特有函数

```C++
deque<int> d{2,3,4}; 
d.push_front(1);       // 头部插入元素 → {1,2,3,4}      O(1)高效 
d.pop_front();         // 头部删除元素 → {2,3,4}        O(1)高效 
d.emplace_front(1);    // C++11 头部原地构造，效率更高 → {1,2,3,4}
```

#### `deque` 的迭代器失效问题

迭代器失效是容器的高频考点，`deque`的迭代器失效规则**比 vector 友好得多**，且和 vector 有明显区别

**回顾 vector 的迭代器失效规则**

1. `insert/emplace/push_back`：扩容则**全失效**，不扩容则插入位置及之后失效；

2. `erase`：被删位置及之后失效，之前有效；

3. 核心：vector 的迭代器失效范围大，扩容必全失效。

**deque 的迭代器失效规则**

deque 因为是**分段连续内存**，无整体扩容搬迁，所以迭代器失效范围极小，这是巨大优势：

**头部 / 尾部增删 \(****`push_front/push_back/pop_front/pop_back`****\)**

> ✅ **所有迭代器、指针、引用 全部有效**！
> 
> 

- 这是 `deque` 最友好的特性，头尾增删完全不会导致任何迭代器失效，放心使用即可。

**指定位置增删 \(****`insert/emplace/erase`****\)**

> ✅ 只有**被操作位置的迭代器失效**，其余迭代器全部有效；
> 
> 

- 比如在`d.begin()+2`插入 / 删除元素，只有指向该位置的迭代器失效，其他位置的迭代器都能正常使用；

- 不会出现 `vector` 的「一失效一大片」的情况。

**特殊极端场景**

只有当 `deque` 的内存段被频繁增删导致「中控数组扩容」时，才会导致全部迭代器失效，但这种场景极少出现，且中控数组扩容的开销远小于 `vector` 的扩容。

### list



### map \& unordered\_map

`std::map` 是 C\+\+ STL 中的**有序键值对关联式容器**，标准命名：`std::map<Key, T>`

- 存储的内容是：**一对一对的键值对（key\-value）**，比如 `{键1:值1, 键2:值2, 键3:值3}`；

- 关键字 `key`：是**唯一的、不允许重复**的，用来做索引（类似字典的拼音 / 部首）；

- 值 `value`：可以重复，可以是任意类型，是实际要存储的数据；

- 核心特点：**会自动按照 ****`key`**** 的大小进行升序排序**，插入后无需手动排序。

#### `map` 底层原理

`std::map`的底层是一颗**平衡的二叉搜索树（红黑树）**，这是它所有特性和效率的根源，记住这个结论即可，无需深入红黑树实现：

1. 红黑树的特性：自动排序、查询 / 插入 / 删除的效率都极高；

2. 带来的优势：`map`的所有增删查改操作，**时间复杂度稳定在 O \(log n\)**；

3. 对比：vector 头部插入是 O \(n\)、尾部插入是 O \(1\)；map 的**任意位置增删查改效率一致**，都是 O \(log n\)。

#### `map` 特性

**键（key）是唯一的，不可重复**

向 map 中插入已存在的 key，插入操作会**失败**，不会覆盖原有数据，也不会新增元素。 

```Plain Text
map<int, string> mp;
mp.insert({1, "Java"});
mp.insert({1, "C++"}); // key=1已存在，插入失败，map中还是 {1:"Java"}
```

自动按**键（key）升序排序**

map 会在插入元素时，自动根据`key`的大小进行**升序排列**，这是红黑树的天然特性，无需手动排序。

```Plain Text
map<int, string> mp;
mp.insert({3, "Python"});
mp.insert({1, "C++"});
mp.insert({2, "Java"});// 遍历输出：会自动按key升序 → 1:C++  2:Java  3:Python
```

键（key）是**只读的**，不可修改

map 中的`key`一旦插入，就**不能被修改**！如果想修改某个 key，只能「先删除旧的 key\-value，再插入新的 key\-value」。

> 原因：key 是排序的依据，修改 key 会破坏红黑树的排序结构，C\+\+ 语法直接禁止这种操作。
> 
> 

#### `map`使用

使用 map 必须包含专属头文件，无其他依赖：

```C++
#include <map>

std::map<Key, T> map_name;
```

`Key`：键的类型（int/string/char 等，必须支持`<`比较运算符，否则无法排序）；

`T`：值的类型（任意类型，int/string/ 自定义结构体 / 容器等）；



**增删查改中增删与vector类似**

重点说查、改：

方式 1：`find(key)` 查找

- 语法：`mp.find(key);`

- 返回值：**迭代器** → 找到 key，返回指向该键值对的迭代器；找不到 key，返回 `mp.end()`；

- 特点：时间复杂度 O \(log n\)，**无任何副作用**，找不到不会插入元素，是 map 查找的最优解；

- 标准用法（必写这种判断）：

```C++
map<int, string> mp{{1,"C++"},{2,"Java"}};
auto it = mp.find(2);
if(it != mp.end()){
    cout << "找到：" << it->first << ":" << it->second << endl; // 输出：2:Java
}else{
    cout << "未找到" << endl;
}
```

> 注意：map 的迭代器访问键值对，用 `it->first`\(key\) 和 `it->second`\(value\)，而非`.` 运算符。
> 
> 



方式 2：`[]` 下标运算符 查找（✅ 慎用，有坑，面试高频考点）

- 语法：`mp[key];`

- 特点：写法极简，但是**有致命副作用**；

- 坑点：如果`key`**不存在**，会**自动插入一个该 key 的键值对**，value 为对应类型的默认值（int→0，string→空字符串）；

```C++
map<int, string> mp{{1,"C++"}};
cout << mp[2] << endl; // key=2不存在，自动插入 {2:""}，输出空字符串
cout << mp.size() << endl; // size从1变为2 ❗
```

> ❗ 结论：**仅当确定 key 一定存在时，才用 \[\] 查找**，否则一律用 find！
> 
> 



方式 3：`count(key)` 统计 key 是否存在

- 语法：`mp.count(key);`

- 返回值：`int` → map 中 key 唯一，返回值**只能是 0 或 1**；返回 1 表示存在，返回 0 表示不存在；

- 适用场景：只需要判断「key 是否存在」，不需要获取 value 时，用 count 最简洁；

```C++
map<int, string> mp{{1,"C++"}};
if(mp.count(1)){
    cout << "key=1存在" << endl;
}
if(mp.count(2) == 0){
    cout << "key=2不存在" << endl;
}
```



map 的`key`只读不可改，**只能修改 value 的值**，修改方式固定，分两步：

1. 用`find(key)`找到要修改的键值对的迭代器；

2. 通过迭代器的 `it->second` 修改 value 的值；

```Python
map<int, string> mp{{1,"C++"},{2,"Java"}};
auto it = mp.find(2);
if(it != mp.end()){
    it->second = "Python"; // 修改value → map变为 {1:"C++", 2:"Python"}
}
```



map 的遍历是高频操作，**没有下标遍历**（因为是树结构，无下标概念），4 种遍历方式按需选择。

> 统一前置代码：所有遍历都基于这个 map
> 
> 

```C++
map<int, string> mp{{1,"C++"},{2,"Java"},{3,"Python"}};

//方式 1：普通迭代器遍历
for(map<int, string>::iterator it = mp.begin(); it != mp.end(); it++){
    cout << it->first << ":" << it->second << "  ";}
    // 输出：1:C++  2:Java  3:Python

//方式 2：范围 for 遍历（C++11）
//最简洁的遍历方式，开发中优先使用，自动按 key 升序遍历：
for(auto& p : mp){ // 加&避免拷贝，效率更高
    cout << p.first << ":" << p.second << "  ";}

//方式 3：反向迭代器遍历（从大到小遍历）
//map 默认升序，反向迭代器可以实现**按 key 降序遍历**，非常实用：
for(map<int, string>::reverse_iterator it = mp.rbegin(); it != mp.rend(); it++){
    cout << it->first << ":" << it->second << "  ";}
// 输出：3:Python  2:Java  1:C++

//方式 4：结构化绑定遍历（C++17）
//C++17 的新特性，直接解构键值对，无需写first/second，代码最简洁：
for(auto& [key, val] : mp){
    cout << key << ":" << val << "  ";}
```



#### `pair` 配对类

map 存储的是**键值对**，C\+\+ 中用 `std::pair<Key, T>` 来表示一个键值对，这是 map 的核心数据单元：

- `pair` 是一个模板类，第一个模板参数是 key 类型，第二个是 value 类型；

- 访问方式：`pair.first` → 获取键 \(key\)，`pair.second` → 获取值 \(value\)；

- 初始化方式：`pair<Key,T>(k, v)` 或 简化写法 `{k, v}`（C\+\+11 推荐）。

```C++
pair<int, string> p(1, "C++");
cout << p.first << endl;  // 输出key → 1
cout << p.second << endl; // 输出value → C++
```

#### `std::map` vs `std::unordered_map`

C\+\+11 新增了 `std::unordered_map`，和`std::map`都是键值对容器，key 唯一，**90% 的 API 用法完全一致**，但底层原理和特性有核心区别

需要**有序的键值对** → 用 `std::map`；

不需要排序，追求**极致的查询 / 插入效率** → 用 `std::unordered_map`；

两者的 API 几乎完全一致，切换成本极低。

#### 总结

1. `std::map`是**有序、唯一**的键值对关联式容器，底层是红黑树；

2. 核心特性：**key 唯一、自动升序排序、key 只读不可修改**；

3. 增：emplace \> insert \> \[\]（慎用 \[\]）；

4. 删：erase \(key\)/erase \(iterator\)，clear 清空；

5. 查：find \(key\)（最优）、count \(key\)（判断存在）、\[\]（慎用）；

6. 改：只能修改 value，通过迭代器的`it->second`修改；

7. 遍历：范围 for 最简洁，反向迭代器实现降序遍历；

8. 迭代器失效：仅删除的迭代器失效，插入无失效；

9. 时间复杂度：所有操作稳定 O \(log n\)。

### set \& unordered\_set

`std::set`是**有序、唯一**的关联式容器，底层是红黑树，所有操作时间复杂度 O \(log n\)；

核心特性：**元素唯一、自动升序排序、元素只读不可修改**；

增：emplace \> insert ；删：erase \(迭代器\)/erase \(值\)、clear；查：find \(最优\)、count；

无下标运算符`[]`，遍历只有迭代器 / 范围 for 方式；

迭代器失效：仅删除的迭代器失效，插入无失效；

set 是「单值去重排序」，map 是「键值对映射」，二者是亲兄弟。

### 迭代器`iterator`

迭代器（iterator）是一个对象，它的作用是**指向容器中的某个元素**，并提供访问该元素的方法。可以把它理解成一个 “智能指针”，专门用来遍历和操作容器里的数据。

#### 迭代器的常见类型
