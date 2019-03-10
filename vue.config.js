module.exports = {
  pwa: {
    name: 'Souvenir',
    themeColor: '#8420a7',
    msTileColor: '#212045',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      importWorkboxFrom: 'local'
    }
  },
  parallel: false,
  chainWebpack: (config) => {
    config.module.rule('worker')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('worker-loader')
  }
}
