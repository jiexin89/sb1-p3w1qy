import { logger } from './utils/logger.js';

export class TaskQueue {
  constructor() {
    this.tasks = [];
    this.isProcessing = false;
  }

  addTask(task) {
    this.tasks.push(task);
    logger.debug('Task added to queue');
  }

  async start() {
    if (this.isProcessing) {
      logger.warn('Task queue is already processing');
      return;
    }

    this.isProcessing = true;
    logger.info('Started processing task queue');

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      try {
        await task();
        logger.debug('Task completed successfully');
      } catch (error) {
        logger.error('Task failed:', error);
      }
    }

    this.isProcessing = false;
    logger.info('Finished processing task queue');
  }

  clear() {
    this.tasks = [];
    logger.info('Task queue cleared');
  }
}