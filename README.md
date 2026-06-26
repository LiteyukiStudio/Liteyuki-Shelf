# Liteyuki Shelf

Liteyuki Shelf 是一个电子书管理平台的基础 MVP，覆盖三类角色：普通读者、小说作者、管理员。

当前技术栈：

- Web 前端：React + Vite + TypeScript
- Web API：Rust + Actix Web
- Desktop/Android 壳：Tauri 2
- 默认服务端口：`8899`
- 电子书支持：EPUB 元数据读取与展示

## Monorepo 结构

```text
apps/
  api/              Actix Web 后端
  web/              React Web 前端
  desktop/src-tauri Tauri 壳
packages/
  shared/           前端共享类型与 i18n 资源
```

## 本地开发

### 1. 安装依赖

```powershell
pnpm install
cargo check --workspace
```

### 2. 启动 Web 前端

```powershell
pnpm dev:web
```

### 3. 启动 API

```powershell
pnpm dev:api
```

### 4. 启动 Tauri 桌面壳

仅启动桌面壳：

```powershell
pnpm dev:tauri
```

这个命令会自动拉起前端开发服务器，再通过 `cargo run --manifest-path apps/desktop/src-tauri/Cargo.toml` 启动桌面壳。

自动先拉起 API 再进入 Tauri 开发模式：

```powershell
pnpm dev
```

或：

```powershell
pnpm dev:desktop
```

API 默认监听 `http://0.0.0.0:8899`，本机访问可用 `http://127.0.0.1:8899`。

后端数据默认保存在 `apps/api/data/index.json`，上传的电子书文件保存在 `apps/api/data/epubs/`，便于本地开发时保留作者草稿、审核结果和 EPUB 原文件。

## API 概览

- `GET /api/health` 健康检查
- `GET /api/books` 获取书籍列表
- `POST /api/books` 创建作者草稿
- `GET /api/books/{id}` 获取书籍详情
- `PUT /api/books/{id}` 更新作者草稿
- `PATCH /api/books/{id}/review` 管理员变更审核状态
- `GET /api/dashboard` 获取按角色聚合的概览数据
- `POST /api/uploads/epub` 上传 EPUB 并读取元数据

## Docker

```powershell
docker compose up --build
```

仓库默认把 Docker 基础镜像指向 `docker.m.daocloud.io`。如果你想改用其他镜像源，可以复制 `.env.example` 为 `.env` 后覆盖：

```powershell
Get-Content .env.example
```

本地已验证容器镜像可成功构建，并且容器内的 Actix 服务能在 `8899` 端口返回健康检查和前端入口页。

构建后：

- 前端静态资源由 Actix 一并托管
- 对外暴露端口 `8899`

## 当前 MVP 能力

- 角色切换：读者 / 作者 / 管理员
- 图书列表、详情、状态与标签展示
- 作者工作台基础指标、草稿创建与内容更新
- 管理员内容概览与审核状态流转
- EPUB 文件上传与基础元数据解析
- 本地 `index.json + epubs/` 持久化存储
- 中英文 i18n 资源预置

## Tauri 说明

仓库内已经提供 `apps/desktop/src-tauri` 基础壳配置，便于后续接入桌面端与 Android 打包流程。当前默认加载 Web 资源，后续可以在此基础上补充移动端适配与原生能力。
