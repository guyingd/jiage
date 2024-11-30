import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  auth: {
    signIn: (credentials: { username: string; password: string }) => 
      ipcRenderer.invoke('auth:signIn', credentials),
    signOut: () => ipcRenderer.invoke('auth:signOut'),
    getSession: () => ipcRenderer.invoke('auth:getSession')
  }
}) 