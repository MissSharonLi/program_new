<template>
  <view class="my__tabs__wrapper">
    <view class="my__tabs__content">
      <template v-for="(item, index) in tabbarList">
        <image
          :key="item.path"
          class="img"
          :src="tabProps.activeTab === index ? item.url_a : item.url"
          @click="handleSwitch(item, index)"
        ></image>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    tabProps: {
      type: Object,
      default: () => ({
        activeTab: null
      })
    }
  },
  data() {
    return {
      activeIndex: null,
      tabbarList: [
        {
          url: require('@/assets/images/tabs/tab1.png'),
          url_a: require('@/assets/images/tabs/tab1-a.png'),
          path: '/pages/home/index'
        },
        {
          url: require('@/assets/images/tabs/tab2.png'),
          url_a: require('@/assets/images/tabs/tab2-a.png'),
          path: '/pages/personal/myAwardBag'
        },
        {
          url: require('@/assets/images/tabs/tab3.png'),
          url_a: require('@/assets/images/tabs/tab3-a.png'),
          path: '/pages/personal/index'
        }
      ]
    }
  },
  methods: {
    handleSwitch(item, index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.tabProps.activeIndex = index
      uni.switchTab({ url: item.path })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.my__tabs {
  &__wrapper {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
  }
  &__content {
    padding: pxTorpx(10) pxTorpx(15) pxTorpx(15);
    background-color: $white;
    @include flex(center, space-between);
    .img {
      width: pxTorpx(60);
      height: pxTorpx(60);
      // margin-top: -70rpx;
    }
  }
}
</style>
