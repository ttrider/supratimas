"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function enableMouseScroll(element) {
    let scrollLeft = -1;
    let scrollTop = -1;
    let screenX = -1;
    let screenY = -1;
    element.addEventListener("mousedown", (ev) => {
        if (ev.target === element) {
            //document.body.style['pointer-events'] = 'none';
            element.style.cursor = "all-scroll";
            element.addEventListener("mouseup", onMouseUp, true);
            document.addEventListener("mouseup", onMouseUp, true);
            element.addEventListener("mousemove", onMouseMove, true);
            document.addEventListener("mousemove", onMouseMove, true);
            scrollLeft = element.scrollLeft;
            scrollTop = element.scrollTop;
            screenX = ev.screenX;
            screenY = ev.screenY;
            ev.cancelBubble = true;
            ev.preventDefault();
        }
    });
    function onMouseMove(ev) {
        const dx = screenX - ev.screenX;
        const dy = screenY - ev.screenY;
        element.scrollTo(scrollLeft + dx, scrollTop + dy);
        ev.cancelBubble = true;
        ev.preventDefault();
    }
    function onMouseUp(ev) {
        element.removeEventListener("mouseup", onMouseUp, true);
        document.removeEventListener("mouseup", onMouseUp, true);
        element.removeEventListener("mousemove", onMouseMove, true);
        document.removeEventListener("mousemove", onMouseMove, true);
        element.style.cursor = null;
        ev.cancelBubble = true;
        ev.preventDefault();
    }
}
exports.enableMouseScroll = enableMouseScroll;
//# sourceMappingURL=layoutScroll.js.map