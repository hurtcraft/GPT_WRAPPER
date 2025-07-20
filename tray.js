const { Tray, Menu, app } = require('electron');
const path = require('path');

let tray = null;

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'pp.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quitter',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('GPT_WRAPPER');
  tray.setContextMenu(contextMenu);
}

module.exports = { createTray };
