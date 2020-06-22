define([
    "app"
], function(app) {
    window.onload = app({
        ipcRenderer: ipcRenderer
    });
});
