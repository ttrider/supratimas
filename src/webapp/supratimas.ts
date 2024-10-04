
declare type CallbackError = string | Error | null | undefined;

declare type Callback<T> = (err: CallbackError, data?: T) => void;

export function attachToExample(element: HTMLElement, exampleUrl: string, errorHandler?: (err: CallbackError) => void) {

    element.addEventListener("click", (ev) => {


        const request = new XMLHttpRequest();
        request.addEventListener("load", (e) => {

            const plan = request.responseText;

            const planFile = createFromPlanText(plan, exampleUrl);

            openPlanWindow(planFile);
        });
        request.open("GET", "/examples/" + exampleUrl);
        request.send(null);
    });
}

export function attachToFileSelector(element: HTMLElement, errorHandler?: (err: CallbackError) => void) {
    if (!element) return;

    element.addEventListener("click", (ev) => {

        const id = "reader_open_control";
        const item = document.getElementById(id);
        if (item) {
            item.click();
            return;
        }

        const inputItem = document.createElement("input");
        inputItem.id = "reader_open_control";
        inputItem.multiple = true;
        inputItem.type = "file";
        inputItem.name = "files[]";

        inputItem.style.width = "0";
        inputItem.style.height = "0";
        inputItem.style.overflow = "hidden";
        inputItem.style.display = "fixed";
        inputItem.style.left = "-32000";
        inputItem.style.top = "-32000";

        inputItem.addEventListener("change", (e) => {
            const files = (<any>e.target).files;

            for (const file of files) {

                createFromFile(file, (e, d) => {
                    if (e) {
                        if (errorHandler) {
                            errorHandler(e);
                        }
                        return;
                    }
                    if (d) {
                        openPlanWindow(d);
                    }
                });
            }
        });

        document.body.appendChild(inputItem);
        inputItem.click();

    });
}

export function attachToTextarea(element: HTMLTextAreaElement, errorHandler?: (err: CallbackError) => void) {
    if (!element) return;

    element.addEventListener("paste", (e: ClipboardEvent) => {
        if (e && e.clipboardData) {
            const data = e.clipboardData.getData("text/plain");
            if (data) {
                const plan = createFromPlanText(data, ("pasted plan " + new Date().toDateString()));

                openPlanWindow(plan);
            }
            e.preventDefault();
            e.returnValue = false;
            e.stopPropagation();
        }
        return false;
    });
}

function openPlanWindow(planFileJson: string) {
    const childWindow = window.open("/webapp", newid());
    if (childWindow) {
        childWindow.addEventListener("supratimas", event => {
            (<any>childWindow).supratimas.update(planFileJson);
        });
        if ((<any>childWindow).supratimas) {
            (<any>childWindow).supratimas.update(planFileJson);
        }
    }
}

function createFromFile(file: File, cb: Callback<string>) {

    const properties = {
        id: newid(),
        name: file.name,
        lastModified: new Date(),
        size: file.size,
        nodeViewMetadata: {
            scrollLeft: 0,
            scrollTop: 0,
            scale: 1,
            showInfo: true
        }
    };

    var reader: FileReader = new FileReader();
    reader.addEventListener("load", (e: any) => {

        if (e.target.error) {
            cb(e.target.error);
        } else {

            try {

                const data = {
                    meta: JSON.stringify(properties),
                    content: e.currentTarget.result
                };

                cb(null, JSON.stringify(data));
            }
            catch (err) {
                cb(err);
            }
        }
    });

    reader.readAsText(file);
}

export function createFromPlanText(planText: string, planName: string) {

    const properties = {
        id: newid(),
        name: planName ? planName : ("plan from " + new Date().toDateString()),
        lastModified: new Date(),
        size: 0,
        nodeViewMetadata: {
            scrollLeft: 0,
            scrollTop: 0,
            scale: 1,
            showInfo: true
        }
    };

    const data = {
        meta: JSON.stringify(properties),
        content: planText
    };

    return JSON.stringify(data);
}

function newid() {
    return (Math.random() * 16).toString(16).replace(/\./, "0").toLowerCase();
}