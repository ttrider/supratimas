/* jshint -W104 */


const target = require("./gulp/target"),
    gulp = require("gulp");

const watchTasks = [];
const buildTasks = [];

var site = new target("web")
    .ts.setFile("webapp/supratimas.ts")
    .css.setSource("site.less", "main.css")
    .html.setSource(["webapp/index.html", "index.html", "terms/index.html", "privacy/index.html"])
    .art.add("favicon.ico", "./")
    .art.add("files/setup.supratimas.2.2.0.exe", "./files")
    .art.add("files/setup.supratimas.addin.1.1.2000.exe", "./files")
    .art.add("examples/example01.sqlplan", "./examples")
    .art.add("examples/example02.sqlplan", "./examples")
    .art.add("examples/example03.sqlplan", "./examples")
    .art.add("files/version.txt", "./")
    .build(buildTasks)
    .watch(watchTasks);

var ssms = new target("ssms")
    .css.setSource("ssms.less", "main.css")
    .html.setSource(["ssms.html"])
    .build(buildTasks)
    .watch(watchTasks);

// var vscode = new target("vscode")
//     .css.setSource("ssms.less")
//     .html.setSource(["ssms.html"])
//     .build(buildTasks)
//     .watch(watchTasks);

gulp.task("build", buildTasks, function() {

});

gulp.task("watch", watchTasks, function() {

});

gulp.task("default", ["watch"], function() {

});


gulp.task("ssmscopy", function() {
    return gulp.src("./dist/ssms/**/*")
        .pipe(gulp.dest("../supra-ssms/vsix/Local"))
});



//shell(["python -m SimpleHTTPServer 5000"], { cwd: "./site" });