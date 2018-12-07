# Bonbons-DI
@bonbons/di

[![Build Status](https://travis-ci.org/ws-Bonbons/options.svg?branch=master)](https://travis-ci.org/ws-Bonbons/options)
[![package version](https://badge.fury.io/js/%40bonbons%2Fdi.svg)](https://badge.fury.io/js/%40bonbons%2Fdi.svg)

> 依赖注入node.js实现

## 安装

```
npm install @bonbons/di --save
```

```
yarn add @bonbons/di
```

## 接入指南

```typescript
import { DIContainer, InjectScope } from "@bonbons/di";
import { Interface, Implement } from "your/code";

// 创建di容器
const di = new DIContainer();

// 注入一个全局单例
di.register(Interface, Implement, InjectScope.Singleton);

// 注入一个范围单例
di.register(Interface, Implement, InjectScope.Scoped);

// 注入一个总是新建的实例
di.register(Interface, Implement, InjectScope.New);

// 工厂方法来进行设置
di.register(Interface, (scopeId?, {...}) => new Implement(...), InjectScope.Singleton);

// 直接食用创建好的实例来解析
di.register(Interface, new Implement(...));

// 完成解析构建
di.complete();

// 获取实例
const imp = di.get(Interface);

// 创建一个scope
di.createScope("scope_id", {...});

// 在某一个范围内获得实例
const scope_imp = di.get(Interface, "scope_id");

// 释放当前范围
di.dispose("scope_id");
```
