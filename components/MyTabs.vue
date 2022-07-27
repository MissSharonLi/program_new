<template>
  <view class="my__tabs__wrapper">
    <view class="my__tabs__content">
      <template v-for="(item, index) in tabbarList">
        <image
          :key="item.path"
          class="img"
          :src="item.url"
          @click="handleSwitch(item, index)"
        ></image>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
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
    padding: pxTorpx(10) pxTorpx(15) pxTorpx(15);
    background-color: $nav-theme-color;
    @include flex(center, space-between);
    .img {
      width: pxTorpx(80);
      height: pxTorpx(80);
      margin-top: -70rpx;
    }
  }
}
</style>
