<template>
  <view class="list__tab__content">
    <image :src="require('@/assets/images/grass.png')" class="grass"></image>
    <text
      v-for="(item, index) in dataSource"
      :key="index"
      :class="{ active: tabIndex === index }"
      @click="handleTab(item, index)"
    >
      {{ item.title }}
    </text>
  </view>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  methods: {
    handleTab(item, index) {
      this.tabIndex = index
      this.$emit('shift', index)
    },
    handleShift(index) {
      this.tabIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.list__tab__content {
  line-height: pxTorpx(50);
  @include flex(center, space-around);
  font-family: $STHupo;
  font-weight: 400;
  font-size: pxTorpx(18);
  font-style: normal;
  letter-spacing: 1px;
  margin: 0 pxTorpx(10);
  padding: 0 pxTorpx(30);
  text-shadow: 0 1px #2e3192, 1px 0 #2e3192, -1px 0 #2e3192, 0 -1px #2e3192;
  color: $white;
  position: relative;
  .grass {
    width: 75rpx;
    height: 140rpx;
    position: absolute;
    left: -5rpx;
    top: -50rpx;
    z-index: -1;
  }
  .active {
    color: #ffff00;
    font-family: $STHupo;
    position: relative;
    text-shadow: 0 1px #2e3192, 1px 0 #2e3192, -1px 0 #2e3192, 0 -1px #2e3192;
  }
}
</style>
