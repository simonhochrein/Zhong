const { app, BrowserWindow, Tray } = require("electron");
require("@electron/remote/main").initialize();

/**
 * @type BrowserWindow
 */
let window;
let tray;
let visible = false;

app.on("ready", () => {
  app.dock.hide();
  window = new BrowserWindow({
    width: 300,
    height: 500,
    frame: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    resizable: false
  });

  window.on("hide", () => {
    visible = false;
  });

  window.loadURL(`file://${__dirname}/dist/index.html`);

  tray = new Tray(`${__dirname}/img/ZhongTemplate.png`);
  tray.setIgnoreDoubleClickEvents(true);

  tray.on("click", () => {
    if (!visible) {
      const { height, width, x, y } = tray.getBounds();
      window.setPosition(
        x + width / 2 - window.getBounds().width / 2,
        y + height
      );
      window.show();
      visible = true;
    } else {
      window.hide();
    }
  });
});
