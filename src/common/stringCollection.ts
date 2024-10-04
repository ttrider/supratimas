import * as formatter from "../sqlplan/formatter";

export class StringCollection {
    items: Array<{
        value: KnockoutObservable<string> | string;
        originalValue: string;
    }> = [];
    collapsed: boolean = true;
    collapsable: boolean = false;
    toggle = (data: any, e: Event) => {
        this.collapsed = !this.collapsed;
        for (const item of this.items) {
            if (typeof item.value !== "string") {
                item.value(formatter.formatName(item.originalValue, this.collapsed ? this.normalLength : this.maxLength));
            }
        }
        this.updated.notifySubscribers(e.target as HTMLElement);
    };
    updated: KnockoutSubscribable<HTMLElement> = new ko.subscribable<HTMLElement>();
    constructor(public lines: Array<string | undefined>, public normalLength: number, public maxLength: number) {
        for (const line of lines) {
            if (line) {
                if (line.length > normalLength) {
                    this.items.push({ value: ko.observable(formatter.formatName(line, this.normalLength)), originalValue: line });
                    this.collapsable = true;
                }
                else {
                    this.items.push({ value: line, originalValue: line });
                }
            }
        }
    }
}