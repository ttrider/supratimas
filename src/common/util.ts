import initializeLayoutComponent from "../layout/initialize";
import { initializeSelectorHandlers } from "./selector";

export function startupInitialize() {
    initializeLayoutComponent();
    initializeSelectorHandlers();
    costColor();

    ko.options.deferUpdates = true;
}

function costColor() {
    ko.bindingHandlers.costColor = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {

            element.style.color = `hsl( 0, 100%, ${(parseFloat(valueAccessor()) / 3)}% )`;
        },

        update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {

            element.style.color = `hsl( 0, 100%, ${(parseFloat(valueAccessor()) / 3)}% )`;
        }
    };
}

const crcTable: number[] = [];

function makeCRCTable() {
    if (crcTable.length > 0) return;
    let c;
    for (let n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
}

export function crc32(str: string): number {
    makeCRCTable();
    var crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

export function addOrUpdate<T>(array: T[], index: number, add: (index: number) => T, update: (index: number, oldValue: T) => T): T {

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

export function getOrAdd<T>(array: T[] | { [name: string]: T }, indexOrKey: number | string, add: (indexOrKey: any) => T): T {

    if (Array.isArray(array)) {
        const oldValue = array[indexOrKey as number];
        if (oldValue === undefined) {
            const value = add(indexOrKey);
            array[indexOrKey as number] = value;
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

export function getFlatArray<T>(value: any[]): T[] {

    let ret: any[] = [];
    copyValues(value, ret);
    return ret;

    function copyValues(source: any[], target: any[]) {

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

export class Rect implements ClientRect {
    get width(): number {
        return this.right - this.left;
    }
    get height(): number {
        return this.bottom - this.top;
    }

    constructor(public left: number, public top: number, public right: number, public bottom: number) {
    }

    static fromPositionAndSize(left: number, top: number, width: number, height: number) {
        return new Rect(left, top, left + width, top + height);
    }

}

