# My Lego Site - Agent 指南

## 项目信息

- **名称**: my-lego-site
- **版本**: 0.0.0
- **描述**: 乐高主题个人网站

## 技术栈

### 核心
- **React 19** - UI 框架
- **TypeScript ~6.0** - 类型系统
- **Vite 8** - 构建工具
- **Tailwind CSS 4** - 样式框架

### 依赖
- **Framer Motion** - 动画库
- **React Router v7** - 路由
- **Lucide React** - 图标库
- **Express 5** - 后端服务器
- **Multer** - 文件上传

### 开发工具
- ESLint + typescript-eslint
- PostCSS + Autoprefixer

## 架构说明

### 目录结构

```
my-lego-site/
├── src/
│   ├── components/     # 可复用组件
│   │   ├── LegoCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Loading.tsx
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   └── Contact.tsx
│   ├── assets/         # 静态资源
│   ├── App.tsx         # 主应用
│   ├── main.tsx        # 入口
│   └── index.css       # 全局样式
├── server/             # 后端服务
├── public/             # 公共资源
└── dist/               # 构建产物
```

### 特色功能
- 乐高风格 UI 设计
- 暗黑模式切换
- 响应式设计
- Framer Motion 动画效果

### 颜色主题

定义在 `src/index.css` 中：
```css
--color-lego-green: #059669;
--color-lego-yellow: #F2CD37;
--color-lego-red: #D12229;
--color-lego-blue: #0055BF;
```

## 常用命令

```bash
npm run dev        # 启动 Vite 开发服务器
npm run server     # 启动后端服务器 (node server/index.cjs)
npm run start      # 同时启动前后端
npm run build      # 生产构建 (tsc + vite build)
npm run lint       # ESLint 检查
npm run preview    # 预览生产构建
```

## 开发约定

- 使用 TypeScript，严格模式
- 组件使用 `.tsx` 后缀
- Tailwind CSS 工具类优先
- 添加新页面时同步更新 Navbar 和路由
