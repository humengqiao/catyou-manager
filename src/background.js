import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron"
// import fs from 'fs-extra'
import { autoUpdater } from "electron-updater"
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib"
import path from 'path'
import { feedUrl } from "./config/app-update"
const isDevelopment = process.env.NODE_ENV !== "production"

if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = path.join(__dirname, 'win-unpacked/resources/app-update.yml')
}

if(!isDevelopment) installVueDevtools(true)

// 清空之前下载的更新包，保证有版本更新时每次都会有更新提示
// const updaterCacheDirName = 'production-manager-updater'
// const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCacheDirName, 'pending')
// fs.emptyDirSync(updatePendingPath)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    resizable: true,
    skipTaskbar: false,
    flashFrame: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.maximize()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null
  })

  win.on("ready-to-show", () => {
    win.show()
  })
}

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  const message = {
    error: "检查更新出错",
    checking: "正在检查更新...",
    updateAva: "检测到新版本，正在下载...",
    updateNotAva: "当前为最新版本"
  }

  autoUpdater.autoDownload = false
  autoUpdater.setFeedURL(feedUrl)

  autoUpdater.on("error", error => {
    sendUpdateMessage(message.error)
    win.webContents.send('error')
  })

  autoUpdater.on("checking-for-update", () => {
    sendUpdateMessage(message.checking)
  })

  autoUpdater.on("update-available", () => {
		// 发送有更新可用消息到渲染进程
		win.webContents.send('update-available')
  })

  autoUpdater.on("update-not-available", () => {
    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on("download-progress", progressObj => {
    win.webContents.send("downloadProgress", progressObj)
  })

  autoUpdater.on(
    "update-downloaded", () => {
      ipcMain.on("isUpdateNow", () => {
        autoUpdater.quitAndInstall()
      })

      win.webContents.send("isUpdateNow")
    }
  )

  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates()
	})

	ipcMain.on('downloadUpdate', () => {
		autoUpdater.downloadUpdate()
	})
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  win.webContents.send("message", text)
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
  updateHandle();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
