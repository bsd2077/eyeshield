const {app, BrowserWindow, ipcMain} = require('electron')
const path = require("path");
const {resolve} = require("node:path");
const {readFile, writeFile} = require("node:fs/promises");

try {
    require('electron-reloader')(module);
} catch {
}

const createWindow = async () => {

    let locale
    let language
    let apppath = app.getAppPath()

    /*    let apppath=resolve(app.getPath("exe"),'../resources')*/

    try {
        const filePath = resolve(apppath, './conf/i18n/locale.json');
        const locale = await readFile(filePath, {encoding: 'utf8'});
        language = JSON.parse(locale).language
        if (!["en", "zh"].includes(language)) {
            language = "en"
            try {

                let data = {language}
                await writeFile(filePath, JSON.stringify(data));

            } catch (err) {

                console.error(err.message);
            }
        }

    } catch (err) {
        let SystemLanguage = `en`

        let PreferredSystemLanguages = app.getPreferredSystemLanguages()
        if (PreferredSystemLanguages[0].toLowerCase().includes(`en`)) {
            SystemLanguage = `en`

        }
        if (PreferredSystemLanguages[0].toLowerCase().includes(`zh`)) {
            SystemLanguage = `zh`

        }

        try {
            const filePath = resolve(apppath, './conf/i18n/locale.json');
            let data = {language: SystemLanguage}

            await writeFile(filePath, JSON.stringify(data));
            language = SystemLanguage
        } catch (err) {

            console.error(err.message);
        }

    }

    try {
        const filePath = resolve(apppath, `./conf/i18n/${language}.json`);
        const lan = await readFile(filePath, {encoding: 'utf8'});
        locale = JSON.parse(lan)
    } catch (err) {

        console.error(err.message);
    }

    const win = new BrowserWindow({
        resizable: false,
        icon: resolve(apppath, './conf/icon.JPG'),
        minimizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        alwaysOnTop: true,
        show: false,
        width: 800,
        height: 600
    })

    let show_duration
    ipcMain.on("duration", (event, args) => {

        let specifyBrowserWindow = BrowserWindow.fromWebContents(event.sender)

        function show() {
            event.sender.send("update_tip")
            specifyBrowserWindow.show()
            specifyBrowserWindow.center()
        }

        clearInterval(show_duration)
        show_duration = setInterval(show, args * 1000 * 60)

    })

    ipcMain.on("enable_auto_boot", (event, args) => {
        app.setLoginItemSettings({openAtLogin: true})

    })
    ipcMain.on("disable_auto_boot", (event, args) => {
        app.setLoginItemSettings({openAtLogin: false})

    })

    ipcMain.on("minimize", (event, args) => {
        let specifyBrowserWindow = BrowserWindow.fromWebContents(event.sender)
        specifyBrowserWindow.minimize()

    })
    ipcMain.on("write_minute", (event, args) => {


        try {
            const filePath = resolve(apppath, './conf/system.json');
            let data = {minute: args}
            writeFile(filePath, JSON.stringify(data));

        } catch (err) {

            console.error(err.message);
        }

    })
    ipcMain.on("restart", async (event, args) => {

      app.relaunch()
        app.exit()
    })

    ipcMain.on("write_locale", async (event, args) => {

        try {
            const filePath = resolve(apppath, './conf/i18n/locale.json');
            let data = {language: String(args)}

            await writeFile(filePath, JSON.stringify(data));

        } catch (err) {

            console.error(err.message);
        }

    })
    ipcMain.handle("get_init_auto_boot", (event, args) => {

        return app.getLoginItemSettings().openAtLogin

    })

    ipcMain.handle("get_init_lan", (event, args) => {
        return locale

    })

    ipcMain.handle("get_init_minute", async (event, args) => {

        const {readFile} = require('node:fs/promises');
        const {resolve} = require('node:path');

        try {
            const filePath = resolve(apppath, './conf/system.json');
            const contents = await readFile(filePath, {encoding: 'utf8'});
            return JSON.parse(contents).minute

        } catch (err) {
            return 30
            console.error(err.message);
        }

    })

    win.removeMenu()
    win.title = locale.title;
    await win.loadFile('./renderer/index.html')
    win.webContents.openDevTools()
    win.show()

}

app.whenReady().then(() => {
    createWindow()

})

