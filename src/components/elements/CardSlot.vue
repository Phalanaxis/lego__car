<template>
  <div class="card__container">
    <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .card {
    &__container {
      width: 100%;
      border: 1px solid hsla(0 ,0 ,100, 0.1);
      border-radius: 10px;
      padding: 15px;
      background-color: #282828;
      cursor: pointer;
      transition: border-color .3s;
      &:hover {
        border-color: hsla(0 ,0 ,100, 0.87);
      }
    }
  }
</style>