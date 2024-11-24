import activeWindow from 'active-win';
import { logger } from './utils/logger.js';

export class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  async initialize() {
    try {
      await this.refreshWindowList();
      logger.info('Window manager initialized');
    } catch (error) {
      logger.error('Failed to initialize window manager:', error);
      throw error;
    }
  }

  async refreshWindowList() {
    const window = await activeWindow();
    if (window) {
      this.windows.set(window.id, window);
    }
  }

  async getActiveWindow() {
    return await activeWindow();
  }

  async getWindowByTitle(title) {
    await this.refreshWindowList();
    return Array.from(this.windows.values())
      .find(window => window.title.includes(title));
  }
}