const { app, BrowserWindow, globalShortcut, screen, Tray, Menu } = require('electron');
const path = require('path');
const { slideDownAndShow, slideUpAndHide, closeAnimation,closeAnimation2 } = require('./animation');
const { createTray } = require('./tray');

const os = require('os');

app.setPath('userData', path.join(os.homedir(), 'GPT_WRAPPER_user_data'));

let mainWindow;
let startY;
let endY;

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;



function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    endY = Math.round(height / 2 - 400);        // position finale (centrée verticalement)
    startY = endY - DEFAULT_HEIGHT;                         // position de départ (100px au-dessus)

    mainWindow = new BrowserWindow({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        x: Math.round(width / 2 - 600),
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
