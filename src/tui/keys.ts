import * as readline from 'readline';

export interface KeyBinding {
  key: 'up' | 'down' | 'left' | 'right' | 'enter' | 'escape' | 'tab' | 'q' | string;
  callback: () => void;
}

export class KeyHandler {
  private bindings: Map<string, () => void> = new Map();
  private rl: readline.Interface | null = null;

  bind(key: KeyBinding['key'], callback: () => void): void {
    this.bindings.set(key, callback);
  }

  unbind(key: string): void {
    this.bindings.delete(key);
  }

  start(): void {
    if (this.rl) return;

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
      if (!key) return;

      // Handle Ctrl+C
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }

      // Map key names
      const keyName = this.mapKeyName(key);
      const callback = this.bindings.get(keyName);

      if (callback) {
        callback();
      }
    });

    process.stdin.resume();
  }

  stop(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }

  private mapKeyName(key: { name: string; sequence: string }): string {
    const mapping: Record<string, string> = {
      return: 'enter',
      escape: 'escape',
    };

    return mapping[key.name] || key.name;
  }
}
