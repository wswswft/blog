---
title: "CUDA - 快速入门"
description: "CUDA 学习笔记：快速入门"
tags:
  - "concept"
  - "CUDA"
  - "GPU"
cover: assets/cuda-1-1.jpg
---
# CUDA - 快速入门

## PREVIEW

- GPU可以视为CPU的协处理器，作为一个device

- CPU与GPU间通讯比较慢（PCIE总线的问题）

## NVCC

1. 安装CUDA就能用，支持纯C\+\+代码编译

2. 编译拓展名为\.cu的CUDA文件

```Bash
nvcc hello.cu -o hello
```

![图片\.png](assets/图片%2035.png)

## CUDA核函数

### 1\.核函数

- CPU下达命令来控制GPU，CUDA既要编写在CPU上运行的主机代码，也要编写在GPU上运行的设备代码

- 主机对设备的调用是通过核函数进行的

- 核函数在GPU上进行并行执行，但是这种并行执行不是从编写代码层面来实现的，作为开发人员不需要从代码层面考虑多线程，编写代码时不需要考虑并行性

- 注意：

    - 限定词\_\_global\_\_修饰，后续其它限定词基本都是遵循前后双下划线的规定

    - 核函数返回值通常是void，主机代码调用核函数时返回值必须是void

```C++
//可以调换顺序
__global__ void kernel_function(argument arg){
    printf("Hello World from the GPU!\n");
}

void __global__ kernel_function(argument arg){
    printf("Hello World from the GPU!\n");
}
```

- 核函数的其它重要性质：

    - 核函数只能访问GPU内存（显存）：编写核函数不要访问主机的内存

    - 核函数不能使用变长参数

    - 核函数不能使用静态变量

    - 核函数不能使用函数指针

    - 核函数具有异步性：调用核函数时，只是启动了核函数，但是CPU主机无法控制GPU设备的执行，CPU主机不会等待核函数执行完毕，所以我们需要显式地调用同步函数，同步CPU与GPU的工作进程，有些线程的执行也需要同步

### 2\.CUDA程序编写流程

```C++
int main(void){
    主机代码(配置GPU并做数据处理)
    核函数调用（并行加速数据处理）
    主机代码（数据回传，释放显存）
    return 0；
}
```

- 核函数不支持C\+\+的iosteram类，打印时用printf函数

```C++
#include<stdio.h>
__global__ void hello_from_gpu(){
    printf("Hello World from the GPU!\n");
}
int main (void){
    hellp_from_gpu<<<1,1>>>();//设置核函数执行线程（线程块个数，每个线程块的线程数）
    cudaDeviceSynchronize();//同步主机与设备，刷新缓冲区
    return 0;
}
```

- 主机与设备的同步问题是CPU，GPU异构架构的一个特点

### 3\.运行一个实例

![图片\.png](assets/图片%2017.png)
