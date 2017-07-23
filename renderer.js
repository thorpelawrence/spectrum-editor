const { ipcRenderer, remote } = require('electron')
const { Menu, MenuItem, dialog } = remote
const loader = require('monaco-loader')
const fs = require('fs')
const win = remote.getCurrentWindow()

const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'Open',
            accelerator: 'CommandOrControl+O',
            click() {
                let path = dialog.showOpenDialog(win) || []
                path = path.length === 1 ? path[0] : null
                win.webContents.send('open-file', path)
            }
        },
        {
            label: 'Save', accelerator: 'CommandOrControl+S',
            click() { win.webContents.send('save-file') }
        },
        {
            label: 'Save As...', accelerator: 'CommandOrControl+Shift+S',
            click() { win.webContents.send('save-file', true) }
        }
    ]
}))
menu.append(new MenuItem({
    label: 'Settings', accelerator: 'CommandOrControl+,',
    click() { ipcRenderer.send('open-settings') }
}))
menu.append(new MenuItem({
    label: 'About',
    click() {
        dialog.showMessageBox(win, {
            icon: `${__dirname}/resources/icon.png`,
            title: "About " + win.getTitle(),
            message: "Spectrum Editor\
            \nCreated with Electron and NodeJS\
            \nBased on Monaco code editor\
            \n\nLawrence Thorpe"
        })
    }
}))
menu.append(new MenuItem({ role: 'quit', accelerator: 'CommandOrControl+Q' }))
Menu.setApplicationMenu(menu)

document.getElementById('titlebar-menu-button').addEventListener('click', (e) => {
    e.preventDefault()
    menu.popup()
}, false)

ipcRenderer.on('settings-changed', () => {
    require('./settings').load()
})

loader().then((monaco) => {
    monaco.editor.defineTheme('zx-spectrum', {
        base: 'vs',
        inherit: false,
        rules: [{ background: 'D7D7D7' }],
        colors: {
            'editor.background': '#D7D7D7',
            'editor.foreground': '#000000',
            'editorLineNumber.foreground': '#000000',
            'editorCursor.foreground': '#0000D7',
            'editor.lineHighlightBorder': '#00000000'
        }
    })
    let editor = monaco.editor.create(document.getElementById("container"), {
        value: 'PRINT "HELLO"\nGOTO 10',
        fontFamily: "ZX Spectrum",
        theme: "zx-spectrum",
        cursorStyle: 'block',
        cursorBlinking: 'solid',
        roundedSelection: false,
        lineNumbers: (n) => 10 * n,
        minimap: { enabled: false },
        wordWrap: true,
        scrollbar: { vertical: 'hidden' },
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false
    })

    ipcRenderer.on('open-file', (e, path) => {
        if (path) {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) console.error(err)
                if (monaco.editor.getModel(path)) {
                    editor.setModel(monaco.editor.getModel(path))
                }
                else {
                    editor.setModel(monaco.editor.createModel(data, null, path))
                }
            })
        }
    })

    ipcRenderer.on('save-file', (e, saveAs) => {
        let path = editor.getModel().uri
        if (saveAs || typeof path !== "string") {
            path = dialog.showSaveDialog(win, {
                defaultPath: typeof path === "string" ? path : null
            })
        }
        if (path) {
            fs.writeFile(path, editor.getValue(), (err) => {
                if (err) console.error(err)
            })
        }
    })

    document.getElementById('container').classList.add('turn-on')
    setTimeout(() => {
        document.getElementById('container').classList.remove('turn-on')
    }, 4000)

    ipcRenderer.on('restore', () => {
        document.getElementById('container').classList.remove('turn-off')
        document.getElementById('container').classList.add('turn-on')
        setTimeout(() => {
            document.getElementById('container').classList.remove('turn-on')
        }, 4000)
    })

    window.addEventListener('resize', () => {
        editor.layout()
    })

    document.getElementById('titlebar-close-button').addEventListener('click', () => {
        document.getElementById('container').classList.remove('turn-on')
        document.getElementById('container').classList.add('turn-off')
        if (JSON.parse(document.getElementById('container').getAttribute('crt-animations'))) {
            setTimeout(() => {
                win.close()
            }, 550)
        }
        else {
            win.close()
        }
    })

    document.getElementById('titlebar-minimize-button').addEventListener('click', () => {
        document.getElementById('container').classList.remove('turn-on')
        document.getElementById('container').classList.add('turn-off')
        if (JSON.parse(document.getElementById('container').getAttribute('crt-animations'))) {
            setTimeout(() => {
                win.minimize()
            }, 550)
        }
        else {
            win.minimize()
        }
    })

    document.getElementById('titlebar-maximize-button').addEventListener('click', () => {
        win.isMaximized() ? win.unmaximize() : win.maximize()
    })
})
