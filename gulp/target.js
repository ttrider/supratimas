/* jshint -W104 */
const
    path = require("path"),
    target_js = require("./target-js"),
    target_css = require("./target-css"),
    target_html = require("./target-html"),
    target_ts = require("./target-ts"),
    target_art = require("./target-artefacts");

function target(name) {
    const _this = this;
    this.name = name;
    this.path = path.resolve(".", "dist", name);

    this.html = new target_html(this);
    this.css = new target_css(this);
    this.js = new target_js(this);
    this.ts = new target_ts(this);
    this.art = new target_art(this);

    this.build = function(tasks) {
        _this.css.build(tasks);
        _this.html.build(tasks);
        _this.js.build(tasks);
        _this.ts.build(tasks);
        _this.art.build(tasks);
        return _this;
    };

    this.watch = function(tasks) {

        _this.css.watch(tasks);
        _this.html.watch(tasks);
        _this.js.watch(tasks);
        _this.ts.watch(tasks);
        _this.art.watch(tasks);
        return _this;
    };


    return this;
}


module.exports = target;