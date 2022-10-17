<template>
  <view class="my__tabs__wrapper">
    <view class="my__tabs__content">
      <image class="bg" src="../assets/images/tab_bg.png" referrerPolicy="no-referrer" />
      <template v-for="(item, index) in tabbarList">
        <image
          :key="item.path"
          class="img"
          referrerPolicy="no-referrer"
          :src="item.url"
          @click="handleSwitch(item, index)"
        ></image>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    activeTab: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      activeIndex: null,
      tabbarList: [
        {
          url: require('@/assets/images/tabs/tab1.png'),
          path: '/pages/home/index'
        },
        {
          url: require('@/assets/images/tabs/tab2.png'),
          path: '/pages/personal/myAwardBag'
        },
        {
          url: require('@/assets/images/tabs/tab3.png'),
          path: '/pages/personal/index'
        }
      ]
    }
  },
  methods: {
    handleSwitch(item, index) {
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
    position: relative;
    padding: pxTorpx(8) pxTorpx(10) pxTorpx(15);
    @include flex(center, space-between);
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      display: block;
      left: 0;
      bottom: 0;
      z-index: -1;
    }
    .img {
      width: pxTorpx(88);
      height: pxTorpx(80);
      margin-top: -30rpx;
    }
  }
}
</style>
