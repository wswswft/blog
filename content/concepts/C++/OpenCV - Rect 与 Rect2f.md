---
title: "OpenCV - Rect 与 Rect2f"
description: "OpenCV 整数矩形与浮点矩形的区别和转换"
tags:
  - "concept"
  - "C++"
  - "OpenCV"
---
# OpenCV - Rect 与 Rect2f

## OpenCV

#### 1\.cv::Rect  \& cv::Rect2f

cv::Rect 和 cv::Rect2f 是 OpenCV 中表示矩形的两个不同类，主要区别在于坐标和尺寸的数据类型。

1. 数据类型区别

    - cv::Rect \- 整数矩形

    ```C++
    // 使用整数坐标（int类型）
    cv::Rect rect_int(x, y, width, height);
    ```

    > 坐标类型: int
    > 
    > 成员: x, y, width, height 都是 int 类型
    > 
    > 适用场景: 像素级操作，图像ROI提取
    > 
    > 

    - cv::Rect2f \- 浮点数矩形

    ```C++
    // 使用浮点数坐标（float类型）
    cv::Rect2f rect_float(x, y, width, height);
    ```

    > 坐标类型: float
    > 
    > 成员: x, y, width, height 都是 float 类型
    > 
    > 适用场景: 亚像素精度操作，几何变换
    > 
    > 

2. 相互转换

    ```C++
    // Rect 转 Rect2f（隐式转换）
    cv::Rect rect_int(10, 20, 100, 150);
    cv::Rect2f rect_from_int = rect_int;  // 自动转换
    
    // Rect2f 转 Rect（需要显式转换，可能丢失精度）
    cv::Rect2f rect_float(10.7f, 20.3f, 100.5f, 150.8f);
    cv::Rect rect_from_float = rect_float;  // 自动向下取整: (10, 20, 100, 150)
    
    // 使用 cv::Rect() 构造函数进行显式转换
    cv::Rect rect_explicit(static_cast<int>(rect_float.x),
                          static_cast<int>(rect_float.y),
                          static_cast<int>(rect_float.width),
                          static_cast<int>(rect_float.height));
    ```

3. 常见操作

    ```Java
    // 求交集
    cv::Rect intersection_int = rect1 & rect2;
    cv::Rect2f intersection_float = rectf1 & rectf2;
    // 求并集
    cv::Rect union_int = rect1 | rect2;
    cv::Rect2f union_float = rectf1 | rectf2;
    // 判断是否包含点
    bool contains_int = rect1.contains(cv::Point(30, 40));
    bool contains_float = rectf1.contains(cv::Point2f(30.5f, 40.2f));
    // 获取面积
    int area_int = rect1.area();
    float area_float = rectf1.area();
    // 获取中心点
    cv::Point center_int = (rect1.tl() + rect1.br()) / 2;
    cv::Point2f center_float = (rectf1.tl() + rectf1.br()) / 2.0f;
    
    ```
