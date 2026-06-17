# 基元合生官网 · 项目说明

## 启动方式
新闻数据通过 `fetch()` 加载本地 JSON,**直接双击 html 会被浏览器跨域策略阻挡新闻部分**。请用本地服务器:

```bash
cd "/Users/linnqwq/Desktop/基元合生/网站"
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

部署版:https://linnqwq.github.io/motif-bio-website/(GitHub Pages,push 后自动更新)

## 目录结构
```
网站/
├── index.html              首页(单页长滚动)
├── news.html               新闻列表页(独立)
├── news-detail.html        新闻详情页模板(通过 ?id=xxx 加载)
├── css/style.css           全部样式
├── js/main.js              所有交互(进场/滚动/数字/新闻渲染/分子网格浮动)
├── data/news.json          新闻数据 ⭐ 改这个就能增删改新闻
└── assets/
    ├── logo/
    │   └── logo-mark.png    透明背景 logo,全站使用
    └── images/
        ├── team/            团队照片(待添加)
        ├── products/        产品图(待添加)
        └── facility/        厂房设备图(待添加)
```

## 页面结构
- `index.html`(首页,单页长滚动) — Hero / 数据栏 / 公司简介 / 团队 / 产品介绍 / 厂房设备 / **最新3条新闻** / 联系我们
- `news.html` — 完整新闻列表,带分类筛选
- `news-detail.html?id=xxx` — 新闻详情(单一模板,所有新闻共用)

## 如何添加/修改新闻

打开 `data/news.json`,按现有格式增删:

```json
{
  "id": "唯一英文ID(用作URL)",
  "date": "2025-10-01",
  "tag": "公司动态",
  "title": "标题",
  "summary": "摘要(列表卡片显示)",
  "cover": "assets/images/news/封面图.jpg",
  "body": "<p>正文段一</p><p>正文段二</p><h2>小标题</h2><p>...</p>"
}
```

刷新页面即生效。**首页自动按日期取最新 3 条**,新闻列表页显示全部并按 tag 筛选。

## 其它内容替换
- **Logo**:替换 `assets/logo/logo-mark.png`(透明背景 PNG)即可全站生效,共 6 处引用
- **团队照**:放到 `assets/images/team/`,推荐 600×660px,改 `index.html` `.team-card .photo` 部分
- **厂房/产品图**:同理放到对应目录,替换 HTML 中的占位 SVG/DIV
- **公司介绍文案**:`index.html` 的 `#about` section
- **联系方式**:`index.html` 的 `#contact` section (电话/邮箱/地址)

## 配色变量
```css
--c-deep:  #102303   /* 深墨绿 · 主色 */
--c-mint:  #C7E6B7   /* 浅薄荷 · 品牌 */
--c-light: #F7F7F7   /* 浅灰白 */
--c-ink:   #0F0F0F   /* 正文黑 */
```
全部定义在 `css/style.css` 顶部 `:root`,改一处全站生效。

## 交互
- **进场动画**:全屏 logo + 公司全名淡入 → 1.5s 后淡出 → 主界面浮现(同一浏览器会话只显示一次,sessionStorage 控制)
- **导航**:滚动后变深绿磨砂玻璃
- **Hero 背景**:分子网格 + 4 个发光脉动节点,节点和连线由 JS 正弦波驱动微浮动
- **滚动揭示**:所有元素滚到视口 fade-up
- **数字滚动**:成立年/注册资本/业务领域/研发占比
- **卡片交互**:产品卡 hover 上浮 + 顶部流光;新闻卡 hover 上浮 + 边框变薄荷
- **新闻列表**:tag 筛选切换
- **移动端**:汉堡菜单

## 部署 / 开发流程

本地开发:
```bash
cd "/Users/linnqwq/Desktop/基元合生/网站"
python3 -m http.server 8000
```

push 到 GitHub(GitHub Pages 自动更新):
```bash
git add .
git commit -m "改动说明"
git push
```
