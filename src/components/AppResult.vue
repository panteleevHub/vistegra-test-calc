<template>
  <div class="calculation">
    <div class="calculation__cart">
      <span class="calculation__product-count">Изделий в корзине: {{ cartItemsCount }}</span>
      <button
        @click="$emit('enterCart')"
        class="button"
        type="button"
      >
        Перейти в корзину
      </button>
    </div>
    <div>
      <h2>Размеры изделия</h2>
      <table class="table table--area">
        <tr>
          <th>Площадь изделия</th>
          <th>Площадь ячейки</th>
        </tr>
        <tr>
          <td>{{ productArea }}м2</td>
          <td>{{ cellLength }}x{{ cellWidth }}м</td>
        </tr>
      </table>
    </div>
    <div>
      <h2>Материалы</h2>
      <table class="table">
        <tr>
          <th>Наименование</th>
          <th>ед.</th>
          <th>кол-во</th>
          <th>сумма</th>
        </tr>
        <tr>
          <td>{{ selectedSheetName ? selectedSheetName : '-' }}</td>
          <td>{{ selectedSheetUnit ? selectedSheetUnit: '-' }}</td>
          <td>{{ sheetCount }}</td>
          <td>{{ totalSheetsPrice }}</td>
        </tr>
        <tr>
          <td>{{ selectedPipeName ? selectedPipeName : '-' }}</td>
          <td>{{ selectedPipeUnit ? selectedPipeUnit : '-' }}</td>
          <td>{{ amountOfPipe }}</td>
          <td>{{ totalPipesPrice }}</td>
        </tr>
        <tr>
          <td>{{ fixCount ? fix.name : '-' }}</td>
          <td>{{ fixCount ? fix.unit : '-' }}</td>
          <td>{{ fixCount }}</td>
          <td>{{ totalFixesPrice }}</td>
        </tr>
      </table>
      <div class="calculation__result">
        <span class="calculation__price">Итого: {{ totalPrice }}</span>
        <div class="calculation__add-to-cart">
          <ProductCounter v-if="!isCartButtonDisabled" @count="count = $event" :count="count" />
          <button
            @click="onAddToCartClick"
            class="button"
            type="submit"
            :disabled="isCartButtonDisabled"
            form="selection-form"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ProductCounter from './ProductCounter.vue';

export default {
  data() {
    return {
      count: 1,
    }
  },

  emits: ['enterCart'],

  computed: {
    ...mapGetters([
      'productArea',
      'cellLength',
      'cellWidth',
      'sheetCount',
      'totalSheetsPrice',
      'fix',
      'fixCount',
      'totalFixesPrice',
      'amountOfPipe',
      'totalPipesPrice',
      'totalPrice',
      'cartItemsCount'
    ]),

    selectedSheetName() {
      return this.$store.state.selectedSheet.name;
    },

    selectedSheetUnit() {
      return this.$store.state.selectedSheet.unit;
    },

    selectedPipeName() {
      return this.$store.state.selectedPipe.name;
    },

    selectedPipeUnit() {
      return this.$store.state.selectedPipe.unit;
    },

    isCartButtonDisabled() {
      if (!this.cellLength || !this.cellWidth || !this.sheetCount) {
        return true;
      }
      return false;
    }
  },

  methods: {
    ...mapMutations([
      'addCartItem',
    ]),

    onAddToCartClick() {
      this.addCartItem({
        area: this.productArea,
        price: this.totalPrice,
        count: this.count,
      });
      this.count = 1;
    }
  },

  components: {
    ProductCounter
  }
}
</script>

<style scoped>
.calculation {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}

.calculation__result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.calculation__price {
  font-size: 16px;
}

.calculation__cart {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.calculation__cart::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  bottom: -10px;
  background-color: gray;
}

.calculation__product-count {
  font-size: 16px;
}

.calculation__add-to-cart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
</style>
