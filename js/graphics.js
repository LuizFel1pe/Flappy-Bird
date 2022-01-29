import { frames } from './index.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const sprites = new Image();
sprites.src = '../sprites.png';

class FlappyBird {
  constructor() {
    this.sources = [
      { x: 0, y: 0 },
      { x: 0, y: 26 },
      { x: 0, y: 52 },
    ];
    this.width = 33;
    this.height = 24;
    this.canvasX = 10;
    this.canvasY = 50;
    this.currentFrame = 0;
    this.gravity = 0.25;
    this.speed = 0;
    this._jump = 4.6;
  }

  reset() {
    this.canvasX = 10;
    this.canvasY = 50;
    this.currentFrame = 0;
    this.gravity = 0.25;
    this.speed = 0;
  }

  draw() {
    this.updateFrame();
    const { x, y } = this.sources[this.currentFrame];

    ctx.drawImage(
      sprites,
      x,
      y,
      this.width,
      this.height,
      this.canvasX,
      this.canvasY,
      this.width,
      this.height
    );
  }

  update(screen) {
    if (this.hasCollision()) {
      screen.switchScreen('gameOver');
      return true;
    }

    this.speed += this.gravity;
    this.canvasY += this.speed;
  }

  jump() {
    this.speed = -this._jump;
  }

  updateFrame() {
    const frameIntervalBreak = 10;
    const passedBreak = frames % frameIntervalBreak === 0;
    if (passedBreak) {
      this.currentFrame = (1 + this.currentFrame) % this.sources.length;
    }
  }

  hasCollision() {
    const flappyBirdY = this.canvasY + this.height;
    const floorY = GAME.floor.canvasY;

    if (flappyBirdY >= floorY) {
      return true;
    }

    return false;
  }
}

class Floor {
  constructor() {
    this.sourceX = 0;
    this.sourceY = 610;
    this.width = 224;
    this.height = 112;
    this.canvasX = 0;
    this.canvasY = canvas.height - 112;
  }

  reset() {
    this.canvasX = 0;
  }

  draw() {
    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX,
      this.canvasY,
      this.width,
      this.height
    );

    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX + this.width,
      this.canvasY,
      this.width,
      this.height
    );
  }

  update() {
    this.canvasX = (this.canvasX - 1) % (this.width / 2);
  }
}

class Background {
  constructor() {
    this.sourceX = 390;
    this.sourceY = 0;
    this.width = 275;
    this.height = 204;
    this.canvasX = 0;
    this.canvasY = canvas.height - 204;
  }

  draw() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX,
      this.canvasY,
      this.width,
      this.height
    );

    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX + this.width,
      this.canvasY,
      this.width,
      this.height
    );
  }
}

class Pipes {
  constructor() {
    this.width = 52;
    this.height = 400;
    this.up = {
      sourceX: 52,
      sourceY: 169,
    };
    this.down = {
      sourceX: 0,
      sourceY: 169,
    };
    this.gap = 90;
    this.pairOfPipes = [];
  }

  reset() {
    this.pairOfPipes = [];
  }

  draw() {
    this.pairOfPipes.forEach(pair => {
      const randomY = pair.y;
      const pipeUpX = pair.x;
      const pipeUpY = randomY;

      ctx.drawImage(
        sprites,
        this.up.sourceX,
        this.up.sourceY,
        this.width,
        this.height,
        pipeUpX,
        pipeUpY,
        this.width,
        this.height
      );

      const pipeDownX = pair.x;
      const pipeDownY = this.height + this.gap + randomY;
      ctx.drawImage(
        sprites,
        this.down.sourceX,
        this.down.sourceY,
        this.width,
        this.height,
        pipeDownX,
        pipeDownY,
        this.width,
        this.height
      );

      pair.pipeUp = {
        x: pipeUpX,
        y: this.height + pipeUpY,
      };

      pair.pipeDown = {
        x: pipeDownX,
        y: pipeDownY,
      };
    });
  }

  update(screen) {
    const passed100Frames = frames % 100 === 0;
    if (passed100Frames) {
      this.pairOfPipes.push({
        x: canvas.width,
        y: -145 * (Math.random() + 1),
      });
    }

    this.pairOfPipes.forEach(pair => {
      pair.x -= 2;
      if (this.hasCollision(pair)) {
        screen.switchScreen('start');
      }

      if (pair.x + this.width <= 0) {
        this.pairOfPipes.shift();
      }
    });
  }


  hasCollision(pair) {
    const upFlappy = GAME.flappyBird.canvasY;
    const downFlappy = GAME.flappyBird.canvasY + GAME.flappyBird.height;

    if (GAME.flappyBird.canvasX + GAME.flappyBird.width >= pair.x) {
      if (upFlappy <= pair.pipeUp.y) {
        return true;
      }

      if (downFlappy >= pair.pipeDown.y) {
        return true;
      }
    }

    return false;
  }
}

class GameOverMessage {
  constructor() {
    this.sourceX = 134;
    this.sourceY = 153;
    this.width = 226;
    this.height = 200;
    this.canvasX = canvas.width / 2 - 226 / 2;
    this.canvasY = 50;
  }
  draw() {
    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX,
      this.canvasY,
      this.width,
      this.height
    );
  }
}

class GetReadyMessage {
  constructor() {
    this.sourceX = 134;
    this.sourceY = 0;
    this.width = 174;
    this.height = 152;
    this.canvasX = canvas.width / 2 - 174 / 2;
    this.canvasY = 50;
  }
  draw() {
    ctx.drawImage(
      sprites,
      this.sourceX,
      this.sourceY,
      this.width,
      this.height,
      this.canvasX,
      this.canvasY,
      this.width,
      this.height
    );
  }
}

const GAME = {
  getReadyMessage: new GetReadyMessage(),
  background: new Background(),
  floor: new Floor(),
  pipes: new Pipes(),
  flappyBird: new FlappyBird(),
  gameOverMessage: new GameOverMessage(),
};

export default GAME;
