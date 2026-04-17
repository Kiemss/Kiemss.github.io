# 维护指南

本文档提供项目的日常维护操作指南，包括添加新页面、修改配置、优化性能等常见任务。

## 目录

- [添加新页面](#添加新页面)
- [修改导航栏](#修改导航栏)
- [修改主题色](#修改主题色)
- [添加新组件](#添加新组件)
- [性能优化](#性能优化)
- [常见问题](#常见问题)
- [更新依赖](#更新依赖)

---

## 添加新页面

### 步骤1：创建页面文件

在 `src/pages/` 目录下创建新的 `.astro` 文件：

```bash
# 例如：创建关于页面
touch src/pages/about.astro
```

### 步骤2：编写页面内容

使用以下模板：

```astro
---
import Layout from '@/components/Layout.astro';
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
---

<Layout 
  title="关于 - Kiem"
  description="关于Kiem的介绍"
  showParticles={true}
  showBackToTop={true}
>
  <Header currentPage="/about" />
  
  <main>
    <h1>关于我</h1>
    <p>这里是关于页面的内容...</p>
  </main>
  
  <Footer showSocialLinks={true} />
</Layout>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--color-text-muted);
  }
</style>
```

### 步骤3：更新导航栏（可选）

如果需要在导航栏中显示新页面，修改Header组件的使用：

```astro
<Header 
  currentPage="/about"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' }  // 添加新导航项
  ]}
/>
```

### 步骤4：测试页面

```bash
npm run dev
```

访问 `http://localhost:4321/about` 查看新页面。

---

## 修改导航栏

### 添加导航项

**方法1：传递自定义items（推荐）**

在使用Header组件时传递自定义导航项：

```astro
---
const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '博客', href: '/blog' },
  { label: '关于', href: '/about' }
];
---

<Header currentPage="/" items={navItems} />
```

**方法2：修改默认导航项**

编辑 `src/components/Header.astro` 文件：

```typescript
const defaultItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },  // 添加新项
];
```

### 删除导航项

从导航项数组中移除对应的项即可。

### 修改导航项样式

编辑 `src/components/Header.astro` 中的 `<style>` 部分：

```css
nav a {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  /* 添加或修改样式 */
}
```

---

## 修改主题色

### 方法1：修改CSS变量（推荐）

编辑 `src/styles/global.css`：

```css
:root {
  --color-primary: #ff6b6b;           /* 修改主题色 */
  --color-primary-rgb: 255, 107, 107; /* 修改RGB值 */
  /* 其他颜色变量... */
}
```

### 方法2：创建主题切换

1. 定义多个主题：

```css
:root {
  --color-primary: #e44e00;
}

[data-theme="blue"] {
  --color-primary: #3498db;
}

[data-theme="green"] {
  --color-primary: #2ecc71;
}
```

2. 添加主题切换脚本：

```javascript
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 加载保存的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
}
```

### 可修改的颜色变量

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| --color-primary | 主题色 | #e44e00 |
| --color-background | 背景色 | #0a0a0a |
| --color-text | 主文本色 | #e0e0e0 |
| --color-text-muted | 次要文本色 | #888 |
| --color-text-subtle | 弱化文本色 | #555 |

---

## 添加新组件

### 步骤1：创建组件文件

在 `src/components/` 目录下创建新的 `.astro` 文件：

```bash
touch src/components/NewComponent.astro
```

### 步骤2：定义Props接口

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = '默认描述' } = Astro.props;
---

<div class="new-component">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .new-component {
    padding: 2rem;
    background: var(--color-background);
    border: 1px solid var(--color-primary);
  }
  
  h2 {
    color: var(--color-text);
  }
  
  p {
    color: var(--color-text-muted);
  }
</style>
```

### 步骤3：使用组件

在页面中导入并使用：

```astro
---
import NewComponent from '@/components/NewComponent.astro';
---

<NewComponent 
  title="组件标题" 
  description="组件描述" 
/>
```

### 组件开发规范

1. **Props接口**: 必须定义TypeScript接口
2. **默认值**: 可选props应提供默认值
3. **样式隔离**: 使用scoped样式
4. **CSS变量**: 使用全局CSS变量，避免硬编码颜色
5. **文档注释**: 为复杂组件添加注释

---

## 性能优化

### 1. 减少粒子数量

在移动设备上减少粒子数量：

```astro
---
const isMobile = Astro.request.headers.get('user-agent')?.includes('Mobile');
---

<Particles particleCount={isMobile ? 40 : 80} />
```

### 2. 图片优化

使用WebP格式并添加懒加载：

```html
<img 
  src="/images/photo.webp" 
  alt="描述" 
  loading="lazy"
  width="800"
  height="600"
/>
```

### 3. 代码分割

对于大型组件，使用动态导入：

```astro
---
const HeavyComponent = await import('./HeavyComponent.astro');
---
```

### 4. 缓存策略

在 `astro.config.mjs` 中配置缓存：

```javascript
export default defineConfig({
  site: 'https://Kiemss.github.io',
  base: '/',
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash][extname]'
        }
      }
    }
  }
});
```

### 5. 性能监控

使用Lighthouse或WebPageTest定期检查性能。

---

## 常见问题

### Q1: 页面样式不生效

**原因**: 可能是CSS变量未定义或样式优先级问题

**解决方案**:
1. 检查 `global.css` 是否正确导入
2. 检查CSS变量拼写
3. 使用浏览器开发者工具检查样式

### Q2: 粒子动画卡顿

**原因**: 粒子数量过多或设备性能不足

**解决方案**:
1. 减少粒子数量
2. 在移动设备上禁用粒子动画
3. 使用CSS `will-change` 优化

```css
canvas {
  will-change: transform;
}
```

### Q3: 构建失败

**常见原因**:
1. TypeScript类型错误
2. 导入路径错误
3. 组件语法错误

**解决方案**:
1. 检查终端错误信息
2. 确保使用 `@/` 路径别名
3. 检查组件Props类型

### Q4: 部署后样式丢失

**原因**: base路径配置错误

**解决方案**:
检查 `astro.config.mjs` 中的 `base` 配置：

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/',  // 或 '/repository-name/'
});
```

### Q5: 返回顶部按钮不显示

**原因**: 页面高度不足，未达到显示阈值

**解决方案**:
1. 确保页面有足够的高度
2. 降低显示阈值：

```astro
<BackToTop threshold={100} />
```

---

## 更新依赖

### 检查更新

```bash
npm outdated
```

### 更新依赖

```bash
# 更新所有依赖
npm update

# 更新特定依赖
npm install astro@latest
```

### 更新Astro版本

```bash
npm install astro@latest
```

检查 [Astro更新日志](https://docs.astro.build/en/changelog/) 了解破坏性变更。

### 更新后测试

```bash
npm run dev     # 测试开发环境
npm run build   # 测试构建
npm run preview # 测试构建结果
```

---

## 维护检查清单

### 每周检查

- [ ] 运行 `npm outdated` 检查依赖更新
- [ ] 测试所有页面功能正常
- [ ] 检查控制台无错误信息
- [ ] 验证移动端响应式正常

### 每月检查

- [ ] 更新依赖到最新稳定版
- [ ] 运行性能测试（Lighthouse）
- [ ] 检查SEO相关配置
- [ ] 备份重要数据

### 每季度检查

- [ ] 审查代码结构
- [ ] 优化性能瓶颈
- [ ] 更新文档
- [ ] 清理无用代码

---

## 故障排查流程

1. **复现问题**: 明确问题发生的条件和步骤
2. **检查控制台**: 查看浏览器开发者工具的错误信息
3. **检查网络**: 确认资源加载正常
4. **检查代码**: 对照文档检查配置和用法
5. **搜索文档**: 查阅 [Astro文档](https://docs.astro.build/)
6. **社区求助**: 在GitHub Issues或社区论坛提问

---

## 相关文档

- [架构文档](./ARCHITECTURE.md)
- [组件使用文档](./COMPONENTS.md)

## 联系方式

如有问题，请通过以下方式联系：

- GitHub Issues: [项目仓库](https://github.com/Kiemss/MyWebsite)
- Email: your-email@example.com
