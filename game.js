let game = {
  ctx: null,
  platform: null,
  ball: null,
  sprites: {
    background: null,
    ball: null,
    platform: null
  },

  // Initialize the canvas context
  init: function() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
  },

  // Preload images and invoke callback when all are loaded
  preload: function(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = "img/" + key + ".png";
      this.sprites[key].addEventListener("load", () => {
        loaded++;
        if (loaded >= required) {
          callback();
        }
      });
    }
  },

  // Main game loop runner
  run: function() {
    window.requestAnimationFrame(() => {
      this.render();
    });
  },

  // Render all the sprites
  render: function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clear canvas
    this.ctx.drawImage(this.sprites.background, 0, 0); // Draw background

    // Draw the ball
    this.ctx.drawImage(
      this.sprites.ball,
      this.ball.x, this.ball.y, // Ball position
      this.ball.width, this.ball.height // Ball size
    );

    // Draw the platform
    this.ctx.drawImage(
      this.sprites.platform,
      this.platform.x, this.platform.y // Platform position
    );
  },

  // Start the game
  start: function() {
    this.init();
    this.preload(() => {
      this.run();
    });
  }
};

// Define the ball properties
game.ball = {
  x: 320,
  y: 280,
  width: 20,
  height: 20
};

// Define the platform properties
game.platform = {
  x: 280,
  y: 300
};

// Start the game when the window loads
window.addEventListener("load", () => {
  game.start();
});
