# CS2抽奖模拟器 - 完整技术方案

## 用户需求确认

✅ **数据存储**: 仅使用localStorage  
✅ **动画实现**: 选择最适合AI做的方案（CSS动画为主）  
✅ **管理方案**: 本地管理界面（可视化操作）  
✅ **经济系统**: 提供初始余额，允许"借贷"和清零，统计盈亏  

---

## 技术架构

### 整体架构

```
前端架构
├── 页面层
│   ├── lottery.astro          # 抽奖主页面
│   └── admin.astro            # 管理员界面
├── 组件层
│   ├── CaseSelector.astro     # 箱子选择器
│   ├── LotteryWheel.astro     # 抽奖转盘
│   ├── ItemDisplay.astro      # 奖品展示
│   ├── Inventory.astro        # 库存管理
│   └── AdminPanel.astro       # 管理面板
├── 逻辑层
│   ├── lottery-engine.ts      # 抽奖引擎
│   ├── storage-manager.ts     # 存储管理
│   ├── admin-manager.ts       # 管理逻辑
│   └── economy-system.ts      # 经济系统
└── 数据层
    ├── default-cases.json     # 默认箱子数据
    └── localStorage           # 用户数据存储
```

---

## 核心功能模块

### 1. 管理员界面模块

**功能列表**:
- ✅ 箱子管理（添加/编辑/删除）
- ✅ 奖品管理（添加/编辑/删除）
- ✅ 概率配置
- ✅ 图片上传（Base64）
- ✅ 配置导入/导出
- ✅ 预览功能

**界面布局**:
```
┌─────────────────────────────────────────┐
│  CS2抽奖模拟器 - 管理界面                │
├─────────────────────────────────────────┤
│  [箱子管理] [奖品管理] [导入/导出]       │
├─────────────────────────────────────────┤
│                                         │
│  箱子列表:                              │
│  ┌─────────────────────────────────┐   │
│  │ 📦 蛇噬武器箱                     │   │
│  │ 价格: $2.50 | 奖品: 17个          │   │
│  │ [编辑] [删除] [预览]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ 添加新箱子]                         │
│                                         │
└─────────────────────────────────────────┘
```

**箱子编辑表单**:
```
┌─────────────────────────────────────────┐
│  编辑箱子                               │
├─────────────────────────────────────────┤
│  箱子名称: [________________]           │
│  箱子价格: [____] USD                   │
│  箱子图片: [选择文件] [预览]             │
│                                         │
│  奖品列表:                              │
│  ┌─────────────────────────────────┐   │
│  │ AK-47 | 蛇噬 | 隐秘 | 0.26%      │   │
│  │ [编辑] [删除]                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ 添加奖品]                           │
│                                         │
│  [保存] [取消]                          │
└─────────────────────────────────────────┘
```

---

### 2. 抽奖引擎模块

**核心算法**:
```typescript
class LotteryEngine {
  // 基于概率的随机抽取
  draw(caseItems: CaseItem[]): CaseItem {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const item of caseItems) {
      cumulative += item.probability;
      if (random <= cumulative) {
        return item;
      }
    }
    
    return caseItems[caseItems.length - 1];
  }
  
  // 概率验证
  validateProbabilities(items: CaseItem[]): boolean {
    const total = items.reduce((sum, item) => sum + item.probability, 0);
    return Math.abs(total - 100) < 0.01;
  }
}
```

---

### 3. 动画模块

**CS2风格开箱动画**:

**阶段一：箱子展示**
- 箱子3D旋转效果
- 开箱按钮发光

**阶段二：转盘滚动**
- 奖品卡片横向滚动
- 灯光效果（霓虹灯）
- 速度由快到慢

**阶段三：结果展示**
- 中奖物品放大
- 稀有度光效
- 音效（可选）

**实现方式**:
- CSS Keyframes动画
- JavaScript控制速度曲线
- CSS Variables控制颜色

**示例代码**:
```css
@keyframes wheel-spin {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1000%);
  }
}

.wheel-container {
  animation: wheel-spin 5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

### 4. 经济系统模块

**功能**:
- ✅ 初始余额设置
- ✅ 开箱扣费
- ✅ 物品出售
- ✅ 借贷功能（允许负余额）
- ✅ 盈亏统计
- ✅ 余额清零

**数据结构**:
```typescript
interface EconomyData {
  balance: number;           // 当前余额
  initialBalance: number;    // 初始余额
  totalSpent: number;        // 总花费
  totalEarned: number;       // 总收入
  profitLoss: number;        // 盈亏
  loanAmount: number;        // 借贷金额
  transactions: Transaction[]; // 交易记录
}

interface Transaction {
  id: string;
  type: 'open_case' | 'sell_item' | 'loan' | 'reset';
  amount: number;
  timestamp: Date;
  description: string;
}
```

---

### 5. 存储管理模块

**localStorage结构**:
```typescript
interface AppStorage {
  // 管理员配置
  admin: {
    cases: Case[];           // 箱子配置
    lastModified: Date;      // 最后修改时间
  };
  
  // 用户数据
  user: {
    balance: number;         // 余额
    inventory: InventoryItem[]; // 库存
    history: HistoryRecord[]; // 历史
    settings: UserSettings;  // 设置
  };
  
  // 经济数据
  economy: EconomyData;
}
```

---

## 页面设计

### 抽奖主页面

**布局**:
```
┌─────────────────────────────────────────┐
│  [Logo] CS2抽奖模拟器    [管理] [库存]   │
├─────────────────────────────────────────┤
│                                         │
│  余额: $100.00  盈亏: +$25.50           │
│                                         │
│  选择箱子:                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│  │📦 │ │📦 │ │📦 │ │📦 │             │
│  └───┘ └───┘ └───┘ └───┘             │
│                                         │
│  当前箱子: 蛇噬武器箱                    │
│  价格: $2.50                            │
│                                         │
│  [开箱]                                 │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     抽奖转盘区域                  │   │
│  │                                  │   │
│  │  [奖][奖][奖][奖][奖][奖][奖]    │   │
│  │                                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  最近获得:                              │
│  [AK-47 蛇噬] [M4A1 龙王] ...          │
│                                         │
└─────────────────────────────────────────┘
```

---

### 管理员页面

**布局**:
```
┌─────────────────────────────────────────┐
│  管理员界面              [返回抽奖]      │
├─────────────────────────────────────────┤
│  [箱子管理] [数据管理] [设置]           │
├─────────────────────────────────────────┤
│                                         │
│  箱子列表:                              │
│  ┌─────────────────────────────────┐   │
│  │ 📦 蛇噬武器箱                     │   │
│  │ 价格: $2.50 | 奖品: 17个          │   │
│  │ [编辑] [删除] [预览]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ 添加新箱子] [导出配置] [导入配置]   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 开发计划

### 第一阶段：基础架构（1-2天）

**任务**:
- [ ] 创建数据结构定义
- [ ] 实现存储管理模块
- [ ] 创建默认箱子数据
- [ ] 搭建基础页面框架

---

### 第二阶段：管理界面（2-3天）

**任务**:
- [ ] 创建管理页面UI
- [ ] 实现箱子CRUD功能
- [ ] 实现奖品CRUD功能
- [ ] 添加图片上传功能
- [ ] 实现配置导入/导出

---

### 第三阶段：抽奖功能（2-3天）

**任务**:
- [ ] 实现抽奖引擎
- [ ] 创建抽奖页面UI
- [ ] 实现基础动画效果
- [ ] 添加结果展示

---

### 第四阶段：经济系统（1-2天）

**任务**:
- [ ] 实现余额管理
- [ ] 添加盈亏统计
- [ ] 实现借贷功能
- [ ] 添加交易记录

---

### 第五阶段：优化完善（1-2天）

**任务**:
- [ ] 优化动画效果
- [ ] 添加音效（可选）
- [ ] 性能优化
- [ ] 测试和修复bug

---

## 技术栈

### 前端技术

- **框架**: Astro 5.6.1
- **语言**: TypeScript
- **样式**: CSS Variables + CSS Animations
- **存储**: localStorage
- **动画**: CSS Keyframes + JavaScript

### 开发工具

- **类型检查**: TypeScript
- **代码规范**: ESLint + Prettier
- **版本控制**: Git

---

## 文件结构

```
src/
├── data/
│   └── default-cases.json        # 默认箱子数据
├── pages/
│   ├── lottery.astro             # 抽奖主页面
│   └── admin.astro               # 管理员界面
├── components/
│   ├── lottery/
│   │   ├── CaseSelector.astro    # 箱子选择器
│   │   ├── LotteryWheel.astro    # 抽奖转盘
│   │   ├── ItemDisplay.astro     # 奖品展示
│   │   └── Inventory.astro       # 库存管理
│   └── admin/
│       ├── CaseManager.astro     # 箱子管理
│       ├── ItemManager.astro     # 奖品管理
│       └── DataManager.astro     # 数据管理
├── scripts/
│   ├── lottery-engine.ts         # 抽奖引擎
│   ├── storage-manager.ts        # 存储管理
│   ├── admin-manager.ts          # 管理逻辑
│   └── economy-system.ts         # 经济系统
├── styles/
│   ├── lottery.css               # 抽奖样式
│   └── admin.css                 # 管理样式
└── types/
    ├── case.ts                   # 箱子类型定义
    ├── item.ts                   # 奖品类型定义
    └── user.ts                   # 用户类型定义
```

---

## 下一步行动

准备开始实施，请确认：

1. ✅ 技术方案是否满意？
2. ✅ 是否需要调整开发计划？
3. ✅ 是否现在开始开发？

确认后将开始创建文件和实现功能。
