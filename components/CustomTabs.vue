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
  color: $white;
  font-style: normal;
  letter-spacing: 1px;
  margin: 0 pxTorpx(10);
  padding: 0 pxTorpx(30);
  background: url('@/assets/images/bg7.png') no-repeat center;
  background-size: 100%;
  .active {
    color: #ffff00;
    font-family: $STHupo;
    position: relative;
    -webkit-text-stroke: 1px #fbc90f;
    // &::after {
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   width: pxTorpx(13);
    //   height: pxTorpx(13);
    //   background: url('@/assets/images/sub.png') no-repeat;
    //   background-size: 100% 100%;
    //   bottom: 0;
    //   left: calc(50% - 15rpx);
    // }
  }
}
</style>
