<template>
  <VanPopup
    :show="show"
    round
    :custom-style="`border-radius:10px;width:90%;background-color:#fff`"
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
  color: $white;
  font-family: $Yuanti;
  background-color: #f8dc4c;
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
