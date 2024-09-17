const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};

const GAME_WIDTH = 640;
const GAME_HEIGHT = 360;

const SPRITE_PATH = "img/";
const SOUND_PATH = "sounds/";

let game = {
  running: true,
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  score: 0,
  rows: 4,
  cols: 8,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null
  },
  sounds: {
    bump: null
  },

  init() {
    const canvas = document.getElementById("mycanvas");
    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) {
      console.error("2D context not supported!");
      return;
    }
    this.setTextFont();
    this.setEvents();
  },

  setTextFont() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#FFFFFF";
  },

  setEvents() {
    window.addEventListener("keydown", e => {
      if (e.keyCode === KEYS.SPACE) {
        this.platform.fire();
      } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
        this.platform.start(e.keyCode);
      }
    });

    window.addEventListener("keyup", () => {
      this.platform.stop();
    });
  },

  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length + Object.keys(this.sounds).length;

    const onResourceLoad = () => {
      loaded++;
      if (loaded >= required) {
        callback();
      }
    };

    this.preloadSprites(onResourceLoad);
    this.preloadAudio(onResourceLoad);
  },

  preloadSprites(onResourceLoad) {
    Object.keys(this.sprites).forEach(key => {
      this.sprites[key] = new Image();
      this.sprites[key].src = SPRITE_PATH + key + ".png";
      this.sprites[key].addEventListener("load", () => {
        console.log(key + " image loaded");
        onResourceLoad();
      });
      this.sprites[key].addEventListener("error", () => {
        console.error("Failed to load image: " + this.sprites[key].src);
      });
    });
  },

  preloadAudio(onResourceLoad) {
    Object.keys(this.sounds).forEach(key => {
      this.sounds[key] = new Audio(SOUND_PATH + key + ".mp3");
      this.sounds[key].addEventListener("canplaythrough", onResourceLoad, { once: true });
      this.sounds[key].addEventListener("error", () => {
        console.error("Failed to load audio: " + this.sounds[key].src);
      });
    });
  },

  create() {
    this.blocks = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          active: true,
          width: 60,
          height: 20,
          x: 64 * col + 65,
          y: 24 * row + 35
        });
      }
    }
  },

  update() {
    this.collideBlocks();
    this.collidePlatform();
    this.ball.collideWorldBounds();
    this.platform.collideWorldBounds();
    this.platform.move();
    this.ball.move();
    this.addScore();
  },

  addScore() {
    this.score++;
    if (this.score >= this.blocks.length) {
      this.end("Вы победили");
    }
  },

  collideBlocks() {
    this.blocks.forEach(block => {
      if (block.active && this.ball.collide(block)) {
        this.ball.bumpBlock(block);
        this.addScore();
        if (this.sounds.bump) this.sounds.bump.play();
      }
    });
  },

  collidePlatform() {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
      if (this.sounds.bump) this.sounds.bump.play();
    }
  },

  run() {
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.update();
        this.render();
        this.run();
      });
    }
  },

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.sprites.background) {
      this.ctx.drawImage(this.sprites.background, 0, 0);
    }
    if (this.sprites.ball) {
      this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    }
    if (this.sprites.platform) {
      this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    }
    this.renderBlocks();
    this.ctx.fillText("Score: " + this.score, 15, 20);
  },

  renderBlocks() {
    this.blocks.forEach(block => {
      if (block.active) {
        this.ctx.drawImage(this.sprites.block, block.x, block.y);
      }
    });
  },

  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  },

  end(message) {
    this.running = false;
    alert(message);
    window.location.reload();
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

// Ball logic
game.ball = {
  dx: 0,
  dy: 0,
  velocity: 3,
  x: 320,
  y: 280,
  width: 20,
  height: 20,
  frame: 0,

  start() {
    this.dy = -this.velocity;
    this.dx = game.random(-this.velocity, this.velocity);
    this.animate();
  },

  animate() {
    setInterval(() => {
      this.frame++;
      if (this.frame > 3) {
        this.frame = 0;
      }
    }, 100);
  },

  move() {
    this.y += this.dy;
    this.x += this.dx;
  },

  collide(element) {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    return x + this.width > element.x &&
           x < element.x + element.width &&
           y + this.height > element.y &&
           y < element.y + element.height;
  },

  collideWorldBounds() {
    let x = this.x + this.dx;
    let y = this.y + this.dy;

    let ballLeft = x;
    let ballRight = ballLeft + this.width;
    let ballTop = y;
    let ballBottom = ballTop + this.height;

    if (ballLeft < 0) {
      this.x = 0;
      this.dx = this.velocity;
    } else if (ballRight > GAME_WIDTH) {
      this.x = GAME_WIDTH - this.width;
      this.dx = -this.velocity;
    }

    if (ballTop < 0) {
      this.y = 0;
      this.dy = this.velocity;
    } else if (ballBottom > GAME_HEIGHT) {
      game.end("Вы проиграли");
    }
  },

  bumpBlock(block) {
    this.dy *= -1;
    block.active = false;
  },

  bumpPlatform(platform) {
    if (platform.dx) {
      this.x += platform.dx;
    }

    if (this.dy > 0) {
      this.dy = -this.velocity;
      let touchX = this.x + this.width / 2;
      this.dx = this.velocity * platform.getTouchOffset(touchX);
    }
  }
};

// Platform logic
game.platform = {
  velocity: 6,
  dx: 0,
  x: 280,
  y: 300,
  width: 100,
  height: 14,
  ball: game.ball,

  fire() {
    if (this.ball) {
      this.ball.start();
      this.ball = null;
    }
  },

  start(direction) {
    if (direction === KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (direction === KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },

  stop() {
    this.dx = 0;
  },

  move() {
    if (this.dx) {
      this.x += this.dx;
      if (this.ball) {
        this.ball.x += this.dx;
      }
    }
  },

  getTouchOffset(x) {
    let diff = (this.x + this.width) - x;
    let offset = this.width - diff;
    return (2 * offset / this.width) - 1;
  },

  collideWorldBounds() {
    let platformLeft = this.x + this.dx;
    let platformRight = platformLeft + this.width;

    if (platformLeft < 0 || platformRight > GAME_WIDTH) {
      this.dx = 0;
    }
  }
};

// Start the game when the window loads
window.addEventListener("load", () => {
  game.start();
});
