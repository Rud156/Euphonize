import * as gulp from 'gulp';
import * as deleteLines from 'gulp-delete-lines';
import { CLIOptions, build as buildCLI } from 'aurelia-cli';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import copyFiles from './copy-files';
import watch from './watch';
import * as project from '../aurelia.json';

let build = gulp.series(
  readProjectConfiguration,
  gulp.parallel(transpile, processMarkup, processCSS, copyFiles),
  writeBundles
);

let main;

if (CLIOptions.taskName() === 'build' && CLIOptions.hasFlag('watch')) {
  main = gulp.series(build, done => {
    watch(null);
    done();
  });
} else {
  main = build;
}

function readProjectConfiguration() {
  return buildCLI.src(project);
}

function writeBundles() {
  gulp
    .src('./index.html')
    .pipe(
      deleteLines({
        filters: ['<script src="\/service-worker-registration\.js"><\/script>'],
      })
    )
    .pipe(gulp.dest('./'));
  return buildCLI.dest();
}

export { main as default };
