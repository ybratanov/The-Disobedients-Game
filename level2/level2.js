let player2, cursors2, scoreText2, timerText2, attemptText2;
let candies2, platforms2, dog, barkSound;
let timeLeft = 180;
let attemptsLeft = 3;
let timerEvent;
leftPressed = true; // без "let"
rightPressed = false;
jumpPressed = false;

class Level2Scene extends Phaser.Scene {
  constructor() {
    super("Level2Scene");
  }

  preload() {
    this.load.image("background2", "level2/background2.png");
    this.load.image("ground2", "level2/graund.png"); // filename confirmed
    this.load.image("obect1", "level2/obect1.png");
    this.load.image("obect2", "level2/obect2.png");
    this.load.image("obect3", "level2/obect3.png");
    this.load.image("obect4", "level2/obect4.png");
    this.load.image("dog", "level2/angry-dog.png");
    this.load.image("candy", "level2/candy.png");
    this.load.image("lollipop", "level2/lollipop.png");
    this.load.image("waffle", "level2/waffle.png");
    this.load.audio("bark", "level2/sounds/dog_bark.mp3");
    this.load.image("georgi", "assets/georgi.png");
    this.load.image("krisi", "assets/krisi.png");
    this.load.image("eli", "assets/eli.png");
    this.load.image("leftArrow", "assets/leftArrow.png");
    this.load.image("rightArrow", "assets/rightArrow.png");
    this.load.image("jumpArrow", "assets/jumpArrow.png");
  }

  create() {
    // Мобилни бутони
    let screenWidth = this.scale.width;
    let screenHeight = this.scale.height;

    // Лява стрелка
    let leftBtn = this.add
      .image(80, screenHeight - 80, "leftArrow")
      .setInteractive()
      .setScrollFactor(0)
      .setScale(0.15)
      .setAlpha(0.85)
      .setDepth(999); // най-отгоре

    let rightBtn = this.add
      .image(180, screenHeight - 80, "rightArrow")
      .setInteractive()
      .setScrollFactor(0)
      .setScale(0.15)
      .setAlpha(0.85)
      .setDepth(999); // най-отгоре

    let jumpBtn = this.add
      .image(screenWidth - 80, screenHeight - 80, "jumpArrow")
      .setInteractive()
      .setScrollFactor(0)
      .setScale(0.25)
      .setAlpha(0.85)
      .setDepth(999); // най-отгоре

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

    timeLeft = 180;
    this.add.image(400, 300, "background2").setDisplaySize(800, 600);

    platforms2 = this.physics.add.staticGroup();
    platforms2.create(400, 630, "ground2").refreshBody();
    platforms2.create(250, 450, "obect1").refreshBody(); // пясък
    platforms2.create(600, 420, "obect2").refreshBody(); //
    platforms2.create(300, 300, "obect3").refreshBody(); //1
    platforms2.create(500, 250, "obect4").refreshBody();

    player2 = this.physics.add
      .sprite(100, 500, selectedAvatarKey)
      .setScale(0.1);
    player2.setCollideWorldBounds(true);
    player2.body.setSize(player2.width * 0.6, player2.height * 0.7, true);
    this.physics.add.collider(player2, platforms2);

    candies2 = this.physics.add.group();
    this.spawnCandies();

    this.physics.add.collider(candies2, platforms2);
    this.physics.add.overlap(player2, candies2, this.collectCandy, null, this);

    dog = this.physics.add.sprite(700, 520, "dog").setScale(0.07);
    dog.setVelocityX(-120);
    dog.setBounce(1);
    dog.setCollideWorldBounds(true);
    this.physics.add.collider(dog, platforms2);
    this.physics.add.overlap(player2, dog, this.hitByDog, null, this);

    barkSound = this.sound.add("bark");
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (dog && barkSound) barkSound.play();
      },
      loop: true,
    });

    cursors2 = this.input.keyboard.createCursorKeys();

    scoreText2 = this.add.text(16, 16, "Candy: 0", {
      fontSize: "20px",
      fill: "#fff",
    });

    timerText2 = this.add.text(650, 16, "Time: 180", {
      fontSize: "20px",
      fill: "#fff",
    });

    attemptText2 = this.add.text(650, 40, `Lives: ${attemptsLeft}`, {
      fontSize: "20px",
      fill: "#fff",
    });

    timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.candyCollected = 0;
  }

  update() {
    let moveX = 0;
    if (cursors2.left.isDown || leftPressed) moveX = -200;
    else if (cursors2.right.isDown || rightPressed) moveX = 200;

    player2.setVelocityX(moveX);

    if (
      (cursors2.up.isDown || cursors2.space.isDown || jumpPressed) &&
      player2.body.blocked.down
    ) {
      player2.setVelocityY(-550);
    }
  }

  updateTimer() {
    timeLeft--;
    timerText2.setText("Time: " + timeLeft);

    if (timeLeft <= 0) {
      this.failLevel();
    }
  }

  failLevel() {
    attemptsLeft--;
    attemptText2.setText(`Lives: ${attemptsLeft}`);
    if (attemptsLeft <= 0) {
      this.scene.start("GameOverScene");
    } else {
      timeLeft = 180;
      this.scene.restart();
    }
  }

  hitByDog() {
    this.sound.play("bark");
    this.failLevel();
  }

  collectCandy(player, candy) {
    candy.disableBody(true, true);
    this.candyCollected++;
    scoreText2.setText(`Candy: ${this.candyCollected}`);
    if (this.candyCollected >= 6) {
      this.scene.start("EndScene");
    }
  }

  spawnCandies() {
    const fixedPositions = [
      { x: 180, y: 400 }, // близалка в ляво
      { x: 660, y: 370 }, // близалка на земята
      { x: 210, y: 250 },
      { x: 490, y: 200 }, // вафла в ляво
    ];
    const randomGroundPositions = [
      { x: Phaser.Math.Between(50, 750), y: 100 },
      { x: Phaser.Math.Between(50, 750), y: 120 },
    ];
    const types = [
      "candy",
      "lollipop",
      "waffle",
      "candy",
      "lollipop",
      "waffle",
    ];
    const allPositions = [...fixedPositions, ...randomGroundPositions];

    for (let i = 0; i < allPositions.length; i++) {
      const pos = allPositions[i];
      const candy = this.physics.add
        .sprite(pos.x, pos.y, types[i])
        .setScale(0.4);
      candy.setBounce(0.2);
      candy.setGravityY(300);
      candy.setCollideWorldBounds(true);
      candies2.add(candy);
    }
  }
}

window.Level2Scene = Level2Scene;
