import { app, BrowserWindow, ipcMain } from 'electron'
import serve from 'electron-serve'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'
const loadURL = serve({ directory: 'dist/app' })

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isProd) {
    loadURL(mainWindow)
  } else {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 处理认证
ipcMain.handle('auth:signIn', async (_, credentials) => {
  // TODO: 实现本地认证
  return { user: { name: 'Admin' } }
})

ipcMain.handle('auth:signOut', async () => {
  // TODO: 实现登出
  return true
})

ipcMain.handle('auth:getSession', async () => {
  // TODO: 获取会话状态
  return { user: { name: 'Admin' } }
}) 