const { app } = require("electron");

const step = 25;
function slideDownAndShow(mainWindow, startY, endY) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    setTimeout(() => {
      slideDownAndShow(mainWindow, startY, endY);
    }, 100);
    return;
  }
  let y = startY;
  mainWindow.setBounds({ x: mainWindow.getBounds().x, y });
  mainWindow.show();
  mainWindow.focus();

  const interval = setInterval(() => {
    if (y >= endY) {
      for (let i = 0; i < 100; i++) {
        y += 2;
        mainWindow.setBounds({ y: y });
      }
      for (let i = 0; i < 100; i++) {
        y -= 2;
       mainWindow.setBounds({ y: y });
      }
      clearInterval(interval);
    } else {
      y += step;
      mainWindow.setBounds({ y: y });
    }
  }, 1);
}

function slideUpAndHide(mainWindow, startY) {

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    setTimeout(() => {
      slideUpAndHide(mainWindow, startY);
    }, 100);
    return;
  }

  let y = mainWindow.getBounds().y;

  const interval = setInterval(() => {
    if (y <= startY) {
      clearInterval(interval);
      mainWindow.hide();
    } else {
      y -= step;
      mainWindow.setBounds({ y: y });
    }
  }, 1);
}

function closeAnimation(mainWindow) {
  const initialBounds = mainWindow.getBounds();
  let width = initialBounds.width;
  let height = initialBounds.height;
  let opacity = 1;

  const centerX = initialBounds.x + width / 2;
  const centerY = initialBounds.y + height / 2;

  const interval = setInterval(() => {
    width = width * 0.9;
    height = height * 0.9;
    opacity = Math.max(0, opacity - 0.05);

    const newX = centerX - width / 2;
    const newY = centerY - height / 2;

    mainWindow.setBounds({
      x: newX,
      y: newY,
      width: width,
      height: height
    });

    mainWindow.setOpacity(opacity);

    if (width <= 10 || height <= 10 || opacity <= 0) {
      clearInterval(interval);
      mainWindow.destroy();
    }
  }, 2);
}

function closeAnimation2(mainWindow) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    setTimeout(() => {
      closeAnimation2(mainWindow);
    }, 100);
    return;
  }
  let y = mainWindow.getBounds().y;
  mainWindow.setBounds({ x: mainWindow.getBounds().x, y });
  mainWindow.show();
  mainWindow.focus();

  const interval = setInterval(() => {
    if (y >= 1500) {
      mainWindow.destroy();
      clearInterval(interval);
    } else {
      y += step;
      mainWindow.setBounds({ y:y });
    }
  }, 1);
}
module.exports = { slideDownAndShow, slideUpAndHide, closeAnimation,closeAnimation2 };
