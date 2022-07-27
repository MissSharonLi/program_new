<script>
export default {
  globalData: {
    type: 1
  },
  onLaunch: function () {
    uni.hideTabBar()
    this.commonUtils.checkUpdateVersion()
    this.$store.dispatch('initFontFamily')
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '/wxcomponents/vant/common/index.wxss';
@import '@/assets/css/common.scss';
page {
  background: url('@/assets/images/lang.png') no-repeat center pxTorpx(200);
  background-size: pxTorpx(375) pxTorpx(265);
  background-color: $uni-theme-background-color;
}
.van-checkbox__icon--checked {
  background-color: $uni-theme-color !important;
  border-color: $uni-theme-color !important;
}
</style>
