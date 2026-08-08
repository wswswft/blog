---
title: "TensorRT - 概览与工作流"
description: "TensorRT 安装、生态与工作流"
tags:
  - "concept"
  - "TensorRT"
  - "inference"
---
# TensorRT - 概览与工作流

本笔记来自 TensorRT 快速入门指南的翻译和整理，用于快速理解如何将训练好的模型转换为 TensorRT 引擎并运行推理。

## 介绍

- NVIDIA TensorRT 是一个 SDK，用于优化经过训练的深度学习模型以实现高性能推理。TensorRT 包含深度学习推理优化器和执行运行时。

- 在您选择的框架中训练深度学习模型后，TensorRT 使您能够以更高的吞吐量和更低的延迟运行它。

- 本部分介绍 TensorRT 中可用的基本安装、转换和运行时选项，以及何时最好应用这些选项。

以下是每章的快速摘要：

- [安装 TensorRT](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#installing-tensorrt) \- 我们提供了多种安装 TensorRT 的简单方法。

- [TensorRT 生态系统 ](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#ecosystem) \- 我们描述了一个简单的流程图，以显示不同类型的转换和部署工作流程，并讨论它们的优缺点。

- [使用 ONNX 的示例部署 ](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#ex-deploy-onnx) \- 本章介绍转换和部署模型的基本步骤。它介绍了本指南其余部分中使用的概念，并引导您完成优化推理执行必须做出的决策。

- [ONNX 转换和部署 ](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#onnx-export) \- 我们提供了从 PyTorch 导出的 ONNX 的广泛概述，以及指向 Jupyter 笔记本的指针，这些指针提供了更多详细信息。

- [使用 TensorRT 运行时 API](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#runtime) \- 本节提供有关使用 TensorRT C\+\+ 和 Python API 对图像进行语义分割的教程。

- 有关允许您快速部署模型的更高级别的应用程序，请参阅 [NVIDIA Triton 推理服务器快速入门 ](https://github.com/triton-inference-server/server/blob/r20.12/docs/quickstart.md)。

## 安装 TensorRT

略

## TensorRT 生态系统

- TensorRT 是一个大型且灵活的项目。它可以处理各种转换和部署工作流程，哪种工作流程最适合您取决于您的具体用例和问题设置。

- TensorRT 提供了多种部署选项，但**所有工作流程都涉及将模型转换为优化的表示形式**，TensorRT 将其称为*引擎 *。为您的模型构建 TensorRT 工作流程涉及**选择正确的部署选项和正确的参数组合来创建引擎**。

## 基本 TensorRT 工作流程

必须遵循五个基本步骤来转换和部署模型：

1. Export the model  导出模型

2. Select a precision  选择精度

3. Convert the model  转换模型

4. Deploy the model  部署模型

在完整的端到端工作流程中理解这些步骤是最容易的：在[使用 ONNX 的示例部署](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html#ex-deploy-onnx)中，我们将介绍一个简单的与框架无关的部署工作流程，使用 ONNX 转换和 TensorRT 的独立运行时将经过训练的 ResNet\-50 模型转换和部署到 TensorRT

## 转换和部署选项

- TensorRT 生态系统分为两部分：

    1. 您可以按照各种路径将其模型转换为优化的 TensorRT 引擎。

    2. 用户在部署优化的 TensorRT 引擎时可以使用 TensorRT 定位的各种运行时。

![图片\.png](assets/图片%202.png)

## 转换

- 使用 TensorRT 转换模型有四个主要选项：

1. 使用 Torch\-TensorRT

2. 从 `.onnx `文件自动转换 ONNX

3. 使用基于 GUI 的工具 [Nsight 深度学习设计器](https://developer.nvidia.com/nsight-dl-designer)

4. 使用 TensorRT API（在 C\+\+ 或 Python 中）手动构建网络

- PyTorch 集成 （Torch\-TensorRT） 提供模型转换和用于转换 PyTorch 模型的高级运行时 API。它可以回退到 TensorRT 不支持特定运算符的 PyTorch 实现。有关支持的运算符的详细信息，请参阅 [ONNX 运算符支持 ](https://github.com/onnx/onnx-tensorrt/blob/main/docs/operators.md)。

- 自动模型转换和部署的一种性能更高的选项是使用 ONNX 进行转换。ONNX 是一个与框架无关的选项，可与 TensorFlow、PyTorch 等中的模型配合使用。TensorRT 支持使用 TensorRT API 或 `trtexec`  从 ONNX 文件自动转换，我们将在本节中使用它们。ONNX 转换是全有或全无，这意味着模型中的所有作都必须由 TensorRT  支持（或者您必须为不受支持的作提供自定义插件）。ONNX 转换产生了一个单一的 TensorRT 引擎，该引擎允许比  Torch\-TensorRT 更少的开销

- 除了 `trtexec，Nsight` [Deep Learning Designer](https://developer.nvidia.com/nsight-dl-designer)  还可以将 ONNX 文件转换为 TensorRT 引擎。基于 GUI 的工具提供模型可视化和编辑、推理性能分析，以及轻松转换为 ONNX  模型的 TensorRT 引擎。Nsight Deep Learning Designer 可按需自动下载 TensorRT 位（包括  CUDA），无需单独安装 TensorRT。

- 您可以使用  TensorRT 网络定义 API 手动构建 TensorRT 引擎，以获得最佳性能和可定制性。这涉及在 TensorRT  作中逐个作构建与目标模型相同的网络，仅使用 TensorRT 作。创建 TensorRT 网络后，您只需从框架中导出模型的权重，并将其加载到  TensorRT 网络中。对于这种方法，有关使用 TensorRT 的网络定义 API 构建模型的更多信息，请参阅此处：

    - [使用 C\+\+ API 从头开始创建网络定义](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/c-api-docs.html#network-definition-scratch-c-api)

    - [使用 Python API 从头开始创建网络定义](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/python-api-docs.html#network-definition-scratch-python-api)

## 部署

- 使用 TensorRT 部署模型有三个选项：

    1. 在 PyTorch 中部署

    2. 使用独立的 TensorRT 运行时 API

    3. 使用 NVIDIA Triton 推理服务器

- 选择部署将决定转换模型所需的步骤。

- 使用  Torch\-TensorRT 时，最常见的部署选项是简单地在 PyTorch 中部署。Torch\-TensorRT 转换会生成一个  PyTorch 图，其中插入了 TensorRT operations。您可以使用 Python 运行 Torch\-TensorRT 模型，就像运行任何其他  PyTorch 模型一样。

- TensorRT 运行时 API 可实现最低的开销和最细粒度的控制。但是，TensorRT 本身不支持的运算符必须作为插件实现（GitHub 上提供了预先编写的插件库 [：TensorRT 插件 ](https://github.com/NVIDIA/TensorRT/tree/main/plugin)）。使用运行时 API 进行部署的最常见路径是使用从框架导出 ONNX，我们将在下一节中介绍。

- 最后，NVIDIA  Triton 推理服务器是开源推理服务软件，使团队能够从任何框架（TensorFlow、TensorRT、PyTorch、ONNX  Runtime 或自定义框架）、本地存储或 Google Cloud Platform 或 AWS S3 在任何基于 GPU 或 CPU  的基础设施（云、数据中心或边缘）上部署经过训练的 AI  模型。它是一个灵活的项目，具有几个独特的功能，例如异构模型的并发模型执行和同一模型的多个副本（多个模型副本可以进一步减少延迟）、负载平衡和模型分析。如果必须通过  HTTP 提供模型，例如在云推理解决方案中，这是一个不错的选择。您可以找到 [NVIDIA Triton 推理服务器主页](https://developer.nvidia.com/nvidia-triton-inference-server)和[文档 ](https://github.com/triton-inference-server/server/blob/r22.01/README.md#documentation)。

## 选择正确的工作流程

- 选择如何转换和部署模型时，两个最重要的因素是：

    1. 您选择的框架

    2. 您首选的 TensorRT 运行时作为目标

- 有关可用运行时选项的更多信息，请参阅本指南中包含的 Jupyter 笔记本，了解如何了解 [TensorRT 运行时 ](https://github.com/NVIDIA/TensorRT/tree/main/quickstart/IntroNotebooks/5.%20Understanding%20TensorRT%20Runtimes.ipynb)。
