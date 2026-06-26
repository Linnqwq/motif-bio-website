# 基元合生官网

> 基元合生(眉山)生物科技有限责任公司 · MOTIF SYNTHETIC BIOLOGY

## 在线地址

- **生产**:https://linnqwq.github.io/motif-bio-website/(GitHub Pages,push 后自动更新)
- **仓库**:https://github.com/Linnqwq/motif-bio-website

## 本地启动

新闻通过 `fetch()` 加载本地 JSON,**不能双击 HTML 打开**(浏览器跨域策略阻挡)。请用本地服务器:

```bash
cd "/Users/linnqwq/Desktop/基元合生/外联宣发/公司网站"
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

端口被占用:`lsof -ti :8000 | xargs kill -9`

## 目录结构

```
公司网站/
├── index.html              首页
├── about.html              关于我们 / 企业简介
├── history.html            关于我们 / 发展历程
├── vision.html             关于我们 / 科技革新
├── products.html           产品中心总览
├── products/
│   ├── api.html            高品质原料药
│   ├── cosmetics.html      化妆品原料
│   ├── nutrition.html      膳食原料
│   ├── food.html           食品添加剂
│   └── feed.html           饲料添加剂
├── news.html               新闻列表
├── news-detail.html        新闻详情(?id=xxx 加载)
├── contact.html            联系我们
├── css/style.css           全部样式(单文件,带 ?v=N 缓存版本号)
├── js/main.js              所有交互
├── data/news.json          ⭐ 新闻数据(改这里加新闻)
└── assets/
    ├── logo/logo-mark.png  透明 logo
    └── images/
        ├── hero/neural.jpg 首屏神经突触图
        ├── facility/       公司外观 / 发酵车间 / 培养室 / 实验室等
        └── ...
```

## 导航结构

```
首页 | 关于我们 ▾ | 产品中心 ▾ | 新闻动态 | 联系我们
       ├ 企业简介      ├ 高品质原料药
       ├ 发展历程      ├ 化妆品原料
       └ 科技革新      ├ 膳食原料
                       ├ 食品添加剂
                       └ 饲料添加剂
```

两个 dropdown 都用**深色玻璃风样式**,桌面端 hover 展开,移动端 click 展开。

## 配色与字体

```css
:root {
  --c-deep:  #102303;   /* 深墨绿 · 主色 */
  --c-mint:  #C7E6B7;   /* 浅薄荷 · 强调 */
  --c-light: #F7F7F7;   /* 浅灰白 · 背景 */
  --c-ink:   #0F0F0F;   /* 正文黑 */
  --maxw:    1240px;
  --pad-x:   clamp(20px, 5vw, 80px);
}
```

字体:中文 **Noto Sans SC**,英文 **Space Grotesk**(Google Fonts)。

## 主要交互

| 模块 | 行为 |
|---|---|
| **进场动画** | 全屏 logo + 公司名淡入 → 1.3s 文字先上移淡出 → 1.5s 绿底淡出 + 微上卷;sessionStorage 控制同会话只显示一次 |
| **导航** | 滚动 100px 后变深绿毛玻璃(blur 8px)+ 阴影 |
| **Hero** | 神经突触图缓慢推近;三行 slogan **fade-in-up 逐行 150ms 错落** |
| **关于我们** | 1:1.4 不对称布局,图片**右边延伸至屏幕边缘**,左圆角 28px |
| **产品中心** | 5 卡片 hover **flex-grow 变宽 + 薄荷光晕亮起**,中文标题变薄荷 |
| **设施跑马灯** | JS RAF 驱动**无缝循环**,55s 一圈,鼠标 hover 暂停,左右按钮可手动跳 |
| **滚动揭示** | IntersectionObserver,元素入视口 fade-up 20px |
| **数字滚动** | 成立年 / 注册资本 / 业务领域 / 研发占比 |
| **链接箭头** | 「了解 / 查看」按钮悬停箭头 translateX(5px) |

## 如何更新内容

### 新闻
打开 `data/news.json` 增删:

```json
{
  "id": "唯一英文ID",
  "date": "2025-10-01",
  "tag": "公司动态",
  "title": "标题",
  "summary": "摘要",
  "cover": "assets/images/news/封面.jpg",
  "body": "<p>正文段一</p><p>正文段二</p>"
}
```

刷新生效。首页自动取最新 3 条,新闻列表页按 tag 筛选。

### 文案 / 联系方式 / 公司信息
- 主 slogan、副标题:`index.html`(直接搜文字定位)
- 公司简介、发展历程:`about.html` / `history.html` / `vision.html`
- 产品详情:`products/*.html` 里的 `.product-detail-card`
- 联系方式:`contact.html` + 全站 footer(13 个 HTML 都引用同一份)

### Logo / 图片
- Logo 全站 6 处引用同一个文件,替换 `assets/logo/logo-mark.png` 即可
- 子页(`products/*.html`)路径要用 `../assets/...`

## 缓存策略

每次改 CSS / JS,**必须**升级 query 版本号(防浏览器缓存):

```html
<link rel="stylesheet" href="css/style.css?v=51" />
<script src="js/main.js?v=51"></script>
```

当前版本:**v50**(详见 `css/style.css` 末尾的版本注释)。

## 部署

```bash
git add .
git commit -m "改动说明"
git push
# GitHub Pages 1-2 分钟自动重新部署
```

强制刷新查看新版:**Cmd + Shift + R**(避免本地缓存)

## 重看进场动画

F12 → Application → Session Storage → 删除 `motif-intro-seen` → 刷新。
