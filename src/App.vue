<template>
  <div class="calculator">
    <h1 class="visually-hidden">Калькулятор расчета каркаса</h1>
    <AppForm />
    <AppResult
      v-if="!isInCart"
      @enterCart="isInCart = true"
    />
    <AppCart
      v-else
      @exitCart="isInCart = false"
    />
  </div>
</template>

<script>
import AppForm from './components/AppForm.vue';
import AppResult from './components/AppResult.vue';
import AppCart from './components/AppCart.vue';

export default {
  data() {
    return {
      isInCart: false,
    }
  },

  components: {
    AppForm,
    AppResult,
    AppCart
  }
}
</script>

<style scoped>
.calculator {
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 30px;
  height: 100%;
}
</style>
