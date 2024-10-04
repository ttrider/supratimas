/* jshint -W104 */
const gulp = require("gulp"),
    concat = require("gulp-concat"),
    printdef = require("gulp-print"),
    log = require("fancy-log"),
    uglify = require('gulp-uglify');
const print = printdef.default;

function targetJS(owner) {
    const _this = this;
    this.owner = owner;

    this.fileName = "lib.js";
    this.path = {
        dist: this.owner.path + "/js"
    };
    this.libraries = [
        "./node_modules/knockout/build/output/knockout-latest.js",
        "./node_modules/animejs/anime.min.js",
        "./node_modules/sax/lib/sax.js",
        "./node_modules/requirejs/require.js"
    ];

    this.build = function(tasks) {
        const ret = [];

        var tn = _this.owner.name + "-libraries";
        tasks.push(tn);
        gulp.task(tn, function() {
            return gulp.src(_this.libraries)
                .pipe(print())
                .pipe(concat(_this.fileName))
                .pipe(uglify())
                .pipe(print())
                .pipe(gulp.dest(_this.path.dist));
        });

    };

    this.watch = function(tasks) {
        _this.build(tasks);
    };
}

module.exports = targetJS;