const APP_NAME = require('package.json').name
module.exports = () => {
  return {
    plugins:[
      require('postcss-plugin-namespace')(`#${APP_NAME}`, { ignore: [ /^\.el-/ , `#${APP_NAME}`] }),
      require('autoprefixer')
    ],
  }
}
