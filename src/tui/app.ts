import { KeyHandler, type KeyBinding } from './keys';
import { renderScreen, clearScreen } from './render';

export interface TuiState {
  url: string;
  selector: string | null;
  status: string;
  elements?: string[];
  selectedIndex?: number;
  logs?: string[];
}

export class TuiApp {
  private keyHandler: KeyHandler;
  private state: TuiState;
  private isRunning = false;
  private bindings: Map<string, () => void> = new Map();

  constructor() {
    this.keyHandler = new KeyHandler();
    this.state = {
      url: '',
      selector: null,
      status: 'Initializing...',
      elements: [],
      selectedIndex: 0,
      logs: [],
    };
  }

  onKey(key: string, callback: () => void): void {
    this.bindings.set(key, callback);
  }

  async start(): Promise<void> {
    this.isRunning = true;

    // Set up key handlers
    for (const [key, callback] of this.bindings) {
      this.keyHandler.bind(key as KeyBinding['key'], callback);
    }

    this.keyHandler.start();
    this.draw();

    // Keep process alive
    return new Promise((resolve) => {
      const check = () => {
        if (!this.isRunning) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  stop(): void {
    this.isRunning = false;
    this.keyHandler.stop();
    clearScreen();
  }

  render(state: Partial<TuiState>): void {
    this.state = { ...this.state, ...state };
    if (this.isRunning) {
      this.draw();
    }
  }

  log(message: string): void {
    const logs = this.state.logs || [];
    logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    // Keep last 5 logs
    if (logs.length > 5) {
      logs.shift();
    }
    this.state.logs = logs;
    if (this.isRunning) {
      this.draw();
    }
  }

  private draw(): void {
    renderScreen(this.state);
  }

  getState(): TuiState {
    return { ...this.state };
  }
}
