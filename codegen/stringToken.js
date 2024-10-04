"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const specialCamels = {
    "in": "iN",
    "default": "Default",
    "delete": "Delete",
    "switch": "Switch"
};
const wordsRegex = /([\s_]+)|((?:[^A-Z])([A-Z]))/;
class StringToken {
    constructor(value, camelSuffix) {
        this.value = value;
        this.camelSuffix = camelSuffix;
        this.words = this.getWords(value);
    }
    get camelCase() {
        if (!this.value) {
            return "";
        }
        //if (this.camelCaseValue) {
        //  return this.camelCaseValue;
        // }
        const specialCamel = specialCamels[this.value.toLowerCase()];
        if (specialCamel) {
            return specialCamel;
        }
        const result = [this.words[0].toLowerCase()];
        for (let index = 1; index < this.words.length; index++) {
            result.push(this.capitalize(this.words[index]));
        }
        this.camelCaseValue = result.join("");
        if (this.camelSuffix) {
            this.camelCaseValue + this.camelSuffix;
        }
        return this.camelCaseValue;
    }
    get humanized() {
        if (!this.value) {
            return "";
        }
        //if (this.humanizedValue) {
        //    return this.humanizedValue;
        // }
        const result = [];
        for (let index = 0; index < this.words.length; index++) {
            result.push(this.capitalize(this.words[index]));
        }
        this.humanizedValue = result.join(" ");
        return this.humanizedValue;
    }
    capitalize(value) {
        if (value.length < 2) {
            return value.toUpperCase();
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
    getWords(input) {
        const results = [];
        if (input) {
            let current = input;
            let match = wordsRegex.exec(current);
            while (match) {
                let wordEnd = match.index;
                let contentStart = match.index;
                if (match[2]) {
                    wordEnd++;
                    contentStart = wordEnd;
                }
                else {
                    contentStart += match[1].length;
                }
                let word = current.substring(0, wordEnd);
                current = current.substring(contentStart);
                addToResults(word);
                match = wordsRegex.exec(current);
            }
            addToResults(current);
        }
        return results;
        function addToResults(word) {
            if (word.startsWith("XML")) {
                results.push("XML");
                const w = word.substring(3).trim();
                if (w) {
                    results.push(w);
                }
            }
            else if (word.startsWith("FTS")) {
                results.push("FTS");
                const w = word.substring(3).trim();
                if (w) {
                    results.push(w);
                }
            }
            else {
                results.push(word);
            }
        }
    }
}
exports.StringToken = StringToken;
//# sourceMappingURL=stringToken.js.map