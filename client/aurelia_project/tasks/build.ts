import * as gulp from 'gulp';
import * as swPreCache from 'sw-precache';
import * as deleteLines from 'gulp-delete-lines';
import * as inject from 'gulp-inject';
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
  const envFlag = CLIOptions.getEnvironment();
  console.log(`The Environment is: ${envFlag}`);
  switch (envFlag) {
    case 'prod':
      return buildCLI.dest().then(() => {
        swPreCache.write(
          './service-worker.js',
          {
            staticFileGlobs: [
              './scripts/*.js',
              './static/images/*.png',
              './static/css/*.css',
              './static/webfonts/*.*',
              './index.html',
              './manifest.json',
            ],
            stripPrefix: '',
          },
          () => {
            console.log('Service Worker Written');
            const target = gulp.src('./index.html');
            const sources = gulp.src('./service-worker-registration.js');
            target.pipe(inject(sources)).pipe(gulp.dest('./'));
            console.log('Service Worker Injected');
          }
        );
      });
    case 'dev':
      gulp
        .src('./index.html')
        .pipe(
          deleteLines({
            filters: ['<script src="/service-worker-registration.js"></script>'],
          })
        )
        .pipe(gulp.dest('./'));
      return buildCLI.dest();
    default:
      return buildCLI.dest();
  }
}

export { main as default };
