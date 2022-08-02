<template>
  <view class="list__tab__content">
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
  font-size: pxTorpx(16);
  color: #f6c25f;
  font-style: normal;
  letter-spacing: 1px;
  .active {
    color: #f6a60f;
    font-size: pxTorpx(18);
    font-family: $STHupo;
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: pxTorpx(13);
      height: pxTorpx(13);
      background: url('@/assets/images/sub.png') no-repeat;
      background-size: 100% 100%;
      bottom: 0;
      left: calc(50% - 15rpx);
    }
  }
}
</style>
