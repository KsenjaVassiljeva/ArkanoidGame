let game = {
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  rows: 4,
  cols: 8,

  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null
  },

  // Initialize canvas context
  init: function() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
  },

  // Preload all sprites and invoke callback when all are loaded
  preload: function(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    const onImageLoad = () => {
      loaded++;
      if (loaded >= required) {
        callback();
      }
    };

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = "img/" + key + ".png";
      this.sprites[key].addEventListener("load", onImageLoad);
    }
  },

  // Create blocks based on the number of rows and columns
  create: function() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 64 * col + 65,
          y: 24 * row + 35
        });
      }
    }
  },

  // Main game loop runner
  run: function() {
    window.requestAnimationFrame(() => {
      this.render();
    });
  },

  // Render all game elements
  render: function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clear the canvas
    this.ctx.drawImage(this.sprites.background, 0, 0); // Draw the background

    // Draw the ball
    this.ctx.drawImage(
      this.sprites.ball,
      this.ball.x, this.ball.y,
      this.ball.width, this.ball.height
    );

    // Draw the platform
    this.ctx.drawImage(
      this.sprites.platform,
      this.platform.x, this.platform.y
    );

    // Render blocks
    this.renderBlocks();
  },

  // Render the blocks
  renderBlocks: function() {
    for (let block of this.blocks) {
      this.ctx.drawImage(this.sprites.block, block.x, block.y);
    }
  },

  // Start the game
  start: function() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  }
};

// Ball object
game.ball = {
  x: 320,
  y: 280,
  width: 20,
  height: 20
};

// Platform object
game.platform = {
  x: 280,
  y: 300
};

// Start the game when the window loads
window.addEventListener("load", () => {
  game.start();
});
