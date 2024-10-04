
function showMenu(menu: HTMLElement) {
    if (isMenuVisible(menu)) {
        return;
    }

    menu.style.display = "flex";

    // we need to wait until ui got updated
    window.requestAnimationFrame((t) => {
        const anchors = menu.getElementsByTagName("a");
        if (anchors) {
            for (let i = 0; i < anchors.length; i++) {
                anchors[i].addEventListener("click", e => {
                    hideMenu(menu);
                });
            }
        }
    });
}

function hideMenu(menu: HTMLElement) {
    if (!isMenuVisible(menu)) {
        return;
    }

    menu.style.display = "none";
}

function isMenuVisible(menu: HTMLElement): boolean {
    return (menu.style.display !== null) && (menu.style.display !== "none");
}

export function initialize(menuButtonClass: string, menuClass: string): HTMLElement {
    const menuButtonSet = document.getElementsByClassName(menuButtonClass);
    const menuSet = document.getElementsByClassName(menuClass);
    if (!menuSet || menuSet.length === 0 || !menuButtonSet || menuButtonSet.length === 0) {
        throw new Error("menu set is missing");
    }
    const menuButton = menuButtonSet[0] as HTMLElement;
    const menu = menuSet[0] as HTMLElement;

    const context = ko.contextFor(menu) as KnockoutBindingContext;

    menuButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        if (isMenuVisible(menu)) {
            hideMenu(menu);
        }
        else {
            showMenu(menu);
        }
    });

    const btns = menu.getElementsByClassName("btn");
    if (btns) {
        for (let i = 0; i < btns.length; i++) {
            const btn = btns[i];
            btn.addEventListener("click", e => {
                e.cancelBubble = true;
                e.stopPropagation();
                e.preventDefault();

                const anchors = btn.getElementsByTagName("a");
                if (anchors) {
                    for (let i = 0; i < anchors.length; i++) {
                        anchors[i].click();
                    }
                }

            });
        }
    }

    const rbtns = menu.getElementsByClassName("rbtn");
    if (btns) {
        for (let i = 0; i < btns.length; i++) {
            const btn = btns[i];
            btn.addEventListener("click", e => {
                e.cancelBubble = true;
                e.stopPropagation();
                e.preventDefault();
                hideMenu(menu);
            });
        }
    }

    const anchors = menu.getElementsByTagName("a");
    if (anchors) {
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener("click", e => {
                hideMenu(menu);
            });
        }
    }

    const textareas = menu.getElementsByTagName("textarea");
    if (textareas) {
        for (let i = 0; i < textareas.length; i++) {
            textareas[i].addEventListener("paste", e => {
                hideMenu(menu);
            });
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideMenu(menu);
        }
    });

    window.addEventListener("mousedown", (e) => {
        hideMenu(menu);
    });

    menu.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });

    return menu;
} 