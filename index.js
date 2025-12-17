const { app, BrowserWindow, globalShortcut, screen, Tray, Menu } = require('electron');
const path = require('path');
const { slideDownAndShow, slideUpAndHide, closeAnimation, closeAnimation2 } = require('./animation');
const { createTray } = require('./tray');

const os = require('os');

app.setPath('userData', path.join(os.homedir(), 'GPT_WRAPPER_user_data'));

let mainWindow;
let startY;
let endY;

// old
// const DEFAULT_WIDTH = 1200;
// const DEFAULT_HEIGHT = 800;

const width_ratio=0.6;
const height_ratio=0.7;
const rest_height_ratio= 1-height_ratio;
let DEFAULT_WIDTH;
let DEFAULT_HEIGHT;



function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    endY = Math.round((height - DEFAULT_HEIGHT) / 2);
    startY = endY - DEFAULT_HEIGHT*1+rest_height_ratio;                         // position de départ (100px au-dessus)

    mainWindow = new BrowserWindow({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        x: Math.round((primaryDisplay.workAreaSize.width - DEFAULT_WIDTH) / 2),
        y: startY,
        opacity: 1,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'pp.png'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        }

    });

    mainWindow.loadURL('https://chat.openai.com');
    mainWindow.on('close', (e) => {
        e.preventDefault();
        closeAnimation(mainWindow);


    })
    mainWindow.on('blur', () => {
        slideUpAndHide(mainWindow, startY);

    });

    createTray();

    //createTray(mainWindow, quittingState)

}
app.whenReady().then(() => {
    const { screen } = require('electron');

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    DEFAULT_WIDTH = Math.floor(width * width_ratio);
    DEFAULT_HEIGHT = Math.floor(height * height_ratio);

    createWindow();
    slideDownAndShow(mainWindow, startY, endY);
    globalShortcut.register('Ctrl+Space', () => {
        if (mainWindow.isVisible()) {

            slideUpAndHide(mainWindow, startY);
        } else {
            slideDownAndShow(mainWindow, startY, endY);
        }
    });

});
