const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog, Menu } = electron;
const DZFileSystem = require('../DZFileSystem');
const { get } = require('http');
const debug = true;
let win
let filePath = undefined;
const isMac = process.platform === 'darwin';
// const isMac = true;

console.log(process.platform);
console.log(isMac);

let dbTool2 = (function() {
    let $ = {
        fn: (function() {
            return {
                on: (hanlder, cb) => {
                    switch(hanlder) {
                        case 'load':
                            $.fn.load(cb);
                            break;
                    }
                },
                load: (cb) => {
                    cb($);
                }
            }
        }())
    };
    return {
        on: $.fn.on
    }
}());

let debTool = function(options) {
     let $ = {
        options: options,
        fn: (function() {
            return {
                text: (data) => {
                    if (options.debug) {
                        console.log(data);
                    }
                }
            }
            }())
    };

    return {
        'text': $.fn.text
    };
}({ 'debug': debug });

const generateMenu = () => {
    return [
        ...(isMac? [{
            label: app.name,
            submenu: [
                { label: 'Abount TextApp', role: 'about' },
                // { type: 'separator' },
                // { role: 'services' },
                // { type: 'separator' },
                // { role: 'hide' },
                // { role: 'hideothers' },
                // { role: 'unhide' },
                // { type: 'separator' },
                // { role: 'quit' }
            ]
        }] : []),
        {
            label: "File",
            submenu: [
                isMac ?
                { role: 'close' } : {  role: 'quit' },
                {
                    label: "Save",
                    accelerator: "CmdOrCtrl+S",
                    click() {
                        win.webContents.send('save-clicked');
                    }
                },
                {
                    label: "Save As",
                    accelerator: "CmdOrCtrl+Shift+S",
                    click() {
                        win.webContents.send('save-as-clicked');
                    }
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                    label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' }
                    ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
              { role: 'reload' },
              { role: 'forcereload' },
              { role: 'toggledevtools' },
              { type: 'separator' },
              { role: 'resetzoom' },
              { role: 'zoomin' },
              { role: 'zoomout' },
              { type: 'separator' },
              { role: 'togglefullscreen' }
            ]
        },

    ]
};

app.on('ready', function() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    const menu = Menu.buildFromTemplate( generateMenu() );
    Menu.setApplicationMenu( menu );

    win.loadFile('index.html');
    debTool.text("app is ready.");
});

ipcMain.on('save', (event, data) => {
    // save text to a file
    debTool.text(data);
    DZFileSystem.init( win, dialog );

    DZFileSystem.save( data, false ).then((filePath) => {
        console.log(`File has been saved to: ${filePath}` );
        win.webContents.send('saved', { 'success': true, 'message': `File has been saved to: ${filePath}` });
    }, (error) => {
        console.log(error);
    });

});

ipcMain.on('save-as', (event, data) => {
    // save text to a file
    debTool.text(data);
    DZFileSystem.init( win, dialog );

    DZFileSystem.save( data, true ).then((filePath) => {
        console.log(`File has been saved to: ${filePath}` );
        win.webContents.send('saved', { 'success': true, 'message': `File has been saved to: ${filePath}` });
    }, (error) => {
        console.log(error);
    });

});
