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
    padding: pxTorpx(8) pxTorpx(15) pxTorpx(15);
    @include flex(center, space-around);
    background: url('@/assets/images/tab_bg.png') no-repeat center;
    background-size: 100%;
    margin-bottom: -5px;
    .img {
      width: pxTorpx(68);
      height: pxTorpx(68);
    }
  }
}
</style>
