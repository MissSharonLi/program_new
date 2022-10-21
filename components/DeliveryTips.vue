<template>
  <VanPopup
    :show="show"
    round
    :custom-style="`border-radius:10px;width:90%;background-color:#fff;border:2px solid #0071bc`"
    @close.native="handleClose"
  >
    <view class="tips" :class="{ custom: type === 1 }">
      <rich-text :nodes="notice"></rich-text>
    </view>
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
    },
    color: {
      type: String,
      default: () => '#fff'
    },
    backgroundColor: {
      type: String,
      default: () => '#fbb03b'
    },
    type: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    handleClose(val) {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.tips {
  text-align: justify;
  font-size: pxTorpx(12);
  min-height: pxTorpx(250);
  padding: pxTorpx(20);
  line-height: 1.8;
  color: #fff;
  font-family: $Yuanti;
  background-color: $white;
  &::after {
    content: '';
    position: absolute;
    width: pxTorpx(45);
    height: pxTorpx(30);
    background: url('@/assets/images/dolphin.png') no-repeat;
    background-size: 100% 100%;
    right: 0;
    top: 0;
  }
  &.custom {
    color: #000;
    background-color: #fff;
  }
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
