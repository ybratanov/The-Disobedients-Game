let player, cursors, scoreText, finishText, startButton;
let selectedAvatarKey = "georgi"; // ← по подразбиране

let fruits;
let platforms;
let score = 0;
let gameStarted = false;
let restartButton;
let nextLevelButton;
let sceneRef; // ще пазим текущата сцена
// за тъчсктин екарн
let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 800 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  this.load.image("background", "assets/background.png");
  this.load.image("georgi", "assets/georgi.png");
  this.load.image("shelf", "assets/shelf.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("apple", "assets/apple.png");
  this.load.image("banana", "assets/banana.png");
  this.load.image("grape", "assets/grape.png");
  this.load.image("leftArrow", "assets/leftArrow.png");
  this.load.image("rightArrow", "assets/rightArrow.png");
  this.load.image("jumpArrow", "assets/jumpArrow.png");
  this.load.image("georgi", "assets/georgi.png");
  this.load.image("krisi", "assets/krisi.png");
  this.load.image("eli", "assets/eli.png");
}

function create() {
  this.add.image(400, 300, "background").setScale(1);

  sceneRef = this;
  gameStarted = true;

  // Екран за избор на герой
  const avatarOptions = ["georgi", "krisi", "eli"];
  let xStart = 200;

  avatarOptions.forEach((key, i) => {
    let avatar = this.add
      .image(xStart + i * 200, 200, key)
      .setInteractive()
      .setScale(0.2)
      .setAlpha(0.6)
      .setName(key);

    avatar.on("pointerdown", () => {
      selectedAvatarKey = key;

      // визуална обратна връзка
      avatarOptions.forEach((k) => {
        const a = this.children.getByName(k);
        if (a) a.setAlpha(0.6);
      });

      avatar.setAlpha(1);
      startButton.setVisible(true);
    });
  });

  // Start Button
  startButton = this.add
  .text(400, 400, "START", {
    fontSize: "48px",
    fill: "#00ff00",
    backgroundColor: "#000",
    padding: { x: 20, y: 10 },
  })
  .setOrigin(0.5)
  .setInteractive()
  .setVisible(false);

  startButton.on("pointerdown", () => {
    // Скриваме избора на аватари
    avatarOptions.forEach((key) => {
      const a = sceneRef.children.getByName(key);
      if (a) a.destroy();
    });
  
    startButton.setVisible(false);
    startGame.call(sceneRef);
  });
  

}

function startGame() {
  this.physics.resume(); // Възстановява физиката!
  sceneRef = this;
  gameStarted = true;
  score = 0;

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 580, "ground").setScale(1).refreshBody();

  platforms.create(390, 450, "shelf").setScale(0.1).refreshBody();
  platforms.create(170, 330, "shelf").setScale(0.1).refreshBody();
  platforms.create(600, 320, "shelf").setScale(0.09).refreshBody();
  platforms.create(700, 200, "shelf").setScale(0.1).refreshBody();
  platforms.create(400, 170, "shelf").setScale(0.1).refreshBody();

  player = this.physics.add.sprite(100, 500, selectedAvatarKey).setScale(0.1);

  player.setCollideWorldBounds(true);
  player.body.setSize(player.width * 0.6, player.height * 0.7, true);

  this.physics.add.collider(player, platforms);

  fruits = this.physics.add.group();
  spawnFruits(this);

  this.physics.add.collider(fruits, platforms);
  this.physics.add.overlap(player, fruits, collectFruit, null, this);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    fill: "#fff",
  });
  finishText = this.add
    .text(400, 300, "", { fontSize: "28px", fill: "#00ff00" })
    .setOrigin(0.5);

  cursors = this.input.keyboard.createCursorKeys();

  // Мобилни бутони
  let screenWidth = sceneRef.scale.width;
  let screenHeight = sceneRef.scale.height;

  // Лява стрелка
  let leftBtn = sceneRef.add
    .image(80, screenHeight - 80, "leftArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.1)
    .setAlpha(0.6);

  // Дясна стрелка
  let rightBtn = sceneRef.add
    .image(180, screenHeight - 80, "rightArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.1)
    .setAlpha(0.6);

  // Скок
  let jumpBtn = sceneRef.add
    .image(screenWidth - 80, screenHeight - 80, "jumpArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.2)
    .setAlpha(0.6);

  if (!this.sys.game.device.os.android && !this.sys.game.device.os.iOS) {
    leftBtn.setVisible(false);
    rightBtn.setVisible(false);
    jumpBtn.setVisible(false);
  }
  // Управление чрез мобилни бутони
  leftBtn.on("pointerdown", () => (leftPressed = true));
  leftBtn.on("pointerup", () => (leftPressed = false));
  leftBtn.on("pointerout", () => (leftPressed = false));

  rightBtn.on("pointerdown", () => (rightPressed = true));
  rightBtn.on("pointerup", () => (rightPressed = false));
  rightBtn.on("pointerout", () => (rightPressed = false));

  jumpBtn.on("pointerdown", () => (jumpPressed = true));
  jumpBtn.on("pointerup", () => (jumpPressed = false));
  jumpBtn.on("pointerout", () => (jumpPressed = false));
}

function spawnFruits(scene) {
  fruits.clear(true, true);

  const fruitTypes = [
    "apple",
    "banana",
    "grape",
    "apple",
    "banana",
    "grape",
    "banana",
    "grape",
  ];
  let i = 0;

  platforms.children.iterate((platform) => {
    if (platform.texture.key === "shelf" && i < fruitTypes.length) {
      const fruitX = platform.x;
      const fruitY = platform.y - platform.displayHeight / 2 - 20; // 20 px offset нагоре
      addFruit(scene, fruitX, fruitY, fruitTypes[i]);
      i++;
    }
  });
}

function addFruit(scene, x, y, type) {
  const fruit = scene.physics.add.sprite(x, y, type).setScale(0.6);
  fruit.setBounce(0);
  fruit.setCollideWorldBounds(true);
  fruit.body.allowGravity = true; // Включи гравитация
  fruit.setGravityY(300); // Лека гравитация за да падне и застане на рафта
  fruits.add(fruit);
}

function collectFruit(player, fruit) {
  fruit.disableBody(true, true);
  score += 20;
  scoreText.setText("Score: " + score);

  if (score >= 100) {
    finishLevel(player.scene);
  }
}

function finishLevel(scene) {
  scene.physics.pause();
  player.setTint(0x00ff00);
  finishText.setText("Ниво Завършено!").setDepth(1);

  // Рестарт бутон
  restartButton = scene.add
    .text(400, 350, "Рестарт", {
      fontSize: "32px",
      fill: "#fff",
      backgroundColor: "#ff0000",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(1);

  restartButton.on("pointerdown", () => {
    cleanupScene(scene);
    startGame.call(scene);
  });

  // Следващо ниво бутон (засега рестартира същото)
  nextLevelButton = scene.add
    .text(400, 420, "Следващо ниво", {
      fontSize: "32px",
      fill: "#fff",
      backgroundColor: "#008000",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(1);

  nextLevelButton.on("pointerdown", () => {
    // Скриваме бутоните
    restartButton.setVisible(false);
    nextLevelButton.setVisible(false);

    // Показваме съобщение
    const waitText = scene.add
      .text(
        400,
        300,
        "Моля за малко търпение...\nСледващите нива са в процес на изработка 😊",
        {
          fontSize: "24px",
          fill: "#00ff00",
          backgroundColor: "#000000",
          padding: { x: 20, y: 10 },
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setDepth(1);

    // След 6 секунди: трие се съобщението, появява се само Рестарт
    scene.time.delayedCall(6000, () => {
      waitText.destroy();
      restartButton.setVisible(true);
    });
  });
}

function update() {
  if (!gameStarted) return;

  if (!gameStarted || !player || !cursors) return;

  let moveX = 0;

  // Клавиатура (наляво / надясно)
  if (cursors.left.isDown) moveX = -200;
  else if (cursors.right.isDown) moveX = 200;

  // Тъч бутони (наляво / надясно)
  if (leftPressed) moveX = -200;
  if (rightPressed) moveX = 200;

  player.setVelocityX(moveX);

  // Скок – клавиатура или тъч
  if (
    (cursors.up.isDown || cursors.space.isDown || jumpPressed) &&
    player.body.blocked.down
  ) {
    player.setVelocityY(-550);
  }

  // Скок за мобилен бутон
  if (jumpPressed && player.body.blocked.down) {
    player.setVelocityY(-550);
  }

  if (!gameStarted || !player || !cursors) return;
}

function cleanupScene(scene) {
  if (restartButton) restartButton.destroy();
  if (nextLevelButton) nextLevelButton.destroy();
  if (finishText) finishText.setText("");
  if (scoreText) scoreText.destroy();

  if (player) {
    player.clearTint();
    player.destroy();
  }

  if (fruits) fruits.clear(true, true);
  if (platforms) platforms.clear(true, true);

  // Добавяме и reset на контроли и логика
  cursors = null;
  gameStarted = false;
}
