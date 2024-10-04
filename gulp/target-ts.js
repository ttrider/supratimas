/* jshint -W104 */

const ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    printdef = require("gulp-print"),
    log = require("fancy-log"),
    newer = require('gulp-newer'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    gulp = require("gulp");
const print = printdef.default;



function targetTS(owner) {
    const _this = this;
    this.owner = owner;

    this.files = [];

    this.path = {
        dist: this.owner.path + "/js",
        src: "./src"
    };


    this.setFile = function(file) {
        _this.files.push(file);
        return _this.owner;
    };

    this.build = function(tasks) {
        var tn = _this.owner.name + "-ts";
        tasks.push(tn);
        gulp.task(tn, function() {
            for (let i = 0; i < _this.files.length; i++) {
                console.info(_this.files[i]);
                processTSFile(_this.files[i]);
            }
            processTS();
        });
    };

    this.watch = function(tasks) {

        _this.build(tasks);

        const dtn = _this.owner.name + "-ts";

        const tn = _this.owner.name + "-ts-watch";
        tasks.push(tn);
        gulp.task(tn, [dtn], function() {

            var watchPath = _this.path.src + "/**/*.ts";
            log(`watching ${watchPath}...`);
            return watch(watchPath, function() {

                for (let i = 0; i < _this.files.length; i++) {
                    processTSFile(_this.files[i]);
                }

                return processTS();
            });
        });

    };

    function processTS() {

        var tsProject = ts.createProject({
            "target": "es5",
            "module": "amd",
            "lib": [
                "dom",
                "es5",
                "scripthost",
                "es2015.iterable"
            ],
            outFile: "app.js",
            strict: true,
            declaration: true,
            sourceMap: true,
            noImplicitAny: false,
            strictNullChecks: false
        });

        var tsResult = gulp.src(_this.path.src + "/**/*.ts")
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return merge([
            tsResult.js.pipe(sourcemaps.write()),
            tsResult.js
            //.pipe(uglify())
            .pipe(print())
            .pipe(gulp.dest(_this.path.dist)),
            tsResult.dts
            .pipe(print())
            .pipe(gulp.dest(_this.path.dist)),
        ]);
    }

    function processTSFile(file) {
        console.info("processing file " + file);
        console.info(_this.path.src + "/" + file);

        var tsProject = ts.createProject({
            "target": "es5",
            "module": "amd",
            "lib": [
                "dom",
                "es5",
                "scripthost",
                "es2015.iterable"
            ],
            //outFile: "app.js",
            strict: true,
            declaration: true,
            sourceMap: true,
            noImplicitAny: false,
            strictNullChecks: false
        });

        var tsResult = gulp.src(_this.path.src + "/" + file)
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return merge([
            tsResult.js.pipe(sourcemaps.write()),
            tsResult.js
            // .pipe(uglify())
            .pipe(print())
            .pipe(gulp.dest(_this.path.dist)),
            tsResult.dts
            .pipe(print())
            .pipe(gulp.dest(_this.path.dist)),
        ]);
    }
}

module.exports = targetTS;