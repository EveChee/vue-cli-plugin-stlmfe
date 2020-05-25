module.exports = () => {
  return {
    plugins:[
      require('postcss-plugin-namespace')('.<%=appName%>', { ignore: [ /^\.el-/ ] }),
      require('autoprefixer')
    ],
  }
}
