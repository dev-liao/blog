---
title: "Nvidia Jetson AGX Orin——启动流程"
description: "总结分享Nvidia官网开发文档"
slug: "nvidia-orin-bootflow"
date: "2025年12月4日"
category: "技术"
tags: ["Nvidia", "启动", "Linux", "Orin"]
author: "Dev-Liao"
featured: true
published: true
---

本系列主要分享Nvidia官网开发文档



# Jetson AGX Orin Boot Flow

启动流程是指引导加载程序为初始化SoC并启动NVIDIA® Jetson™ Linux所执行的一系列操作。引导加载程序执行的关键操作包括：

- 初始化存储设备、内存控制器（MC）、外部存储控制器（EMC）及CPU
- 设置安全参数
- 加载并验证固件组件
- 维护信任链
- 为各类固件组件创建存储隔离区
- 烧写存储设备
- 启动至操作系统

此外，Jetson启动软件还可能根据产品需求执行其他操作，包括但不限于：

- 初始化HDMI®或DisplayPort接口
- 显示启动徽标

下图展示了启动软件中的控制流。

![image-20251204132640162](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204132640282.png)

## BootROM

BootROM（引导只读存储器）硬编码于SoC中，当BPMP脱离复位状态后即开始运行。它初始化启动介质并从存储设备加载BR-BCT、PSCBL1、Microboot1（MB1）及MB1-BCT，随后停止工作。

启动介质起始位置最多可存储四份BootROM引导配置表（BR-BCT）副本。每份BR-BCT副本均按"设备擦除扇区大小"边界对齐，副本之间保留必要空白区域。BR-BCT包含BootROM用于硬件初始化的配置参数。

该配置表同时包含引导加载程序（MB1、MB1-BCT和PSCBL）的相关信息，包括：

- 大小
- 入口地址
- 加载地址
- 哈希值

BootROM利用这些信息验证并加载引导加载程序及MB1-BCT组件。下图展示了启动流程。

![image-20251204133241286](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204133241399.png)

## PSCROM

平台安全控制器（PSC）ROM是SoC中的硬件组件，在处理器复位后立即开始运行。

PSCROM存储NVIDIA及OEM认证与解密所需的所有密钥。它为BootROM提供认证和解密服务，并对BPMP（即MB1）和PSC（即PSC-BL1）的下一阶段启动进行审计。

![image-20251204133525179](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204133525260.png)

# MB1

MB1（Microboot1）在BPMP上运行，是由BootROM加载到AOTZRAM中的首个启动软件组件。它负责初始化SoC的特定部分（包括CPU）并执行安全配置。

MB1采用NVIDIA专属密钥进行签名和加密。下图展示其控制流。

![image-20251204133716599](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204133716713.png)

MB1负责以下功能：

- 平台配置（包括引脚复用、GPIO、焊盘电压、安全控制寄存器及防火墙设置）
- 基于内存BCT初始化SDRAM
- 加载固件（含初始化CPU复合体CCplex的组件）
- 配置PMIC以启用VDD_CPU电源轨
- 创建内存隔离区
- 加载下一阶段引导程序MB2

MB1由NVIDIA所有，在Jetson BSP包中以二进制形式提供。您可通过其引导配置表（MB1-BCT）针对特定平台配置其行为。

# MB2

MB2是继MB1之后执行的引导加载程序组件，包含两种变体：

## **MB2小程序**

- 运行于BPMP（R5）处理器
- 负责检测当前使用的Jetson设备类型并获取相关信息
- Tegraflash（在主机上运行）利用这些信息为设备重刷选择正确的配置文件

小程序获取的关键信息包括：

- 芯片信息（基于熔丝读取）：BR版本、SKU、样品类型及RAM代码
- 存储于EEPROM中的板级相关信息
- Auto平台BCT的客户定制段信息

## **MB2主程序**

- 运行于CCPLEX处理器
- 负责刷写操作：冷启动刷写：MB2-CCPLEX从主机接收二进制文件并逐一刻录至设备RCM引导模式：从主机接收二进制文件并直接加载至SDRAM供启动流程组件执行

下图展示了MB2-CCPLEX的组成结构。

# ![image-20251204134135399](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204134135515.png)

# UEFI

统一可扩展固件接口（UEFI）是一项行业规范，定义了平台固件与操作系统之间的标准接口。在Jetson启动流程中，UEFI已取代CBoot作为Jetson Linux设备的CPUBL。

UEFI的特性包括：

- 结合其他规范（SMBIOS、ACPI），可加载通用操作系统，无需对操作系统进行平台定制
- 定义了标准化的安全启动机制，用于验证第三方软件（如操作系统和PCIe选项ROM）的真实性
- 通过选项ROM支持扩展卡驱动程序，并将其集成到系统配置用户界面中
- 定义了固件更新的标准方法

下图阐述了UEFI启动流程的主要环节。

![image-20251204134355084](https://gitee.com/liao-xingyu/image_repo/raw/master/image/20251204134355243.png)

UEFI sources and compilation details for this release are available at: https://github.com/NVIDIA/edk2-nvidia/wiki
