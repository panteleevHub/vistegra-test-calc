<template>
  <form @submit.prevent="onFormSubmit" class="selection" id="selection-form">
    <fieldset>
      <h2>Материал для покрытия</h2>
      <div class="selection__filters">
        <div class="selection__filter">
          <span>Фильтр:</span>
          <select v-model="filter">
            <option value="all">Все</option>
            <option
              v-for="material in sheetMaterials"
              :value="material.key"
              :key="material.key"
            >
              {{ material.name }}
            </option>
          </select>
        </div>
        <div class="selection__sort">
          <span>Сортировка:</span>
          <select v-model="sort">
            <option value="width">По ширине</option>
            <option value="price">По цене</option>
          </select>
          <select v-model="sortDirection">
            <option value="up">По возрастанию</option>
            <option value="down">По убыванию</option>
          </select>
        </div>
      </div>
      <ul class="selection__list">
        <li v-for="(item, index) in filteredAndSortedSheets" :key="item.name">
          <input
            v-model="checkedSheet"
            :value="item.name"
            :id="item.name"
            type="radio"
            class="visually-hidden"
          >
          <label :for="item.name">{{ item.name }}</label>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <h2>Материал для рамы</h2>
      <ul class="selection__list">
        <li v-for="(item, index) in pipes" :key="item.name">
          <input
            v-model="checkedPipe"
            :value="item.name"
            :id="item.name"
            type="radio"
            class="visually-hidden"
          >
          <label :for="item.name">{{ item.name }}</label>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <h2>Размер рамы</h2>
      <div class="selection__frame">
        <div v-for="item in frameSizes" class="selection__frame-size">
          <label :for="item.key">{{ item.name }}(м)</label>
          <input
            @input="onFrameSizeInput"
            :value="frameSize[item.key]"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :id="item.key"
            type="number"
            placeholder="Введите значение"
          >
          <span v-if="!frameSizeValidation[item.key]" class="selection__validation-message">
            От {{ item.min }} до {{ item.max }}
          </span>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <h2>Тип рамы</h2>
      <ul class="selection__list">
        <li v-for="item in frameTypes" :key="item.name">
          <input
            v-model="checkedFrame"
            :value="item.key"
            :id="item.key"
            type="radio"
            class="visually-hidden"
          >
          <label :for="item.key">{{ item.name }}</label>
        </li>
      </ul>
    </fieldset>
  </form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { SortTypes, SortDirections, ALL_ITEMS } from '@/utils/const.js';

export default {
  data() {
    return {
      checkedSheet: '',
      checkedPipe: '',
      checkedFrame: '',
      frameSize: {
        length: null,
        width: null
      },
      frameSizeValidation: {
        length: true,
        width: true
      },
      filter: ALL_ITEMS,
      sort: SortTypes.WIDTH,
      sortDirection: SortDirections.UP,
    }
  },

  computed: {
    ...mapGetters([
      'sheets',
      'pipes',
      'sheetMaterials',
      'frameTypes',
      'frameSizes'
    ]),

    filteredSheets() {
      if (this.filter === ALL_ITEMS) {
        return this.sheets;
      }
      return this.sheets.filter(sheet => sheet.material === this.filter);
    },

    filteredAndSortedSheets() {
      if (this.sortDirection === SortDirections.UP) {
        return [...this.filteredSheets].sort((sheetA, sheetB) => sheetA[this.sort] - sheetB[this.sort]);
      }
      if (this.sortDirection === SortDirections.DOWN) {
        return [...this.filteredSheets].sort((sheetA, sheetB) => sheetB[this.sort] - sheetA[this.sort]);
      }
    },

    frameLength() {
      return this.frameSize.length;
    },

    frameWidth() {
      return this.frameSize.width;
    }
  },

  methods: {
    ...mapMutations([
      'setFrameSize',
      'setSelectedPipe',
      'setFrameStep',
      'setSelectedSheet',
    ]),

    onFrameSizeInput({target}) {
      const size = this.frameSizes.find(elem => elem.key === target.id);
      this.frameSize[target.id] = target.value;

      if (this.frameSize[target.id] < size.min || this.frameSize[target.id] > size.max) {
        this.frameSizeValidation[target.id] = false;
        this.setFrameSize({length: 0, width: 0});
      } else {
        this.frameSizeValidation[target.id] = true;
        this.setFrameSize({
          length: this.frameSize.length,
          width: this.frameSize.width,
        });
      }
    },

    onFormSubmit() {
      this.checkedSheet = '';
      this.checkedPipe = '';
      this.checkedFrame = '';
      this.frameSize = {
        length: null,
        width: null
      };
      this.filter = ALL_ITEMS;
      this.sort = SortTypes.WIDTH;
      this.sortDirection = SortDirections.UP;
    }
  },

  watch: {
    checkedPipe(value) {
      if (value) {
        const selectedPipe = this.pipes.find(elem => elem.name === value);
        this.setSelectedPipe(selectedPipe);
      } else {
        this.setSelectedPipe({});
      }
    },

    checkedFrame(value) {
      if (value) {
        const frameStep = this.frameTypes.find(elem => elem.key === value).step;
        this.setFrameStep(frameStep);
      } else {
        this.setFrameStep(0);
      }
    },

    checkedSheet(value) {
      if (value) {
        const selectedSheet = this.sheets.find(elem => elem.name === value);
        this.setSelectedSheet(selectedSheet);
      } else {
        this.setSelectedSheet({});
      }
    },

    frameLength(value) {
        if (value === null) {
          this.setFrameSize({length: 0, width: 0});
        }
      },

    frameWidth(value) {
      if (value === null) {
        this.setFrameSize({length: 0, width: 0});
      }
    }
  }
}
</script>

<style scoped>
.selection {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}

.selection::after {
  content: "";
  position: absolute;
  top: 0;
  right: -15px;
  width: 1px;
  height: 100%;
  background-color: gray;
}

.selection__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

@media (min-width: 1180px) {
  .selection__list {
    grid-template-columns: repeat(4, 1fr);
  }
}

.selection__list label {
  display: block;
  padding: 5px;
  border: 1px solid black;
  cursor: pointer;
}

.selection__list input:hover + label,
.selection__list input:checked + label {
  background-color: #DBDBDB;
}

.selection__filters {
  display: flex;
  column-gap: 25px;
  margin-bottom: 15px;
}

.selection__sort,
.selection__filter {
  display: flex;
  column-gap: 10px;
}

.selection__filters select {
  font-size: 14px;
  cursor: pointer;
}

.selection__filters select:focus {
  outline: none;
}

.selection__frame {
  display: flex;
  column-gap: 5px;
}

.selection__frame-size {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}

.selection__frame-size input {
  width: 140px;
  padding: 5px;
  border: 1px solid black;
  cursor: pointer;
}

.selection__validation-message {
  font-size: 12px;
  color: red;
}
</style>
