module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('eslint');
    config.module.rules.delete('eslint-plugin-vue');
  }
}