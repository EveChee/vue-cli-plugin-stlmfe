module.exports = api => {
  const isTs = api.entryFile.endsWith('.ts')
  const usesRouter = Boolean(require(api.resolve('package.json')).dependencies['vue-router'])
  const projectName = require(api.resolve('package.json')).name;

  api.render({
    [api.entryFile]: './template/src/main.js',
    [`./src/set-public-path.${isTs ? 'ts' : 'js'}`]: './template/src/set-public-path.js',
    [`./src/single-spa-vue-mfe.${isTs ? 'ts' : 'js'}`]: isTs ? './template/src/single-spa-vue-mfe.ts' : './template/src/single-spa-vue-mfe.js',
  }, {
  isTs,
  usesRouter,
  appName: projectName,
});

api.extendPackage({
  dependencies: {
    'systemjs-webpack-interop': '^1.1.0',
  }
})
}
