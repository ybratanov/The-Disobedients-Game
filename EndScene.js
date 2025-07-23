class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000");

    this.add
      .text(400, 200, "Браво!", {
        fontSize: "40px",
        fill: "#00ff00",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 260, "Успешно мина всички нива!", {
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        400,
        300,
        "Моля да ни извините – следващото ниво е в процес на разработка.",
        {
          fontSize: "18px",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 600 },
        }
      )
      .setOrigin(0.5);

    // Този бутон трябва да стартира първото ниво
    const restartButton = this.add
      .text(400, 400, "ИГРАЙ ОТНОВО", {
        fontSize: "28px",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);

    // Явно някъде се губи интерактивността, затова я активираме по-сигурно
    restartButton.setInteractive({ useHandCursor: true });

    // Добавяме hover ефект (по избор)
    restartButton.on("pointerover", () => {
      restartButton.setStyle({ fill: "#ffff00" });
    });
    restartButton.on("pointerout", () => {
      restartButton.setStyle({ fill: "#ffffff" });
    });

    // Клик – рестарт на играта
    restartButton.on("pointerdown", () => {
      console.log("➡ Рестартираме играта...");
      this.scene.stop("EndScene");
      this.scene.stop("Level1Scene"); // ако все още е активна
      this.scene.stop("Level2Scene");
      this.scene.stop("GameOverScene");

      gameStarted = false; // нулираме глобалната логика
      score = 0;

      this.scene.start("Level1Scene");
    });
  }
}

window.EndScene = EndScene;
