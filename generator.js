module.exports = api => {
  const isTs = api.entryFile.endsWith('.ts')
  const usesRouter = Boolean(require(api.resolve('package.json')).dependencies['vue-router'])
  const projectName = require(api.resolve('package.json')).name;

  api.render({
    [api.entryFile]: './template/src/main.js',
    './postcss.config.js': './template/postcss.config.js',
    [`./src/set-public-path.${isTs ? 'ts' : 'js'}`]: './template/src/set-public-path.js',
  }, {
    isTs,
    usesRouter,
    appName: projectName,
  });

  api.extendPackage({
    dependencies: {
      'single-spa-vue-mfe': '^1.0.3',
      'postcss-plugin-namespace': '^0.0.2',
      'systemjs-webpack-interop': '^2.1.1',
    }
  })
}
