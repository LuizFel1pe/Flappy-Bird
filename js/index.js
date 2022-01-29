import Screen from './screen.js';

const screen = new Screen();

let frames = 0;

function loop() {
  screen.draw();
  screen.update();

  frames += 1;

  requestAnimationFrame(loop);
}

screen.switchScreen('start');
loop();

window.addEventListener('keydown', () => {
  screen.click();
});

window.addEventListener('click', () => {
  screen.click();
});

export { frames };
