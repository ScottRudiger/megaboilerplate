import { join } from 'path';
import { cpy, replaceCode, templateReplace, addNpmPackage, addNpmScript } from '../utils';

async function generateGulpBuildTool(params) {
  const build = join(__base, 'build', params.uuid);
  const gulpfile = join(__dirname, 'modules', 'gulp', 'gulpfile.js');

  await cpy([gulpfile], build);

  await addNpmScript('postinstall', 'gulp build', params);

  await addNpmPackage('gulp', params, true);
  await addNpmPackage('gulp-if', params, true);
  await addNpmPackage('gulp-util', params, true);
  await addNpmPackage('yargs', params, true);
  await addNpmPackage('gulp-sourcemaps', params, true);
  await addNpmPackage('gulp-uglify', params, true);
  await addNpmPackage('vinyl-buffer', params, true);
  await addNpmPackage('gulp-plumber', params, true);
  await addNpmPackage('gulp-csso', params, true);
  await addNpmPackage('gulp-autoprefixer', params, true);

  let buildTasks = [];

  switch (params.cssPreprocessor) {
    case 'sass':
      const sassGulpRequire = join(__dirname, 'modules', 'gulp', 'sass-gulp-require.js');
      const sassGulpTask = join(__dirname, 'modules', 'gulp', 'sass-gulp-task.js');

      await addNpmPackage('gulp-sass', params, true);

      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_REQUIRE', sassGulpRequire);
      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_TASK', sassGulpTask);

      buildTasks.push('sass');
      break;

    case 'less':
      const lessGulpRequire = join(__dirname, 'modules', 'gulp', 'less-gulp-require.js');
      const lessGulpTask = join(__dirname, 'modules', 'gulp', 'less-gulp-task.js');

      await addNpmPackage('gulp-less', params, true);

      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_REQUIRE', lessGulpRequire);
      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_TASK', lessGulpTask);

      buildTasks.push('less');
      break;

    case 'css':
      const cssGulpRequire = join(__dirname, 'modules', 'gulp', 'css-gulp-require.js');
      const cssGulpTask = join(__dirname, 'modules', 'gulp', 'css-gulp-task.js');

      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_REQUIRE', cssGulpRequire);
      await replaceCode(join(build, 'gulpfile.js'), 'CSS_PREPROCESSOR_GULP_TASK', cssGulpTask);

      buildTasks.push('css');
      break;

    default:
      break;
  }

  switch (params.jsFramework) {
    case 'react':
      const reactGulpRequire = join(__dirname, 'modules', 'gulp', 'react', 'react-gulp-require.js');
      const reactGulpTask = join(__dirname, 'modules', 'gulp', 'react', 'react-gulp-task.js');

      await addNpmPackage('vinyl-source-stream', params, true);
      await addNpmPackage('babelify', params, true);
      await addNpmPackage('browserify', params, true);
      await addNpmPackage('watchify', params, true);
      await addNpmPackage('babel-preset-es2015', params, true);
      await addNpmPackage('babel-preset-react', params, true);

      await replaceCode(join(build, 'gulpfile.js'), 'JS_FRAMEWORK_GULP_REQUIRE', reactGulpRequire);
      await replaceCode(join(build, 'gulpfile.js'), 'JS_FRAMEWORK_GULP_TASK', reactGulpTask);

      buildTasks.push('react');
      break;

    case 'angularjs':
      const angularjsGulpRequire = join(__dirname, 'modules', 'gulp', 'angularjs', 'angularjs-require.js');
      const angularjsGulpTask = join(__dirname, 'modules', 'gulp', 'angularjs', 'angularjs-task.js');

      await addNpmPackage('gulp-concat', params, true);
      await addNpmPackage('gulp-ng-annotate', params, true);
      await addNpmPackage('gulp-angular-templatecache', params, true);

      await replaceCode(join(build, 'gulpfile.js'), 'JS_FRAMEWORK_GULP_REQUIRE', angularjsGulpRequire);
      await replaceCode(join(build, 'gulpfile.js'), 'JS_FRAMEWORK_GULP_TASK', angularjsGulpTask);

      buildTasks.push('angular', 'templates');
      break;

    default:
      break;
  }

  await templateReplace(join(build, 'gulpfile.js'), {
    buildTasks: "'" + buildTasks.join("', '") + "'"
  });
}

export default generateGulpBuildTool;
