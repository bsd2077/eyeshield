let {contextBridge, ipcRenderer} = require("electron")
contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => {
        ipcRenderer.send("minimize")
    },
    disable_auto_boot: () => {
        ipcRenderer.send("disable_auto_boot")
    },

    enable_auto_boot: () => {
        ipcRenderer.send("enable_auto_boot")
    },

    write_minute: (minute) => {
        ipcRenderer.send("write_minute", minute)
    },
    restart: () => {
        ipcRenderer.send("restart")
    },
    write_locale: (lan) => {
        ipcRenderer.send("write_locale", lan)
    },
    update_tip: (c) => {
        ipcRenderer.on("update_tip", (_event, value) => c(value))
    },
    get_init_auto_boot: () => {
        return ipcRenderer.invoke("get_init_auto_boot")
    },
    get_init_lan: () => {
        return ipcRenderer.invoke("get_init_lan")
    },

    get_init_minute: () => {
        return ipcRenderer.invoke("get_init_minute")
    },
    duration: (minute) => {
        ipcRenderer.send("duration", minute)
    }

})
