const { app, BrowserWindow, ipcMain } = require('electron')

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

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('active', () => {
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
