module.exports.edit = function () {
    const { ipcRenderer } = require('electron')

    document.getElementById('crt-flicker').checked = JSON.parse(localStorage.getItem('crt-flicker') || true)
    document.getElementById('crt-flicker').addEventListener('change', function () {
        localStorage.setItem('crt-flicker', this.checked)
        ipcRenderer.send('settings-changed')
    })
    document.getElementById('crt-grid').checked = JSON.parse(localStorage.getItem('crt-flicker') || true)
    document.getElementById('crt-grid').addEventListener('change', function () {
        localStorage.setItem('crt-grid', this.checked)
        ipcRenderer.send('settings-changed')
    })
    document.getElementById('crt-animations').checked = JSON.parse(localStorage.getItem('crt-animations') || true)
    document.getElementById('crt-animations').addEventListener('change', function () {
        localStorage.setItem('crt-animations', this.checked)
        ipcRenderer.send('settings-changed')
    })
    document.getElementById('blur').value = localStorage.getItem('blur') || 0.6
    document.getElementById('blur').addEventListener('input', function () {
        localStorage.setItem('blur', this.value)
        ipcRenderer.send('settings-changed')
    })
    document.getElementById('frame-height').value = localStorage.getItem('frame-height') || 60
    document.getElementById('frame-height').addEventListener('input', function () {
        localStorage.setItem('frame-height', this.value)
        ipcRenderer.send('settings-changed')
    })
    document.getElementById('frame-width').value = localStorage.getItem('frame-width') || 3
    document.getElementById('frame-width').addEventListener('input', function () {
        localStorage.setItem('frame-width', this.value)
        ipcRenderer.send('settings-changed')
    })
}

module.exports.load = function () {
    document.getElementById('container').setAttribute('crt-flicker', localStorage.getItem('crt-flicker') || true)
    document.getElementById('container').setAttribute('crt-grid', localStorage.getItem('crt-grid') || true)
    document.getElementById('container').setAttribute('crt-animations', localStorage.getItem('crt-animations') || true)
    if (localStorage.getItem('blur')) {
        document.documentElement.style.setProperty('--blur', localStorage.getItem('blur') + 'px')
    }
    if (localStorage.getItem('frame-height')) {
        document.documentElement.style.setProperty('--frame-height', localStorage.getItem('frame-height') + 'px')
        window.dispatchEvent(new Event('resize'))
    }
    if (localStorage.getItem('frame-width')) {
        document.documentElement.style.setProperty('--frame-width', localStorage.getItem('frame-width') + 'px')
        window.dispatchEvent(new Event('resize'))
    }
}
