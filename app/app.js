define(['win', 'ipcRenderer'], function(win, ipcRenderer) {
    let appEngine = (function(options) {
        let $ = {
            ipcRenderer: {},
            data: {
                mainBody: {
                    text: '',
                    fontSize: 12
                },
                elements: {
                    mainBody: null
                }
            },
            fn: (function() {
                return {
                    init: () => {

                        ipcRenderer = options.ipcRenderer;

                        $.data.elements.mainBody = document.querySelector('#main-body');
                        $.data.elements.mainBody.style.fontSize = '12px';
                        $.data.elements.footer = document.querySelector('#footer');

                        let buttons = document.querySelectorAll('.click-button');

                        Array.from(buttons).forEach(button => {
                           button.addEventListener('click', $.fn.handler);
                        });

                        $.fn.listeners();
                    },
                    message: (eventName, data) => {
                        ipcRenderer.send(eventName, data);
                    },
                    listeners: () => {

                        // $.ipcRenderer.on('save-clicked', (event, results) => {
                        //     $.fn.message('save', $.data.elements.mainBody.value);
                        // });

                    },
                    handler: (e) => {
                        switch (e.currentTarget.id) {
                            case 'button-id':
                                $.fn.message('<onEventName>', {});
                                break;
                        }
                    }
                }
            }())
        };
        $.fn.init();
    });
})

window.onload = appEngine({
    ipcRenderer: ipcRenderer
});
