import { Player } from './websocket-client';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private players: Map<string, Player> = new Map();
  private localPlayerId: string | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setPlayers(players: { [id: string]: Player }): void {
    this.players.clear();
    for (const id in players) {
      this.players.set(id, players[id]);
    }
  }

  setLocalPlayerId(id: string): void {
    this.localPlayerId = id;
  }

  render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#2d2d2d';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw all players
    this.players.forEach((player, id) => {
      this.drawPlayer(player, id === this.localPlayerId);
    });
  }

  private drawGrid(): void {
    const gridSize = 50;
    this.ctx.strokeStyle = '#3a3a3a';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawPlayer(player: Player, isLocal: boolean): void {
    const radius = 20;

    // Draw player circle
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = isLocal ? '#ff6b6b' : '#4ecdc4';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw username
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(player.username, player.x, player.y - radius - 5);

    // Draw health bar
    const healthBarWidth = 40;
    const healthBarHeight = 5;
    const healthPercentage = player.health / 100;

    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(
      player.x - healthBarWidth / 2,
      player.y + radius + 5,
      healthBarWidth,
      healthBarHeight
    );

    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(
      player.x - healthBarWidth / 2,
      player.y + radius + 5,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
  }

  startRenderLoop(): void {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
