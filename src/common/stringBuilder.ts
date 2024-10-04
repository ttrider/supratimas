
export declare type stringItem = (null | string | (() => string));

export class StringBuilder {

    private parts: stringItem[] = [];

    constructor(...values: stringItem[]) {
        this.append(values);
    }

    get isEmpty() {
        return this.parts.length === 0;
    }

    append(value?: null | stringItem | stringItem[] | number | number[]) {
        if (value != null && value != undefined) {
            if (Array.isArray(value)) {
                for (const v of value) {
                    if (v != null && v != undefined) {
                        this.pushPart(v);
                    }
                }
            }
            else {
                this.pushPart(value);
            }
        }
        return this;
    }
    private pushPart(item: stringItem | number) {
        if (typeof item === "number") {
            item = item.toString();
        }
        this.parts.push(item);
    }

    format(separator: string) {
        const ret: string[] = [];

        for (const item of this.parts) {
            if (item) {
                const itemVal = (typeof item === "function") ? item() : item;
                if (itemVal) {
                    ret.push(itemVal);
                }
            }
        }
        return ret.join(separator);
    }
}