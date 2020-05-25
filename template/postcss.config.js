module.exports = () => {
  return {
    plugins:[
      require('postcss-plugin-namespace')('#<%=appName%>', { ignore: [ /^\.el-/ , '#<%=appName%>'] }),
      require('autoprefixer')
    ],
  }
}
