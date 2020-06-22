    let appEngine = (function(modules) {
        let $ = {
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

                        debugger;
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
                        modules.ipcRenderer.send(eventName, data);
                    },
                    listeners: () => {

                        modules.ipcRenderer.on('saved', (event, results) => {
                            if (results.success) {
                                console.log(results.message);
                                $.data.elements.footer.innerHTML = results.message;
                            }
                        });

                        modules.ipcRenderer.on('save-clicked', (event, results) => {
                            $.fn.message('save', $.data.elements.mainBody.value);
                        });

                        modules.ipcRenderer.on('save-as-clicked', (event, results) => {
                            $.fn.message('save-as', $.data.elements.mainBody.value);
                        });

                    },
                    handler: (e) => {
                        switch (e.currentTarget.id) {
                            case 'save-button':
                                console.log($.data.elements.mainBody.value);
                                $.fn.message('save', $.data.elements.mainBody.value);
                                break;
                            case 'plus-button':
                                $.data.elements.mainBody.style.fontSize = `${++$.data.mainBody.fontSize}px`
                                break;
                            case 'minus-button':
                                $.data.elements.mainBody.style.fontSize = `${--$.data.mainBody.fontSize}px`
                                break;
                        }
                    }
                }
            }())
        };
        $.fn.init();
    });

    window.onload = appEngine({
        ipcRenderer: ipcRenderer
    });
