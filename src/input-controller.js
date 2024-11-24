import robot from 'robotjs';
import { logger } from './utils/logger.js';

export class InputController {
  async initialize() {
    try {
      // Configure robot.js settings
      robot.setMouseDelay(2);
      robot.setKeyboardDelay(2);
      logger.info('Input controller initialized');
    } catch (error) {
      logger.error('Failed to initialize input controller:', error);
      throw error;
    }
  }

  async moveMouseTo(x, y) {
    try {
      robot.moveMouse(x, y);
      logger.debug(`Moved mouse to ${x}, ${y}`);
    } catch (error) {
      logger.error('Failed to move mouse:', error);
      throw error;
    }
  }

  async typeText(text) {
    try {
      robot.typeString(text);
      logger.debug(`Typed text: ${text}`);
    } catch (error) {
      logger.error('Failed to type text:', error);
      throw error;
    }
  }

  async pressKey(key) {
    try {
      robot.keyTap(key);
      logger.debug(`Pressed key: ${key}`);
    } catch (error) {
      logger.error('Failed to press key:', error);
      throw error;
    }
  }
}