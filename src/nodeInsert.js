$(document).ready(function () {
    var insertTag = function(type) {
        console.log('insert tag');
        var inner = {
            a: '',
            span: '',
            div: '',
            p: '',
            input: '',
            img: '',
            ul: '',
            table: ''
        };
        if (inner[type] === undefined) {
            return;
        }
        var text = window.prompt('insert a "' + type + '" tag, with its class and text value:', inner[type]);
        if (text === null) {
            return;
        }
        var tag = document.createElement(type);
        var parts = text.split(' ');
        tag.className = parts[0];

        document.head.getElementsByTagName('style')[0].innerHTML += '.' + parts[0] + ' {}';

        switch(type) {
            case 'ul':
                parts[1] = '<li>item</li><li>item</li><li>item</li>';
                break;
            case 'table':
                parts[1] = '<tr><th>cell</th><th>cell</th><th>cell</th><th>cell</th></tr>\
                    <tr><td>cell</td><td>cell</td><td>cell</td><td>cell</td></tr>\
                    <tr><td>cell</td><td>cell</td><td>cell</td><td>cell</td></tr>\
                    <tr><td>cell</td><td>cell</td><td>cell</td><td>cell</td></tr>';
                break;
            case 'img':
                parts[1] = 'http://img04.sogoucdn.com/app/a/100520024/f198f65245c56d2f0bb59f7f9f87bdf6';
                break;
        }
        if (parts[1]) {
            if (type === 'input') {
                tag.value = parts[1];
            } else if (type === 'img') {
                tag.src = parts[1];
            } else {
                tag.innerHTML = parts[1];
            }
        }
        window.currentNode.appendChild(tag);

        if (type !== 'div') {
            return;
        }
        interact(tag).resizable({
            preserveAspectRatio: false,
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            }
        }).on('resizemove', function(event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            // target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
        });
    };

    var insertA = function () {
        insertTag('a');
        return false;
    };

    var insertSpan = function () {
        insertTag('span');
        return false;
    };

    var insertDiv = function () {
        insertTag('div');
        return false;
    };

    var insertP = function () {
        insertTag('p');
        return false;
    };

    var insertInput = function () {
        insertTag('input');
        return false;
    };

    var insertImg = function () {
        insertTag('img');
        return false;
    };

    var insertUl = function () {
        insertTag('ul');
        return false;
    };

    var insertTable = function () {
        insertTag('table');
        return false;
    };

    $(document).bind('keydown', 'a', insertA);
    $(document).bind('keydown', 's', insertSpan);
    $(document).bind('keydown', 'd', insertDiv);
    $(document).bind('keydown', 'p', insertP);
    $(document).bind('keydown', 'i', insertInput);
    $(document).bind('keydown', 'm', insertImg);
    $(document).bind('keydown', 'u', insertUl);
    $(document).bind('keydown', 't', insertTable);
});