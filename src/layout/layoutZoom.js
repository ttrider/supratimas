"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function enableMouseZoom(element, layoutManager) {
    element.addEventListener("wheel", function (ev) {
        if (ev.ctrlKey) {
            layoutManager.setScale("wheel", ev.deltaY);
            // zoom
        }
        else {
            element.scrollBy(ev.deltaX, ev.deltaY);
        }
        ev.cancelBubble = true;
        ev.preventDefault();
    }, true);
}
exports.enableMouseZoom = enableMouseZoom;
/**touch-action: pinch-zoom */ 
//# sourceMappingURL=layoutZoom.js.map