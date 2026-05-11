# My Lego Site

一个乐高主题的个人网站，使用 React + TypeScript + Vite + Tailwind CSS 构建。

## 特性

- 🧱 乐高风格的 UI 设计
- 🌙 暗黑模式切换
- 📱 响应式设计
- ⚡ 使用 Vite 快速构建
- 🎨 使用 Tailwind CSS 样式
- 🎭 使用 Framer Motion 动画
- 📦 使用 Lucide React 图标

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- React Router
- Lucide React

## 项目结构

`
src/
├── components/          # 可复用组件
│   ├── LegoCard.tsx    # 乐高卡片组件
│   ├── Navbar.tsx      # 导航栏组件
│   ├── Footer.tsx      # 页脚组件
│   └── Loading.tsx     # 加载动画组件
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── About.tsx       # 关于页面
│   ├── Portfolio.tsx   # 作品集页面
│   └── Contact.tsx     # 联系页面
├── assets/             # 静态资源
├── App.tsx             # 主应用组件
├── main.tsx            # 入口文件
└── index.css           # 全局样式
`

## 开发

### 安装依赖

`ash
npm install
`

### 启动开发服务器

`ash
npm run dev
`

### 构建生产版本

`ash
npm run build
`

### 代码检查

`ash
npm run lint
`

## 自定义

### 修改颜色主题

编辑 src/index.css 中的颜色变量：

`css
@theme {
  --color-lego-green: #059669;
  --color-lego-yellow: #F2CD37;
  --color-lego-red: #D12229;
  --color-lego-blue: #0055BF;
}
`

### 添加新页面

1. 在 src/pages/ 目录创建新组件
2. 在 src/App.tsx 中添加路由
3. 在 src/components/Navbar.tsx 中添加导航链接

## 部署

构建生产版本后，将 dist 目录部署到任何静态文件服务器。

## 许可证

MIT
