class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add.text(400, 200, "Game Over!", {
      fontSize: "48px",
      fill: "#ff0000",
    }).setOrigin(0.5);

    const restartText = this.add.text(400, 400, "Нова игра", {
      fontSize: "32px",
      fill: "#ffffff",
      backgroundColor: "#ff0000",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    restartText.on("pointerdown", () => {
      // ВАЖНО: рестартирай и избери отново Level1Scene!
      window.location.reload();

    });
  }
}

window.GameOverScene = GameOverScene;
