---
title: "CUDA - 线程模型"
description: "CUDA 学习笔记：线程模型"
tags:
  - "concept"
  - "CUDA"
  - "GPU"
---
# CUDA - 线程模型

## CUDA线程模型

### 1\.线程模型结构

1. 线程模型重要概念：

    1. Grid 网格：每个核函数启动所产生的所有线程统称为一个网格

    2. Block 线程块 ：网格由若干个线程块构成

    3. Thread 线程：一个线程块包含着一组线程

2. 线程分块是逻辑上的划分，物理上线程不分块  

3. 配置线程：\<\<\<grid\_size,block\_size\>\>\>

    1. 线程数至少要大于等于计算核心数才能充分利用资源

4. 最大允许线程块大小：1024

最大允许网格大小： $2^{31}-1$（针对一维网格）

![图片\.png](assets/图片%207.png)

![图片\.png](assets/图片%2052.png)

### 2\.线程组织管理

#### 一位维线程模型

1. 每个线程在核函数中都有一个唯一的身份标识

2. 每个线程的唯一标识由这两个\<\<\<grid\_size, block\_size\>\>\>确定；grid\_size, block\_size保存在内建变量（build\-in variable），内建变量不需要去定义，可以直接在核函数中使用，目前考虑的是一维的情况:

    1. gridDim\.x：该变量的数值等于执行配置中变量grid\_size的值

    2. blockDim\.x：该变量的数值等于执行配置中变量block\_size的值。

3. 线程索引保存成内建变量（ build\-in variable）：

    1. blockIdx\.x：该变量指定一个线程在一个网格中的线程块索引值，范围为0\~ gridDim\.x\-1；

    2. threadIdx\.x：该变量指定一个线程在一个线程块中的线程索引值，范围为0\~ blockDim\.x\-1

4. 例如：kernel\_fun\<\<\<2, 4\>\>\>\(\) ;

    - Dim从1开始，ldx从 0开始

    - gridDim\.x 的值为2

    - blockDim\.x的值为4

    - 线程唯一标识：blockIdx\.x取值范围为0\~1

    ```C++
    Idx = threadIdx.x + blockIdx.x * blockDim.xthreadIdx.x 
    ```



![图片\.png](assets/图片%2022.png)

![图片\.png](assets/图片%2013.png)

#### 推广到多维线程

1. CUDA可以组织三维的网格和线程块

2. blockIdx和threadIdx是类型为uint3的变量，该类型是一个结构体，具有x,y,z三个成员（3个成员都为无符号类型的成员构成）：

    $\begin{cases}
   𝑏𝑙𝑜𝑐𝑘𝐼𝑑𝑥. 𝑥\\
   𝑏𝑙𝑜𝑐𝑘𝐼𝑑𝑥. 𝑦\\
   𝑏𝑙𝑜𝑐𝑘𝐼𝑑𝑥. 𝑧
\end{cases}$                                    $\begin{cases}
 thread𝐼𝑑𝑥. 𝑥\\
 𝑡ℎ𝑟𝑒𝑎𝑑𝐼𝑑𝑥. 𝑦\\
 𝑡ℎ𝑟𝑒𝑎𝑑𝐼𝑑𝑥. 𝑧
\end{cases}$

3. gridDim和blockDim是类型为dim3的变量，该类型是一个结构体，具有x,y,z三个成员：

$\begin{cases}
gridDim. 𝑥\\
gridDim. 𝑦\\
gridDim. 𝑧
\end{cases}$                                    $\begin{cases}
𝑏𝑙𝑜𝑐𝑘Dim. 𝑥\\
𝑏𝑙𝑜𝑐𝑘Dim. 𝑦\\
𝑏𝑙𝑜𝑐𝑘Dim. 𝑧
\end{cases}$

4. 取值范围：

blockIdx\.x 范围 $[0, gridDim.x-1]$

threadIdx\.x 范围 $[0, blockDim.x-1]$

blockIdx\.y 范围 $[0, gridDim.y-1]$

threadIdx\.y 范围 $[0, blockDim.y-1]$

blockIdx\.z范围 $[0, gridDim.z-1]$

threadIdx\.z 范围 $[0, blockDim.z-1]$

注意：内建变量只在核函数有效，且无需定义！

5. \<\<\<grid\_size, block\_size\>\>\>

    - grid\_size  $\rightarrow$ gridDim\.x

    - block\_size $\rightarrow$ blockDim\.x

    - gridDim和blockDim没有指定的维度默认为1：

    $\begin{cases}
gridDim. 𝑥 = grid\_size\\
gridDim. 𝑦 = 1\\
gridDim. 𝑧 = 1
\end{cases}$                      $\begin{cases}
𝑏𝑙𝑜𝑐𝑘Dim. 𝑥 = block\_size\\
𝑏𝑙𝑜𝑐𝑘Dim. 𝑦 = 1\\
𝑏𝑙𝑜𝑐𝑘Dim. 𝑧 = 1
\end{cases}$

6. 定义多维网格和线程块（c\+\+构造函数语法）：

    ```C++
    dim3 grid_size(Gx, Gy, Gz);
      dim3 block_size(Bx, By, Bz);
    ```

7. 举个例子,定义一个 2×2×1 的网格， 5×3×1的线程块，代码中定义如下:

    ```C++
    dim3 grid_size(2, 2);// 等价于dim3 grid_size(2, 2, 1);
      dim3 block_size(5, 3);// 等价于dim3 block_size(5, 3, 1);
    ```

![图片\.png](assets/图片%2015.png)

8. 多维网格和多维线程块本质是一维的，GPU物理上不

分块。

9. 每个线程都有唯一标识：

    ```C++
    int tid = threadIdx.y * blockDim.x + threadIdx.x;
    int bid = blockIdx.y * gridDim.x + blockIdx.x;
    ```

08推广到多维线程

多维线程块中的线程索引：

```C++
int tid = threadIdx.z * blockDim.x * blockDim.y + threadIdx.y * blockDim.x + threadIdx.x;
```

多维网格中的线程块索引：

```C++
int bid = blockIdx.z * gridDim.x * gridDim.y + blockIdx.y * gridDin.x + blockIdx.x;
```

### 3\.网络与线程块限制

1. 网格大小限制：

gridDim\.x 最大值： $2^{31}-1$

gridDim\.y 最大值：$2^{16}-1$

gridDim\.z 最大值：$2^{16}-1$

2. 线程块大小限制：

blockDim\.x 最大值：1024

blockDim\.y 最大值： 1024

blockDim\.z 最大值：64

注意：线程块总的大小最大为1024！！

## 线程随机索引计算方式

### 一维网格 一维线程块

1. 定义grid和block尺寸:

```C++
dim3 grid_size(4);
dim3 block_size(8);
```

2. 调用核函数：

```C++
kernel_fun<<< grid_size, block_size >>>(…) ;
//具体的线程索引方式如图所示：
//blockIdx.x从0到3，threadIdx.x从0到7
```

3. 计算方式：

```C++
int id = blockIdx.x * blockDim.x + threadIdx.x
```

![图片\.png](assets/图片%2024.png)

### 二维网格 二维线程块

1. 定义grid和block尺寸:

```C++
dim3 grid_size(2, 2);
dim3 block_size(4, 4);
```

2. 调用核函数：

```C++
kernel_fun<<< grid_size, block_size >>>(…) ;
//具 体 的 线 程 索 引 方 式:
//blockIdx.x 和blockIdx.y从0到1;
//threadIdx.x和threadIdx.y从0到3。
```

3. 计算方式：

```C++
int blockId = gridDim.x * blockIdx.x + blockId.y;
int threadId = threadIdx.y *blockDim.x + threadIdx.x;
int id = blockId * (blockDim.x * blockDim.y) + threadId;
```

![图片\.png](assets/图片%2016.png)

### 三维网格 三维线程块

1. 定义grid和block尺寸:

```C++
dim3 grid_size(2, 2, 2);
dim3 block_size(4, 4, 2);
```

2. 调用核函数：

```C++
kernel_fun<<< grid_size, block_size >>>(…) ;
//具体的线程索引方式如图所示
//blockIdx.x、blockIdx.y和blockIdx.z 从 0 到 1 
//threadIdx.x 、 threadIdx.y 从 0 到 3 ，threadIdx.z从0到1。
```

3. 计算方式：

```C++
int blockId = gridDim.x * gridDim.y * blockIdx.z + blockIdx.y * gridDim.x + blockIdx.x;
int threadId = (threadIdx.z * (blockDim.x * blockDim.y)) + (threadIdx.y * blockDim.x) + threadIdx.x;
int id = blockId * (blockDim.x * blockDim.y * blockDim.z) + threadId
```

### 其他组合

```C++
//一维Grid 一维Block：
int blockId = blockIdx.x;
int id = blockIdx.x *blockDim.x + threadIdx.x;
//一维Grid 二维Block:
int blockId = blockIdx.x;
int id = blockIdx.x * blockDim.x * blockDim.y + threadIdx.y * blockDim.x + threadIdx.x;
//一维Grid 三维Block
int blockId = blockIdx.x;
int id = blockIdx.x * blockDim.x * blockDim.y * blockDim.z
+ threadIdx.z * blockDim.y * blockDim.x
+ threadIdx.y * blockDim.x + threadIdx.x;
//二维Grid 一维Block：
int blockId = blockIdx.y * gridDim.x + blockIdx.x;
int id = blockId * blockDim.x + threadIdx.x;
//二维Grid 二维Block:
int blockId = blockIdx.x + blockIdx.y * gridDim.x;
int id = blockId * (blockDim.x * blockDim.y) + (threadIdx.y * blockDim.x) + threadIdx.x;
//二维Grid 三维Block
int blockId = blockIdx.x + blockIdx.y * gridDim.x;
int id = blockId * (blockDim.x * blockDim.y * blockDim.z)
+ (threadIdx.z * (blockDim.x * blockDim.y))
+ (threadIdx.y * blockDim.x) + threadIdx.x;
//三维Grid 一维Block：
int blockId = blockIdx.x + blockIdx.y * gridDim.x + gridDim.x * gridDim.y * blockIdx.z;
int id = blockId * blockDim.x + threadIdx.x;
//三维Grid 二维Block:
int blockId = blockIdx.x + blockIdx.y * gridDim.x + gridDim.x * gridDim.y * blockIdx.z;
int id = blockId * (blockDim.x * blockDim.y) + (threadIdx.y * blockDim.x) + threadIdx.x;
//三维Grid 三维Block
int blockId = blockIdx.x + blockIdx.y * gridDim.x + gridDim.x * gridDim.y * blockIdx.z;
int id = blockId * (blockDim.x * blockDim.y * blockDim.z)
+ (threadIdx.z * (blockDim.x * blockDim.y))
+ (threadIdx.y * blockDim.x) + threadIdx.x;
```
