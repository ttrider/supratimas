/* jshint -W104 */
/* jshint -W119 */
const gulp = require("gulp"),
    path = require("path"),
    printdef = require("gulp-print"),
    less = require('gulp-less'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    log = require("fancy-log"),
    newer = require('gulp-newer'),
    watch = require('gulp-watch');
const print = printdef.default;

function targetArtefacts(owner) {
    const _this = this;
    this.owner = owner;

    this.resources = [];
    this.path = {
        dist: this.owner.path,
        src: "./"
    };

    this.add = function(src, dest) {
        this.resources.push({ src: src, dest: dest });
        return _this.owner;
    };

    this.build = function(tasks) {

        var tn = _this.owner.name + "-artefacts";
        tasks.push(tn);
        gulp.task(tn, function() {
            return processResources();
        });
    };

    this.watch = function(tasks) {
        _this.build(tasks);
    };

    function processResources() {
        for (const item of _this.resources) {
            var src = path.resolve(_this.path.src, item.src);
            var dest = path.resolve(_this.path.dist, item.dest);
            gulp.src(src)
                .pipe(newer(dest))
                .pipe(print())
                .pipe(gulp.dest(dest));
        }
    }
}


module.exports = targetArtefacts;