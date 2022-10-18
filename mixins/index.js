const mixins = {
  computed: {
    navBarHeight() {
      return this.$store.getters.getNavBarHeight
    },
    navHeight() {
      return Number(this.$store.getters.getNavBarHeight.replace('px', '')) - 20
    },
    token() {
      return this.$store.state.token || uni.getStorageSync('storage_token')
    },
    userInfo() {
      return this.$store.state.userInfo || uni.getStorageSync('storage_userInfo')
    },
    siteConfig() {
      return this.$store.state.siteConfig || uni.getStorageSync('storage_siteConfig')
    },
    areaList() {
      return this.$store.state.areaList || {}
    }
  },
  async onPullDownRefresh() {
    try {
      await this.$nextTick()
      this.returnData = []
      this.params.page = 1
      await this.getData()
      uni.stopPullDownRefresh()
    } catch {
    } finally {
      uni.stopPullDownRefresh()
    }
  }
}
export default mixins
