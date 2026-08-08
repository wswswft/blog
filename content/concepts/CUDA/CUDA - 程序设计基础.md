---
title: "CUDA - 程序设计基础"
description: "CUDA 学习笔记：程序设计基础"
tags:
  - "concept"
  - "CUDA"
  - "GPU"
---
# CUDA - 程序设计基础

## CUDA矩阵加法运算程序

### CUDA程序基本框架

![图片\.png](assets/图片%2037.png)

### 设置GPU设备

1. 获取GPU设备数量

```C++
int iDeviceCount = 0;
cudaGetDeviceCount(&iDeviceCount);
```

![图片\.png](assets/图片%2032.png)

- \_\_host\_\_\_\_device\_\_说明该函数可以在主机和设备程序中被调用

- 几乎每一个运行时API都有一个cudaError\_t的返回值，代表此运行时API的调用时的状态，返回cudaSuccess时调用成功

2. 设置GPU执行时使用的设备

```C++
int iDev = 0;
cudaSetDevice(iDev)
```

![图片\.png](assets/图片%2042.png)

- \_\_host\_\_说明该函数只可以在主机程序中被调用

- 这里直接把int值传进去了

```C++
#include <stdio.h>

int main(void)
{
    // 检测计算机GPU数量
    int iDeviceCount = 0;
    cudaError_t error = cudaGetDeviceCount(&iDeviceCount);

    if (error != cudaSuccess || iDeviceCount == 0)
    {
        printf("No CUDA campatable GPU found!\n");
        exit(-1);
    }
    else
    {
        printf("The count of GPUs is %d.\n", iDeviceCount);
    }
    
    // 设置执行
    int iDev = 0;
    error = cudaSetDevice(iDev);
    if (error != cudaSuccess)
    {
        printf("fail to set GPU 0 for computing.\n");
        exit(-1);
    }
    else
    {
        printf("set GPU 0 for computing.\n");
    }

    return 0;
}

```

### 内存管理

- CUDA 通过内存分配、数据传递、内存初始化、内存释放进行内存管理

- 标准C语言内存管理函数 $————————————————————$CUDA内存管理函数

![图片\.png](assets/图片%2044.png)

#### 内存分配

- 主机分配内存：extern void \*malloc\(unsigned int num\_bytes\);

```C++
float *fpHost_A;
fpHost_A = (float *)malloc(nBytes);
```

设备分配内存：

```C++
float *fpDevice_A;
cudaMalloc((float**)&fpDevice_A, nBytes);
```

![图片\.png](assets/图片%2057.png)

- C/C\+\+不支持多个返回值，而这里返回值用来返回错误代码，所以只有在设计成双重指针的时候，才能通过这个函数进行地址分配

#### 数据拷贝（按字节）

- 主机数据拷贝： void \*memcpy\(void \*dest, const void \*src, size\_t n\);

```C++
memcpy((void*)d, (void*)s, nBytes);
```

- 设备数据拷贝：

```C++
cudaMemcpy(Device_A, Host_A, nBytes,cudaMemcpyHostToHost)
```

![图片\.png](assets/图片%208.png)

- kind:

    - cudaMemcpyHostToHost          主机→主机

    - cudaMemcpyHostToDevice      主机→设备

    - cudaMemcpyDeviceToHost      设备→主机（有隐式同步）

    - cudaMemcpyDeviceToDevice 设备→设备

    - cudaMemcpyDefault                   默认

    - 默认方式只允许在支持统一虚拟寻址的系统上使用。

#### 内存初始化（按字节）

主机内存初始化：void \*memset\(void \*str, int c, size\_t n\);

```C++
memset(fpHost_A, 0, nBytes);
```

设备内存初始化：

```C++
cudaMemset(fpDevice_A, 0, nBytes);
```

![图片\.png](assets/图片%2043.png)

#### 内存释放

释放主机内存：

```C++
free(pHost_A);
```

释放设备内存：

```C++
cudaFree(pDevice_A);
```

![图片\.png](assets/图片%2056.png)

### 自定义设备函数

1. 设备函数（device function）

    1. 定义只能执行在GPU设备上的函数为设备函数

    2. 设备函数只能被核函数或其他设备函数调用

    3. 设备函数用 \_\_device\_\_ 修饰

2. 核函数（kernel function）

    1. 用 \_\_global\_\_ 修饰的函数称为核函数，一般由主机调用，在设备中执行

    2. \_\_global\_\_ 修饰符既不能和\_\_host\_\_同时使用，也不可与\_\_device\_\_ 同时使用

3. 主机函数（host function）

    1. 主机端的普通 C\+\+ 函数可用 host 修饰

    2. 对于主机端的函数， \_\_host\_\_修饰符可省略

    3. 可以用 \_\_host\_\_ 和 \_\_device\_\_ 同时修饰一个函数减少冗余代码。编译器会针对主机和设备分别编译该函数。

## CUDA错误检查

### 运行时API错误代码

1. CUDA运行时API大多支持返回错误代码，返回值类型：cudaError\_t

2. 运行时API成功执行，返回值为cudaSuccess

3. 运行时API返回的执行状态值是枚举变量

![图片\.png](assets/图片%2054.png)

### 错误检查函数

1. 获取错误代码对应名称：cudaGetErrorName

    1. 返回 char\*

![图片\.png](assets/图片%2061.png)

2. 获取错误代码描述信息： cudaGetErrorString

    1. 返回 char\*

![图片\.png](assets/图片%2053.png)

3. ErrorCheck函数：

    1. 在调用CUDA运行时API时，调用ErrorCheck函数进行包装

    2. 参数filename一般使用\_\_FILE\_\_; 参数lineNumber一般使用\_\_LINE\_\_

    3. 错误函数返回运行时API调用的错误代码

    ```C++
    cudaError_t error = cudaMalloc((float**)&fpDevice_A,4);//未包装，下面是已包装
    cudaError_t error = ErrorCheck(cudaMalloc((float**)&fpDevice_A,4),__FILE__,__LINE__);
    ```

### 检查核函数

1. 错误检测函数问题：不能捕捉调用核函数的相关错误

2. 捕捉调用核函数可能发生错误的方法：

```C++
ErrorCheck(cudaGetLastError(), __FILE__, __LINE__);//检测同步函数之上的最后一条错误
ErrorCheck(cudaDeviceSynchronize(), __FILE__, __LINE__);
```

3. 核函数定义：

```C++
**__global__** void kernel_function(argument arg);
```

![图片\.png](assets/图片%2033.png)

## CUDA记时

### 事件记时

- 程序执行时间记时：是CUDA程序执行性能的重要表现

- 使用CUDA 事件（event）记时方式

- CUDA 事件记时可为主机代码、设备代码记时

![图片\.png](assets/图片%2027.png)

- Lesson 3\.3中有对应的时间计时器的模板

### nvprof性能刨析\(计算能力8\.0以上无法直接使用\)

- nvprof是一个可执行文件

- 执行命令：nvprof \./exe\_name

- 8\.0以上的替代  

```C++
nsys nvprof ./nvprofAnalysis
```

### nvsight配置有bug先跳过了
