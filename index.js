module.exports = (api, options) => {
  options.css.extract = false

  api.chainWebpack(webpackConfig => {
    webpackConfig
      .devServer
      .headers({
        'Access-Control-Allow-Origin': '*',
      })
      .set('disableHostCheck', true)

    webpackConfig
      .entry('app')
      .add('./src/main.ts')
      .end()
      .output.filename('[name].js')

    webpackConfig.optimization.delete('splitChunks')

    webpackConfig.output.libraryTarget('umd')

    webpackConfig.set('devtool', 'sourcemap')
  })
}