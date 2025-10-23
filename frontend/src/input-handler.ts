export interface InputState {
  moveX: number;
  moveY: number;
  shooting: boolean;
  mouseX: number;
  mouseY: number;
}

export class InputHandler {
  private keys: Set<string> = new Set();
  private mouseX = 0;
  private mouseY = 0;
  private mouseDown = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseDown = false;
    });

    // Prevent context menu on right-click
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  getInputState(): InputState {
    let moveX = 0;
    let moveY = 0;

    // WASD keys
    if (this.keys.has('w') || this.keys.has('arrowup')) {
      moveY -= 1;
    }
    if (this.keys.has('s') || this.keys.has('arrowdown')) {
      moveY += 1;
    }
    if (this.keys.has('a') || this.keys.has('arrowleft')) {
      moveX -= 1;
    }
    if (this.keys.has('d') || this.keys.has('arrowright')) {
      moveX += 1;
    }

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= length;
      moveY /= length;
    }

    return {
      moveX,
      moveY,
      shooting: this.mouseDown,
      mouseX: this.mouseX,
      mouseY: this.mouseY,
    };
  }
}
