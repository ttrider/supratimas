
export class Notifications {

    show(text: CallbackError, secondsToShow: number = 0): NotificationItem {

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

    hide(item: NotificationItem) {
        this.items.remove(item);
    }

    hideAll() {
        this.items.removeAll();
    }


    items: KnockoutObservableArray<NotificationItem> = ko.observableArray();

}

export class NotificationItem {
    constructor(public owner: Notifications, public text: CallbackError) {

    }

    hide() {
        this.owner.hide(this);
    }
    hideAll() {
        this.owner.hideAll();
    }
}



