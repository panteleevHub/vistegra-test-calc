<template>
  <div class="counter">
    <button
      @click="onDecreaseCountClick"
      class="button counter__button"
      type="button"
      :disabled="isDecreaseButtonDisabled"
    >
      -
    </button>
    <span>{{ count }}</span>
    <button
      @click="onIncreaseCountClick"
      class="button counter__button"
      type="button"
    >
      +
    </button>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  },

  emits: ['count'],

  computed: {
    isDecreaseButtonDisabled() {
      return this.count === 1;
    }
  },

  methods: {
    onDecreaseCountClick() {
      this.$emit('count', this.count - 1);
    },

    onIncreaseCountClick() {
      this.$emit('count', this.count + 1);
    }
  }
}
</script>

<style scoped>
.counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.counter__button {
  padding: 0 5px;
}
</style>
