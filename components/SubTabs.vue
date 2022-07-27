<template>
  <view class="notify__nav__content" :style="{ top: isCustom && navBarHeight }">
    <view
      v-for="(item, index) in dataSource"
      :key="index"
      class="notify__nav__item"
      :class="{ active: tabIndex === index }"
      @click="handleTab(index, item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>
<script>
export default {
  props: {
    isCustom: {
      type: Boolean,
      default: () => false
    },
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
    handleTab(index, value) {
      this.tabIndex = index
      this.$emit('tabClick', value || index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.notify__nav {
  &__content {
    background-color: $sub-nav-theme-color;
    @include flex(center, space-around);
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9;
    height: pxTorpx(55);
  }
  &__item {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    padding-top: pxTorpx(20);
    padding-bottom: pxTorpx(5);
    &::after {
      content: '';
      display: block;
      width: pxTorpx(16);
      height: pxTorpx(3);
      background-color: transparent;
      margin: 0 auto;
      margin-top: pxTorpx(5);
      border-radius: pxTorpx(3);
    }
    &.active {
      color: $theme-light-color;
      &::after {
        background-color: $theme-light-color;
      }
    }
  }
}
</style>
