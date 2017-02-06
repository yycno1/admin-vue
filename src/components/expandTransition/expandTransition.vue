<template>
  <transition
    name="expand"
    @beforeEnter="beforeEnter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @afterLeave="afterLeave">
    <slot></slot>
  </transition>
</template>

<script>
export default{
  methods: {
    beforeEnter(el) {
      el.classList.add('collapsing');
      setTimeout(() => {
        el.style.maxHeight = '500px';
      }, 10);
    },
    afterEnter(el) {
      el.classList.remove('collapsing');
      el.style.maxHeight = `${el.scrollHeight}px`;
    },
    beforeLeave(el) {
      el.classList.add('collapsing');
      el.style.maxHeight = 0;
    },
    afterLeave(el) {
      el.classList.remove('collapsing');
    },
  },
};
</script>

<style>
.collapsing{
  transition: max-height 0.337s ease-in-out;
  overflow: hidden;
  max-height: 0;
}
</style>
