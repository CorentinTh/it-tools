// server.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // 创建Vite服务器实例
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  // 使用Vite的中间件
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      // 读取index.html文件
      const indexProd = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      // 应用Vite HTML转换。重要：在生产环境中，这将由Vite自己处理。
      const indexHtml = await vite.transformIndexHtml(req.originalUrl, indexProd);

      // 加载服务器入口。vite.ssrLoadModule会自动转换ECS模块为CommonJS，可直接被Node.js导入
      const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
      const {
        app, router, pinia, i18n,
        cssHtml,
        appHtml,
      } = await render(req, res);

      // 设置服务器端路由位置
      router.push(req.originalUrl);
      // 等待路由准备就绪
      await router.isReady();

      // 注入应用内容到模板中
      const html = indexHtml
        .replace('<!--app-html-->', appHtml)
        .replace('<!--app-css-->', cssHtml);

      // 发送渲染后的HTML回客户端
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }
    catch (e) {
      // 如果捕获到错误，则使用Vite修复堆栈追踪，并发送500错误
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

startServer();
