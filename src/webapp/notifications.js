"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Notifications {
    constructor() {
        this.items = ko.observableArray();
    }
    show(text, secondsToShow = 0) {
        console.error(text);
        const item = new NotificationItem(this, text);
        this.items.push(item);
        if (secondsToShow) {
            window.setTimeout(() => {
                this.items.remove(item);
            }, secondsToShow * 1000);
        }
        return item;
    }
    hide(item) {
        this.items.remove(item);
    }
    hideAll() {
        this.items.removeAll();
    }
}
exports.Notifications = Notifications;
class NotificationItem {
    constructor(owner, text) {
        this.owner = owner;
        this.text = text;
    }
    hide() {
        this.owner.hide(this);
    }
    hideAll() {
        this.owner.hideAll();
    }
}
exports.NotificationItem = NotificationItem;
//# sourceMappingURL=notifications.js.map