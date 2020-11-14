const { app, BrowserWindow, Tray, ipcMain, Menu } = require("electron");
const Positioner = require("electron-positioner");
require("@electron/remote/main").initialize();

/**
 * @type BrowserWindow
 */
let window;

/**
 * @type Tray
 */
let tray;

let visible = false;

/**
 * Based on code from https://github.com/maxogden/menubar/blob/master/src/util/getWindowPosition.ts
 * @param {Electron.BrowserWindow} _window
 * @param {Electron.Rectangle} _bounds
 */
const getPosition = (_window, _bounds) => {
  const positioner = new Positioner(_window);
  switch (process.platform) {
    case "darwin":
      return positioner.move("trayCenter", _bounds);
    case "linux":
      return positioner.move("topRight");
    default:
      return positioner.move("bottomRight");
  }
};

app.on("ready", () => {
  if (app.dock) {
    app.dock.hide();
  }
  window = new BrowserWindow({
    width: 300,
    height: 500,
    frame: false,
    show: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
    resizable: false,
  });

  window.on("hide", () => {
    visible = false;
  });

  window.loadURL(`file://${__dirname}/dist/index.html`);

  window.on("blur", () => {
    // window.hide();
  });

  tray = new Tray(`${__dirname}/img/ZhongTemplate.png`);
  tray.setIgnoreDoubleClickEvents(true);

  tray.on("click", () => {
    if (!visible) {
      getPosition(window, tray.getBounds());
      window.show();
      visible = true;
    } else {
      window.hide();
    }
  });
  tray.on("right-click", () => {
    tray.popUpContextMenu(
      Menu.buildFromTemplate([
        {
          label: "Quit",
          click() {
            app.quit();
          },
          accelerator: "CommandOrControl+Q"
        },
      ])
    );
  });

  ipcMain.on("alert", () => {
    const done = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      },
      resizable: false,
    });
    done.loadURL(`file://${__dirname}/dist/done.html`);
  });
});
