/* jshint -W104 */
/* jshint -W119 */
const gulp = require("gulp"),
    printdef = require("gulp-print"),
    log = require("fancy-log"),
    fileinclude = require('gulp-file-include'),
    newer = require('gulp-newer'),
    htmlmin = require('gulp-htmlmin'),
    path = require('path'),
    fs = require('fs'),
    watch = require('gulp-watch');
const print = printdef.default;

function targetHTML(owner) {
    const _this = this;
    this.owner = owner;


    this.files = [];
    this.path = {
        dist: this.owner.path,
        src: "./html"
    };
    /**
     * @returns {target}
     */
    this.setSource = function(sourceFiles) {
        _this.files = sourceFiles;
        return _this.owner;
    };

    this.build = function(tasks) {


        var tn = _this.owner.name + "-html";
        tasks.push(tn);
        gulp.task(tn, function() {
            processHtml();
        });

    };

    this.watch = function(tasks) {

        _this.build(tasks);

        const dtn = _this.owner.name + "-html";

        const tn = _this.owner.name + "-html-watch";
        tasks.push(tn);
        gulp.task(tn, [dtn], function() {

            var watchPath = _this.path.src + "/**/*.html";
            log(`watching ${watchPath}...`);
            return watch(watchPath, function() {
                return processHtml();
            });
        });

    };


    function processHtml() {

        var fileIncludeSettings = {
            prefix: '@@',
            basepath: '@file',
            context: {}
        };

        for (const rootFileName of _this.files) {
            var rootFile = path.resolve(_this.path.src, rootFileName);
            var targetFile = path.resolve(_this.path.dist, rootFileName);

            log(`processing ${rootFile} into ${targetFile} ...`);
            log(`exists: ${fs.existsSync(rootFile)}`);
            gulp.src([rootFile])
                .pipe(fileinclude(fileIncludeSettings))
                .pipe(print())
                //.pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, maxLineLength: 100 }))
                .pipe(gulp.dest(path.dirname(targetFile)));
        }
    }
}


module.exports = targetHTML;