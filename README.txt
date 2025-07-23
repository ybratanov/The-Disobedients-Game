📱 Add the following to your index.html body for mobile buttons:
<div id="mobile-controls">
  <button id="left-button">←</button>
  <button id="right-button">→</button>
  <button id="jump-button">↑</button>
</div>

🎮 Make sure to style them and hook them into your game via:
document.getElementById('left-button').addEventListener('touchstart', ...)