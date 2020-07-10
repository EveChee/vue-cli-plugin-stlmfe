module.exports = (api, options) => {
  /*
  css的分离 一些文档会为了保证最小引入数量
  而建议将css分离关闭 实际不影响样式隔离 因为重点在自动化前缀
  */
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
    /*
      这里删除公共包标签引入设置 是因为
      1.systemjs无法处理
      2.有说设置publicPath解决 但实际未找到办法
      3.因为提取出来的包在webpack剩余的app.js没有指定引入
      而是外链的方式加载 所以相当于缺失了一部分包
      */
    webpackConfig.optimization.delete('splitChunks')

    webpackConfig.output.libraryTarget('umd')

    webpackConfig.set('devtool', 'sourcemap')
  })
}