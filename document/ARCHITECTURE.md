# 项目架构文档

## 技术栈

- **框架**: Astro 5.6.1
- **语言**: TypeScript
- **样式**: 纯CSS (CSS Variables)
- **构建工具**: Vite (Astro内置)
- **部署**: GitHub Pages

## 目录结构

```
MyWebsite/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署配置
├── public/
│   └── favicon.svg             # 网站图标
├── src/
│   ├── components/             # 组件目录
│   │   ├── Header.astro        # 导航栏组件
│   │   ├── Footer.astro        # 页脚组件
│   │   ├── Layout.astro        # 基础布局组件
│   │   ├── Particles.astro     # 粒子动画组件
│   │   └── BackToTop.astro     # 返回顶部组件
│   ├── styles/                 # 样式目录
│   │   └── global.css          # 全局样式和CSS变量
│   ├── scripts/                # 脚本目录（预留）
│   ├── pages/                  # 页面目录
│   │   ├── index.astro         # 首页
│   │   ├── projects.astro      # 项目展示页
│   │   └── 404.astro           # 404错误页
│   └── env.d.ts                # Astro类型定义
├── document/                   # 文档目录
│   ├── ARCHITECTURE.md         # 架构文档（本文件）
│   ├── COMPONENTS.md           # 组件使用文档
│   └── MAINTENANCE.md          # 维护指南
├── astro.config.mjs            # Astro配置文件
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript配置
└── README.md                   # 项目说明
```

## 组件体系

### 组件关系图

```
Layout.astro (基础布局)
├── Header.astro (导航栏)
├── Footer.astro (页脚)
├── Particles.astro (粒子动画，可选)
└── BackToTop.astro (返回顶部，可选)
```

### 组件职责

| 组件 | 职责 | 依赖 |
|------|------|------|
| Layout | 统一HTML结构、注入全局样式、管理页面meta | Particles, BackToTop, global.css |
| Header | 导航栏展示、当前页面高亮 | 无 |
| Footer | 版权信息、社交链接展示 | 无 |
| Particles | Canvas粒子动画效果 | 无 |
| BackToTop | 返回顶部按钮、滚动监听 | 无 |

## 样式架构

### CSS变量体系

所有颜色和样式通过CSS变量管理，便于主题定制：

```css
:root {
  --color-primary: #e44e00;           /* 主题色 */
  --color-primary-rgb: 228, 78, 0;    /* 主题色RGB值 */
  --color-background: #0a0a0a;        /* 背景色 */
  --color-text: #e0e0e0;              /* 主文本色 */
  --color-text-muted: #888;           /* 次要文本色 */
  --color-text-subtle: #555;          /* 弱化文本色 */
  --font-family: system-ui, -apple-system, sans-serif;
  --transition-duration: 0.2s;
  --shadow-glow: ...;                 /* 发光阴影 */
  --shadow-glow-subtle: ...;          /* 弱化发光阴影 */
}
```

### 样式作用域

- **全局样式** (`global.css`): CSS变量、重置样式、基础样式、工具类
- **组件样式**: 每个组件内的`<style>`标签，作用域隔离
- **页面样式**: 页面特定样式，优先级最高

## 构建流程

### 开发环境

```bash
npm run dev      # 启动开发服务器 (localhost:4321)
npm run start    # 同上
```

### 生产构建

```bash
npm run build    # 构建生产版本到 dist/
npm run preview  # 预览构建结果
```

### 自动部署

通过GitHub Actions自动部署到GitHub Pages：

1. 触发条件：push到main分支
2. 构建环境：Node.js 20
3. 构建步骤：
   - 安装依赖 (`npm ci`)
   - 构建项目 (`npm run build`)
   - 上传构建产物
4. 部署：自动部署到GitHub Pages

## 路由系统

Astro基于文件系统的路由：

- `/` → `src/pages/index.astro`
- `/projects` → `src/pages/projects.astro`
- `/404` → `src/pages/404.astro` (自动处理404)

## 类型系统

### TypeScript配置

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]  // 路径别名
    }
  }
}
```

### 组件Props接口

每个组件都定义了TypeScript接口，提供类型安全：

```typescript
interface Props {
  // 组件属性定义
}
```

## 性能优化

### 已实施的优化

1. **组件化**: 减少代码重复，提高复用性
2. **CSS变量**: 减少样式重复，便于主题切换
3. **作用域样式**: 避免样式冲突
4. **按需加载**: 粒子动画和返回顶部组件可选加载
5. **Canvas动画**: 使用requestAnimationFrame优化性能

### 建议的优化

1. 图片优化：使用WebP格式，添加懒加载
2. 代码分割：大型组件按需加载
3. 缓存策略：配置适当的缓存头
4. 预加载：关键资源预加载

## 扩展性设计

### 添加新页面

1. 在 `src/pages/` 创建新的 `.astro` 文件
2. 导入Layout、Header、Footer组件
3. 配置页面特定的props
4. 添加页面内容

### 添加新组件

1. 在 `src/components/` 创建新的 `.astro` 文件
2. 定义Props接口
3. 实现组件逻辑和样式
4. 在需要的页面中导入使用

### 主题定制

修改 `src/styles/global.css` 中的CSS变量即可全局更改主题色。

## 安全性

- 无敏感信息暴露
- 外部链接使用 `rel="noopener noreferrer"`
- 使用TypeScript提供类型安全
- 遵循Astro安全最佳实践

## 浏览器兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 支持CSS变量
- 支持ES6+特性
- 移动端响应式支持

## 维护建议

1. 定期更新依赖版本
2. 保持组件职责单一
3. 遵循现有代码风格
4. 编写必要的注释
5. 更新相关文档

## 相关文档

- [组件使用文档](./COMPONENTS.md)
- [维护指南](./MAINTENANCE.md)
