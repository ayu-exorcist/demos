let iframeDialog = document.getElementById('iframeDialog');
dialogPolyfill.registerDialog(iframeDialog); // This polyfill works on modern versions of all major browsers. It also supports IE9 and above.

// dialog 元素没有 open 属性时, 需要手动设置
if (typeof iframeDialog.showModal === 'function') {
    iframeDialog.showModal(); // 显示对话，并使其成为 top - most 型对话. showModal()会出现遮罩, 以防止你去操作除对话框以外的它元素
} else {
    alert('The <dialog> API is not supported by this browser.');
}

// 绑定事件
let confirmBtn = document.querySelector('.button-confirm');
let closeBtn = document.querySelector('.button-close');
let cancelBtn = document.querySelector('.button-cancel');

let options = {
    capture: false,
    passive: false,
    once: false
};

// X
closeBtn.addEventListener('click', (event) => iframeDialog.close('close'), options);

// Cancel
cancelBtn.addEventListener('click', (event) => iframeDialog.close('cancel'), options);

// Esc
iframeDialog.addEventListener('cancel', (event) => iframeDialog.close('esc'), options);

// Backdrop
iframeDialog.addEventListener('click', (event) => {
    if (event.target === iframeDialog) {
        // 避免遮盖 iframeDialog 事件, 比如 submit 事件
        iframeDialog.close('backdrop');
    }
}, options);


// Confirm
/*
由于 <form> 元素设置了 method = "dialog", 因此提交时会触发 close 事件, 并且 returnValue 默认为 Confirm 按钮的 value 属性值
(为了兼容 Firefox 需要手动绑定事件, 如下所示:)
*/
// iframeDialog.addEventListener('submit', (event) => iframeDialog.close('confirm'), options);
confirmBtn.addEventListener('click', (event) => iframeDialog.close('confirm'), options);

// close
iframeDialog.addEventListener('close', (event) => {
    // 处理表单
    let formData = {};
    let inputList = document.getElementsByTagName('input');

    for (const item of inputList) {
        let type = item.type;
        let checked = item.checked;
        let name = item.name;
        let value = item.value;

        switch (type) {
            case 'url': {
                let href = document.location.toString();
                formData[name] = value || href;
                break;
            }
            case 'checkbox':
            case 'radio':
            default:
                checked ? formData[name] = value : false;
        }
    }

    console.debug('Events ', iframeDialog.returnValue, ' triggered.');
    switch (iframeDialog.returnValue) {
        case 'confirm':
            splitScreen(formData);
            break;
        case 'close':
        case 'cancel':
        case 'esc':
        case 'backdrop':
        default:
            document.location.reload(false);
    }
}, options);

function splitScreen(data) {
    let tabOne = data['tab-one'];
    let tabTwo = data['tab-two'];
    let direction = data.hv;
    delete data.hv;

    switch (direction) {
        // 由于 case 语句没有写 {}, 所有 case 都处于同一块级作用域. 这里使用 var 声明变量, 靠其变量提升使其处于函数作用域
        case 'horizontal':
            var width = '50%';
            var height = '100%';
            break;
        case 'vertical':
            var width = '100%';
            var height = '50%';
            break;
        default:
            // 默认水平放置
            var width = '50%';
            var height = '100%';
    }

    // let html = '<iframe style="border: none;" width="' + width + '" height="' + height + '" src="' + tabOne + '"></iframe><iframe style="border: none;" width="' + width + '" height="' + height + '" src="' + tabTwo + '"></iframe>';
    let html = `\
<html><iframe style="border: none;" width="${width}" height="${height}" src="${tabOne}"></iframe><iframe style="border: none;" width="${width}" height="${height}" src="${tabTwo}"></iframe><body style="margin: 0;"></body></html>`;
    document.body.innerHTML = html;
}