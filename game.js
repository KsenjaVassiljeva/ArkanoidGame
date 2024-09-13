let game = {
    ctx: null,
    background: null,
  
    start: function() {
      this.ctx = document.getElementById("mycanvas").getContext("2d");
      
      // Load the background image
      this.background = new Image();
      this.background.src = "img/background.png";
      
      // Ensure the image is drawn only after it's loaded
      this.background.onload = () => {
        window.requestAnimationFrame(() => {
          this.ctx.drawImage(this.background, 0, 0);
        });
      };
    }
  };
  
  // Start the game when the window loads
  window.addEventListener("load", () => {
    game.start();
  });
  