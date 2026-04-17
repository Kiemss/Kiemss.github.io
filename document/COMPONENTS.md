# 组件使用文档

本文档详细介绍项目中所有组件的使用方法、Props配置和示例代码。

## 目录

- [Layout 组件](#layout-组件)
- [Header 组件](#header-组件)
- [Footer 组件](#footer-组件)
- [Particles 组件](#particles-组件)
- [BackToTop 组件](#backtotop-组件)

---

## Layout 组件

基础布局组件，提供统一的HTML结构、全局样式注入和页面meta管理。

### 用法

```astro
---
import Layout from '@/components/Layout.astro';
---

<Layout 
  title="页面标题"
  description="页面描述"
  showParticles={true}
  showBackToTop={true}
  customCursor={true}
>
  <!-- 页面内容 -->
</Layout>
```

### Props说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | string | 是 | - | 页面标题 |
| description | string | 否 | "Kiem's Portfolio - Game Developer" | 页面描述（SEO） |
| showParticles | boolean | 否 | false | 是否显示粒子动画背景 |
| showBackToTop | boolean | 否 | false | 是否显示返回顶部按钮 |
| customCursor | boolean | 否 | false | 是否使用自定义光标 |

### 示例代码

#### 基础用法

```astro
<Layout title="首页">
  <h1>欢迎访问</h1>
</Layout>
```

#### 完整配置

```astro
<Layout 
  title="首页 - Kiem"
  description="Kiem的个人作品集"
  showParticles={true}
  showBackToTop={true}
  customCursor={true}
>
  <Header currentPage="/" />
  <main>
    <!-- 页面内容 -->
  </main>
  <Footer showSocialLinks={true} />
</Layout>
```

### 注意事项

- Layout组件必须在页面最外层
- 自动注入全局样式 (`global.css`)
- 自动设置HTML lang属性为"zh-CN"

---

## Header 组件

导航栏组件，支持当前页面高亮和自定义导航项。

### 用法

```astro
---
import Header from '@/components/Header.astro';
---

<Header currentPage="/" />
```

### Props说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| currentPage | string | 否 | '' | 当前页面路径，用于高亮 |
| items | Array<{label, href}> | 否 | 默认导航项 | 自定义导航项配置 |

### 默认导航项

```javascript
[
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' }
]
```

### 示例代码

#### 基础用法

```astro
<Header currentPage="/" />
```

#### 自定义导航项

```astro
---
const customNavItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
  { label: '博客', href: '/blog' }
];
---

<Header currentPage="/projects" items={customNavItems} />
```

### 样式特性

- 悬停时显示下划线动画
- 当前页面自动高亮
- 悬停时文字发光效果

---

## Footer 组件

页脚组件，支持可选的社交链接显示。

### 用法

```astro
---
import Footer from '@/components/Footer.astro';
---

<Footer showSocialLinks={true} year={2026} />
```

### Props说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| showSocialLinks | boolean | 否 | false | 是否显示社交链接 |
| year | number | 否 | 当前年份 | 版权年份 |
| socialLinks | Array<SocialLink> | 否 | 默认社交链接 | 自定义社交链接配置 |

### SocialLink接口

```typescript
interface SocialLink {
  platform: string;    // 平台名称
  url: string;         // 链接地址
  icon: string;        // 图标标识（目前支持'github'）
  ariaLabel: string;   // 无障碍标签
}
```

### 默认社交链接

```javascript
[
  {
    platform: 'GitHub',
    url: 'https://github.com/Kiemss',
    icon: 'github',
    ariaLabel: 'GitHub'
  }
]
```

### 示例代码

#### 基础用法

```astro
<Footer />
```

#### 显示社交链接

```astro
<Footer showSocialLinks={true} year={2026} />
```

#### 自定义社交链接

```astro
---
const mySocialLinks = [
  {
    platform: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: 'github',
    ariaLabel: 'GitHub'
  }
];
---

<Footer showSocialLinks={true} socialLinks={mySocialLinks} />
```

### 扩展社交平台

要添加新的社交平台图标，需要：

1. 在 `Footer.astro` 的 `iconMap` 中添加SVG图标
2. 在 `socialLinks` prop中使用新的icon标识

```astro
const iconMap = {
  github: `<svg>...</svg>`,
  twitter: `<svg>...</svg>`,  // 添加新图标
  linkedin: `<svg>...</svg>`  // 添加新图标
};
```

---

## Particles 组件

Canvas粒子动画组件，提供动态背景效果。

### 用法

```astro
---
import Particles from '@/components/Particles.astro';
---

<Particles />
```

### Props说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| particleCount | number | 否 | 80 | 粒子数量 |
| connectionDistance | number | 否 | 120 | 粒子连接距离 |
| particleColor | string | 否 | 'rgba(228, 78, 0, 0.6)' | 粒子颜色 |
| lineColor | string | 否 | 'rgba(228, 78, 0, 0.3)' | 连线颜色 |
| mouseRadius | number | 否 | 100 | 鼠标影响半径 |

### 示例代码

#### 基础用法

```astro
<Particles />
```

#### 自定义配置

```astro
<Particles 
  particleCount={100}
  connectionDistance={150}
  particleColor="rgba(100, 200, 255, 0.6)"
  lineColor="rgba(100, 200, 255, 0.3)"
/>
```

### 性能优化建议

- 粒子数量建议不超过150个
- 连接距离建议不超过200px
- 在移动设备上可考虑减少粒子数量

### 注意事项

- 组件使用fixed定位，z-index为-1
- 自动响应窗口大小变化
- 使用requestAnimationFrame优化动画性能

---

## BackToTop 组件

返回顶部按钮组件，滚动超过阈值自动显示。

### 用法

```astro
---
import BackToTop from '@/components/BackToTop.astro';
---

<BackToTop />
```

### Props说明

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| threshold | number | 否 | 300 | 显示阈值（像素） |
| iconColor | string | 否 | '#e44e00' | 图标颜色 |

### 示例代码

#### 基础用法

```astro
<BackToTop />
```

#### 自定义配置

```astro
<BackToTop threshold={500} iconColor="#ffffff" />
```

### 功能特性

- 滚动超过阈值自动显示
- 点击平滑滚动到顶部
- 悬停时发光效果
- 固定在页面右下角

---

## 组件组合示例

### 完整页面示例

```astro
---
import Layout from '@/components/Layout.astro';
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
---

<Layout 
  title="完整页面示例"
  description="展示所有组件的组合使用"
  showParticles={true}
  showBackToTop={true}
  customCursor={true}
>
  <Header currentPage="/" />
  
  <main>
    <h1>页面标题</h1>
    <p>页面内容...</p>
  </main>
  
  <Footer showSocialLinks={true} year={2026} />
</Layout>
```

### 简单页面示例

```astro
---
import Layout from '@/components/Layout.astro';
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
---

<Layout title="简单页面">
  <Header currentPage="/simple" />
  
  <main>
    <h1>简单页面</h1>
  </main>
  
  <Footer />
</Layout>
```

---

## 最佳实践

1. **组件导入**: 使用 `@/` 路径别名导入组件
2. **Props传递**: 必填props必须传递，可选props根据需要传递
3. **样式隔离**: 组件样式已作用域隔离，避免全局样式污染
4. **性能考虑**: Particles组件在移动设备上可考虑禁用
5. **可访问性**: Footer的社交链接已配置aria-label

## 常见问题

### Q: 如何修改主题色？

A: 修改 `src/styles/global.css` 中的CSS变量：

```css
:root {
  --color-primary: #你的颜色;
  --color-primary-rgb: R, G, B;
}
```

### Q: 如何添加新的导航项？

A: 在使用Header组件时传递自定义items：

```astro
<Header 
  currentPage="/" 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'New Page', href: '/new-page' }
  ]} 
/>
```

### Q: 如何禁用粒子动画？

A: 在Layout组件中不传递 `showParticles` 或设置为 `false`：

```astro
<Layout title="页面" showParticles={false}>
```

### Q: 组件样式不生效怎么办？

A: 检查以下几点：
1. 确保导入了全局样式（Layout组件已自动导入）
2. 检查CSS变量是否正确定义
3. 检查样式优先级问题

## 相关文档

- [架构文档](./ARCHITECTURE.md)
- [维护指南](./MAINTENANCE.md)
