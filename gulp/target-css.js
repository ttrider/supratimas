/* jshint -W104 */
/* jshint -W119 */
const gulp = require("gulp"),
    printdef = require("gulp-print"),
    less = require('gulp-less'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    log = require("fancy-log"),
    newer = require('gulp-newer'),
    path = require('path'),
    watch = require('gulp-watch');
const print = printdef.default;

function targetCSS(owner) {
    const _this = this;
    this.owner = owner;

    this.lessFiles = [];

    this.resources = [
        "i", "f"
    ];
    this.path = {
        dist: this.owner.path + "/css",
        src: "./css"
    };

    this.setSource = function(rootFile, targetFile) {
        _this.lessFiles.push({
            rootFile: rootFile,
            fileName: targetFile
        });
        return _this.owner;
    };

    this.build = function(tasks) {

        var tn = _this.owner.name + "-less";
        tasks.push(tn);
        gulp.task(tn, function() {
            return processLess();
        });

        tn = _this.owner.name + "-resources";
        tasks.push(tn);
        gulp.task(tn, function() {
            return processResources();
        });


    };

    this.watch = function(tasks) {
        _this.build(tasks);

        const dtn = _this.owner.name + "-less";

        const tn = _this.owner.name + "-less-watch";
        tasks.push(tn);
        gulp.task(tn, [dtn], function() {
            var watchPath = _this.path.src + "/*.less";
            log(`watching ${watchPath}...`);
            return watch(watchPath, function() {
                return processLess();
            });
        });

    };



    function processLess() {

        for (const fileInfo of _this.lessFiles) {
            var rootFile = path.resolve(_this.path.src, fileInfo.rootFile);
            var targetFile = path.resolve(_this.path.dist, fileInfo.fileName);
            gulp.src(rootFile)
                .pipe(less())
                .pipe(uglifycss())
                .pipe(rename(fileInfo.fileName))
                .pipe(print())
                .pipe(gulp.dest(path.dirname(targetFile)));

        }

    }

    function processResources() {
        for (const item of _this.resources) {
            var src = _this.path.src + "/" + item + "/**/*.*";
            gulp.src(src)
                .pipe(newer(_this.path.dist + "/" + item))
                .pipe(print())
                .pipe(gulp.dest(_this.path.dist + "/" + item));
        }
    }
}


module.exports = targetCSS;