export default class Shape {
    static svg = document.getElementById('svg');
    static initAttrs = {
        style: `\
fill: #ecad9e;
stroke: #beedc7;
stroke-width: 1rem;
opacity: 1;
fill-opacity: 1;
stroke-opacity: .5;\
`
    };

    constructor(type, attr) {
        this.type = type;
        this.attr = attr;
    }

    sayHello() {
        console.log(`I'm ${this.type}.`)
    }

    getClass() {
        return this.constructor;
    }

    set type(v) {
        this._type = v;
    }

    get type() {
        return this._type;
    }

    set attr(v) {
        let attr = {};
        console.debug(`Raw attributes: ${v}`);
        v.split(/\n+/)
            .filter((item) => {
                return item.trim();
            })
            .map((item) => {
                let itemArr = item.split('=');
                // 更新对象 attr
                attr[itemArr[0].trim()] = JSON.parse(itemArr[1].trim().replace(/'/g, '"'));
            });
        this._attr = attr;

        console.debug(this.attr);
    }

    get attr() {
        return this._attr;
    }

    getElement() {
        this.el = document.createElementNS('http://www.w3.org/2000/svg', this.type);

        this.setAttrs(Shape.initAttrs); // 设置初始化 attr
        this.setAttrs(this.attr);

        return this.el;
    }

    setAttrs(attrs = Shape.initAttrs) {
        for (let k in attrs) {
            console.log(1, k);
            this.el.setAttribute(k, attrs[k]);
        }
    }

    static show(child, parent = Shape.svg) {
        if (parent === Shape.svg) {
            while (parent.lastChild) {
                parent.lastChild.remove();
            }
        }
        parent.appendChild(child);
    }
}

export function removeElementAttr(attrName, el = Shape.svg) {
    el.removeAttribute(attrName);
}

export function setElementAttrs(attrs, el = Shape.svg) {
    for (let k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
}

export function showShape(type, attr) {
    let shape = new Shape(type, attr);
    let shapeEl = shape.getElement();
    Shape.show(shapeEl);
}