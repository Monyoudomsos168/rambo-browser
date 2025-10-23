export interface Player {
  id: string;
  x: number;
  y: number;
  health: number;
  score: number;
  username: string;
}

export interface GameState {
  players: { [id: string]: Player };
}

export interface Message {
  type: string;
  data: any;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectInterval = 3000;
  private reconnectTimer: number | null = null;
  private onStateUpdateCallback: ((state: GameState) => void) | null = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null = null;

  constructor(private url: string) {}

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.onConnectionChangeCallback) {
          this.onConnectionChangeCallback(true);
        }
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        if (this.onConnectionChangeCallback) {
          this.onConnectionChangeCallback(false);
        }
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimer) {
      this.reconnectTimer = window.setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.connect();
      }, this.reconnectInterval);
    }
  }

  private handleMessage(message: Message): void {
    // For now, we'll just log messages
    // In a full implementation, this would parse game state updates
    console.log('Received message:', message);
  }

  send(type: string, data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: Message = { type, data };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  sendMove(x: number, y: number): void {
    this.send('move', { x, y });
  }

  sendShoot(targetX: number, targetY: number): void {
    this.send('shoot', { targetX, targetY });
  }

  onStateUpdate(callback: (state: GameState) => void): void {
    this.onStateUpdateCallback = callback;
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.onConnectionChangeCallback = callback;
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
