const { app, BrowserWindow } = require("electron");
require('@electron/remote/main').initialize();

app.on('ready', () => {
    const window = new BrowserWindow({
        width: 300,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    window.loadURL(`file://${__dirname}/dist/index.html`);
})