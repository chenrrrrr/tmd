const { Menu, BrowserWindow, ipcMain } = require('electron');
// 主菜单模板
const templ = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建',
        accelerator: 'Ctrl+N',
        click () {
          BrowserWindow.getFocusedWindow().webContents.send('action', 'new');
        },
      },
      {
        label: '打开',
        accelerator: 'Ctrl+O',
        click () {
          BrowserWindow.getFocusedWindow().webContents.send('action', 'open');
        },
      },
      {
        label: '保存',
        accelerator: 'Ctrl+S',
        click () {
          BrowserWindow.getFocusedWindow().webContents.send('action', 'save');
        },
      },
    ],
  },
];

// 主菜单
const m = Menu.buildFromTemplate(templ);
Menu.setApplicationMenu(m);


/*
// 右键菜单模板
const contextMenu_templ = [
  {
    label: '重载',
    role: 'reload',
  }
];
const contextMenu = Menu.buildFromTemplate(contextMenu_templ);
// 主进程监听右键事件
ipcMain.on('contextMenu', () => {
  contextMenu.popup(BrowserWindow.getFocusedWindow());
});
*/
