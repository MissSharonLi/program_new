<template>
  <view class="notify__nav__content" :style="{ top: isCustom && navHeight + 'px' }">
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
    @include flex(center, space-around);
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9;
    padding-top: pxTorpx(10);
  }
  &__item {
    font-family: $Yuanti;
    font-weight: 400;
    font-size: pxTorpx(14);
    background-color: #29abe2;
    border-radius: pxTorpx(10);
    border: pxTorpx(4) solid #29abe2;
    color: $white;
    padding: pxTorpx(5) pxTorpx(15);
    &.active {
      background-color: #0071bc;
    }
  }
}
</style>
