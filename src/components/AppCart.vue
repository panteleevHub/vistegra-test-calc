<template>
  <div class="cart">
    <h2>Корзина</h2>
    <div class="cart__table">
      <table v-if="isTableShow" class="table table--cart">
        <tr>
          <th>Изделие</th>
          <th>Площадь</th>
          <th>Цена</th>
          <th>Количество</th>
        </tr>
        <tr v-for="(item, index) in items" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.area }}м2</td>
          <td>{{ item.price }}</td>
          <td>
            <ProductCounter
              @count="onCount($event, item.id)"
              :count="item.count"
            />
            <button
              @click="onDeleteItemClick(item.id)"
              class="button cart__delete-item"
              type="button"
            >
              Удалить
            </button>
          </td>
        </tr>
      </table>
      <p v-else class="cart__empty">Нет изделий</p>
    </div>
    <button
      @click="$emit('exitCart')"
      class="button"
      type="button"
    >
      Выйти из корзины
    </button>
  </div>
</template>

<script>
import ProductCounter from './ProductCounter.vue';
import { mapMutations } from 'vuex';

export default {
  emits: ['exitCart'],

  computed: {
    items() {
      return this.$store.state.cartItems;
    },

    isTableShow() {
      return this.items.length !== 0;
    }
  },

  methods: {
    ...mapMutations([
      'changeItemCount',
      'deleteCartItem'
    ]),

    onCount(value, itemId) {
      this.changeItemCount({itemId, value});
    },

    onDeleteItemClick(id) {
      this.deleteCartItem(id);
    }
  },

  components: {
    ProductCounter
  }
}
</script>

<style scoped>
.cart__table {
  margin-bottom: 15px;
}

.cart__empty {
  font-size: 18px;
  text-align: center;
  padding: 15px;
  margin: 0;
}

.cart__delete-item {
  width: 100%;
  padding: 3px 5px;
  margin-top: 5px;
}
</style>
