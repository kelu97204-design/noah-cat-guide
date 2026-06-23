# Noah 猫咪图鉴上线说明

## 本地预览

电脑上已经可以直接访问：

```text
http://localhost:5173/lukee-cat-guide.html
```

同一 Wi-Fi 下的设备可以尝试：

```text
http://你的电脑局域网IP:5173/lukee-cat-guide.html
```

## 上线到公网的推荐方式

这个网站包含意见反馈和反馈后台，因此推荐部署到支持 Node.js 的平台，例如 Render、Railway、Fly.io 或自己的云服务器。

上线时运行命令：

```text
node server.js
```

平台需要设置：

```text
Start Command: node server.js
Port: 使用平台自动分配的 PORT
```

## 访问地址

上线后：

```text
首页: https://你的域名/lukee-cat-guide.html
反馈后台: https://你的域名/feedback-admin.html
```

## 重要提醒

当前后台没有登录密码，适合先测试。正式公开前，建议给 `feedback-admin.html` 加密码或放到受保护的后台环境里，避免任何人都能看到反馈内容。
