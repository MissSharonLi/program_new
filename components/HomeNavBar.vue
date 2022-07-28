<template>
  <view
    class="custom__nav__content"
    :class="{ default: isDefault }"
    :style="{ width: '100%', height: navBarHeight }"
  >
    <text class="nav__title">{{ title }}</text>
  </view>
</template>
<script>
export default {
  name: 'HomeNavBar',
  props: {
    type: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    navBarHeight() {
      return this.$store.getters.getNavBarHeight
    }
  }
}
</script>
<style lang="scss" scoped>
.custom__nav__content {
  width: 100%;
  height: 100%;
  background-color: $theme-title-color;
  display: flex;
  align-items: bottom;
  display: flex;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  .nav__title {
    font-family: $PingFang;
    font-weight: 700;
    font-size: pxTorpx(18);
    color: $white;
    text-align: center;
    display: block;
    margin: 0 auto;
  }
}
</style>
