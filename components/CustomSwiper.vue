<template>
  <view class="swiper__content" :class="{ banner: isBanner }">
    <Swiper
      class="swiper"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
    >
      <Block v-for="(item, index) in dataSource" :key="index">
        <SwiperItem>
          <view class="swiper-item">
            <image
              v-if="item"
              class="swiper-image"
              :class="{ unique: isUnique }"
              :src="item"
              referrerPolicy="no-referrer"
            ></image>
          </view>
        </SwiperItem>
      </Block>
    </Swiper>
  </view>
</template>
<script>
export default {
  props: {
    isBanner: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: () => ['banner.jpeg', 'banner.jpeg']
    },
    isUnique: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      indicatorDots: false,
      autoplay: false,
      interval: 1000,
      duration: 500
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.swiper__content {
  height: pxTorpx(150);
  .swiper {
    margin-top: pxTorpx(5);
    height: 100%;
  }
  .swiper-item {
    height: pxTorpx(125);
    text-align: center;
    border-radius: pxTorpx(16);
    border: pxTorpx(8) solid #0071bc;
    .swiper-image {
      height: pxTorpx(125);
      text-align: center;
      width: 100%;
    }
  }
  &.banner {
    .swiper {
      margin-top: 0;
    }
    .swiper-item {
      height: pxTorpx(134);
      text-align: center;
      .swiper-image {
        width: pxTorpx(110) !important;
        height: pxTorpx(114) !important;
        border: pxTorpx(10) solid $white;
        border-radius: 0;
      }
    }
  }
}
</style>
