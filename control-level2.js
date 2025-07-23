// control-level2.js

leftPressed = false;
rightPressed = false;
jumpPressed = false;

function createTouchControls(scene) {
  const screenWidth = scene.scale.width;
  const screenHeight = scene.scale.height;

  const leftBtn = scene.add
    .image(80, screenHeight - 80, "leftArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.15)
    .setAlpha(0.85);

  const rightBtn = scene.add
    .image(180, screenHeight - 80, "rightArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.15)
    .setAlpha(0.85);

  const jumpBtn = scene.add
    .image(screenWidth - 80, screenHeight - 80, "jumpArrow")
    .setInteractive({ useHandCursor: false })
    .setScrollFactor(0)
    .setScale(0.25)
    .setAlpha(0.85);

  // Show buttons only on mobile
  if (!scene.sys.game.device.os.android && !scene.sys.game.device.os.iOS) {
    leftBtn.setVisible(false);
    rightBtn.setVisible(false);
    jumpBtn.setVisible(false);
  }

  // Touch logic
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

function getTouchInput() {
  return { leftPressed, rightPressed, jumpPressed };
}

window.createTouchControls = createTouchControls;
window.getTouchInput = getTouchInput;
