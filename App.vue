<script>
export default {
  globalData: {
    type: 1
  },
  onLaunch: function () {
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
  background: url('@/assets/images/common.png') no-repeat top;
  background-size: 100%;
  background-color: $theme-bg-color;
}
.van-checkbox__icon--checked {
  background-color: #f15a24 !important;
  border-color: #f15a24 !important;
}
.van-checkbox__icon {
  border: 2px solid #f15a24 !important;
}
.van-checkbox__label {
  color: #fff !important;
}
</style>
