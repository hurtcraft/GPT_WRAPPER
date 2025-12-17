const FPS = 90;
const FRAME = 100 / FPS;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animate(win, from, to, duration, apply, done) {
  const start = Date.now();
  const delta = to - from;

  const timer = setInterval(() => {
    const t = Math.min((Date.now() - start) / duration, 1);
    apply(from + delta * easeOutCubic(t));

    if (t === 1) {
      clearInterval(timer);
      done?.();
    }
  }, FRAME);
}

function slideDownAndShow(mainWindow, startY, endY) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return setTimeout(() => slideDownAndShow(mainWindow, startY, endY), 100);
  }

  const { x } = mainWindow.getBounds();
  mainWindow.setBounds({ x, y: startY });
  mainWindow.show();
  mainWindow.focus();

  animate(
    mainWindow,
    startY,
    endY,
    250,
    y => mainWindow.setBounds({ y })
  );
}
function slideUpAndHide(mainWindow, startY) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return setTimeout(() => slideUpAndHide(mainWindow, startY), 100);
  }

  const { y } = mainWindow.getBounds();

  animate(
    mainWindow,
    y,
    startY,
    200,
    y => mainWindow.setBounds({ y }),
    () => mainWindow.hide()
  );
}

function closeAnimation(mainWindow) {
  const b = mainWindow.getBounds();
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;

  const start = Date.now();
  const duration = 250;

  const timer = setInterval(() => {
    const t = Math.min((Date.now() - start) / duration, 1);
    const k = 1 - easeOutCubic(t);

    const width = Math.max(1, b.width * k);
    const height = Math.max(1, b.height * k);

    mainWindow.setBounds({
      x: cx - width / 2,
      y: cy - height / 2,
      width,
      height
    });

    mainWindow.setOpacity(1 - t);

    if (t === 1) {
      clearInterval(timer);
      mainWindow.destroy();
    }
  }, FRAME);
}

function closeAnimation2(mainWindow) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return setTimeout(() => closeAnimation2(mainWindow), 100);
  }

  const { y } = mainWindow.getBounds();
  const targetY = y + 1000;

  animate(
    mainWindow,
    y,
    targetY,
    300,
    y => mainWindow.setBounds({ y }),
    () => mainWindow.destroy()
  );
}
module.exports = { slideDownAndShow, slideUpAndHide, closeAnimation,closeAnimation2 };