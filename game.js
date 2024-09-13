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

  // Initialize the game and set up events
  init: function() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.setEvents();
  },

  // Set event listeners for platform movement
  setEvents: function() {
    window.addEventListener("keydown", e => {
      if (e.keyCode === 37) {
        this.platform.dx = -this.platform.velocity; // Move left
      } else if (e.keyCode === 39) {
        this.platform.dx = this.platform.velocity; // Move right
      }
    });

    window.addEventListener("keyup", e => {
      this.platform.dx = 0; // Stop movement when key is released
    });
  },

  // Preload images
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

  // Create the blocks
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

  // Update the platform's position
  update: function() {
    this.platform.move();
  },

  // Run the game loop
  run: function() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
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
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);

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

// Platform object with movement logic
game.platform = {
  x: 280,
  y: 300,
  width: 100,
  height: 20,
  velocity: 6,
  dx: 0,

  // Move the platform based on dx
  move: function() {
    this.x += this.dx;
    if (this.x < 0) this.x = 0; // Prevent going out of bounds (left)
    if (this.x + this.width > game.ctx.canvas.width) this.x = game.ctx.canvas.width - this.width; // Prevent going out of bounds (right)
  }
};

// Ball object
game.ball = {
  x: 320,
  y: 280,
  width: 20,
  height: 20
};

window.addEventListener("load", () => {
  game.start();
});
