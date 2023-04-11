import { createStore } from "vuex";
import { getGapBetweenPipes, getPipesAlongSide } from '@/utils/index.js';
import {
  MILLIMETERS_IN_METER,
  SHEET_LENGTH,
  MaterialTypes,
  ConfigTypes
} from '@/utils/const.js';

export default createStore({
  state: {
    data: [
      {
        type: "list",
        name: "Лист-1 0.5 ширина 1.8м",
        material: "plastic",
        unit: "м2",
        width: 1.8,
        price: 12,
      },
      {
        type: "list",
        name: "Лист-2 0.5 ширина 1.5м",
        material: "plastic",
        unit: "м2",
        width: 1.5,
        price: 15,
      },
      {
        type: "list",
        name: "Лист-3 0.5 ширина 1.2м",
        material: "plastic",
        unit: "м2",
        width: 1.2,
        price: 15,
      },
      {
        type: "list",
        name: "Лист-4 0.7 ширина 1.8м",
        material: "plastic",
        unit: "м2",
        width: 1.8,
        price: 17,
      },
      {
        type: "list",
        name: "Лист-5 0.7 ширина 1.5м",
        material: "plastic",
        unit: "м2",
        width: 1.5,
        price: 20,
      },
      {
        type: "list",
        name: "Лист-6 0.7 ширина 1.2м",
        material: "plastic",
        unit: "м2",
        width: 1.2,
        price: 22,
      },

      {
        type: "list",
        name: "Лист-7 0.3 ширина 1м",
        material: "metal",
        unit: "м2",
        width: 1,
        price: 25,
      },
      {
        type: "list",
        name: "Лист-8 0.3 ширина 0.75м",
        material: "metal",
        unit: "м2",
        width: 0.75,
        price: 20,
      },
      {
        type: "list",
        name: "Лист-9 0.3 ширина 0.5м",
        material: "metal",
        unit: "м2",
        width: 0.5,
        price: 15,
      },
      {
        type: "list",
        name: "Лист-10 0.5 ширина 1м",
        material: "metal",
        unit: "м2",
        width: 1,
        price: 30,
      },
      {
        type: "list",
        name: "Лист-11 0.5 ширина 0.75м",
        material: "metal",
        unit: "м2",
        width: 0.75,
        price: 26,
      },
      {
        type: "list",
        name: "Лист-12 0.5 ширина 0.5м",
        material: "metal",
        unit: "м2",
        width: 0.5,
        price: 22,
      },

      {
        type: "pipe",
        name: "Труба 20х20",
        unit: "мп",
        width: 20,
        price: 18,
      },
      {
        type: "pipe",
        name: "Труба 30х30",
        unit: "мп",
        width: 30,
        price: 18,
      },

      {
        type: "fix",
        name: "Саморез",
        unit: "шт",
        price: 1.1,
      },
    ],
    config: [
      {
        type: "size",
        key: "length",
        name: "Длина",
        min: 5,
        max: 50,
        step: 0.2,
      },
      {
        type: "size",
        key: "width",
        name: "Ширина",
        min: 5,
        max: 25,
        step: 0.2,
      },
      {
        type: "frame",
        key: "light",
        name: "Легкая",
        step: 1.2,
      },
      {
        type: "frame",
        key: "standard",
        name: "Стандартная",
        step: 1,
      },
      {
        type: "frame",
        key: "strong",
        name: "Усиленная",
        step: 0.8,
      },
      {
        type: "material",
        key: "metal",
        name: "Металл",
      },
      {
        type: "material",
        key: "plastic",
        name: "Пластик",
      },
      {
        type: "fix",
        key: "plastic",
        name: "Пластик",
        value: 10,
      },
      {
        type: "fix",
        key: "metal",
        name: "Пластик",
        value: 5,
      },
    ],
    cartItems: [],
    productId: 1,
    frame: {
      length: 0,
      width: 0,
      step: 0
    },
    selectedPipe: {},
    selectedSheet: {},
  },

  getters: {
    sheets(state) {
      return state.data.filter(elem => elem.type === MaterialTypes.SHEET);
    },

    pipes(state) {
      return state.data.filter(elem => elem.type === MaterialTypes.PIPE);
    },

    fix(state) {
      return state.data.find(elem => elem.type === MaterialTypes.FIX);
    },

    fixesPerSquareMeter(state) {
      if (!state.selectedSheet.material) {
        return 0;
      }
      return state.config.find(elem => {
        return elem.type === ConfigTypes.FIX && elem.key === state.selectedSheet.material
      }).value;
    },

    sheetMaterials(state) {
      return state.config.filter(elem => elem.type === ConfigTypes.MATERIAL);
    },

    frameTypes(state) {
      return state.config.filter(elem => elem.type === ConfigTypes.FRAME);
    },

    frameSizes(state) {
      return state.config.filter(elem => elem.type === ConfigTypes.SIZE);
    },

    productArea(state) {
      const area = state.frame.length * state.frame.width;
      return Number(area.toFixed(1));
    },

    sheetCount(state, getters) {
      if (!state.selectedSheet.width) {
        return 0;
      }
      return Math.ceil(getters.productArea / (SHEET_LENGTH * state.selectedSheet.width));
    },

    totalSheetsPrice(state, getters) {
      if (!state.selectedSheet.price) {
        return 0;
      }
      return getters.sheetCount * state.selectedSheet.price;
    },

    fixCount(state, getters) {
      return Math.ceil(getters.productArea * getters.fixesPerSquareMeter);
    },

    totalFixesPrice(state, getters) {
      return Math.ceil(getters.fix.price * getters.fixCount);
    },

    lengthGap(state) {
      if (!state.frame.length || !state.selectedPipe.width || !state.frame.step) {
        return 0;
      }
      return getGapBetweenPipes(
        state.frame.length,
        state.selectedPipe.width,
        state.frame.step
      );
    },

    widthGap(state) {
      if (!state.frame.width || !state.selectedPipe.width || !state.frame.step) {
        return 0;
      }
      return getGapBetweenPipes(
        state.frame.width,
        state.selectedPipe.width,
        state.frame.step
      );
    },

    cellLength(state, getters) {
      if (!getters.lengthGap) {
        return 0;
      }

      const cellLength = getters.lengthGap + (state.selectedPipe.width / MILLIMETERS_IN_METER) * 2;

      return Number(cellLength.toFixed(2));
    },

    cellWidth(state, getters) {
      if (!getters.widthGap) {
        return 0;
      }

      const cellWidth = getters.widthGap + (state.selectedPipe.width / MILLIMETERS_IN_METER) * 2;

      return Number(cellWidth.toFixed(2));
    },

    amountOfPipe(state, getters) {
      const frameLength = state.frame.length;
      const frameWidth = state.frame.width;
      const pipeWidth = state.selectedPipe.width;
      const lengthGap = getters.lengthGap;
      const widthGap = getters.widthGap;

      if (!widthGap || !lengthGap) {
        return 0;
      }

      const pipesAlongFrameLength = getPipesAlongSide(frameLength, pipeWidth, lengthGap);
      const pipesAlongFrameWidth = getPipesAlongSide(frameWidth, pipeWidth, widthGap);

      return Math.ceil(pipesAlongFrameLength * frameWidth + pipesAlongFrameWidth * frameLength);
    },

    totalPipesPrice(state, getters) {
      if (!state.selectedPipe.price) {
        return 0;
      }
      return getters.amountOfPipe * state.selectedPipe.price;
    },

    totalPrice(state, getters) {
      return getters.totalSheetsPrice + getters.totalFixesPrice + getters.totalPipesPrice;
    },

    cartItemsCount(state) {
      return state.cartItems.reduce((sum, {count}) => sum + count, 0);
    }
  },

  mutations: {
    setFrameSize(state, {length, width}) {
      state.frame.length = length;
      state.frame.width = width;
    },

    setSelectedPipe(state, pipe) {
      state.selectedPipe = pipe;
    },

    setFrameStep(state, step) {
      state.frame.step = step;
    },

    setSelectedSheet(state, sheet) {
      state.selectedSheet = sheet;
    },

    addCartItem(state, item) {
      item.id = state.productId;
      state.productId++;
      state.cartItems.push(item);
    },

    deleteCartItem(state, itemId) {
      const index = state.cartItems.findIndex(elem => elem.id === itemId);
      state.cartItems.splice(index, 1);
    },

    changeItemCount(state, {itemId, value}) {
      state.cartItems.forEach(elem => {
        if (itemId === elem.id) {
          elem.count = value;
        }
      });
    }
  }
});
