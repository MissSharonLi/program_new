const mixins = {
  computed: {
    navBarHeight() {
      return this.$store.getters.getNavBarHeight
    },
    token() {
      return this.$store.state.token || uni.getStorageSync('storage_token')
    },
    userInfo() {
      return this.$store.state.userInfo || uni.getStorageSync('storage_userInfo')
    },
    areaList() {
      return this.$store.state.areaList || {}
    }
  },
  async onPullDownRefresh() {
    await this.$nextTick()
    this.returnData = []
    this.params.page = 1
    await this.getData()
    uni.stopPullDownRefresh()
  }
}
export default mixins
