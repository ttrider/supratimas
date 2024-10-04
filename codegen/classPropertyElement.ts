export class ClassPropertyElement {
    isArray?: boolean;
    className?: string | null;
    declareType?: string | null;
    constructor(public name: string) {
    }

    get definitionType() {
        return this.declareType ? this.declareType : this.className;
    }
}