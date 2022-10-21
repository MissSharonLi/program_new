<template>
  <view class="content about__us" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar class="nav__wrapper" :isBack="true" title="关于我们"></HomeNavBar>
    <view class="about__us__content" :style="{ 'min-height': sightHeight + 'px' }">
      <rich-text :nodes="html"></rich-text>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      html: ''
    }
  },
  onLoad() {
    this.getData()
  },
  methods: {
    async getData() {
      const { code, data } = await api.getAboutUsList()
      if (code === 1) this.html = data
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.content {
  min-height: auto;
}
.about__us {
  &__content {
    margin: 0 auto;
    width: calc(100% - 60px);
    border: pxTorpx(6) solid #29abe2;
    background-color: #f0fcff;
    border-radius: pxTorpx(16);
    font-size: pxTorpx(14);
    color: #000;
    line-height: 1.8;
    text-align: justify;
    padding: 30rpx;
  }
}
</style>
