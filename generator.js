module.exports = api => {
  const isTs = api.entryFile.endsWith('.ts')
  const usesRouter = Boolean(require(api.resolve('package.json')).dependencies['vue-router'])
  const projectName = require(api.resolve('package.json')).name;

  api.render({
    [api.entryFile]: './template/src/main.js',
    './postcss.config.js': './template/postcss.config.js',
  }, {
    isTs,
    usesRouter,
    appName: projectName,
  });

  api.extendPackage({
    dependencies: {
      'single-spa-vue-mfe': '^1.0.0',
      'postcss-plugin-namespace': '^0.0.2',
    }
  })
}
