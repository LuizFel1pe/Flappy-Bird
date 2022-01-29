import GAME from './graphics.js';

class Screen {
  constructor() {
    this.currentScreen = null;
  }

  switchScreen(screen) {
    this.reset();
    this.currentScreen = screen;
  }

  reset() {
    const elements = Object.values(GAME);
    elements.forEach(element => {
      if (element.reset) {
        element.reset();
      }
    });
  }

  draw() {
    switch (this.currentScreen) {
      case 'start':
        GAME.background.draw();
        GAME.floor.draw();
        GAME.getReadyMessage.draw();
        GAME.flappyBird.draw();
        break;
      case 'game':
        GAME.background.draw();
        GAME.pipes.draw();
        GAME.floor.draw();
        GAME.flappyBird.draw();
        break;
      case 'gameOver':
        GAME.background.draw();
        GAME.floor.draw();
        GAME.gameOverMessage.draw();
        break;
      default:
        break;
    }
  }

  update() {
    switch (this.currentScreen) {
      case 'start':
        GAME.floor.update();
        break;
      case 'game':
        GAME.flappyBird.update(this);
        GAME.pipes.update(this);
        GAME.floor.update();
        break;
      case 'gameOver':
        break;
      default:
        break;
    }
  }

  click() {
    switch (this.currentScreen) {
      case 'start':
        this.switchScreen('game');
        break;
      case 'game':
        GAME.flappyBird.jump();
        break;
      case 'gameOver':
        this.switchScreen('start');
        break;
      default:
        break;
    }
  }
}

export default Screen;
