import { LayoutManager } from "./layout";

export function enableMouseZoom(element: HTMLElement, layoutManager: LayoutManager) {

    element.addEventListener("wheel", function (ev) {

        if (ev.ctrlKey) {
            layoutManager.setScale("wheel", ev.deltaY);
            // zoom
        } else {
            element.scrollBy(ev.deltaX, ev.deltaY);
        }

        ev.cancelBubble = true;
        ev.preventDefault();

    }, true);

}

/**touch-action: pinch-zoom */