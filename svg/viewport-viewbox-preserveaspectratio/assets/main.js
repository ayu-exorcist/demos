import {
    removeElementAttr as removeSvgAttr,
    setElementAttrs as setSVGAttrs,
    showShape
} from './shape.js';
import {
    AttrError,
    ValueError
} from './error.js';

let form = document.getElementsByTagName('form')[0];

let vpWidth = document.getElementById('viewportWidth'),
    vpHeight = document.getElementById('viewportHeight');

let vbMinX = document.getElementById('viewBoxMinX'),
    vbMinY = document.getElementById('viewBoxMinY'),
    vbWidth = document.getElementById('viewBoxWidth'),
    vbHeight = document.getElementById('viewBoxHeight');

let align = document.getElementById('align'),
    meetOrSlice = document.getElementById('meetOrSlice'),
    mos = document.getElementById('meetOrSliceReference');

let type = document.getElementById('type'),
    attr = document.getElementById('attr');

/**
 * textarea 根据内容简易缩放
 */
attr.addEventListener('input', textareaEvent);

function textareaEvent(e) {
    let el = e.target;
    // (由于 scrollHeight 的值在行减少时不是立刻减少一个 lineheight, 所以需要)清空内联样式, 使内联元素包裹内容, 即其高度与内容高度立刻保持一致
    el.style.cssText = '';
    // el.style.height = '';
    // 设置内联样式 height 为 scrollHeight (该属性是一个只读属性, 其值等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度)
    el.style.height = `${el.scrollHeight}px`;
}

// 事件委托
form.addEventListener('input', formEvent);
form.addEventListener('change', formEvent);

function formEvent(e) {
    let el = e.target;
    let value = el.value;
    switch (el) {
        default:
            console.log(`${Object.getPrototypeOf(el).constructor.name} is not supported!`);
            break;
        case vpWidth: {
            try {
                value ? setSVGAttrs({
                    width: value
                }) : removeSvgAttr('width');
            } catch (e) {
                throw new ValueError('viewport width');
            }
            break;
        }
        case vpHeight: {
            try {
                value ? setSVGAttrs({
                    height: value
                }) : removeSvgAttr('height');
            } catch (e) {
                throw new ValueError('viewport height');
            }
            break;
        }
        case vbMinX:
        case vbMinY:
        case vbWidth:
        case vbHeight: {
            let vbArr = [vbMinX.value, vbMinY.value, vbWidth.value, vbHeight.value];

            let vb = vbArr.join(" ").trim();
            // 该 flag 决定了是否移除 viewBox 属性
            let flag = vbArr.every((item) => {
                return item.trim();
            });

            try {
                (vb && flag) ? setSVGAttrs({
                    viewBox: vb
                }): removeSvgAttr('viewBox');
            } catch (e) {
                throw new ValueError('viewBox');
            }
            break;
        }
        case align:
        case meetOrSlice: {
            // 该 flag 决定了 meetOrSlice 是否显示及 meetOrSlice 的值
            let flag = !align.value || align.value === 'none';
            // meetOrSlice 是否显示
            mos.style.visibility = flag ? 'hidden' : 'visible';
            // 更新 meetOrSliceValue 的值
            let meetOrSliceValue = meetOrSlice.value = flag ? '' : (!meetOrSlice.value ? 'meet' : meetOrSlice.value);

            let parArr = [align.value, meetOrSliceValue];

            let par = parArr.join(' ').trim();

            try {
                par ? setSVGAttrs({
                    preserveAspectRatio: par
                }) : removeSvgAttr('preserveAspectRatio');
            } catch (e) {
                throw new ValueError('preserveAspectRatio');
            }
            break;
        }
        case type: {
            // 变更类型时清空属性框中的值
            attr.value = '';

            // 手动触发事件
            attr.dispatchEvent(new Event('input')); // 触发 textarea 缩放
        }
        case attr: {
            try {
                e.type === 'change' && attr.value && showShape(type.value, attr.value);
            } catch (e) {
                throw new AttrError(type.value);
            }
            break;
        }
    }
}

(function init() {
    // 初始化 type 和 attribute 值
    type.value = 'rect';
    attr.value = `\
x="0"
y="0"
width="50%"
height="50%"\
`;
    // 显示默认的矩形
    showShape(type.value, attr.value);

    // 手动触发事件
    attr.dispatchEvent(new Event('input')); // 触发 textarea 缩放
})();