<template>
  <VanPopup :show="show" round custom-style="border-radius:10px;width:90%;background-color:#404040">
    <view class="tips">{{ notice }}</view>
    <view class="tips__footer" @click="show = false">关闭</view>
  </VanPopup>
</template>
<script>
import VanPopup from '@/wxcomponents/vant/popup/index'
export default {
  components: {
    VanPopup
  },
  props: {
    notice: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.tips {
  text-align: justify;
  font-size: pxTorpx(12);
  min-height: pxTorpx(100);
  padding: pxTorpx(20);
  line-height: 1.8;
  color: $white;
  &__footer {
    width: pxTorpx(80);
    height: pxTorpx(30);
    line-height: pxTorpx(30);
    background-color: #f8dc4c;
    color: $white;
    text-align: center;
    margin: pxTorpx(10) auto;
    border-radius: pxTorpx(5);
  }
}
</style>
