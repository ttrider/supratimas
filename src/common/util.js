"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialize_1 = require("../layout/initialize");
const selector_1 = require("./selector");
function startupInitialize() {
    initialize_1.default();
    selector_1.initializeSelectorHandlers();
    costColor();
    ko.options.deferUpdates = true;
}
exports.startupInitialize = startupInitialize;
function costColor() {
    ko.bindingHandlers.costColor = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            element.style.color = `hsl( 0, 100%, ${(parseFloat(valueAccessor()) / 3)}% )`;
        },
        update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            element.style.color = `hsl( 0, 100%, ${(parseFloat(valueAccessor()) / 3)}% )`;
        }
    };
}
const crcTable = [];
function makeCRCTable() {
    if (crcTable.length > 0)
        return;
    let c;
    for (let n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
}
function crc32(str) {
    makeCRCTable();
    var crc = 0 ^ (-1);
    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}
exports.crc32 = crc32;
;
function addOrUpdate(array, index, add, update) {
    const oldValue = array[index];
    if (oldValue === undefined) {
        const value = add(index);
        array[index] = value;
        return value;
    }
    const value = update(index, oldValue);
    array[index] = value;
    return value;
}
exports.addOrUpdate = addOrUpdate;
function getOrAdd(array, indexOrKey, add) {
    if (Array.isArray(array)) {
        const oldValue = array[indexOrKey];
        if (oldValue === undefined) {
            const value = add(indexOrKey);
            array[indexOrKey] = value;
            return value;
        }
        return oldValue;
    }
    const oldValue = array[indexOrKey];
    if (oldValue === undefined) {
        const value = add(indexOrKey);
        array[indexOrKey] = value;
        return value;
    }
    return oldValue;
}
exports.getOrAdd = getOrAdd;
function getFlatArray(value) {
    let ret = [];
    copyValues(value, ret);
    return ret;
    function copyValues(source, target) {
        for (const item of source) {
            if (item !== undefined) {
                if (Array.isArray(item)) {
                    copyValues(item, target);
                }
                else {
                    target.push(item);
                }
            }
        }
    }
}
exports.getFlatArray = getFlatArray;
class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    get width() {
        return this.right - this.left;
    }
    get height() {
        return this.bottom - this.top;
    }
    static fromPositionAndSize(left, top, width, height) {
        return new Rect(left, top, left + width, top + height);
    }
}
exports.Rect = Rect;
//# sourceMappingURL=util.js.map