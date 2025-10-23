import { Game } from './game';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Rambo Browser Game - Initializing...');
  
  const game = new Game();
  game.start();

  console.log('Game started!');

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    game.stop();
  });
});
