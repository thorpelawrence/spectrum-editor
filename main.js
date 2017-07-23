const { app, BrowserWindow, ipcMain } = require('electron')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

let win

function createWindow() {
    win = new BrowserWindow({
        title: 'Spectrum Editor',
        icon: `${__dirname}/resources/icon.png`,
        frame: false,
        width: 640,
        height: 480,
        minWidth: 400,
        minHeight: 200
    })

    win.loadURL(`file://${__dirname}/index.html`)

    win.on('closed', () => {
        win = null
    })

    win.webContents.on('will-navigate', (e, url) => {
        e.preventDefault()
        win.webContents.send('open-file', url.slice(7))
    })

    win.on('restore', () => {
        win.webContents.send('restore')
    })
}

log.info("App starting...")

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall()
})

app.on('ready', () => {
    createWindow()
    autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('open-settings', () => {
    new BrowserWindow({
        title: win.getTitle() + " Settings",
        parent: win,
        modal: true,
        frame: false,
        width: 400,
        height: 500,
        resizable: false
    }).loadURL(`file://${__dirname}/settings.html`)
})

ipcMain.on('settings-changed', () => {
    win.webContents.send('settings-changed')
})
