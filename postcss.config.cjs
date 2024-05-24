// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      viewportWidth: 1920, // UI设计稿的宽度
      propList: ['*'],
      selectorBlackList: ['.norem'], // 过滤掉.norem-开头的class，不进行rem转换
    },
  },
}
