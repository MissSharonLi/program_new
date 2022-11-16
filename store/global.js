import { domain } from '../sdk/config'
const globalModule = {
  namespaced: true,
  state: {
    token: '',
    userInfo: {},
    areaList: {},
    siteConfig: {},
    navBarHeight: '',
    familyArray: [
      {
        family: 'STHupo',
        source: `url("${domain}assets/apifonts/FangZhengHeiTi-GBK-1.ttf")`
      },
      {
        family: 'Yuanti',
        source: `url("${domain}assets/apifonts/TengXiangJiaLiZhunCuYuanJian-2.ttf")`
      },
      {
        family: 'PingFang',
        source: `url("${domain}assets/apifonts/PingFang.ttf")`
      },
      {
        family: 'ShenPin',
        source: `url("${domain}assets/apifonts/RuiZiAoYunJingShenPinBoJianMianFei-Shan(REEJI-PinboGB-Flash)-2.ttf")`
      }
    ]
  },
  getters: {
    getNavBarHeight(state) {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync()
      // 胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
      state.navBarHeight =
        (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 +
        menuButtonInfo.height +
        systemInfo.statusBarHeight
      return state.navBarHeight * 1.5 + 'px'
    }
  },
  mutations: {
    setFontFamily(state) {
      state.familyArray.forEach((item) => {
        wx.loadFontFace({
          family: item.family,
          global: true,
          source: item.source,
          success(res) {
            // console.log(res.status)
          },
          fail: function (res) {
            // console.log(res.status)
          },
          complete: function (res) {
            // console.log(res.status)
          }
        })
      })
    },
    setToken(state, data) {
      state.token = data || ''
    },
    setUserInfo(state, data) {
      state.userInfo = JSON.parse(data || '{}')
    },
    setAreaList(state, data) {
      state.areaList = JSON.parse(data || '{}')
    },
    setSiteConfig(state, data) {
      state.siteConfig = JSON.parse(data || '{}')
    }
  },
  actions: {
    initFontFamily({ commit }) {
      commit('setFontFamily')
    }
  }
}
export default globalModule
