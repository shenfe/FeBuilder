const init = function (el) {
    
};

const renderComponents = data => {
    $(function () {
        $('#components').jstree({
            core: {
                data,
                themes: {
                    dots: false,
                    icons: false
                }
            },
            checkbox: {
                keep_selected_style: false
            },
            plugins: [
                'dnd'
            ]
        });
    });
};

const renderFileAssets = data => {
    $(function () {
        $('#fileassets').jstree({
            core: {
                data,
                themes: {
                    dots: false,
                    icons: false
                }
            },
            checkbox: {
                keep_selected_style: false
            },
            plugins: [
                'dnd'
            ]
        });
    });
};

module.exports = {
    init,
    renderComponents,
    renderFileAssets
};