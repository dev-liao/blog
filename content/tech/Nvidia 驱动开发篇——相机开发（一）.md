---
title: "Nvidia 驱动开发篇——相机开发(一)"
description: "总结分享Nvidia官网相机开发文档"
slug: "nvidia-camera-driver"
date: "2025年11月30日"
category: "技术"
tags: ["Nvidia", "相机驱动", "Linux"]
author: "Dev-Liao"
featured: true
published: true
---

本系列主要分享Nvidia官网相机开发文档

# 相机架构栈

![屏幕截图 2025-11-30 200541](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251130200614465.png)

摄像头架构包含以下NVIDIA组件：

- libargus：提供基于摄像头核心堆栈的底层API。
- nvarguscamerasrc：NVIDIA摄像头GStreamer插件，提供通过ARGUS API控制ISP属性的选项。
- v4l2src：标准Linux V4L2应用程序，通过直接内核IOCTL调用访问V4L2功能。

NVIDIA提供OV5693拜耳传感器作为示例。NVIDIA已针对NVIDIA® Jetson™平台对该传感器进行调优。基于媒体控制器框架的驱动代码位于：

```
./kernel/nvidia/drivers/media/i2c/ov5693.c
```

NVIDIA为Jetson板级支持包（BSP）软件版本提供额外的传感器支持。开发者若需使用任何拜耳传感器及调优支持，必须与NVIDIA认证的摄像头合作伙伴协作。相关工作包括：

- 传感器驱动开发
- 用于传感器表征的定制工具
- 图像质量调优
- 这些工具和操作机制不属于公开的Jetson嵌入式平台（JEP）板级支持包发布内容。

# 摄像头相关API

下表描述了每种摄像头配置可用的摄像头 API。

| 摄像头 API                       | 使用 Jetson ISP（CSI 接口） | 不使用 Jetson ISP†（CSI 接口） | USB (UVC)‡（USB 接口） |
| :------------------------------- | :-------------------------- | :----------------------------- | :--------------------- |
| libargus                         | ✓                           |                                |                        |
| GStreamer (GST-nvarguscamerasrc) | ✓                           |                                |                        |
| V4L2                             |                             | ✓                              | ✓                      |

† **libargus 是访问摄像头的首选途径。**

‡ **驱动程序不由 NVIDIA 提供；您必须自行编写。** 您可以支持的外设总线设备包括：

- 以太网
- 非 UVC USB

> **注意**
>
> 默认的 OV5693 摄像头不包含集成的 ISP。对参考摄像头使用 V4L2 API 将记录“原始”拜耳数据。



# 验证和测试 V4L2 驱动程序的方法

驱动程序开发完成后，请使用提供的工具或应用程序来验证和测试 V4L2 驱动程序接口。

有关通用的 GStreamer 和多媒体操作，请参阅《Multimedia 用户指南》，该指南可从 [Jetson 下载中心](https://developer.nvidia.com/embedded/downloads)获取。

# 使用 libargus 底层 API 的应用程序

NVIDIA Multimedia API 提供了示例程序，演示了如何使用 libargus API 来预览、捕获和记录传感器数据流。

该 Multimedia API 可通过 NVIDIA® SDK Manager 安装，或作为独立软件包安装。

Multimedia API 文档位于 *Jetson Linux API Reference*中，该文档包含在 Jetson Linux 文档包内，并可从 Jetson 文档站点的 ["Jetson Software Documentation"](https://developer.nvidia.com/embedded/downloads) 页面单独下载。

# 使用 GStreamer 与 nvarguscamerasrc 插件的应用程序

利用受支持的 nvarguscamerasrc GStreamer 插件及 ARGUS API 的摄像头功能，可以：

- 为拜耳传感器启用 ISP 处理
- 执行拜耳捕获中 ISP 的格式转换部分

例如，对于格式为 1080p/30/BGGR 的拜耳传感器：

- **将预览保存到文件：**

```
$ gst-launch-1.0 nvarguscamerasrc num-buffers=200 ! 'video/x-raw(memory:NVMM), width=1920, height=1080, framerate=30/1, format=NV12' ! omxh264enc ! qtmux ! filesink location=test.mp4 -e
```

- **将预览渲染到 HDMI® 屏幕：**

```
$ gst-launch-1.0 nvarguscamerasrc ! 'video/x-raw(memory:NVMM), width=1920, height=1080, format=(string)NV12, framerate=(fraction)30/1' ! nvoverlaysink -e
```

有关 ARGUS API 的更多信息，请参阅[Jetson Linux API ](https://docs.nvidia.com/jetson/l4t-multimedia/)中 [Libargus Camera API](https://docs.nvidia.com/jetson/l4t-multimedia/group__LibargusAPI.html) 页面。

# 使用 GStreamer 与 V4L2 源插件的应用程序

使用拜耳传感器、YUV 传感器或 USB 摄像头输出未经 ISP 处理的 YUV 图像时，不会调用 NVIDIA 摄像头软件堆栈。

例如，对于格式为 480p/30/YUY2 的 USB 摄像头：

- **将预览保存到文件（基于软件转换器）：**

```
$ gst-launch-1.0 v4l2src num-buffers=200 device=/dev/video0 ! 'video/x-raw, format=YUY2, width=640, height=480, framerate=30/1' ! videoconvert ! omxh264enc ! qtmux ! filesink location=test.mp4 -ev
```

- 如果您从远程控制台操作，请先输入 `export DISPLAY=:0`。然后将预览渲染到屏幕：

```
$ gst-launch-1.0 v4l2src device=/dev/video0 ! 'video/x-raw, format=YUY2, width=640, height=480, framerate=30/1' ! xvimagesink -ev
```

对于格式为 480p/30/UYVY 的 YUV 传感器：

- **将预览保存到文件（基于硬件加速转换器）：**

```
$ gst-launch-1.0 -v v4l2src device=/dev/video0 ! 'video/x-raw, format=(string)UYVY, width=(int)640, height=(int)480, framerate=(fraction)30/1' ! nvvidconv ! 'video/x-raw(memory:NVMM), format=(string)NV12' ! omxh264enc ! qtmux ! filesink location=test.mp4 -ev
```

- **将预览渲染到屏幕：**

```
$ export DISPLAY=:0 // 如果您从远程控制台操作
$ gst-launch-1.0 v4l2src device=/dev/video0 ! 'video/x-raw, format=(string)UYVY, width=(int)640, height=(int)480, framerate=(fraction)30/1' ! xvimagesink -ev
```

# 直接使用 V4L2 IOCTL 的应用程序

在传感器启动阶段，可使用 V4L2 IOCTL 来验证基本功能。

例如，从格式为 1080p/30/RG10 的拜耳传感器捕获数据：

```
$ v4l2-ctl --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap --stream-count=1 -d /dev/video0 --stream-to=ov5693.raw
```

# ISP 配置

Camera Core 发布包包含针对参考传感器的模型 ISP 配置文件。

> **注意**
>
> 具有集成 ISP 的 CSI 摄像头和 USB 摄像头可在 ISP 旁路模式下工作。Jetson 开发者套件（OV5693）的 RAW 摄像头模块提供了可用的 ISP 支持。
>
> 对其他摄像头模块的额外 ISP 支持需通过第三方合作伙伴实现。

# 无限超时支持

此使用场景不同于典型的摄像头使用场景。典型使用场景中，摄像头传感器连续流式传输帧，摄像头硬件和驱动程序在等待摄像头帧时支持有限超时。

而在此使用场景中，摄像头传感器被触发生成指定数量的帧后，会无限期停止流传输（即"无限超时"）。每当摄像头驱动程序恢复流传输时，它必须能够无超时问题地恢复捕获帧。摄像头驱动程序和硬件必须始终准备好捕获来自 CSI 传感器的帧。摄像头驱动程序不知道流传输何时会重新开始。

为支持此使用场景，摄像头传感器硬件模块必须支持暂停和恢复流传输。

要启用此功能，需通过将 `enableCamInfiniteTimeout`环境变量设置为 1 来运行摄像头服务（即 `nvargus-daemon`服务）：

```
$ sudo service nvargus-daemon stop
$ sudo enableCamInfiniteTimeout=1 nvargus-daemon
```

# Mesa 安装导致的符号链接变更

安装 Mesa EGL 可能会创建 `/usr/lib/<ABI_directory>/libEGL.so`符号链接，从而覆盖驱动程序必须使用的实现库 `/usr/lib/<ABI_directory>/tegra-egl/libEGL.so`的符号链接。这会干扰任何 EGL™ 的客户端，包括发布中使用 EGLStreams 的库。

在本版本中，系统重启时会替换该符号链接，从而在重启后修复此问题。之前的版本已对 `libGL`和 `libglx`等其他库应用了类似的解决方法。

# 其他参考

有关使用 V4L2 或 GStreamer 与其他 Jetson 多媒体组件集成的详细信息，请参阅 *Jetson Linux API Reference*。

有关 Argus 的详细信息，请参阅[Jetson Linux API ](https://docs.nvidia.com/jetson/l4t-multimedia/)中 [Libargus Camera API](https://docs.nvidia.com/jetson/l4t-multimedia/group__LibargusAPI.html) 页面。

# Q&A

Q：什么是Mesa？为什么它安装会导致问题？

A：**Mesa** 是一个开源、跨平台的图形库实现。它提供了对多种图形 API 的支持，最著名的是 **OpenGL** 和 **Vulkan**。

**Mesa EGL** 是 Mesa 项目的一部分，它实现了 **EGL** API。EGL 是 Khronos Group 定义的一个标准，它充当了**OpenGL（或 OpenGL ES）等渲染API** 与**底层原生平台窗口系统**之间的接口。简单来说，OpenGL 负责画图，而 EGL 负责在屏幕上创建一个可以作画的“画布”，并管理这个画布。

------

### 在 Jetson 平台上的核心冲突

冲突在于：

1. **NVIDIA 的专有实现：**Jetson 平台使用 NVIDIA 的专有图形驱动（ Tegra 驱动）。这个驱动自带了一整套图形库，包括它自己的 `libEGL.so`、`libGL.so`等。这些库为了充分发挥 NVIDIA GPU（在 Jetson 上是 Tegra GPU）的硬件加速能力而进行了高度优化。在 Jetson 上，**计算机视觉、摄像头处理、多媒体（如您提到的 `nvoverlaysink`）等核心功能都严重依赖 NVIDIA 的 EGL 实现来高效处理数据**（尤其是通过 EGLStreams 机制）。
2. **Mesa 的开源实现：**Mesa 是一个通用的开源实现，它不针对任何特定硬件的私有特性进行优化。当您在系统上安装 Mesa（例如，通过 `apt install mesa-utils`或某些依赖它的软件包时），它可能会将其库文件安装到系统库目录（如 `/usr/lib/aarch64-linux-gnu/`）。安装过程中，Mesa 通常会创建一个名为 `libEGL.so.1`的文件，并创建一个指向它的符号链接 `libEGL.so`。这个符号链接会**覆盖**掉系统原本指向 NVIDIA 实现的符号链接。

### 冲突的后果

当应用程序（例如使用摄像头的 GStreamer 管道）试图运行时：

- 它本应加载 `/usr/lib/aarch64-linux-gnu/tegra-egl/libEGL.so`（NVIDIA 的优化版本）。
- 但由于符号链接被更改，它实际上加载了 `/usr/lib/aarch64-linux-gnu/libEGL.so.1`（Mesa 的通用版本）。
- Mesa 的版本**不包含** NVIDIA 的私有扩展（如 EGLStreams），导致依赖于这些功能的应用程序**崩溃或无法正常工作**。您文档中提到的“包括使用 EGLStreams 的库”正是指 Jetson 的多媒体组件。

### 解决方案（如文档所述）

NVIDIA 在较新的 Jetson Linux 版本中加入了自动修复机制：

- **重启修复：** 系统重启时，一个启动脚本会检测到符号链接被更改，并将其重新指向正确的 NVIDIA 库。

- **手动修复：** 如果不想重启，可以手动重新创建符号链接。例如：

  ```
  # 首先检查当前链接指向哪里
  ls -l /usr/lib/aarch64-linux-gnu/libEGL.so
  
  # 如果它指向的是 Mesa 的库而不是 tegra-egl 下的库，则需要修复
  sudo ln -sf tegra-egl/libEGL.so.1 /usr/lib/aarch64-linux-gnu/libEGL.so
  ```

  
