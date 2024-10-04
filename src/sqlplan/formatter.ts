import { ColumnReferenceType, ObjectType } from "./saxfactory";

export function formatName(name: string, maxLength: number): string {

    const l = name.length;

    if (l < maxLength) {
        return name;
    }

    const i = (l - (l - (maxLength - 3))) / 2;

    return name.substring(0, i) + "..." + name.substring(l - i);
}

export function splitIntoLines(value: string, maxLength: number): Array<string> {
    if (!value) return [value];
    if (!maxLength) return [value];

    const lines = [];
    while (value.length > maxLength) {
        let index = maxLength;
        while (index > 0 && value[index] !== " ") {
            index--;
        }
        if (index === 0) index = maxLength;

        lines.push(value.substring(0, index));
        value = value.substring(index, value.length).trim();
    }
    lines.push(value);
    return lines;
}


export function formatByteSize(bytes: number): string {

    let val = bytes;
    if (val < 1024) {
        return val + " B";
    }
    val = val / 1024.0;
    val = Math.round(val * 100.0) / 100.0;
    if (val < 1024) {
        return val + " KB";
    }
    val = val / 1024.0;
    val = Math.round(val * 100.0) / 100.0;
    if (val < 1024) {
        return val + " MB";
    }
    val = val / 1024.0;
    val = Math.round(val * 100.0) / 100.0;
    if (val < 1024) {
        return val + " GB";
    }
    val = val / 1024.0;
    val = Math.round(val * 100.0) / 100.0;
    return val + " TB";
}

export function formatPercentage(value: number | null | undefined): string {
    if (value === undefined) {
        return "";
    }
    if (value === null) {
        return "";
    }
    let val = (Math.round(value * 10000.0) / 100.0).toString();
    // make sure that we are displaing exactly 2 decimal points
    const p = val.indexOf(".");
    const l = val.length;
    if (p === -1) {
        val += ".00%";
    } else if (l > (p + 3)) { //we have more then 2 digits
        val = val.substring(0, p + 3) + "%";
    } else if (l < (p + 3)) { //we have less then 2 digits
        const c = (p + 3) - l;
        for (let i = 0; i < c; i++) {
            val = val + "0";
        }
        val = val + "%";
    } else {
        val = val + "%";
    }
    return val;
}

export function formatPlanObjectFullName(planObject: ObjectType): string {

    let val = "";
    let sep = "";
    if (planObject.Server) {
        val += "[" + planObject.Server + "]";
        sep = ".";
    }
    if (planObject.Database) {
        val += sep + "[" + planObject.Database + "]";
        sep = ".";
    }
    if (planObject.Schema) {
        val += sep + "[" + planObject.Schema + "]";
        sep = ".";
    }
    if (planObject.Table) {
        val += sep + "[" + planObject.Table + "]";
        sep = ".";
    }
    if (planObject.Index) {
        val += sep + "[" + planObject.Index + "]";
    }
    return val;

}

export function formatObjectName(name: string | undefined): string {
    if (name && (name.length > 0) && (name.charAt(0) !== "[")) {
        return "[" + name + "]";
    }
    return "";
}

export function formatPlanColumnFullName(planObject: ColumnReferenceType): string {
    let val = "";
    let sep = "";
    if (planObject.Server) {
        val += sep + formatObjectName(planObject.Server);
        sep = ".";
    }
    if (planObject.Database) {
        val += sep + formatObjectName(planObject.Database);
        sep = ".";
    }
    if (planObject.Schema) {
        val += sep + formatObjectName(planObject.Schema);
        sep = ".";
    }
    if (planObject.Table) {
        val += sep + formatObjectName(planObject.Table);
        sep = ".";
    }
    if (planObject.Column) {
        val += sep + formatObjectName(planObject.Column);
    }
    if (planObject.Alias) {
        val += " as " + formatObjectName(planObject.Alias);
    }

    if (planObject.ScalarOperator) {
        val += " = " + planObject.ScalarOperator.ScalarString;
    }

    return val;
}



