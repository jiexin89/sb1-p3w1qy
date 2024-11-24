import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { BrowserManager } from './browser-manager.js';
import { TaskQueue } from './task-queue.js';
import { logger } from './utils/logger.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const browserManager = new BrowserManager();
const taskQueue = new TaskQueue();

// Serve static files
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected');

  socket.on('execute-task', async (data) => {
    try {
      const { type, url } = data;
      if (type === 'navigate') {
        taskQueue.addTask(async () => {
          const page = await browserManager.newPage();
          await page.goto(url);
          socket.emit('task-completed', { message: `Navigated to ${url}` });
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

async function main() {
  try {
    await browserManager.initialize();
    taskQueue.start();
    
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();