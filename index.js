const { app, BrowserWindow, globalShortcut, screen, Tray, Menu } = require('electron');
const path = require('path');
const { slideDownAndShow, slideUpAndHide, closeAnimation, closeAnimation2 } = require('./animation');
const { createTray } = require('./tray');
const fs = require("fs");

const os = require('os');

app.setPath('userData', path.join(os.homedir(), 'GPT_WRAPPER_user_data'));
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

let mainWindow;
let startY;
let endY;

// old
// const DEFAULT_WIDTH = 1200;
// const DEFAULT_HEIGHT = 800;

const width_ratio=0.7;
const height_ratio=0.75;
const rest_height_ratio= 1-height_ratio;
let DEFAULT_WIDTH;
let DEFAULT_HEIGHT;

let chat_gpt_url="https://chat.openai.com/";
let claud_url="https://claude.com/";
let deepseek_url="https://www.deepseek.com/";

let default_url=config.model;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    endY = Math.round((height - DEFAULT_HEIGHT) / 2);
    startY = endY - DEFAULT_HEIGHT*1+rest_height_ratio;                         

    mainWindow = new BrowserWindow({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        x: Math.round((primaryDisplay.workAreaSize.width - DEFAULT_WIDTH) / 2),
        y: startY,
        opacity: 1,
        show: false,
        //autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'pp.png'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        }

    });

    mainWindow.loadURL(default_url);
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

function loadModel(modelName, url) {
    default_url = url;

    if (mainWindow) {
        mainWindow.loadURL(default_url);
    }

    config.model = url;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
}

function createMenu() {
    const template = [
        {
            label: "Model",
            submenu: [
                {
                    label: "ChatGPT",
                    type: "radio",
                    checked: config.model === chat_gpt_url,
                    click() {
                        loadModel("chatgpt", chat_gpt_url);
                    }
                },
                {
                    label: "Claude",
                    type: "radio",
                    checked: config.model === claud_url,
                    click() {
                        loadModel("claude", claud_url);
                    }
                },
                {
                    label: "DeepSeek",
                    type: "radio",
                    checked: config.model === deepseek_url,
                    click() {
                        loadModel("deepseek", deepseek_url);
                    }
                },
                { type: "separator" },
                { role: "quit" }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
app.whenReady().then(() => {
    const { screen } = require('electron');

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    DEFAULT_WIDTH = Math.floor(width * width_ratio);
    DEFAULT_HEIGHT = Math.floor(height * height_ratio);

    createMenu();
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
