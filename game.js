let game = {
  ctx: null,
  sprites: {
    background: null,
    ball: null,
    platform: null
  },

  // Initialize canvas context
  init: function() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
  },

  // Preload images and invoke the callback when all are loaded
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

  // Render the game by drawing all the sprites
  render: function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clear the canvas first
    this.ctx.drawImage(this.sprites.background, 0, 0);  // Draw the background at (0, 0)
    this.ctx.drawImage(this.sprites.ball, 50, 50);      // Draw the ball at a specific position (50, 50)
    this.ctx.drawImage(this.sprites.platform, 100, 400); // Draw the platform at a specific position (100, 400)
  },

  // Start the game
  start: function() {
    this.init();
    this.preload(() => {
      this.run();
    });
  }
};

// Start the game when the window loads
window.addEventListener("load", () => {
  game.start();
});
