import { WebSocketClient, Player } from './websocket-client';
import { GameRenderer } from './game-renderer';
import { InputHandler } from './input-handler';

export class Game {
  private wsClient: WebSocketClient;
  private renderer: GameRenderer;
  private inputHandler: InputHandler;
  private localPlayer: Player | null = null;
  private players: Map<string, Player> = new Map();
  private lastUpdateTime = 0;
  private moveSpeed = 200; // pixels per second

  constructor() {
    // Determine WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8080';
    const wsUrl = `${protocol}//${host}/ws`;

    this.wsClient = new WebSocketClient(wsUrl);
    this.renderer = new GameRenderer('game-canvas');
    
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.inputHandler = new InputHandler(canvas);

    this.setupWebSocketCallbacks();
    this.setupUI();
  }

  private setupWebSocketCallbacks(): void {
    this.wsClient.onConnectionChange((connected) => {
      const statusElement = document.getElementById('connection-status');
      if (statusElement) {
        statusElement.textContent = connected ? 'Connected' : 'Disconnected';
        statusElement.style.color = connected ? '#00ff00' : '#ff0000';
      }
    });

    this.wsClient.onStateUpdate((state) => {
      this.players.clear();
      for (const id in state.players) {
        this.players.set(id, state.players[id]);
      }
      this.renderer.setPlayers(state.players);
      this.updatePlayerList();
    });
  }

  private setupUI(): void {
    const playerCountElement = document.getElementById('player-count');
    if (playerCountElement) {
      playerCountElement.textContent = '0';
    }
  }

  private updatePlayerList(): void {
    const playerListElement = document.getElementById('player-list');
    const playerCountElement = document.getElementById('player-count');

    if (playerListElement) {
      playerListElement.innerHTML = '';
      this.players.forEach((player) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.textContent = `${player.username} - Score: ${player.score}`;
        playerListElement.appendChild(playerItem);
      });
    }

    if (playerCountElement) {
      playerCountElement.textContent = this.players.size.toString();
    }
  }

  start(): void {
    this.wsClient.connect();
    this.renderer.startRenderLoop();
    this.startGameLoop();
  }

  private startGameLoop(): void {
    this.lastUpdateTime = Date.now();

    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
      this.lastUpdateTime = currentTime;

      this.update(deltaTime);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }

  private update(deltaTime: number): void {
    const input = this.inputHandler.getInputState();

    // Update local player position
    if (input.moveX !== 0 || input.moveY !== 0) {
      // Calculate new position
      const moveDistance = this.moveSpeed * deltaTime;
      const newX = (this.localPlayer?.x || 100) + input.moveX * moveDistance;
      const newY = (this.localPlayer?.y || 100) + input.moveY * moveDistance;

      // Send move update to server
      this.wsClient.sendMove(newX, newY);

      // Optimistically update local position
      if (this.localPlayer) {
        this.localPlayer.x = newX;
        this.localPlayer.y = newY;
      }
    }

    // Handle shooting
    if (input.shooting) {
      this.wsClient.sendShoot(input.mouseX, input.mouseY);
    }
  }

  stop(): void {
    this.wsClient.disconnect();
  }
}
