import { BrowserWindow, app, Menu, ipcMain } from 'electron';
import { resolve } from 'path';
import glasstron from 'glasstron';
import { View } from './view';
import { startMessagingAgent } from './messaging';
import { getAppMenu } from './menus/app';
import { Storage } from './storage';
import { path } from '../../scripts/webpack.config';
import { Overlay } from './overlay';

export class AppWindow {
    public window: BrowserWindow;
    public overlay: Overlay;

    public storage: Storage;

    public views: View[] = [];
    
    public selectedId: string;


    constructor() {
        this.window = new BrowserWindow({
          frame: false,
          titleBarStyle: "hidden",
          minWidth: 500,
          minHeight: 450,
          width: 1280,
          height: 720,
          show: false,
          title: app.name,
          maximizable: true,
          webPreferences: {
            plugins: true,
            nodeIntegration: true,
            contextIsolation: false,
            experimentalFeatures: true,
            webviewTag: true,
            webSecurity: false,
            enableRemoteModule: true
          },
        })

        glasstron.update(this.window, {
            macos: {vibrancy: "fullscreen-ui"},
            linux: {requestBlur: true},
            windows: {blurType: "blurbehind"}
        })

        this.overlay = new Overlay(this);

        this.storage = new Storage()

        startMessagingAgent()

        Menu.setApplicationMenu(getAppMenu(app.name))

        if(process.env.ENV == "development") {
          this.window.loadURL('http://localhost:9010/app.html')
          this.window.webContents.openDevTools({ mode: 'detach' })
        } else {
          this.window.loadURL("file:///" + resolve(`${app.getAppPath()}/build/app.html`))
        }

        this.window.on('ready-to-show', () => {
            this.window.show()
            // this.overlay.show()
        })

        this.window.on('move', () => {
          this.overlay.rearrange()
        })

        this.window.on('maximize', () => {
          this.rearrangeView()
        })

        this.window.on('unmaximize', () => {
          this.rearrangeView()
        })
    };

    rearrangeView() {
      this.selectedView.rearrange()
    }

    public getViewFromId(id: string) {
      return this.views.find(view => view.id == id)
    }

    public get selectedView() {
      return this.getViewFromId(this.selectedId);
    }
}
