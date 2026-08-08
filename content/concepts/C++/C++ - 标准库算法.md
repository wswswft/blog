---
title: "C++ - 标准库算法"
description: "<algorithm> 与 <numeric> 常用算法笔记"
tags:
  - "concept"
  - "C++"
  - "STL"
---
# C++ - 标准库算法

## \<algorithm\>

### 共同点

部分不同类别的算法函数存在着如下共同点，可以进行归类以方便记忆：

- `_if`: 对容器中所有满足条件的元素进行处理，如 `copy_if` 对满足条件的元素进行复制，而 `remove_if` 对满足条件的元素进行删除。

- `_n`: 对容器中指定的迭代器后指定数量的元素进行处理，其参数使用 `Size count` 代替了 `InputIterator last` 迭代器。

- `_copy`: 将运算结果复制到另一个容器中，而不是对容器自身进行改变，其参数列表多了一个 `OutputIterator result` 参数用于复制。

### of 系列函数

包含 `all_of`, `any_of` 和 `none_of`，当给定范围中的 每个/至少有一个/没有 元素满足条件时返回 `true`。

### copy 系列函数

包括 `copy`, `copy_n`, `copy_if`, `copy_backward`，用于对容器中指定元素的复制。它们只修改由迭代器指向的值，并为目标范围内的元素赋予新值。它不能用来创建新元素，也无法直接将元素插入到空容器。如果不确定目标容器容量是否足够，可以使用输出迭代器，例如：

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> src{1, 2, 3, 4, 5};
    vector<int> dst;

    // 下面的使用方法会导致段错误
    // copy(src.begin(), src.end(), dst.begin());

    // 正确使用方法，back_inserter 调用容器的 push_back 方法
    copy(src.begin(), src.end(), back_inserter(dst));

    return 0;
}
```

### remove 系列函数

包括 `remove`, `remove_if`, `remove_copy`, `remove_copy_if`，用于容器中指定元素的删除。需要注意的是，它并不会真正删除元素，而是将要删除的元素移到容器的末尾，并返回一个指向新的逻辑尾部的迭代器。通过容器提供的 `erase` 成员函数真正删除这些元素。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> vec{1, 2, 3, 4, 5};

    auto new_end =
        remove_if(vec.begin(), vec.end(), [](int val) { return val % 2 == 0; });
    cout << vec.size() << endl;     /* 5 */

    vec.erase(new_end, vec.end());
    cout << vec.size() << endl;     /* 3 */

    return 0;
}
```

输出为：

```Plain Text
5
3
```

### sort 系列函数

包括 `is_sorted`, `is_sorted_until`, `partial_sort`, `partial_sort_copy`, `sort`, `stable_sort`, `nth_element`。

- `is_sorted`, `is_sorted_until` 判断容器是否按照顺序排序，`is_sorted(first, last)` 返回 `is_sorted_until(first, last) == last`，`operator<` 执行排序比较，`is_sorted(first, last, pred)` 返回 `is_sorted_until(first, last, pred) == last`，`pred` 执行排序比较。

- `partial_sort` 对元素的指定部分进行排序，例如：

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    random_shuffle(vec.begin(), vec.end());

    partial_sort(vec.begin(), vec.begin() + 5, vec.end());
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        cout << *iter << " ";
    }
    cout << endl;   /* 1 2 3 4 5 9 8 6 7 10 */

    return 0;
}
```

- `nth_element` 正确地找到范围中序列的第 n 个元素，以满足以下条件：位于此元素之前的所有元素小于或等于此元素，位于此元素之后的所有元素大于或等于此元素。与 `partial_sort` 相比，`nth_element` 不会对范围中第 n 个元素两边的任意元素排序，不需要较低范围的排序时，可以用作替代 `partial_sort` 的一种较快算法（复杂度为线性）。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    random_shuffle(vec.begin(), vec.end());

    decltype(vec) vec_copy(vec);
    partial_sort(vec_copy.begin(), vec_copy.begin() + 5, vec_copy.end());
    cout << vec_copy << endl;   /* { 1 2 3 4 5 9 8 6 7 10 } */

    vec_copy = vec;
    nth_element(vec_copy.begin(), vec_copy.begin() + 4, vec_copy.end());
    cout << vec_copy << endl;   /* { 4 1 2 3 5 6 9 8 7 10 } */

    return EXIT_SUCCESS;
}
```

- `sort` 复杂度为 O\(NlogN\)，而 `stable_sort` 复杂度取决于内存是否充足，最好为 O\(NlogN\)，最差为 O\(N\(logN\)^2\)。通常情况下， `sort` 比 `stable_sort` 更快，但 `sort` 不保证稳定性，即不保证保留等效元素的相对顺序。

### find, search 系列函数

包括 `adjacent_find`, `find`, `find_end`, `find_first_of`, `find_if`, `find_if_not`, `search`, `search_n`, `binary_search`, `lower_bound`, `upper_bound`。

- `adjacent_find` 查找符合条件的两个相邻元素，返回第一个元素的迭代器，如

```C++
auto result = adjacent_find(vec.begin(), vec.end(), [](int elem1, int elem2) { return elem1 * 2 == elem2; });
```

- `find_first_of` 查找一个序列中查找另一个序列中**任意**一个元素的第一次出现位置。

- `find_end` 用于在一个序列中查找另一个序列的最后一次出现位置。如果想要查找一个序列中子序列第一次出现的位置，可以使用 `search`。例如：

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> target{1, 2, 4, 6, 8, 7, 8, 4, 6, 8};
    vector<int> pattern{2, 3, 4};

    auto comp = [](int elem1, int elem2) { return elem1 == 2 * elem2; };

    auto result1 = search(target.begin(), target.end(), pattern.begin(),
                        pattern.end(), comp);
    cout << distance(target.begin(), result1) << endl;  /* 2 */

    auto result2 = find_end(target.begin(), target.end(), pattern.begin(),
                            pattern.end(), comp);
    cout << distance(target.begin(), result2) << endl;  /* 7 */

    return 0;
}
```

- `binary_search` 在**已排序范围**中查找是否有等于指定值的元素；`lower_bound`/`upper_bound` 在**已排序范围**中查找值不小于/大于指定值的首个元素的位置。这些算法要求容器必须已经排序，并且其谓词函数和排序函数的谓词函数相同。其复杂度对于随机访问迭代器是对数关系，对于其他迭代器是线性关系。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

class CInt {
   public:
    CInt(int value) : value_{value} {}
    CInt(const CInt& rhs) : value_{rhs.value_} {}
    CInt& operator=(const CInt& rhs) {
        value_ = rhs.value_;
        return *this;
    }
    auto operator<=>(const CInt& rhs) const { return value_ <=> rhs.value_; }
    friend ostream& operator<<(ostream& os, const CInt& rhs);

   private:
    int value_;
};

inline ostream& operator<<(ostream& os, const CInt& rhs) {
    os << "CInt(" << rhs.value_ << ")";
    return os;
}

int main() {
    vector<CInt> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    random_shuffle(vec.begin(), vec.end());
    cout << vec << endl;
    /* { CInt(5) CInt(4) CInt(8) CInt(9) CInt(1) CInt(6) CInt(3) CInt(2) CInt(7) CInt(10) } */

    auto comp = greater<CInt>();
    sort(vec.begin(), vec.end(), comp);

    CInt val{5};
    if (binary_search(vec.begin(), vec.end(), val, comp)) {
        cout << val << "is found." << endl;
    } else {
        cout << val << "is not found." << endl;
    }   /* CInt(5)is found. */

    vector<CInt>::iterator result;
    result = lower_bound(vec.begin(), vec.end(), val, comp);
    cout << "lower bound of " << val << ": " << *result << "." << endl;
    /* lower bound of CInt(5): CInt(5). */

    result = upper_bound(vec.begin(), vec.end(), val, comp);
    cout << "upper bound of " << val << ": " << *result << "." << endl;
    /* upper bound of CInt(5): CInt(4). */

    return EXIT_SUCCESS;
}
```

### heap 系列函数

堆 \(heap\) 是一种完全二叉树，每个节点的值都大于或等于其子节点，可以再对数时间内添加或删除元素。堆是实现优先级队列的理想方式，用于实现 C\+\+ 标准库容器适配器 `priority_queue` 类。

heap 系列函数包括 `is_heap`, `is_heap_until`, `make_heap`, `push_heap`, `pop_heap`, `sort_heap`。

- `push_heap`, `pop_heap` 和 `sort_heap` 需要容器在排序前必须是一个堆;

- `push_heap`/`pop_heap` 不会对容器进行添加和删除操作，需要在之前/后手动进行元素的添加/删除；

- `sort_heap` 被调用之后，容器不再是一个堆；

示例用法如下：

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8};
    random_shuffle(vec.begin(), vec.end());
    cout << vec << endl;    /* { 5 4 8 7 1 6 3 2 } */

    auto comp = greater<int>();

    make_heap(vec.begin(), vec.end(), comp);
    cout << vec << endl;    /* { 1 2 3 5 4 6 8 7 } */

    vec.push_back(9);
    push_heap(vec.begin(), vec.end(), comp);
    cout << vec << endl;    /* { 1 2 3 5 4 6 8 7 9 } */

    pop_heap(vec.begin(), vec.end(), comp);
    vec.pop_back();
    cout << vec << endl;    /* { 2 4 3 5 9 6 8 7 } */

    sort_heap(vec.begin(), vec.end(), comp);
    cout << vec << endl;    /* { 9 8 7 6 5 4 3 2 } */

    return 0;
}
```

### partition 系列函数

partition 意为将容器中的元素分为两个不相交的集合，满足条件元素在不满足条件的元素之前，包括 `is_partitioned`, `partition`, `partition_copy`, `partition_point`。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    random_shuffle(vec.begin(), vec.end());
    cout << vec << endl;    /* { 5 4 8 9 1 6 3 2 7 10 } */

    auto greater_than_five = [](int value) { return value > 5; };

    auto result = is_partitioned(vec.begin(), vec.end(), greater_than_five);
    cout << result << endl; /* 0 */

    partition(vec.begin(), vec.end(), greater_than_five);
    cout << vec << endl;    /* { 10 7 8 9 6 1 3 2 4 5 } */
    cout << is_partitioned(vec.begin(), vec.end(), greater_than_five) << endl;  /* 1 */
    cout << distance(vec.begin(),
                     partition_point(vec.begin(), vec.end(), greater_than_five))
         << endl;   /* 5 */

    return EXIT_SUCCESS;
}
```

### replace 系列函数

replace 意为检查范围中的每个元素，并替换与指定值匹配的元素，包括 `replace`, `replace_copy`, `replace_copy_if`, `replace_if`。

### permutation 系列函数

permutation 意为排列，即两个范围包含相同元素，但顺序可能不同。其包括 `is_permutation`, `prev_permutation`, `next_permutation`。

`prev_permutation`/`next_permutation` 得到字典顺序的更小/大排列，其可以通过谓词指定。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

class CInt {
   public:
    CInt(int value) : value_{value} {}
    CInt(const CInt& rhs) : value_{rhs.value_} {}
    CInt& operator=(const CInt& rhs) {
        value_ = rhs.value_;
        return *this;
    }
    auto operator<=>(const CInt& rhs) const { return value_ <=> rhs.value_; }
    auto operator==(const CInt& rhs) const { return value_ == rhs.value_; }
    inline int value() const { return value_; }
    friend ostream& operator<<(ostream& os, const CInt& rhs);

   private:
    int value_;
};

inline ostream& operator<<(ostream& os, const CInt& rhs) {
    os << "CInt(" << rhs.value_ << ")";
    return os;
}

int main() {
    vector<CInt> vec{5, 1, 10};
    decltype(vec) vec_copy(vec);

    next_permutation(vec.begin(), vec.end(), greater<CInt>());
    cout << vec << endl;        /* { CInt(1) CInt(10) CInt(5) } */
    cout << vec_copy << endl;   /* { CInt(5) CInt(1) CInt(10) } */
    cout << is_permutation(vec.begin(), vec.end(), vec_copy.begin(),
                           vec_copy.end())  /* using operator== */
         << endl;   /* 1 */
    cout << is_permutation(vec.begin(), vec.end(), vec_copy.begin(),
                           vec_copy.end(),
                           [](const CInt& lhs, const CInt& rhs) {
                               return lhs.value() == rhs.value();
                           }) /* using pred */
         << endl;   /* 1 */

    return EXIT_SUCCESS;
}
```

### min max 系列函数

包括 `min`, `max`, `minmax`, `min_element`, `max_element`, `minmax_element`。特别地，`minmax`, `minmax_element` 返回 `pair`。

`min`/`max`/`minmax` 接受两个对象，返回其中较小/大/\(小, 大\)的元素；或者接受一个 `initializer_list`，返回其中最小/大/\(小, 大\)的元素。

如果对容器进行最小/大/\(小, 大\)的元素判断，需要改用 `min_element`/`max_element`/`minmax_element`，其返回最小/大/\(小, 大\)元素的迭代器。

### set 系列函数

包括 `set_difference`, `set_intersection`, `set_symmetric_difference`, `set_union`，其复杂度是线性的。注意输入的两个范围都**需要排序，且排序方式相同**。此外，输出迭代器的范围需要足够大，否则会发生未定义行为。

假设输入集合为 $A,B$，输出集合为 $C$，则各个算法的解释如下：

- `set_difference`: $A\-B$

- `set_intersection`: $A\\cap B$

- `set_symmetric_difference`: $A\\cup B\-A\\cap B$

- `set_union`: $A\\cup B$

### count 系列函数

包括 `count`, `count_if`，返回范围内与指定值匹配的元素数量。

### fill 系列函数

包括 `fill`, `fill_n`，其将新值分配给指定范围内的每个元素。

### for\_each 系列函数

包括 `for_each`, `for_each_n`，将函数用于范围中每个元素。

### generate 系列函数

包括 `generate`, `generate_n`，将函数对象生成的值分配给范围中每个元素。

### merge 系列函数

包括 `inplace_merge`, `merge`，将两个已排序的范围合并。`inplace_merge` 用于在一个已排序的序列中原地合并两个已排序的子序列，而 `merge` 用于合并两个已排序的序列，并将结果存储在另一个序列中。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>
#include <random>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    mt19937 engine(42);
    uniform_int_distribution<int> dis(-10, 10);

    auto gen = [&engine, &dis] { return dis(engine); };
    auto comp = greater<int>();

    vector<int> vec1(5);
    generate(vec1.begin(), vec1.end(), gen);
    sort(vec1.begin(), vec1.end(), comp);
    cout << vec1 << endl;   /* { 9 6 5 -3 -7 } */

    vector<int> vec2(5);
    generate(vec2.begin(), vec2.end(), gen);
    sort(vec2.begin(), vec2.end(), comp);
    cout << vec2 << endl;   /* { 6 2 2 -1 -7 } */

    vector<int> vec3(vec1);
    copy(vec2.begin(), vec2.end(), back_inserter(vec3));
    cout << vec3 << endl;   /* { 9 6 5 -3 -7 6 2 2 -1 -7 } */
    inplace_merge(vec3.begin(), vec3.begin() + 5, vec3.end(), comp);
    cout << vec3 << endl;   /* { 9 6 6 5 2 2 -1 -3 -7 -7 } */

    vector<int> vec4;
    merge(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(),
          back_inserter(vec4), comp);
    cout << vec4 << endl;   /* { 9 6 6 5 2 2 -1 -3 -7 -7 } */

    return EXIT_SUCCESS;
}
```

### swap 系列函数

包括 `swap`, `swap_ranges`, `iter_swap`，用于交换元素。

- 如果 `Fit1` 和 `Fit2` 是前向迭代器，则 `iter_swap(Fit1, Fit2)` 等效于 `swap(*Fit1, *Fit2)`。

- `swap_ranges` 将一个范围中的元素与另一大小相等的范围中的元素交换。如果交换**同一类型的容器**中的元素，应使用该容器中的 `swap` **成员函数**，因为该成员函数通常具有恒定的复杂性。

### equal 系列函数

包括 `equal`, `equal_range`。

- `equal` 用于逐个元素比较两个范围是否相等或是否在二元谓词指定的意义上等效，通常用于比较不同容器类型，否则使用 `operator==`。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

int main() {
    vector<int> vec{1, 2, 3, 4, 5};
    list<int> l{2, 4, 6, 8, 10};
    cout << equal(vec.begin(), vec.end(), l.begin(), l.end(),
                [](int x1, int x2) { return x1 * 2 == x2; })
        << endl;
    return 0;
}
```

- `equal_range` 在已排序的范围中寻找所有元素都等效于给定值的子范围，其返回的一对迭代器中，第一个迭代器是 `lower_bound`，第二个迭代器是 `upper_bound`。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <random>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    random_device rd;
    mt19937 engine(rd());
    uniform_int_distribution<> dist(1, 10);

    vector<int> vec;
    generate_n(back_inserter(vec), 20, [&] { return dist(engine); });
    sort(vec.begin(), vec.end(), greater<int>());
    cout << vec << endl;    /* { 9 9 9 8 8 7 7 7 7 7 4 3 3 3 2 2 2 1 1 1 } */

    int value = 7;
    auto [first, last] =
        equal_range(vec.begin(), vec.end(), value, greater<int>());

    for (auto it = first; it != last; ++it) {
        cout << *it << " ";
    }
    cout << endl;   /* 7 7 7 7 7 */

    return 0;
}
```

### move 系列函数

包括 `move` 和 `move_backward`。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

class CInt {
   public:
    CInt() = default;
    CInt(int value) : value_{value} {
        cout << "Constructor called, value: " << value_ << "." << endl;
    }
    CInt(const CInt& rhs) : value_{rhs.value_} {
        cout << "Copy constructor called, value: " << value_ << "." << endl;
    }
    CInt(CInt&& rhs) : value_{rhs.value_} {
        cout << "Move constructor called, value: " << value_ << "." << endl;
    }
    CInt& operator=(const CInt& rhs) {
        cout << "Operator= called, value: " << value_ << "." << endl;
        value_ = rhs.value_;
        return *this;
    }
    inline int value() const { return value_; }
    friend ostream& operator<<(ostream& os, const CInt& rhs);

   private:
    int value_;
};

inline ostream& operator<<(ostream& os, const CInt& rhs) {
    os << "CInt(" << rhs.value_ << ")";
    return os;
}

int main() {
    int size = 5;
    vector<CInt> vec1;
    vec1.reserve(size);
    for (int i = 1; i <= size; ++i) {
        vec1.emplace_back(i);
    }

    vector<CInt> vec2;
    vec2.reserve(size);
    move(vec1.begin(), vec1.end(), back_inserter(vec2));
    cout << vec1 << endl;
    cout << vec2 << endl;

    return 0;
}
```

输出为：

```Plain Text
Constructor called, value: 1.
Constructor called, value: 2.
Constructor called, value: 3.
Constructor called, value: 4.
Constructor called, value: 5.
Move constructor called, value: 1.
Move constructor called, value: 2.
Move constructor called, value: 3.
Move constructor called, value: 4.
Move constructor called, value: 5.
{ CInt(1) CInt(2) CInt(3) CInt(4) CInt(5) }
{ CInt(1) CInt(2) CInt(3) CInt(4) CInt(5) 
```

### shuffle 系列函数

包括 `shuffle`, `random_shuffle`，重新排列给定范围中的元素。`random_shuffle` 函数已弃用，原因参考 [为什么在 C\+\+14 中弃用 std::random\_shuffle 方法？\- Stack Overflow](https://go.microsoft.com/fwlink/p/?linkid=397954)

```C++
#include <random>
#include <iostream>

using namespace std;

int main() {
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dist(1, 6);

    for (int i = 0; i < 5; ++i) {
        cout << dist(gen) << " ";
    }
    cout << endl;
    /* 5 1 6 1 2 */
}
```

### reverse 系列函数

包括 `reverse`, `reverse_copy`，反转元素的顺序。

### rotate 系列函数

包括 `rotate`, `rotate_copy`，交换相邻范围的元素，复杂度是线性。用 `rotate` 实现的 `push_front` 函数如下：

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

template <typename T>
void push_front(vector<T>& vec, const T& element) {
    vec.push_back(element);
    rotate(vec.begin(), vec.end() - 1, vec.end());
}

int main() {
    vector<int> vec{1, 2, 3, 4, 5};
    push_front(vec, 0);
    cout << vec << endl;    /* { 0 1 2 3 4 5 } */
    return 0;
}
```

### unique 系列函数

包括 `unique`, `unique_copy`，移除指定范围中彼此相邻的重复元素。复杂度为线性。

### clamp

将值与上限和下限进行比较，如果值位于边界之间，则返回对该值的引用；如果值高于或低于这两个限制，则返回对上限或下限的引用。

### includes

判断一个**排序**的范围是否包含另一**排序**范围中的所有元素，其中元素之间的排序或等效条件可通过二元谓词指定。复杂度是线性。

### lexicographical\_compare

逐个元素比较两个序列以确定其中的较小序列。如果第一个范围按字典顺序小于第二个范围，则为 `true`；否则为 `false`。序列之间按字典顺序进行的比较将逐个比较元素，直到：

- 它查找到两个不相等的相应元素，比较结果作为序列之间比较的结果。

- 未找到任何不相等的元素，但一个序列的元素数比另一个序列多，并且较短的序列小于较长的序列。

- 未找到任何不相等的元素，并且序列具有相同的元素数，因此序列相等，比较的结果为 `false`。

### mismatch

逐个元素对比两个范围，并找到出现不同的第一个位置。

### sample

从给定的范围中随机采样一定数量的元素。

### transform

将指定的函数对象应用于源范围中的每个元素或两个源范围中的元素对。 然后，它将函数对象的返回值复制到目标范围。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    transform(vec.begin(), vec.end(), vec.begin(),
              [](int value) { return value % 2 == 1 ? value : 0; });
    cout << vec << endl;    /* { 1 0 3 0 5 0 7 0 9 0 } */
    return 0;
}
```

## \<numeric\>

### **scan 系列函数**

包括 `exclusive_scan`, `inclusive_scan`, `transform_exclusive_scan`, `transform_inclusive_scan`，对一个范围内的元素执行累积计算，并将结果存储到另一个范围中。`transform_*` 先对元素进行一次变换操作，然后再进行累积计算操作。

`inclusive_scan` 和 `exclusive_scan` 的签名如下：

```C++
template<class InputIt, class OutputIt, class BinaryOp>
OutputIt inclusive_scan(InputIt first, InputIt last, OutputIt d_first, BinaryOp op);

template<class InputIt, class OutputIt, class T, class BinaryOp>
OutputIt exclusive_scan(InputIt first, InputIt last, OutputIt d_first, T init, BinaryOp op);
```

`exclusive_scan` 对输入范围 \[first, last\) 中的元素进行二元操作 `op`，并将结果存储到输出范围 \[d\_first, d\_first \+ \(last \- first\)\) 中。与 `inclusive_scan` 不同的是，`exclusive_scan` 需要指定一个初始值 `init`，作为累积的起始值。输出范围中的每个元素都是输入范围中相应位置元素之前（不包括自身）所有输入元素的累积结果。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

template <typename T>
inline ostream& operator<<(ostream& os, const vector<T>& vec) {
    os << "{ ";
    for (auto iter = vec.begin(); iter != vec.end(); ++iter) {
        os << *iter << " ";
    }
    os << "}";
    return os;
}

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> result(numbers.size());

    inclusive_scan(numbers.begin(), numbers.end(), result.begin(),
                   multiplies<int>());
    cout << result << endl;  // { 1 2 6 24 120 }

    exclusive_scan(numbers.begin(), numbers.end(), result.begin(), 1,
                   multiplies<int>());
    cout << result << endl;  // { 1 1 2 6 24 }

    transform_exclusive_scan(numbers.begin(), numbers.end(), result.begin(), 1,
                             multiplies<int>(),
                             [](int elem) { return elem * 2; });
    cout << result << endl;  // { 1 2 8 48 384 }

    return 0;
}
```

### **reduce 系列函数**

包括 `reduce`, `transform_reduce`，在给定的范围 \[first, last\) 上执行二元操作 op，初始值为 init。它可以在顺序执行、并行执行或未指定执行顺序的情况下执行操作，具体取决于传递给函数的执行策略。`reduce` 要求二元操作 op 是满足结合律的。否则，结果可能会与预期不符。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    int result;

    result = std::reduce(numbers.begin(), numbers.end(), 0, std::minus<int>());
    std::cout << result << std::endl; /* Expect -15, get -5 */

    result = std::reduce(numbers.begin(), numbers.end(), 0, std::plus<int>());
    std::cout << result << std::endl; /* Expect 15, get 15*/

    return 0;
}
```

### **accumulate**

`accumulate` 函数计算指定范围内所有元素的累加值。`accumulate` 不支持并行计算，其复杂度与范围大小是线性关系。

```C++
// compile with g++ (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    int result =
        std::accumulate(numbers.begin(), numbers.end(), 0, std::minus<int>());
    std::cout << result << std::endl; /* -15 */

    return 0;
}
```

### **partial\_sum**

`partial_sum` 对一个范围内的元素执行部分和计算，并将结果存储到另一个范围中。

```C++
#include <iostream>
#include <numeric>
#include <vector>

using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> result(numbers.size());

    partial_sum(numbers.begin(), numbers.end(), result.begin(), multiplies<>());

    for (const auto& num : result) {
        cout << num << " ";
    }
    cout << endl;  // Output: 1 3 6 24 120

    return 0;
}
```

### **inner\_product**

计算两个范围内元素的内积。

### **adjacent\_difference**

计算输入范围中每个元素与其前一元素之间的连续差值，即对于输入范围中的值序列 a1, a2, a3，第二个模板函数将在目标范围中存储连续的 adjacent\_difference 值：a1, a2 binary\_op a1, a3 binary\_op a2。

### **gcd 和 lcm**

gcd 计算最大公约数 \(Greatest Common Divisor\)，lcm 计算最小公倍数 \(Least Common Multiple\)。

## 参考

- Microsoft Learn: [https://learn\.microsoft\.com/zh\-cn/cpp/standard\-library/algorithm\-functions?view=msvc\-170](https://learn.microsoft.com/zh-cn/cpp/standard-library/algorithm-functions?view=msvc-170)

- C\+\+ Reference: [https://en\.cppreference\.com/w/](https://en.cppreference.com/w/)

- ChatGPT 3\.5: [https://chat\.openai\.com/](https://chat.openai.com/)
