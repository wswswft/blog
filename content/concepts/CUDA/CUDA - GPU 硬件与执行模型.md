---
title: "CUDA - GPU 硬件与执行模型"
description: "CUDA 学习笔记：GPU 硬件与执行模型"
tags:
  - "concept"
  - "CUDA"
  - "GPU"
---
# CUDA - GPU 硬件与执行模型

## GPU信息查询

### 运行时API查询GPU信息

- 涉及的运行时API函数:  cudaGetDeviceProperties\(结构体地址，索引号\)

- 调用： cudaDeviceProp prop; 

ErrorCheck\(cudaGetDeviceProperties\(\&prop, device\_id\), \_\_FILE\_\_, \_\_LINE\_\_\);

![图片\.png](assets/图片%2030.png)

![图片\.png](assets/图片%2026.png)

- SM：流式多处理器

### 查询GPU计算核心数量

- CUDA运行时API函数是无法查询GPU核心数量的（起码我不知道应该用哪一个运行

时API函数进行查询）

- 根据GPU的计算能力进行查询（其实就是打表）

```C++
#include <stdio.h>
#include "../tools/common.cuh"

int getSPcores(cudaDeviceProp devProp)
{  
    int cores = 0;
    int mp = devProp.multiProcessorCount;
    switch (devProp.major){
     case 2: // Fermi
      if (devProp.minor == 1) cores = mp * 48;
      else cores = mp * 32;
      break;
     case 3: // Kepler
      cores = mp * 192;
      break;
     case 5: // Maxwell
      cores = mp * 128;
      break;
     case 6: // Pascal
      if ((devProp.minor == 1) || (devProp.minor == 2)) cores = mp * 128;
      else if (devProp.minor == 0) cores = mp * 64;
      else printf("Unknown device type\n");
      break;
     case 7: // Volta and Turing
      if ((devProp.minor == 0) || (devProp.minor == 5)) cores = mp * 64;
      else printf("Unknown device type\n");
      break;
     case 8: // Ampere
      if (devProp.minor == 0) cores = mp * 64;
      else if (devProp.minor == 6) cores = mp * 128;
      else if (devProp.minor == 9) cores = mp * 128; // ada lovelace
      else printf("Unknown device type\n");
      break;
     case 9: // Hopper
      if (devProp.minor == 0) cores = mp * 128;
      else printf("Unknown device type\n");
      break;
     default:
      printf("Unknown device type\n"); 
      break;
      }
    return cores;
}

int main()
{
    int device_id = 0;
    ErrorCheck(cudaSetDevice(device_id), __FILE__, __LINE__);
    

    cudaDeviceProp prop;
    ErrorCheck(cudaGetDeviceProperties(&prop, device_id), __FILE__, __LINE__);

    printf("Compute cores is %d.\n", getSPcores(prop));

    return 0;
}
```

![图片\.png](assets/图片%2049.png)

## 组织线程模型（以二维矩阵加法为例）

- 数据存储方式：

    - 数据在内存中是以线性、以行为主的方式存储

    - 本例中，16×8的二维数组，在内存中一段连续的128个地址存储该数组。

![图片\.png](assets/图片%2021.png)

![图片\.png](assets/图片%2047.png)

### 二维网格二维线程块

- 二维网格和二维线程块对二维矩阵进行索引

- 每个线程可负责一个矩阵元素的计算任务

![图片\.png](assets/图片%2034.png)

- 线程与二维矩阵映射关系

    $\begin{cases}
ix = threadldx.x+blockldx.x\times blockDim.x\\
iy = threadldx.y+blockldx.y\times blockDim.y
\end{cases}$

- 线程与二维矩阵映射关系

$idx = iy \times nx + ix$

![图片\.png](assets/图片%209.png)

### 二维网格一维线程块

- $blockDim.y = 1
$          其余同上

### 一维网格一维线程块

- $blockDim.y =1
$     

- iy由循环进行指定

## GPU硬件资源

### 流多处理器\-\-SM

- GPU并行性依靠流多处理器SM（streaming multiprocessor）来完成

- 不同架构的SM不同

![图片\.png](assets/图片%2028.png)

![图片\.png](assets/图片%2019.png)



- 一个GPU是由多个SM构成的，Fermi架构SM关键资源如下：

    1. CUDA核心（CUDA core）

    2. 共享内存/L1缓存（shared memory/L1 cache）

    3. 寄存器文件（RegisterFile）

    4. 加载和存储单元（Load/Store Units）

    5. 特殊函数单元（Special Function Unit）

        1. 用来执行一些高效函数，如正弦余弦平方根

    6. Warps调度（Warps Scheduler）

- GPU中每个SM都可以支持数百个线程并发执行

- 以线程块block为单位，向SM分配线程块，多个线程块可被同时分配到一个可用的SM上

- 当一个线程块被分配好SM后，就不可以再分配到其他SM上了

![图片\.png](assets/图片%2029.png)

### 线程模型与物理结构

![图片\.png](assets/图片%2050.png)

- 左图线程模型，是在逻辑角度进行分析

- 线程模型可以定义成千上万个线程

- 网格中的所有线程块需要分配到SM上进行执行

- 线程块内的所有线程分配到同一个SM中执行，但是每个SM上可以被分配多个线程块

- 线程块分配到SM中后，会以32个线程为一组进行分割，每个组成为一个wrap

- 右图物理结构，是在硬件角度进行分析，因为硬件资源是有限的，所以活跃的线程束的数量会受到SM资源限制。

### 线程束

- CUDA 采用单指令多线程SIMT架构管理执行线程，每32个为一组，构成一个线程束。

- 同一个线程块中相邻的 32个线程构成一个线程束

- 具体地说，一个线程块中第 0 到第 31 个线程属于第 0 个线程束，第 32 到第 63 个线程 属于第 1 个线程束，依此类推。

![图片\.png](assets/图片%2060.png)

- 每个线程束中只能包含同一线程块中的线程

- 每个线程束包含32个线程 = SM的core数量

- 线程束是GPU硬件上真正的做到了并行

![图片\.png](assets/图片%2025.png)

- 线程束数量 = ceil（线程块中的线程数/32）
